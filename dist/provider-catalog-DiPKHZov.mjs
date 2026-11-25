import{r as discoverHuggingfaceModels,t as HUGGINGFACE_BASE_URL}from"./models-C_kisVVx.mjs";
//!extensions/huggingface/provider-catalog.ts
async function buildHuggingfaceProvider(e=``,t={}){return{baseUrl:HUGGINGFACE_BASE_URL,api:`openai-completions`,models:await discoverHuggingfaceModels(e,void 0,t)}}export{buildHuggingfaceProvider as t};