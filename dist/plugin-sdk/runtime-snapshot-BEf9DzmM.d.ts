import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
//#endregion
export { getRuntimeConfigSnapshot as a, setRuntimeConfigSnapshot as c, clearRuntimeConfigSnapshot as i, ConfigWriteFollowUp as n, getRuntimeConfigSourceSnapshot as o, RuntimeConfigSnapshotRefreshOptions as r, selectApplicableRuntimeConfig as s, ConfigWriteAfterWrite as t };