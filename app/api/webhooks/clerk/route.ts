import logger from "@/lib/logger";
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createUser, updateUser, deleteUser } from "../../../../lib/actions/users.actions";
import { connectToDatabase } from "../../../../lib/database/mongoose";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing WEBHOOK_SECRET");

  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.error("Missing svix headers");
      return new Response("Missing headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      logger.error("Webhook signature verification failed: %o", err);
      return new Response("Invalid signature", { status: 400 });
    }

    const eventType = evt.type;
    logger.info("Webhook received: %s", eventType);

    await connectToDatabase();

    if (eventType === "user.created") {
      const { id: clerkId, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId,
        email: email_addresses?.[0]?.email_address || "",
        username: username || "",
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
      };

      logger.info("Creating user: %o", user);
      const newUser = await createUser(user);

      if (newUser) {
        await (await clerkClient()).users.updateUserMetadata(clerkId, {
          publicMetadata: { userId: newUser._id },
        });
        logger.info("Updated Clerk user metadata for: %s", clerkId);
      }

      return NextResponse.json({ message: "OK", user: newUser });
    }

    if (eventType === "user.updated") {
      const { id: clerkId, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        photo: image_url || "",
      };

      logger.info("Updating user %s: %o", clerkId, user);
      const updatedUser = await updateUser(clerkId, user);
      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const { id: clerkId } = evt.data;

      if (!clerkId) {
        logger.error("user.deleted event missing id");
        return new Response("Missing user ID", { status: 400 });
      }

      logger.info("Deleting user: %s", clerkId);
      const deletedUser = await deleteUser(clerkId);
      logger.info("Deleted user result: %o", deletedUser);

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    logger.warn("Unhandled webhook event: %s", eventType);
    return new Response("Unhandled event", { status: 200 });

  } catch (err) {
    logger.error("Fatal webhook error: %o", err);
    return new Response("Server error", { status: 500 });
  }
}
