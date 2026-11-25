import{Check,Errors}from"typebox/value";
//!extensions/deep-research/src/validation.ts
function parseValue(e,t){if(!Check(e,t))throw new Error(`Invalid research data: ${Errors(e,t).map(e=>e.message).join(`; `)}`);return t}export{parseValue as t};