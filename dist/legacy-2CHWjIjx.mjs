import{s as findLegacyConfigRuleIssues}from"./legacy-tools-by-sender-DuYvBClm.mjs";import{n as LEGACY_CONFIG_MIGRATION_RULES}from"./legacy-config-migrations-DF7DYlEH.mjs";
//!src/config/legacy.ts
function findLegacyConfigIssues(e,t,n=[]){return findLegacyConfigRuleIssues(e,[...LEGACY_CONFIG_MIGRATION_RULES,...n],t)}export{findLegacyConfigIssues as t};