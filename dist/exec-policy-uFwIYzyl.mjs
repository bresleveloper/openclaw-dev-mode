import{d as resolveExecPolicyForMode}from"./exec-approvals-core-BZ6-zeZE.mjs";
//!src/infra/exec-policy.ts
function applyExecPolicyLayer(e,t){if(!t)return e;if(t.mode)return{...e,mode:t.mode,...resolveExecPolicyForMode(t.mode)};if(t.security!==void 0||t.ask!==void 0){const{mode:n,...r}=e;return{...r,security:t.security??e.security,ask:t.ask??e.ask}}return e}export{applyExecPolicyLayer as t};