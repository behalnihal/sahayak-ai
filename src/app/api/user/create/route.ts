import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      return NextResponse.json(
        { message: "User already exists", user },
        { status: 200 }
      );
    }

    // Get user data from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Could not get user data from Clerk" },
        { status: 400 }
      );
    }

    // Create new user
    user = new User({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "user@example.com",
      firstName: clerkUser.firstName || "User",
      lastName: clerkUser.lastName || "Name",
      photo: clerkUser.imageUrl || "",
      username: clerkUser.username || `user_${userId.slice(0, 8)}`,
    });

    await user.save();

    console.log("Manually created user:", user._id);

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
