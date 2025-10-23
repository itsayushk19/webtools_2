"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import logger from "@/lib/logger";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    logger.info('Creating user in MongoDB: %o', user);

    const newUser = await User.create(user);

    logger.info('User created successfully: %o', newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    logger.error('Error creating user: %o', error);
    throw error;
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    logger.error('Error reading user %s: %o', userId, error);
    throw error;
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    logger.info('Updating user %s with %o', clerkId, user);

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });
    if (!updatedUser) throw new Error('User update failed');

    logger.info('User updated: %o', updatedUser);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    logger.error('Error updating user %s: %o', clerkId, error);
    throw error;
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    logger.info('Deleting user: %s', clerkId);

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) throw new Error('User not found');

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    logger.info('Deleted user: %o', deletedUser);
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    logger.error('Error deleting user %s: %o', clerkId, error);
    throw error;
  }
}
