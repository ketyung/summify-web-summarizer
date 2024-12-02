import { Readability } from "@mozilla/readability";

// Check if the page is not the popup page
if (window.location.pathname !== '/popup.html') {
        // Inject a floating button into the page
      // Inject a floating button into the page
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '10000';
    button.style.padding = '4px 10px 4px 10px'; // Adjust padding to fit the icon and text
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.backgroundColor = '#9922CC';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'background-color 0.3s';
    button.style.display = 'flex'; // Flexbox for icon and text alignment
    button.style.alignItems = 'center'; // Center the icon and text vertically
    button.style.gap = '8px'; // Space between icon and text

    // Add hover effect
    button.onmouseover = () => {
      button.style.backgroundColor = '#0056b3';
    };
    button.onmouseleave = () => {
      button.style.backgroundColor = '#9922CC';
    };

    // Create an image element for the icon
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icons/icon-48.png'); // Get the URL for the icon
    icon.alt = 'Summify Icon';
    icon.style.width = '20px'; // Match the icon size
    icon.style.height = '20px';
    

    // Create a text node for the button label
    const buttonText = document.createElement('span');
    buttonText.textContent = 'Summarize';

    // Append the icon and text to the button
    button.appendChild(icon);
    button.appendChild(buttonText);

    // Handle click event to open the popup
    button.addEventListener('click', async () => {
      
        chrome.runtime.sendMessage({ action: 'openPopupWithTab'});

    });

    // Add the button to the DOM
    document.body.appendChild(button);

}



const getArticleFromDoc = () =>{

  const docClone = document.cloneNode(true) as Document;

  // Pass the cloned document to Readability
  const reader = new Readability(docClone);
  const article = reader.parse();

  return article;

}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "fetchPageContent") {
    try {
      // Check if the opener exists (i.e., if the current window was opened by another window)
     
         const article =  getArticleFromDoc();

        if (article) {
          sendResponse({ title: article.title, content: article.content.trim() });
        } else {
          sendResponse({ error: "Unable to parse the content from the parent window." });
        }
    } catch (error: any) {
      console.error("Error extracting content with Readability:", error);
      sendResponse({ error: error.message });
    }
  }
  return true; // Indicate an asynchronous response
});
