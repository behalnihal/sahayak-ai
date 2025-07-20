import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const SIGNIN_SECRET = process.env.SIGNIN_SECRET;
  if (!SIGNIN_SECRET) {
    throw new Error("SIGNIN_SECRET is not set");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.text();
  const wh = new Webhook(SIGNIN_SECRET);

  let evt: { type: string; data: any };

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as { type: string; data: any };
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, username } =
      evt.data;

    try {
      await connectDb();

      // Check if User model is available
      if (!User) {
        console.error("User model is undefined in webhook");
        return new Response("Database model error", { status: 500 });
      }

      const userData = {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
        username:
          username || email_addresses[0]?.email_address?.split("@")[0] || "",
      };

      const result = await User.findOneAndUpdate({ clerkId: id }, userData, {
        upsert: true,
        new: true,
      });

      console.log(
        `Webhook: ${eventType} - User ${id} ${result ? "updated" : "created"}`
      );
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error syncing user:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
