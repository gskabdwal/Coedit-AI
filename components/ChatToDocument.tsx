"use client";
import { useState, useTransition } from "react";
import { BotIcon, LanguagesIcon, MessageCircleCode } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "@/components/ui/input";


const ChatToDocument = ({ doc }: {doc: Y.Doc}) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestion(input);
    
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question: input,
          }),
        }
      );

      if (res.ok) {
        const { message } = await res.json();
        setInput("");
        setSummary(message);
        toast.success("Question asked successfully!");
      }
    });
  };

  return (
    <div className="text-black">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline" className="text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700">
          <DialogTrigger>
            <MessageCircleCode className="mr-2"/>
            Chat to Document
          </DialogTrigger>
        </Button>
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle>Chat to the document</DialogTitle>
            <DialogDescription className="text-black-100">
              Ask a question and chat to the document with AI.
            </DialogDescription>

            <hr className="mt-5" />

            {question && <p className="text-gray-500">Q: {question}</p>}
          </DialogHeader>

          {summary && (
            <div className="text-black flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex ">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  AI {isPending ? "is thinking..." : "Says:"}
                </p>
              </div>
              <div >
                {isPending ? "Thinking..." : <Markdown >{summary}</Markdown>}
              </div>
            </div>
          )}

          <form className="flex gap-2 text-black" onSubmit={handleAskQuestion}>
            <Input
              type="text"
              placeholder="Enter your question"
              className="w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button type="submit" disabled={!input || isPending}>
              {isPending ? "Asking..." : "Ask"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatToDocument;