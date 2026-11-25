import{randomUUID}from"node:crypto";
//!src/config/sessions/session-diff-baseline-capture.ts
function createSessionDiffBaselineCaptureClaim(){return{version:1,captureId:randomUUID(),status:`pending`}}export{createSessionDiffBaselineCaptureClaim as t};