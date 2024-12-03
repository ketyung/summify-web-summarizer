import { Select } from "pix0-core-ui";
import { ChromeSummType, AllSummStyles as GAllSumStyles, getChromeSummTypeValue } from "./chromeSumStyle";

export const hasBuiltInSummarizer = ('ai' in self && 'summarizer' in (self.ai as any));
 
type props = {

    setSelectedStyle : (style : string ) => void,

    selectedStyle : string, 
}

export default function StyleSel({setSelectedStyle, selectedStyle} :props) {

   
    return <Select className='w-3/5' options={GAllSumStyles.map((e)=>{
             
        if (  e === ChromeSummType.None) {
          return {value : e, label:"Choose A Style"};
        }

        const o = {value : getChromeSummTypeValue(e), label: e};
        //console.log("oo::", o);
        return o;

    })} onChange={(e)=>{
        setSelectedStyle(e.target.value );
    }} value={selectedStyle}/>
    
}