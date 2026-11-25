//!src/shared/deferred.ts
const promiseWithResolvers=Promise;function createDeferredCore(){return promiseWithResolvers.withResolvers()}export{createDeferredCore as t};