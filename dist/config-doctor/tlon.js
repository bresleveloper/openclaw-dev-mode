import { i as createLegacyPrivateNetworkDoctorContract } from "./runtime-doctor-migrations-BhouWAUC.js";
//#region extensions/tlon/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "tlon" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
