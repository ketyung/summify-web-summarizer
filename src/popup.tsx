import { useState, useEffect, useCallback } from "react";
import { BeatLoader } from "react-spinners";

const Popup = () => {
  const [pageContent, setPageContent] = useState("");

  // Callback function to fetch content
  const fetchContent = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "fetchPageContent" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("chrome.runtime.lastError.message:", chrome.runtime.lastError.message);
              return;
            }

            // Handle the response from content script
            if (response?.content) {
              setPageContent(response.content);
            } else {
              console.error("No response or content received.");
            }
          }
        );
      }
    });
  }, []); // Empty dependency array ensures `fetchContent` is stable.

  // Automatically fetch content when the popup loads
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div className="p-4 max-w-xl bg-white rounded-lg shadow-md" style={{minWidth:"460px"}}>
      <h2 className="font-bold text-lg mb-2">Page Content:</h2>
      {pageContent ? (
        <p className="whitespace-pre-wrap">{pageContent}</p>
      ) : (
        <p><BeatLoader size={8} color="#aaa"/></p>
      )}
    </div>
  );
};

export default Popup;