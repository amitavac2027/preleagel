import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const components: Components = {
  // The template uses <label> tags as italic field hints, not form controls.
  label: ({ children }) => (
    <span className="mt-1 block text-xs italic text-zinc-500 dark:text-zinc-400">
      {children}
    </span>
  ),
  span: ({ className, children, ...props }) =>
    className === "coverpage_link" ? (
      <span className="italic" {...props}>
        {children}
      </span>
    ) : (
      <span className={className} {...props}>
        {children}
      </span>
    ),
};

export default function NdaPreview({
  document: documentText,
  isComplete,
  onDownload,
}: {
  document: string;
  isComplete: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Live preview
        </h2>
        <button
          type="button"
          onClick={onDownload}
          disabled={!isComplete}
          title={
            isComplete
              ? undefined
              : "Fill in all fields to enable download"
          }
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
        >
          Download .md
        </button>
      </div>
      <div className="prose prose-sm prose-zinc max-h-[75vh] max-w-none overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 dark:prose-invert dark:border-zinc-800 dark:bg-zinc-900">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {documentText}
        </Markdown>
      </div>
    </div>
  );
}
