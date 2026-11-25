import{o as createLegacyPrivateNetworkDoctorContract}from"./runtime-doctor-migrations-D8alsOFs.js";
//!extensions/tlon/src/doctor-contract.ts
const contract=createLegacyPrivateNetworkDoctorContract({channelKey:`tlon`});const legacyConfigRules=contract.legacyConfigRules;const normalizeCompatibilityConfig=contract.normalizeCompatibilityConfig;export{legacyConfigRules,normalizeCompatibilityConfig};