import { Select } from "pix0-core-ui";
import { AllSummStyles, SummarizationStyle, stringToSummarizationStyle } from "./webSumStyle";
import { ChromeSummType, AllSummStyles as GAllSumStyles, stringToChromeSummType } from "./chromeSumStyle";


type props = {

    setSelectedStyle : (style : string ) => void,

    selectedStyle : string, 
}

export default function StyleSel({setSelectedStyle, selectedStyle} :props) {

    const hasBuiltInSummarizer = ('ai' in self && 'summarizer' in (self.ai as any));

    const allTypes = hasBuiltInSummarizer ? GAllSumStyles : AllSummStyles;

    return <Select className='w-3/5' options={allTypes.map((e)=>{
             
        if ( e === SummarizationStyle.NONE || e === ChromeSummType.None) {
          return {value : e, label:"Choose A Style"};
        }
        return {value : e, label: e}
    })} onChange={(e)=>{
        setSelectedStyle( hasBuiltInSummarizer ? stringToChromeSummType(e.target.value) : stringToSummarizationStyle(e.target.value));
    }} value={selectedStyle}/>
    
}