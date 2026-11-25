//!packages/normalization-core/src/stringified-error.ts
function toStringifiedError(e){return e instanceof Error?e:new Error(String(e))}export{toStringifiedError as t};