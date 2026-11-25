import{n as applyAgentDefaultMediaModel}from"./provider-onboard-BM-9pxDY.mjs";
//!extensions/fal/onboard.ts
const FAL_DEFAULT_IMAGE_MODEL_REF=`fal/fal-ai/flux/dev`;function applyFalConfig(e){return applyAgentDefaultMediaModel(e,`image`,FAL_DEFAULT_IMAGE_MODEL_REF)}export{applyFalConfig as t};