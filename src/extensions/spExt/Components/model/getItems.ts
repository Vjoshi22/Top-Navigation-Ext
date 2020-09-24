import { sp } from "sp-pnp-js";
import {
    SPHttpClient,
    SPHttpClientResponse,   
    ISPHttpClientOptions
  } from '@microsoft/sp-http';

var url = `/_api/web/lists/GetByTitle('GlobalNavList')/items?$expand=ParentLookup&$select=*,ParentLookup/ItemValue`;
export interface ISPList{
    Parent: string;
}
export function getlistItems(): Promise<ISPList[]>{
    
    let currentURL = this.context.pageContext.web.absoluteUrl;

    let requestURL = currentURL.concat(url);
    return this.context.spHttpClient.get(requestURL,
    SPHttpClient.configurations.v1)
    .then(response=>{
      return response.json();
    }).then(jsonresponse =>{
       return jsonresponse.value;
       console.log(jsonresponse.value);
    }) as Promise<ISPList[]>;
   
  
}