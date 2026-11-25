import{i as asOptionalObjectRecord}from"./record-coerce-BTbqdJ3-.mjs";
//!src/agents/embedded-agent-runner/run/attempt-tool-call-block-type.ts
function isRunnerToolCallBlock(e){const t=asOptionalObjectRecord(e)?.type;return t===`toolCall`||t===`toolUse`||t===`functionCall`}export{isRunnerToolCallBlock as t};