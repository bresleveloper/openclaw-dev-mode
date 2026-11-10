import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { f as OperatorScope, r as GatewayRequestFunction, t as DatabasePortRecoveryIntent } from "../database-port-recovery-Bqi8HAkj.js";
//#region src/cli/local-state-owner.d.ts
type LocalMutationScope = {
  env: NodeJS.ProcessEnv;
  config: OpenClawConfig;
  signal: AbortSignal;
  assertCurrent: () => void;
};
/**
 * One request to the selected Gateway owner, on its own guarded connection. For methods
 * without an expected-owner parameter: the method's own guard (for example a config
 * baseHash) binds the effect, and owner identity is revalidated right before dispatch.
 */
type OwnerRequest = <R>(method: string, params: Record<string, unknown>) => Promise<R>;
/** Select one owner before domain admission and retain offline custody through resource settlement. */
export declare function runWithLocalStateOwner<T>(params: {
  method: string;
  /** Lazy input is collected only for Gateway dispatch, never for the local path. */
  params: Record<string, unknown> | ((signal: AbortSignal) => Promise<Record<string, unknown>>);
  target: string;
  recoveryCommand?: string;
  /** Internal manifest-bound recovery; never routed to or borrowed from a running owner. */
  databasePortRecovery?: DatabasePortRecoveryIntent;
  requiredCapabilities?: readonly string[];
  scopes?: readonly OperatorScope[];
  timeoutMs?: number;
  expectFinal?: boolean;
  requireLocalBackendSharedAuth?: boolean;
  onGatewayResponse?: (request: GatewayRequestFunction, signal: AbortSignal) => Promise<void>;
  onGatewaySignalAbort?: (request: GatewayRequestFunction) => Promise<void>;
  /** Local inspection must stay read-only and must not load mutation-capable runtime config. */
  onForeignOwner?: "refuse" | ((scope: Omit<LocalMutationScope, "config"> & {
    requestOwner: OwnerRequest;
  }) => Promise<T>);
  assertTargetCurrent?: () => void;
  runLocal: (scope: LocalMutationScope) => Promise<T>;
}): Promise<T>;
//#endregion