"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  auth.protect();

  const { sessionClaims } = await auth();
  console.log('Session Claims:', sessionClaims); // Log session claims

  // Validate session claims
  if (!sessionClaims || !sessionClaims.email) {
    throw new Error('Invalid session claims.');
  }

  const docCollectionRef = adminDb.collection("documents");

  try {
    const docRef = await docCollectionRef.add({
      title: "New Doc",
    });

    await adminDb
      .collection("users")
      .doc(sessionClaims.email)
      .collection("rooms")
      .doc(docRef.id)
      .set({
        userId: sessionClaims.email,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
      });
    console.log('User document updated successfully.'); // Log success

    return { docId: docRef.id };
  } catch (error) {
    console.error('Error during Firestore operations:', error);
    throw error; // Rethrow error for further handling
  }
}

export async function deleteDocument(roomId: string) {
  auth.protect();

  try {
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // Delete the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete the room in liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();

  console.log("Invite user to document: ", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth.protect();

  console.log("Invite user to document: ", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}