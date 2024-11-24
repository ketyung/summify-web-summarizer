// background.ts
console.log("Background script running!");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SUMMARIZE_PAGE") {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GET_PAGE_CONTENT" },
          (response) => {
            if (response?.content) {
              // Use the page content for summarization (e.g., call your API)
              summarizeText(response.content).then((summary) => {
                sendResponse({ summary });
              });
            }
          }
        );
      }
    });

    // Keep the message channel open for async response
    return true;
  }
});

// Example function to send the content to your API for summarization
const summarizeText = async (text: string): Promise<string> => {
  try {


    /*
    const response = await fetch("https://api.your-ai.com/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data.summary;
    */

    return text 
  } catch (error) {
    console.error("Failed to summarize text:", error);
    return "Error generating summary.";
  }
};