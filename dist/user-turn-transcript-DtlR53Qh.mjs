import{t as createUserTurnTranscriptRecorder}from"./user-turn-transcript-CxnLUxf3.mjs";
//!src/system-agent/user-turn-transcript.ts
function createSystemAgentUserTurnRecorder(e){const t=createUserTurnTranscriptRecorder({input:{text:e},target:()=>void 0});delete t.captureModelPromptProjection;delete t.prepareModelPromptProjection;return t}export{createSystemAgentUserTurnRecorder as t};