import { Select } from "pix0-core-ui";
import { languageSymbols } from "./lan";


type props = {

    setSelectedLanguage : (lan : string ) => void,

    selectedLanguage : string, 
}

export default function LanSel({setSelectedLanguage, selectedLanguage} :props) {

    return <Select className='w-3/5' options={languageSymbols.map((e)=>{
             
        return {value : e.code, label: `${e.symbol} ${e.language}`}
    })} onChange={(e)=>{
        setSelectedLanguage(e.target.value);
    }} value={selectedLanguage}/>
    
}