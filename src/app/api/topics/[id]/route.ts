import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDb } from "@/lib/mongodb";
import Topic from "@/models/Topic";
import User from "@/models/User";

// Helper function to get or create user
async function getOrCreateUser(clerkUserId: string) {
  let user = await User.findOne({ clerkId: clerkUserId });

  if (!user) {
    // If user doesn't exist, try to get user data from Clerk and create them
    try {
      const clerkUser = await currentUser();

      if (clerkUser) {
        // Create a user record with Clerk data
        user = new User({
          clerkId: clerkUserId,
          email:
            clerkUser.emailAddresses[0]?.emailAddress || "user@example.com",
          firstName: clerkUser.firstName || "User",
          lastName: clerkUser.lastName || "Name",
          photo: clerkUser.imageUrl || "",
          username: clerkUser.username || `user_${clerkUserId.slice(0, 8)}`,
        });
        await user.save();
        console.log("Created new user:", user._id);
      }
    } catch (createError) {
      console.error("Error creating user:", createError);
      throw new Error("Failed to create user");
    }
  }

  return user;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Get or create user
    const user = await getOrCreateUser(userId);

    // Find topic (ensure it belongs to the user)
    const { id } = await params;
    const topic = await Topic.findOne({
      id: id,
      userId: user._id,
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Get or create user
    const user = await getOrCreateUser(userId);

    // Find and delete topic (ensure it belongs to the user)
    const { id } = await params;
    const topic = await Topic.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
