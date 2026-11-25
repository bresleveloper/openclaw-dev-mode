//!src/llm/utils/stream-wrapper.ts
function mapAssistantMessageStream(e,t){return e&&typeof e===`object`&&`then`in e?Promise.resolve(e).then(t):t(e)}export{mapAssistantMessageStream as t};