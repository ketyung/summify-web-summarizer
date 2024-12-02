import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from 'react-dom/client'
import { BeatLoader } from 'react-spinners';
import { TabbedView, Tab, Checkbox, Button } from 'pix0-core-ui';
import CopyButton from './copyButton';
import FieldLabel from './components/FieldLabel';
import StyleSel from './components/StyleSel';
import LanSel from './components/LanSel';
import { GoAlert } from 'react-icons/go';
import { ChromeSummType, getChromeSummTypeValue } from './components/chromeSumStyle';

const Popup = () => {
  const [pageContent, setPageContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [auto, setAuto] = useState(false);
  const [summStyle, setSummStyle] = useState<string>(getChromeSummTypeValue(ChromeSummType.KeyPoints));
  const [language, setLanguage] = useState('en');
  const [hasPermission, setHasPermission] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  

  const fetchContent = useCallback(async (byPassAutoCheck: boolean = false) => {
    if (!hasPermission || (!byPassAutoCheck && !auto)) {
      return;
    }

    setIsError(false);
    setProcessing(true);
    setSummary('');
    setPageContent('');

    try {
     
        chrome.runtime.sendMessage(
          { type: 'sumPage', style: summStyle, language },
          (sumResponse) => {
            if (chrome.runtime.lastError) {
              setError(chrome.runtime.lastError.message);
              setIsError(true);
            } else {
              if (sumResponse?.content) {
                setPageContent(sumResponse.content);
                setSummary(sumResponse.summary || 'No summary available');
                setTabIndex(0);
              } else {
                setError('No response or content received.');
                setIsError(true);
              }
            }
            setProcessing(false);
          }
        );
      
    } catch (err) {
      setError('An error occurred while fetching the content.');
      setIsError(true);
      setProcessing(false);
    }
  }, [auto, summStyle, language, hasPermission]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const tabs: Tab[] = [
    {
      title: 'Summary',
      view: (
        <>
          {summary && <CopyButton textToCopy={summary} className='rounded-full w-24 p-1 bg-gray-300 mb-2' />}
          <div className="whitespace-pre-wrap max-h-96 text-xs overflow-y-auto xl:max-w-screen-2xl max-w-4xl" dangerouslySetInnerHTML={{ __html: summary || '' }} />
        </>
      ),
    },
    {
      title: 'Original',
      view: (
        <div className="whitespace-pre-wrap max-h-96 text-xs overflow-y-auto xl:max-w-screen-2xl max-w-4xl" dangerouslySetInnerHTML={{ __html: pageContent || '' }} />
      ),
    },
  ];

  return (
    <div className={`min-h-96 p-4 bg-white rounded-lg shadow-md w-full${isError ? ' text-red-400' : ' text-gray-800'}`}>
      <h2 className='text-2xl my-2 flex'>
        <span className='mr-2'>Summify v{chrome.runtime.getManifest().version}</span>
        <FieldLabel className="inline flex ml-2 mt-1.5 mr-4" title="Auto Summarization">
          <Checkbox lightTickColor='#ff2' checked={auto} setChecked={setAuto} />
        </FieldLabel>
      </h2>

      {(showConfirm || !hasPermission) && (
        <div className='border border-red-500 rounded p-2 my-2'>
          <GoAlert className='inline w-5 h-5 mr-1' />
          To summarize this page, Summify needs temporary access to its content.
          Please note, we do NOT store your content on our servers or anywhere else. Do you want to proceed?
          <div className='my-4 flex'>
            <Button
              className='rounded-full p-2 w-24 bg-green-500 text-gray-100 mr-4'
              onClick={() => {
                setHasPermission(true);
                setShowConfirm(false);
                setError(undefined);
                setIsError(false);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      )}

      <div className='my-2'>
        <FieldLabel title="Summary Style">
          <StyleSel setSelectedStyle={setSummStyle} selectedStyle={summStyle} />
        </FieldLabel>
      </div>

      <div className='my-2'>
        <FieldLabel title="Summary Language">
          <LanSel setSelectedLanguage={setLanguage} selectedLanguage={language} />
        </FieldLabel>
      </div>

      <div className='my-2'>
        <Button
          disabled={processing}
          onClick={async (e) => {
            e.preventDefault();
            if (!hasPermission) {
              if (showConfirm) {
                setIsError(true);
                setError('Please click Yes above to grant the permission!');
              } else {
                setShowConfirm(true);
              }
            } else {
              await fetchContent(true);
            }
          }}
          className="my-2 w-64 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors xl:text-base text-xs"
        >
          {processing ? <BeatLoader size={6} color='#aaa' /> : <>Summarize</>}
        </Button>
      </div>

      <div className='h-full'>
        {(pageContent && summary) ? (
          <TabbedView groupId='_1stTab' tabs={tabs} selected={tabIndex} setSelected={setTabIndex} />
        ) : (
          <div className='my-4'>
            {processing && (
              <div className='flex'>
                Summarizing
                <BeatLoader size={8} color="#aaa" className='ml-1 inline mt-1' />
              </div>
            )}
          </div>
        )}
      </div>

      {isError && (
        <div className='my-2'>
          {error && <div className='text-red-600 text-xs my-2'>{error}</div>}
          <Button
            className='p-2 w-32 text-gray-100 rounded-full bg-gray-800'
            disabled={processing}
            onClick={async (e) => {
              e.preventDefault();
              setIsError(false);
              setTimeout(async () => {
                await fetchContent(true);
              }, 500);
            }}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};

// Use createRoot to render the component in React 18 and later
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Popup />);
