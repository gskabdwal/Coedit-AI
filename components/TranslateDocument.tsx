"use client";
import { useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import * as Y from "yjs";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();

        setSummary(translated_text);
        toast.success("Translated summary successfully!");
      }
    });
  };

  return (
    <div className="text-black">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline" className="text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700">
          <DialogTrigger>
            <LanguagesIcon />
            Translate
          </DialogTrigger>
        </Button>
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle>Translate the document</DialogTitle>
            <DialogDescription className="text-black-100">
              Select a language and AI will translate a summary of the document
              in the selected language.
            </DialogDescription>

            <hr className="mt-5" />
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
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent> 
                {languages.map((language) => (
                  <SelectItem  key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={!language || isPending}>
              {isPending ? "Translating..." : "Translate"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranslateDocument;