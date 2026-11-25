import{n as isTruthyEnvValue}from"./env-CgAf0Ri-.mjs";import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";
//!src/canvas/config.ts
function isCoreCanvasHostEnabled(e){if(isTruthyEnvValue(process.env.OPENCLAW_SKIP_CANVAS_HOST))return false;const t=e?.plugins?.entries?.canvas?.config?.host;return!isRecord(t)||t.enabled!==false}export{isCoreCanvasHostEnabled as t};