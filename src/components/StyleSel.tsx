import { Select } from "pix0-core-ui";
import { AllSummStyles, SummarizationStyle, stringToSummarizationStyle } from "./webSumStyle";

type props = {

    setSelectedStyle : (style : string ) => void,

    selectedStyle : string, 
}

export default function StyleSel({setSelectedStyle, selectedStyle} :props) {

    return <Select className='w-3/5' options={AllSummStyles.map((e)=>{
             
        if ( e === SummarizationStyle.NONE) {
          return {value : e, label:"Choose A Style"};
        }
        return {value : e, label: e}
    })} onChange={(e)=>{
        setSelectedStyle(stringToSummarizationStyle(e.target.value));
    }} value={selectedStyle}/>
    
}