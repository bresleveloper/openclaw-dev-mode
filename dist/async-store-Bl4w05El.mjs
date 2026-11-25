import{AsyncResource}from"node:async_hooks";
//!src/shared/async-store.ts
function enterAsyncStore(e,t){this.enterWith(e);return t()}function runWithAsyncStore(e,t,n){if(e.getStore()===t)return n();return new AsyncResource(`OpenClawAsyncStore`).runInAsyncScope(enterAsyncStore,e,t,n)}export{runWithAsyncStore as t};