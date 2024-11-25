console.log("Background script running!");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  
  if (message.type === "sumPage") {
  
    handleSummarizePage(sendResponse);
    return true; // Keep the message channel open for async responses
  }

});

const handleSummarizePage = async (sendResponse: (response: any) => void) => {
  try {
    // Get active tab
    const tabs = await getActiveTab();
    if (!tabs[0]?.id) {

      sendResponse({ error: "No active tab found." });
      return;
    }


    // Send a message to the content script to fetch page content
    const response = await sendMessageToTab(tabs[0].id, { action: "fetchPageContent" });
    
    
    if (response?.content) {
      // Summarize the content
      const summary = await summarizeText(response.content);

      sendResponse({ title: response.title, content: response.content, summary });
    } else {
      sendResponse({ error: "No content extracted from the page." });
    }
  } catch (error) {
    console.error("Error in summarizing page:", error);
    sendResponse({ error: "An error occurred while summarizing the page." });
  }
};

// Helper function to get the active tab
const getActiveTab = (): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, resolve);
  });
};

// Helper function to send a message to a specific tab
const sendMessageToTab = (tabId: number, message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to tab:", chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(response);
      }
    });
  });
};

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
    return `<h1>Summarized:</h1>${text}`; // Dummy summarization for testing
  } catch (error) {
    console.error("Failed to summarize text:", error);
    return "Error generating summary.";
  }
};