import{s as resolvePluginApprovalRequestAllowedDecisions}from"./plugin-approvals-NfNDMxex.mjs";
//!src/infra/plugin-approval-canonical-decisions.ts
function resolveCanonicalPluginApprovalRequestAllowedDecisions(e){const t=resolvePluginApprovalRequestAllowedDecisions(e);return t.includes(`deny`)?t:[...t,`deny`]}export{resolveCanonicalPluginApprovalRequestAllowedDecisions as t};