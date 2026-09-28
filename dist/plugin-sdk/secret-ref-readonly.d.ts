import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../config-CTir7RIz.js";
//#region src/plugin-sdk/secret-ref-readonly.internal.d.ts
/** Checks env provider selection and allowlists without resolving a credential. */
export declare function canResolveEnvSecretRefInReadOnlyPath(params: {
  cfg?: OpenClawConfig;
  provider: string;
  id: string;
}): boolean;
//#endregion
//#region src/plugin-sdk/secret-ref-readonly.d.ts
export type ReadOnlyEnvSecretRefResolution = {
  status: "available";
  value: string;
} | {
  status: "missing";
} | {
  status: "blocked";
};
/** Resolve one configured secret without letting blocked refs borrow ambient credentials. */
export declare function resolveReadOnlyEnvSecretRef(params: {
  value: unknown;
  path: string;
  cfg?: OpenClawConfig;
  expectedEnvId: string;
  normalizeValue: (value: unknown) => string | undefined;
}): ReadOnlyEnvSecretRefResolution;
//#endregion