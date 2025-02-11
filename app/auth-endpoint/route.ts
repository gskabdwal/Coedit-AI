import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebase-admin";

import { NextRequest, NextResponse } from "next/server";
import liveblocks from "@/lib/liveblocks";


export async function POST(req: NextRequest) {
  auth.protect();

  const { sessionClaims } = await auth();
  console.log('Session Claims:', sessionClaims); // Log session claims

  if (!sessionClaims) {
    console.error('Session claims are null. Authentication failed.');
    throw new Error('Session claims are null. Authentication failed.');
  }

  if (!sessionClaims.email) {
    console.error('Session claims email is null. Authentication failed.');
    throw new Error('Session claims email is null. Authentication failed.');
  }

  if (!sessionClaims.fullName) {
    console.log('Session claims full name is null. Using empty string as fallback.');
  }

  if (!sessionClaims.image) {
    console.log('Session claims image is null. Using empty string as fallback.');
  }

  const { room } = await req.json();
  console.log('Room:', room); // Log the room variable

  if (!room) {
    throw new Error('Room is null. Cannot proceed.');
  }

  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name: sessionClaims.fullName ?? '',
      email: sessionClaims.email ?? '',
      avatar: sessionClaims.image ?? '',
    },
  });


  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }
}