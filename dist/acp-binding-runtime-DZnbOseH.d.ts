import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { n as ResolvedConfiguredAcpBinding } from "./persistent-bindings.resolve-DIsexQDp.js";

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
export { ensureConfiguredAcpBindingReady as t };