"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";



const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
        try {
            console.log('Attempting to create new document...'); // Log the attempt
            // Create new doc
            const { docId } = await createNewDocument();
            console.log('Document ID:', docId); // Log the docId

            if (!docId) {
                throw new Error('Document ID is undefined or empty.');
            }

            console.log('Redirecting to new document...'); // Log the redirect
            router.push(`/doc/${docId}`);
            console.log('Successfully created and redirected to new document.'); // Log the success
        } catch (error) {
            console.error('Error creating document:', error);
            console.error('Failed to create new document.'); // Log the failure
        }
    });
  };
  return (
    <Button className="bg-slate-700 shadow-black shadow-lg" onClick={handleCreateNewDocument} disabled={isPending}>
      New Document
    </Button>
  );
};

export default NewDocumentButton;