import{normalizeOptionalString,readStringValue}from"openclaw/plugin-sdk/string-coerce-runtime";
//!extensions/google/oauth-token-shared.ts
function parseGoogleOauthApiKey(e){try{const t=JSON.parse(e);return{token:readStringValue(t.token),projectId:readStringValue(t.projectId)}}catch{return null}}
//!extensions/google/gemini-auth.ts
function parseGeminiAuth(e){const t=e.startsWith(`{`)?parseGoogleOauthApiKey(e):null;return{headers:{...t?.token?{Authorization:`Bearer ${t.token}`}:{"x-goog-api-key":e},"Content-Type":`application/json`}}}function resolveGoogleEnvApiKey(){return normalizeOptionalString(process.env.GEMINI_API_KEY)??normalizeOptionalString(process.env.GOOGLE_API_KEY)}export{resolveGoogleEnvApiKey as n,parseGeminiAuth as t};