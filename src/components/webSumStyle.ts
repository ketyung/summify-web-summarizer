const getAllEnumValues = <T extends Record<string, string | number>>(enumObj: T): T[keyof T][] => {
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

function lanAppend(language: string) {
    let prompt = "";
    switch (language) {
      case 'ar':
        prompt = "Please return the summary in Arabic.";
        break;
      case 'bm':
        prompt = "Please return the summary in Bahasa Malaysia.";
        break;
      case 'de':
        prompt = "Please return the summary in German.";
        break;
      case 'en':
        prompt = ""; // Default to English, no explicit instruction needed.
        break;
      case 'es':
        prompt = "Please return the summary in Spanish.";
        break;
      case 'fr':
        prompt = "Please return the summary in French.";
        break;
      case 'hi':
        prompt = "Please return the summary in Hindi.";
        break;
      case 'it':
        prompt = "Please return the summary in Italian.";
        break;
      case 'ja':
        prompt = "Please return the summary in Japanese.";
        break;
      case 'ko':
        prompt = "Please return the summary in Korean.";
        break;
      case 'pt':
        prompt = "Please return the summary in Portuguese.";
        break;
      case 'ru':
        prompt = "Please return the summary in Russian.";
        break;
      case 'th':
        prompt = "Please return the summary in Thai.";
        break;
      case 'vi':
        prompt = "Please return the summary in Vietnamese.";
        break;
      case 'zh':
        prompt = "Please return the summary in Simplified Chinese.";
        break;
      case 'zh-tw':
        prompt = "Please return the summary in Traditional Chinese.";
        break;
      default:
        // Default to English if the language is not recognized
        prompt = "";
        break;
    }
  
    return prompt;
}
  
function getStyleDescription(style: SummarizationStyle, language: string = 'en'): string {
    let prompt: string;

    // Generate the summary style description in English
    switch (style) {
        case SummarizationStyle.SENTENCE:
            prompt = "Summarize the content in concise sentences.";
            break;
        case SummarizationStyle.PARAGRAPH:
            prompt = "Summarize the content in detailed paragraphs.";
            break;
        case SummarizationStyle.BULLET_POINT:
            prompt = "Summarize the content in bullet points for highlights.";
            break;
        case SummarizationStyle.HEADING:
            prompt = "Organize the summary into sections with headings.";
            break;
        case SummarizationStyle.NUMBERED_LIST:
            prompt = "Provide the summary as a numbered list for clear steps.";
            break;
        case SummarizationStyle.TABLE:
            prompt = "Present the summary in a structured tabular format.";
            break;
        case SummarizationStyle.HIGHLIGHT_BOX:
            prompt = "Summarize key points in highlight boxes.";
            break;
        case SummarizationStyle.QUOTE:
            prompt = "Extract and summarize using key quotes.";
            break;
        case SummarizationStyle.CODE_SNIPPET:
            prompt = "Include relevant code snippets in the summary.";
            break;
        case SummarizationStyle.MARKDOWN:
            prompt = "Provide the summary formatted with Markdown styling.";
            break;
        default:
            prompt = "Organize the summary into sections with headings, use paragraphs for detailed explanations, and include bullet points for concise lists. Ensure the tone is professional and easy to read.";
            break;
    }

    // Add instruction to specify the language for the result
  
    prompt += " "+lanAppend(language);
    // Now, pass the prompt to the generative AI (assumed function)
    return prompt;
}

  

  export function constructSummarizePrompt(content: string, style?: SummarizationStyle, language: string = 'en' ): string {
    const styleDescription = getStyleDescription(style ?? SummarizationStyle.NONE, language);
    return `Summarize the following web page content. ${styleDescription}
  
  Content to summarize:  
  ${content}`;
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

export const languageSymbols = [
    { code: 'ar', symbol: '🇸🇦', language: 'Arabic' },
    { code: 'bm', symbol: '🇲🇾', language: 'Bahasa Malaysia' },
    { code: 'de', symbol: '🇩🇪', language: 'German' },
    { code: 'en', symbol: '🇬🇧', language: 'English' },
    { code: 'es', symbol: '🇪🇸', language: 'Spanish' },
    { code: 'fr', symbol: '🇫🇷', language: 'French' },
    { code: 'hi', symbol: '🇮🇳', language: 'Hindi' },
    { code: 'it', symbol: '🇮🇹', language: 'Italian' },
    { code: 'ja', symbol: '🇯🇵', language: 'Japanese' },
    { code: 'ko', symbol: '🇰🇷', language: 'Korean' },
    { code: 'pt', symbol: '🇵🇹', language: 'Portuguese' },
    { code: 'ru', symbol: '🇷🇺', language: 'Russian' },
    { code: 'th', symbol: '🇹🇭', language: 'Thai' },
    { code: 'vi', symbol: '🇻🇳', language: 'Vietnamese' },
    { code: 'zh', symbol: '🇨🇳', language: 'Simplified Chinese' },
    { code: 'zh-tw', symbol: '🇹🇼', language: 'Traditional Chinese' }
  ];
  