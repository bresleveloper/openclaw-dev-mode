import { buildXiaomiSpeechProvider } from "./speech-provider.js";
//#region extensions/xiaomi/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildXiaomiSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
