import{n as isRich,r as theme}from"./theme-DS2CtI9X.mjs";
//!packages/terminal-core/src/prompt-style.ts
const stylePromptMessage=e=>isRich()?theme.accent(e):e;const stylePromptTitle=e=>e&&isRich()?theme.heading(e):e;const stylePromptHint=e=>e&&isRich()?theme.muted(e):e;export{stylePromptMessage as n,stylePromptTitle as r,stylePromptHint as t};