import{a as resolveApiKeyForProvider}from"./provider-auth-runtime-Oyus2coP.mjs";
//!extensions/google/generation-auth.ts
async function resolveGoogleGenerationApiKey(e){const{apiKey:t}=await resolveApiKeyForProvider({provider:`google`,cfg:e.cfg,agentDir:e.agentDir,store:e.authStore});if(!t)throw new Error(`Google API key missing`);return t}export{resolveGoogleGenerationApiKey as t};