import{t as findMarkdownCodeRegions}from"./markdown-code-regions-DW0eMqgb.mjs";import"./code-ranges-DvhlRpPR.mjs";
//!src/shared/text/trim-code-text.ts
function trimTextPreservingCode(e,t=`both`,n){let r=e.trimStart();if(r&&r.length!==e.length){const t=e.length-r.length;const i=(n??findMarkdownCodeRegions(e)).find(e=>(e.block||n&&e.start===0)&&e.start<=t&&t<e.end);if(i)r=e.slice(i.start)}if(t===`both`){const t=e.trimEnd().length;if(n?.some(n=>n.start<=t&&n.end===e.length))return r;return r.trimEnd()}return r}function combineNonStreamingReplyParts(e){let t=``;for(const n of e){if(!n.trim())continue;const e=!t||/[\r\n]$/.test(t)||/^[\r\n]/.test(n)?``:/^[\t ]+\S/.test(n)?`
`:`

`;t+=e+n}return trimTextPreservingCode(t)}export{trimTextPreservingCode as n,combineNonStreamingReplyParts as t};