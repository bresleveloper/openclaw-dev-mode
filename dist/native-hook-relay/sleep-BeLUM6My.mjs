import{y as resolveTimerTimeoutMs}from"./number-coercion-DIhBGkET.mjs";import{n as createAbortError,s as sleepWithAbort}from"./src-CY_qXgOR.mjs";
//!src/infra/abort-signal.ts
function isAbortError(e){if(!e||typeof e!==`object`)return false;try{if((`name`in e?String(e.name):``)===`AbortError`)return true;return(`message`in e&&typeof e.message===`string`?e.message:``)===`This operation was aborted`}catch{return false}}
//!src/utils/sleep.ts
function sleep(e,t){const n=resolveTimerTimeoutMs(e,0,0);if(t){if(t.aborted)return Promise.reject(createAbortError(`aborted`,{cause:t.reason??/* @__PURE__ */ new Error(`aborted`)}));return sleepWithAbort(n,t)}return new Promise(e=>{setTimeout(e,n)})}export{isAbortError as n,sleep as t};