//!src/shared/weak-owner-map.ts
function getOrCreateWeakOwnerMap(e,t){let n=e.get(t);if(!n){n=/* @__PURE__ */ new Map;e.set(t,n)}return n}export{getOrCreateWeakOwnerMap as t};