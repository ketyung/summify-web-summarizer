import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from 'react-dom/client'
import { BeatLoader } from 'react-spinners';
import { TabbedView , Tab, Checkbox, Button } from 'pix0-core-ui';
import CopyButton from './copyButton';
import FieldLabel from './components/FieldLabel';
import StyleSel from './components/StyleSel';
import { SummarizationStyle } from './components/webSumStyle';
import LanSel from './components/LanSel';

const Popup = () => {
  const [pageContent, setPageContent] = useState<string>();

  const [summary, setSummary] = useState<string>();


  const [isError, setIsError] = useState(false);


  const [tabIndex, setTabIndex] = useState(0);

  const [processing, setProcessing] = useState(false);

  const [auto, setAuto] = useState(false);

  const [summStyle, setSummStyle] = useState<string>(SummarizationStyle.BULLET_POINT);

  const [language, setLanguage] = useState("en");

  const [hasPermission, setHasPermission] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  

  // Callback function to fetch content
  const fetchContent = useCallback(async (byPassAutoCheck : boolean = false) => {

    if (!byPassAutoCheck) {
      if ( !auto ){
          return;
      } 
    }

    setIsError(false);
    setProcessing(true);

    chrome.runtime.sendMessage(
      { type: "sumPage", style: summStyle, language }, // Sending 'sumPage' action to the background script
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
          setSummary(response.summary);
          setTabIndex(0);
        } else {
          console.error("No response or content received.");
          setPageContent("No response or content received.");
          setIsError(true);
        }

        setProcessing(false);
      }
    );
  }, [auto, summStyle, language]); 


  useEffect(() => {
    fetchContent();
  }, [fetchContent]);


  const tabs : Tab[] = [{title:"Summary",  view:
  <>
  {summary && <CopyButton textToCopy={summary} className='rounded-full w-24 p-1 bg-gray-300 mb-2'/>}
  <div className="whitespace-pre-wrap max-h-96 text-xs overflow-y-auto xl:max-w-screen-2xl max-w-4xl" dangerouslySetInnerHTML={{ __html:summary ?? ""}}/>
  </>
  },
  {title:"Original", view: <div className="whitespace-pre-wrap max-h-96 text-xs overflow-y-auto xl:max-w-screen-2xl max-w-4xl" dangerouslySetInnerHTML={{ __html:pageContent ?? ""}}/>}];


  
  return (
    <div className={`min-h-96 p-4 bg-white rounded-lg shadow-md w-full${isError ? ' text-red-400' : ' text-gray-800'}`}>
      <h2 className='text-2xl my-2 flex'><span className='mr-2'>Summify v1.4.3</span><FieldLabel className="inline flex ml-2 mt-1.5 mr-4" title="Auto Summarization">
          <Checkbox lightTickColor='#ff2' checked={auto} setChecked={(c)=>{

              if (!hasPermission) {
                  setShowConfirm(true);
              }else {
                  setAuto(c);
              }
          }}/>
        </FieldLabel></h2>
      <div className='my-2'>
        <FieldLabel title="Summary Style">
          <StyleSel setSelectedStyle={setSummStyle} selectedStyle={summStyle ?? ""}/>
        </FieldLabel>
      </div>
      <div className='my-2'>
        <FieldLabel title="Summary Language">
          <LanSel setSelectedLanguage={setLanguage} selectedLanguage={language}/>
        </FieldLabel>
      </div>
      {showConfirm && 
        <div className='border border-red-500 rounded p-2 my-2'>
        To summarize this page, Summify needs temporary access to its content. 
        Please note, we do NOT store your content on our servers or anywhere else. Do you want to proceed?
        <div className='my-4 flex'>
          <Button className='rounded-full p-2 w-24 bg-green-500 text-gray-100 mr-4' onClick={async (e)=>{
              e.preventDefault();
              setHasPermission(true);
              setShowConfirm(false);
              await fetchContent(true);
          }}>Yes</Button>

          <Button className='rounded-full p-2 w-24 bg-gray-700 text-gray-100 ml-4' onClick={(e)=>{
              e.preventDefault();
              setHasPermission(false);
              setShowConfirm(false);
          }}>No</Button>
        </div>
      </div>}
      <div className='my-2'>
      <Button disabled={processing} onClick={async (e)=>{
            e.preventDefault();
            if ( !hasPermission) {
                setShowConfirm(true);
            }else {
                await fetchContent(true);
            }
        }}
        className="my-2 w-64 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors xl:text-base text-xs">
        {processing ? <BeatLoader size={6} color='#aaa'/> : <>Summarize</>}
      </Button>
      </div>
      <div className='h-full'>
      {(pageContent && summary) ? <TabbedView groupId='_1stTab' tabs={tabs} selected={tabIndex} setSelected={setTabIndex}/> : (
    
        <div className='my-4'>{processing ? <div className='flex'>Summarizing<BeatLoader size={8} color="#aaa" className='ml-1 inline mt-1' /></div> : <></>}</div>
      )}
      </div>
      {isError && <button className='p-2 w-32 text-gray-100 rounded-full bg-gray-800' disabled={processing} onClick={(e)=>{
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