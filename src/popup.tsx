import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from 'react-dom/client'
import { BeatLoader } from 'react-spinners';
import { TabbedView , Tab } from 'pix0-core-ui';

const Popup = () => {
  const [pageContent, setPageContent] = useState<string>();

  const [summary, setSummary] = useState<string>();


  const [isError, setIsError] = useState(false);


  const [tabIndex, setTabIndex] = useState(0);

  const [processing, setProcessing] = useState(false);
  // Callback function to fetch content
  const fetchContent = useCallback(() => {
    setIsError(false);
    setProcessing(true);

    chrome.runtime.sendMessage(
      { type: "sumPage" }, // Sending 'sumPage' action to the background script
      (response) => {
        if (chrome.runtime.lastError) {
          setPageContent(chrome.runtime.lastError.message ?? "Error fetching content");
          setSummary("Error of summarizing content");
          setIsError(true);
          setProcessing(false);
          return;
        }

        if (response?.content) {
          setPageContent(response.content);
          setSummary(response.summary ?? "No summary");
          setTabIndex(0);
        } else {
          console.error("No response or content received.");
          setPageContent("No response or content received.");
          setIsError(true);
        }

        setProcessing(false);
      }
    );
  }, []); 


  useEffect(() => {
    fetchContent();
  }, [fetchContent]);


  const tabs : Tab[] = [{title:"Summary",  view:
  <div className="whitespace-pre-wrap p-2" dangerouslySetInnerHTML={{ __html:summary ?? ""}}/>},
  {title:"Original", view: <div className="whitespace-pre-wrap p-2" dangerouslySetInnerHTML={{ __html:pageContent ?? ""}}/>}];


  
  return (
    <div style={{color: isError ? "#d00" : "#222",  minWidth: '460px', padding:"4px", border:"1px solid #ccc", background:"#fff"}} 
    className={`p-4 max-w-xl bg-white rounded-lg shadow-md w-full${isError ? ' text-red-400' : ' text-gray-800'}`}>
      <h2 className='text-2xl'>Summify v1.3.3</h2>
      {(pageContent && summary) ? <TabbedView tabs={tabs} selected={tabIndex}/> : (
        <p>
          {processing ? <BeatLoader size={8} color="#aaa" /> : <>Start soon...</>}
        </p>
      )}

      {isError && <button className='p-2 w-32' disabled={processing} onClick={(e)=>{
         e.preventDefault();
         setIsError(false);
         setTimeout(()=>{
            fetchContent();
         },500);
      }}>Try again</button>}
    </div>
  );
};

// Use createRoot to render the component in React 18 and later
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Popup />);