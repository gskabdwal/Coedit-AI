"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { deleteDocument } from "@/actions/actions";

const DeleteDocument = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await deleteDocument(roomId);

      if (success) {
        setIsOpen(false);
        router.replace("/");
        toast.success("Room deleted successfully!");
      } else {
        toast.error("Failed to delete room");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="destructive" className="bg-red-700 text-white shadow-xl shadow-red-800">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent className="bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            document and all its contents, removing all users from the document.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            className="bg-red-700 shadow-xl shadow-red-800"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDocument;