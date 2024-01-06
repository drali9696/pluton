import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Answer } from "~/components/Answer";
import { Search } from "~/components/Search";
import { SearchQuery } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Pluton" },
    { name: "description", content: "Welcome to Pluton!" },
  ];
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    sourceLinks: [],
  });
  const [answer, setAnswer] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  const onSetDone = (value: boolean) => {
    setDone(value);
    setAnswer((a) => a.replaceAll("===DONE===", ""));
  };

  const onAnswerUpdate = (value: string) => {
    setAnswer((prev) => prev + value);
  };

  return (
    <div className="h-screen overflow-auto bg-[#18181C] text-[#D4D4D8]">
      {answer ? (
        <Answer
          searchQuery={searchQuery}
          answer={answer}
          done={done}
          onReset={() => {
            setAnswer("");
            setSearchQuery({ query: "", sourceLinks: [] });
            setDone(false);
          }}
        />
      ) : (
        <Search
          onSearch={setSearchQuery}
          onAnswerUpdate={onAnswerUpdate}
          onDone={onSetDone}
        />
      )}
    </div>
  );
}
