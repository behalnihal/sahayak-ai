"use server";

import { connectDb } from "../mongodb";
import User from "@/models/User";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";

declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  tokens?: number;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

export async function createUser(user: CreateUserParams) {
  try {
    await connectDb();
    const newUser = await User.create({ ...user, tokens: 20 });
    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    handleError(err);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDb();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectDb();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectDb();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function decrementUserTokens(clerkId: string) {
  try {
    await connectDb();
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");
    if (user.tokens <= 0) throw new Error("No tokens left");
    user.tokens -= 1;
    await user.save();
    return user.tokens;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserTokens(clerkId: string) {
  try {
    await connectDb();
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");
    return user.tokens;
  } catch (error) {
    handleError(error);
  }
}
