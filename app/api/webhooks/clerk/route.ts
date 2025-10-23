/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions"; // ✅ correct path

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing WEBHOOK_SECRET in .env.local");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
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
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`➡️ Webhook received: ${eventType}`);

  try {
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

      console.log("🟢 Creating user:", user);
      const newUser = await createUser(user);
      console.log("✅ Mongo insert:", newUser);

      if (newUser) {
        await clerkClient.users.updateUserMetadata(clerkId, {
          publicMetadata: { userId: newUser._id },
        });
      }

      return NextResponse.json({ message: "OK", user: newUser });
    }

    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        photo: image_url || "",
      };

      console.log("🟡 Updating user:", id);
      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      console.log("🔴 Deleting user:", id);
      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    console.log("ℹ️ Unknown event:", eventType);
    return new Response("Unhandled event", { status: 200 });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return new Response("Server error", { status: 500 });
  }
}
