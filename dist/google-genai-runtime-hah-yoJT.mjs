import{t as resolveGoogleApiClientHeaders}from"./google-api-client-header-C2pASjfO.mjs";import{GoogleGenAI}from"@google/genai";
//!extensions/google/google-genai-runtime.ts
function createGoogleGenAI(e){const t=e.httpOptions??{};return new GoogleGenAI({...e,httpOptions:{...t,headers:{...t.headers,...resolveGoogleApiClientHeaders({baseUrl:t.baseUrl})}}})}export{createGoogleGenAI as t};