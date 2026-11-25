import{s as defineChannelAliasMigration}from"./runtime-doctor-migrations-D8alsOFs.js";
//!extensions/mattermost/src/doctor-contract.ts
const{legacyConfigRules,normalizeChannelConfig:normalizeCompatibilityConfig}=defineChannelAliasMigration({channelId:`mattermost`,streaming:{defaultMode:`partial`},accountStreamingReplacesRoot:true});export{legacyConfigRules,normalizeCompatibilityConfig};