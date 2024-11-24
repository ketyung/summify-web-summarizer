import { Readability } from "@mozilla/readability";

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "fetchPageContent") {
    try {
      // Clone the document to avoid altering the live DOM
      const docClone = document.cloneNode(true) as Document;

      // Pass the cloned document to Readability
      const reader = new Readability(docClone);
      const article = reader.parse();

      if (article) {
        sendResponse({ title: article.title, content: article.content });
      } else {
        sendResponse({ error: "Unable to parse the content." });
      }
    } catch (error : any ) {
      console.error("Error extracting content with Readability:", error);
      sendResponse({ error: error.message });
    }
  }
  return true; // Indicate an asynchronous response
});
