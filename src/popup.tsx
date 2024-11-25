import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from 'react-dom/client'
import { BeatLoader } from 'react-spinners';

const Popup = () => {
  const [pageContent, setPageContent] = useState<string>();

  const [isError, setIsError] = useState(false);

  // Callback function to fetch content
  const fetchContent = useCallback(() => {

    setIsError(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "fetchPageContent" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log('popup.chrome.runtime.lastError.message:', chrome.runtime.lastError.message);
              setPageContent(chrome.runtime.lastError.message ?? "Error fetching content");
              setIsError(true);
              return;
            }

       
            if (response?.content) {
              setPageContent(response.content);
            } else {
              console.error('No response or content received.');
              setPageContent('No response or content received.');
              setIsError(true);
            }
          }
        );
      }
    });
  }, []); // Empty dependency array ensures `fetchContent` is stable.

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div style={{color: isError ? "#d00" : "#222",  minWidth: '460px', padding:"4px", border:"1px solid #ccc", background:"#fff"}} 
    className={`p-4 max-w-xl bg-white rounded-lg shadow-md w-full${isError ? ' text-red-400' : ' text-gray-800'}`}>
      <h2 className='text-2xl'>Summify v1.2.6</h2>
      <h2 className="font-bold text-lg mb-2">Page Content:</h2>
      {pageContent ? (
        <p className={"whitespace-pre-wrap"}>{pageContent}</p>
      ) : (
        <p>
          <BeatLoader size={8} color="#aaa" />
        </p>
      )}
    </div>
  );
};

// Use createRoot to render the component in React 18 and later
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Popup />);