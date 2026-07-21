import "./paths-BMBAvkNf.js";
import "./fs-safe-RNq3oO57.js";
import "./utils-CRO4LGEB.js";
import "./types.secrets-OocW4TQ1.js";
import "./subsystem-C3fiUGN1.js";
import "./agent-scope-B2Pk_xhT.js";
import "./config-Cc93keN1.js";
import "./mime-BaK8UYea.js";
import "./paths-C2C4lJH6.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BMKJWjgY.js";
import "./memory-search-JiXKdx8t.js";
import "./fs-utils-C2ZSfRoU.js";
import "./openclaw-runtime-config-DUr2_HXQ.js";
import "./openclaw-runtime-session-kFmqZ-F7.js";
//#region src/plugin-sdk/memory-core-host-engine-foundation.ts
/**
* Public SDK foundation surface for memory host engine config, paths, and shared helpers.
*/
const MEMORY_CORE_TRANSCRIPT_UPDATE_SUBSCRIBER_KEY = Symbol.for("openclaw.memoryCore.sessionTranscriptUpdateSubscriber");
globalThis[MEMORY_CORE_TRANSCRIPT_UPDATE_SUBSCRIBER_KEY] ??= onInternalSessionTranscriptUpdate;
//#endregion
export {};
