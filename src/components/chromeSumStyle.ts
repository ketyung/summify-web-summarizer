export const getAllEnumValues = <T extends Record<string, string | number>>(enumObj: T): T[keyof T][] => {
  return Object.values(enumObj).filter(value => typeof value === "string" || typeof value === "number") as T[keyof T][];
};


export enum ChromeSummType {
    KeyPoints = "Key Points", // default
    SummaryAtAGlance = "TLDR",
    BriefPreview = "Teaser",
    CatchyHeadline = "Headline",
    None = "None",
}


export function getChromeSummTypeValue(type: ChromeSummType): string {
    switch (type) {
      case ChromeSummType.KeyPoints:
        return "key-points";
      case ChromeSummType.SummaryAtAGlance:
        return "tl;dr";
      case ChromeSummType.BriefPreview:
        return "teaser";
      case ChromeSummType.CatchyHeadline:
        return "headline";
      default:
        return "key-points";
    }
}

export function stringToChromeSummType(input: string): ChromeSummType {
    const formattedInput = input.trim().toLowerCase(); // Normalize input
    const typeMap: { [key: string]: ChromeSummType } = {
      "key-points": ChromeSummType.KeyPoints,
      "tl;dr": ChromeSummType.SummaryAtAGlance,
      teaser: ChromeSummType.BriefPreview,
      headline: ChromeSummType.CatchyHeadline,
    };
  
    return typeMap[formattedInput] || ChromeSummType.KeyPoints; // Default to KeyPoints if no match
}


export const AllSummStyles = getAllEnumValues(ChromeSummType);
