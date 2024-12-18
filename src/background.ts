
console.log("Background script running!");


if ('ai' in self && 'summarizer' in (self.ai as any)) {
    // The Summarizer API is supported.
    console.log("The summarizer API is supported");
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  
  if (message.type === "sumPage") {
  
    handleSummarizePage(sendResponse, message.style, message.language, message.content, message.title);
    return true; // Keep the message channel open for async responses
  }else 
  if (message.action === 'openPopupWithTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        // Open the popup window

      
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: 800,
          height: 600,
          left: 400, // Position of the popup
          top: 100,
        }, async (_w : any) => {
           
            if ( message.article ){
                await chrome.storage.local.set({ 'content': message.article.content});
                await chrome.storage.local.set({ 'title': message.article.title});
            }

        });
      };

   

    });
    //return true;
  }
});

const handleSummarizePage = async (sendResponse: (response: any) => void, style: string, language ? : string , content? : string, title? : string ) => {
  try {
    // Get active tab
    const tabs = await getActiveTab();
    if (!tabs[0]?.id) {

      sendResponse({ error: "No active tab found." });
      return;
    }

    
    if ( content ) {
        const summary = await summarizeText(content, style, language);
        sendResponse({ title: title, content: content, summary });

    }else {

        // Send a message to the content script to fetch page content
        const response = await sendMessageToTab(tabs[0].id, { action: "fetchPageContent" });
        
        if (response?.content) {
          // Summarize the content
            const summary = await summarizeText(response.content, style, language);

            sendResponse({ title: response.title, content: response.content, summary });
        } else {
            sendResponse({ error: "No content extracted from the page." });
        }
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


const summarizeText = async (text: string, style : string, language? : string ): Promise<string> => {

  const ai : any = 'ai' in self && 'summarizer' in (self.ai as any) ? (self.ai as any) : undefined ;


  if ( ai.summarizer === undefined) {

      return 'Undefined summarizer';
  }

  try {
     
      const options = {
        sharedContext: 'This is a scientific article',
        type: style,
        format: 'markdown',
        length: 'medium',
      };
      
      const available = (await ai.summarizer.capabilities()).available;
      let summarizer;

      console.log("summarizer available?", available);
      if (available === 'no') {
          // The Summarizer API isn't usable.
          //console.log("summarizer is:",ai.summarizer );
          return 'Summarizer is NOT available';
      }
      if (available === 'readily') {
        // The Summarizer API can be used immediately .
          summarizer = await ai.summarizer.create(options);
      } else {
          // The Summarizer API can be used after the model is downloaded.
          summarizer = await ai.summarizer.create(options);
          summarizer.addEventListener('downloadprogress', (e: any) => {
            console.log(e.loaded, e.total);
          });
          await summarizer.ready;
      }

    
      const summary = await summarizer.summarize(text , {
        context: text ,
      });
    
      if (summary && language){

          if ( language === 'en') {
              return summary;
          }
          return await translateSummary(summary, language);
      }

      return summary;
  }catch(e : any ){

      return `Error: ${e.message}`;
  }

}



const translateSummary = async (summary : string, toLanguage : string, fromLanguage : string = 'en' ) =>{

  if ('translation' in self /*&& 'createTranslator' in (self.translation as any)*/)  {
      // The Translator API is supported.


      const translator = await (self.translation as any).createTranslator({
        sourceLanguage: fromLanguage,
        targetLanguage: toLanguage,
      });

      const translatorStatus = await translator.canTranslate({
        sourceLanguage: fromLanguage,
        targetLanguage: toLanguage,
      });


   
      if (translatorStatus === "no") {
          console.log("Unable to translate from", fromLanguage, "to",toLanguage, "translator is", translatorStatus);
          return summary;
      }
      console.log("Translator status is", translatorStatus);

      const translatedText = await translator.translate(summary);

      return translatedText;
  }
  console.log("No translator available for translating", fromLanguage, "to",toLanguage);

  return summary;
  
}

/*
const summarizeTextByApi = async (text: string, style : string, language? : string ): Promise<string> => {
  try {

    //console.log("style::", style, "lan::", language);

    const postData : any = { content : text, summStyle: style, language: language  };

    //console.log("post.data::", postData);

    const response = await fetch("https://tools.techchee.com/api/gai/summWeb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer Temp_Chrome_Ext_Key_`, 
      },
      body: JSON.stringify({data : postData}),
    });
    const data = await response.json();

    //console.log("at bg::data.is:",data);
    
    if ( data.status === 1)
        return data.text;
    else {

        if (data.error){
            return data.error;
        }

        if ( data.message ){
            return data.message;
        }
        return 'Possibly error';
    }
    
  } catch (error) {
    console.error("Failed to summarize text:", error);
    return "Error generating summary.";
  }
};*/