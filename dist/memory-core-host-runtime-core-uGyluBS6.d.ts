import "./types-D7I_F5Ux.js";
import "./config-contracts-CY87ANNp.js";
import "./sqlite-database-admission-B2aFY5v9.js";
import "./common-CCG3ut4I.js";
import "./config-S5Zm-Svf.js";
import "./utils-DhaCU8ER.js";
import "./fs-safe-Be4CnQth.js";
import "./memory-search-UMUE5u-D.js";
import "./dreaming-D2Tdqt2p.js";
import { n as MemoryCitationsMode, r as OpenClawConfig } from "./workspace-files-OMI5Gbjs.js";
import "./fs-utils-DfIeS0Wn.js";
import "./runtime-config-legacy-XzU8arX-.js";
import { DatabaseSync } from "node:sqlite";
//#region packages/memory-host-sdk/src/host/backend-config.d.ts
type ResolvedMemoryBackendConfig = {
  backend: "builtin";
  citations: MemoryCitationsMode;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
//#endregion
export { resolveMemoryBackendConfig as t };