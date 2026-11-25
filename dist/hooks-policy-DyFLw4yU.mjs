import{n as normalizeAgentId}from"./agent-id-cOfqmfln.mjs";import"./session-key-C6YO7qUA.mjs";
//!src/gateway/hooks-policy.ts
function resolveAllowedAgentIds(e){if(!Array.isArray(e))return;const t=/* @__PURE__ */ new Set;for(const n of e){const e=n.trim();if(!e)continue;if(e===`*`)return;t.add(normalizeAgentId(e))}return t}export{resolveAllowedAgentIds as t};