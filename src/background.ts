

// background.ts
console.log("Background script running!");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "summarizePage") {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action:  "fetchPageContent" }, // Action to trigger content extraction
          (response) => {
            if (chrome.runtime.lastError) {
              console.log("background.chrome.runtime.lastError.message:", chrome.runtime.lastError.message);
              sendResponse({ error: chrome.runtime.lastError.message });
              return;
            }

            if (response?.content) {
              // Use the page content for summarization (e.g., call your API)
              summarizeText(response.content).then((summary) => {
                sendResponse({ summary });
              });
            } else {
              sendResponse({ error: "No content extracted from the page." });
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
    // You can call your API for summarization here
    // Example:
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
    return text; // Placeholder for summarization API call
  } catch (error) {
    console.error("Failed to summarize text:", error);
    return "Error generating summary.";
  }
};