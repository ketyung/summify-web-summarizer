import { ReactNode } from "react";

type props ={
    children : string|ReactNode, 

    className? : string, 

    title? : string|ReactNode,

    sideTrigger? : ReactNode,

    id? : string, 
}

export default function FieldLabel ({children, title, className, sideTrigger, id } : props) {

    return <div className={className} id={id}>
            <div className={`text-xs text-gray-600 ${sideTrigger ? " flex" : ""}`}>
            {title}{sideTrigger}</div>
            {children}
    </div>
}