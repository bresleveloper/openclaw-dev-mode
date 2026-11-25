import{n as ToolInputError}from"./tool-input-error-BCfbFipG.mjs";
//!src/image-generation/resolution.ts
function normalizeImageGenerationResolution(e){const t=e?.trim().toUpperCase();if(!t)return;if(t===`1K`||t===`2K`||t===`4K`)return t;throw new ToolInputError(`resolution must be one of 1K, 2K, or 4K`)}export{normalizeImageGenerationResolution as t};