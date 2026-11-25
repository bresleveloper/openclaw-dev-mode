//!extensions/deepgram/audio-query.ts
function setDeepgramQueryParam(e,t,n){if(Array.isArray(n)){e.delete(t);for(const r of n)e.append(t,r)}else e.set(t,String(n))}export{setDeepgramQueryParam as t};