//!packages/normalization-core/src/expect.ts
function expectDefined(e,t){if(e===null||e===void 0)throw new Error(`expected `+t+` to be defined`);return e}export{expectDefined as t};