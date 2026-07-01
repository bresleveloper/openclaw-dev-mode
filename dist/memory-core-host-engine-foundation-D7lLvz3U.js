import "./paths-DyelItkH.js";
import "./fs-safe-aqmM_n6V.js";
import "./utils-BApvfmPs.js";
import "./types.secrets-lIZQEgMF.js";
import "./subsystem-yNfG7O3v.js";
import "./agent-scope-CDZXADgT.js";
import "./config-A41fTHlt.js";
import "./mime-C8mVE2Bw.js";
import "./paths-CHZBIGhF.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import "./memory-search-QpW93KPi.js";
import "./fs-utils-B-YGVvwo.js";
import "./openclaw-runtime-config-DyfrpEp8.js";
import "./openclaw-runtime-session-DyfrpEp8.js";
//#region src/plugin-sdk/memory-core-host-engine-foundation.ts
/**
* Public SDK foundation surface for memory host engine config, paths, and shared helpers.
*/
const MEMORY_CORE_TRANSCRIPT_UPDATE_SUBSCRIBER_KEY = Symbol.for("openclaw.memoryCore.sessionTranscriptUpdateSubscriber");
globalThis[MEMORY_CORE_TRANSCRIPT_UPDATE_SUBSCRIBER_KEY] ??= onInternalSessionTranscriptUpdate;
//#endregion
export {};
