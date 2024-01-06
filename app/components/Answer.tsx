import { SearchQuery } from "~/types";
import { IconReload } from "@tabler/icons-react";
import { FC } from "react";

interface AnswerProps {
  searchQuery: SearchQuery;
  answer: string;
  done: boolean;
  onReset: () => void;
}

export const Answer: FC<AnswerProps> = ({
  searchQuery,
  answer,
  done,
  onReset,
}) => {
  return (
    <div className="max-w-[800px] space-y-4 py-16 px-8 sm:px-24 sm:pt-16 pb-32 m-auto">
      <div className="overflow-auto text-2xl sm:text-4xl query">
        {searchQuery.query}
      </div>

      <div className=" border-zinc-800 pb-4">
        <div className="text-md text-blue-500 subtitle">Answer</div>

        <div className="mt-2 overflow-auto answer">
          {replaceSourcesWithLinks(answer, searchQuery.sourceLinks)}
        </div>
      </div>

      {done && (
        <>
          <div className="border-zinc-800 pb-4 sources">
            <div className="text-md text-blue-500 subtitle">Sources</div>

            {searchQuery.sourceLinks.map((source, index) => {
              const isUsed = answer.includes(`[${index + 1}]`);
              return (
                <div
                  key={index}
                  className={`mt-1 overflow-auto`}
                  style={{
                    opacity: isUsed ? 1 : 0.25,
                    display: isUsed ? "block" : "none",
                    pointerEvents: isUsed ? "all" : "none",
                  }}
                >
                  <a
                    className="link text-blue-500 hover:cursor-pointer hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={source}
                    data-customattribute={`[${index + 1}]`}
                  >
                    <img
                      alt={`[${index + 1}]`}
                      onError={(e: any) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("display-before");
                      }}
                      src={new URL(source).origin + "/favicon.ico"}
                    />

                    {source.split("//")[1].split("/")[0].replace("www.", "")}
                  </a>
                </div>
              );
            })}
          </div>

          <button
            className="flex h-10 w-52 items-center justify-center rounded-full bg-blue-500 p-2 hover:cursor-pointer hover:bg-blue-600"
            onClick={onReset}
          >
            <IconReload size={18} />
            <div className="ml-2">Ask New Question</div>
          </button>
        </>
      )}
    </div>
  );
};

const replaceSourcesWithLinks = (answer: string, sourceLinks: string[]) => {
  const elements = answer.split(/(\[[0-9]+\])/).map((part, index) => {
    if (/\[[0-9]+\]/.test(part)) {
      const link = sourceLinks[parseInt(part.replace(/[\[\]]/g, "")) - 1];
      return (
        <a
          key={index}
          className="hover:cursor-pointer text-blue-500 link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-customattribute={part}
          style={{
            display: "inline-block",
          }}
        >
          <img
            alt={part}
            onError={(e: any) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add("display-before");
            }}
            src={new URL(link).origin + "/favicon.ico"}
          />
        </a>
      );
    } else {
      return part;
    }
  });

  return elements;
};
