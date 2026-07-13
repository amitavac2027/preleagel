import fs from "node:fs";
import path from "node:path";
import NdaGenerator from "@/components/NdaGenerator";

function readTemplate(filename: string): string {
  const templatesDir = path.join(process.cwd(), "..", "templates");
  return fs.readFileSync(path.join(templatesDir, filename), "utf-8");
}

export default function Home() {
  const coverPageTemplate = readTemplate("Mutual-NDA-coverpage.md");
  const standardTerms = readTemplate("Mutual-NDA.md");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mutual NDA Creator
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Fill in the details below to generate a Common Paper Mutual
            Non-Disclosure Agreement. Preview it live, then download the
            completed document.
          </p>
        </header>
        <NdaGenerator
          coverPageTemplate={coverPageTemplate}
          standardTerms={standardTerms}
        />
      </main>
    </div>
  );
}
