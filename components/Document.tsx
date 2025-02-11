"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";

import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";

import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

import { db } from "@/firebase";
import useOwner from "@/lib/useOwner";

const Document = ({ id }: { id: string }) => {
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-inherit p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="md:flex md:flex-1 w-full md:space-x-2" onSubmit={updateTitle}>
          {/* Update title */}
          <Input
            value={input}
            className="border-0 w-full bg-slate-600 shadow-xl shadow-slate-800"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
          />
          
          <div className="flex justify-between items-center md:space-x-2 my-3 md:my-0">
          <div className="hidden md:flex">|</div>
            <Button
              disabled={isUpdating}
              className="bg-slate-700 shadow-xl shadow-slate-800"
              type="submit"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <div>|</div>

            {isOwner && (
              <>
                <InviteUser />
                <div>|</div>
                <DeleteDocument />
              </>
            )}
          </div>
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* Manage Users */}
        <ManageUsers />

        {/* Avatars */}
        <Avatars />
      </div>

      <hr className="pb-10" />

      {/* Collaborative Editor */}
      <Editor />
    </div>
  );
};
export default Document;
