import { ArrowLeftCircle } from "lucide-react";
import favicon from './icon.svg';

export default function Home() {
  return (
    <>
      <head>
          <title>CoEdit AI</title>t 
          <link rel="icon" href={favicon} />
      </head>
      <main className="flex space-x-2 items-center animate-pulse">
        <ArrowLeftCircle className="w-12 h-12" />
        <h1 className="font-bold">Get started with creating a New Document</h1>
      </main>
    </>
  );
}