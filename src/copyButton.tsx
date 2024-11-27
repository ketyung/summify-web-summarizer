import React, { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { Button } from "pix0-core-ui";

export function copyToClipboard(text: string, onSuccess?: (text? : string) => void, onError?: (e? : Error)=>void ): void {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
    
        try {
            document.execCommand('copy');
            if ( onSuccess) onSuccess('Copied');
        } catch (err : any) {
            if ( onError) onError(err);
        }
    
        document.body.removeChild(textArea);
        return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
        if ( onSuccess) onSuccess('Copied');

    }, (err: any) => {
        if ( onError) onError(err);
    });
}


interface CopyButtonProps {
  textToCopy: string;

  className? : string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(textToCopy);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000); // Display "Copied!" for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button title="Click To Copy"
      onClick={handleCopy}
      className={ className ? `${className} transition-colors duration-300` : 
      "inline flex items-center mb-1 dark:text-gray-300 text-indigo-600 hover:text-indigo-800 transition-colors duration-300"}
    >
      {copied ? (
        <div className="animate-pulse text-green-400 text-xs">Copied!</div>
      ) : (
        <IoCopyOutline className="w-4 h-4 inline" />
      )}
    </Button>
  );
};

export default CopyButton;