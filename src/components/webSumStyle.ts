export const getAllEnumValues = <T extends Record<string, string | number>>(enumObj: T): T[keyof T][] => {
    return Object.values(enumObj).filter(value => typeof value === "string" || typeof value === "number") as T[keyof T][];
};

export enum SummarizationStyle {
    SENTENCE = "Sentence", // Concise individual points
    PARAGRAPH = "Paragraph", // Detailed explanation in paragraphs
    BULLET_POINT = "Bullet Point", // Highlights in bulleted lists
    HEADING = "Heading", // Section categorization
    NUMBERED_LIST = "Numbered List", // Ordered steps or processes
    TABLE = "Table", // Structured tabular format
    HIGHLIGHT_BOX = "Highlight Box", // Important facts or tips
    QUOTE = "Quote", // Key quotes or notable text from the content
    CODE_SNIPPET = "Code Snippet", // Code blocks for technical content
    MARKDOWN = "Markdown", // Markdown-based styling
    NONE = "None",
}



export const AllSummStyles = getAllEnumValues(SummarizationStyle);


export function stringToSummarizationStyle(input: string): SummarizationStyle {
  const formattedInput = input.trim().toLowerCase(); // Normalize input
  const styleMap: { [key: string]: SummarizationStyle } = {
    sentence: SummarizationStyle.SENTENCE,
    paragraph: SummarizationStyle.PARAGRAPH,
    "bullet point": SummarizationStyle.BULLET_POINT,
    heading: SummarizationStyle.HEADING,
    "numbered list": SummarizationStyle.NUMBERED_LIST,
    table: SummarizationStyle.TABLE,
    "highlight box": SummarizationStyle.HIGHLIGHT_BOX,
    quote: SummarizationStyle.QUOTE,
    "code snippet": SummarizationStyle.CODE_SNIPPET,
    markdown: SummarizationStyle.MARKDOWN,
  };

  return styleMap[formattedInput] || SummarizationStyle.PARAGRAPH; // Default to PARAGRAPH if no match
}
