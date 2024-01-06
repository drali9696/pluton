export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  GPT4_TURBO = "gpt-4-1106-preview",
}

export type Source = {
  url: string;
  text: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: string[];
};
