import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTokens } from "@/lib/actions/user.actions";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokens = await getUserTokens(userId);
    if (tokens === undefined) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ tokens });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
