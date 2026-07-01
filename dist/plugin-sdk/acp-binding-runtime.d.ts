import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { n as ResolvedConfiguredAcpBinding, t as resolveConfiguredAcpBindingRecord } from "./persistent-bindings.resolve-BBXk8h-n.js";

//#region src/acp/persistent-bindings.lifecycle.d.ts
/** Resolves a configured binding for a conversation and ensures its ACP session exists. */
declare function ensureConfiguredAcpBindingReady(params: {
  cfg: OpenClawConfig;
  configuredBinding: ResolvedConfiguredAcpBinding | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
//#endregion
export { ensureConfiguredAcpBindingReady, resolveConfiguredAcpBindingRecord };