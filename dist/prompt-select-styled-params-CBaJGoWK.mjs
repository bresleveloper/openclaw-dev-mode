import{n as stylePromptMessage,t as stylePromptHint}from"./prompt-style-B-J86yY8.mjs";
//!packages/terminal-core/src/prompt-select-styled-params.ts
function styleSelectParams(e){return{...e,message:stylePromptMessage(e.message),options:e.options.map(e=>{const t=`hint`in e&&typeof e.hint===`string`?e.hint:void 0;return t===void 0?e:{...e,hint:stylePromptHint(t)}})}}export{styleSelectParams as t};