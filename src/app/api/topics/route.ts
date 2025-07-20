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

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Check if User model is available
    if (!User) {
      console.error("User model is undefined");
      return NextResponse.json(
        { error: "Database model error" },
        { status: 500 }
      );
    }

    // Get or create user
    const user = await getOrCreateUser(userId);

    // Get user's topics
    const topics = await Topic.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDb();

    // Check if User model is available
    if (!User) {
      console.error("User model is undefined");
      return NextResponse.json(
        { error: "Database model error" },
        { status: 500 }
      );
    }

    // Get or create user
    const user = await getOrCreateUser(userId);

    // Create new topic
    const topic = new Topic({
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      userId: user._id,
      title: title.trim(),
    });

    await topic.save();

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
