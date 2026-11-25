//!src/agents/thinking-block.ts
function isThinkingLikeBlock(e){if(!e||typeof e!==`object`)return false;const t=e.type;return t===`thinking`||t===`redacted_thinking`}export{isThinkingLikeBlock as t};