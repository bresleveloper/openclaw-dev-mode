import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import "../types-ACDCRjU-.js";
import { f as OperatorScope, o as GatewayRequestFunction, t as DatabasePortRecoveryIntent } from "../database-port-recovery-0AsyALgu.js";
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
type OwnerRequest = <R>(method: string, params: Record<string, unknown>, options?: {
  expectFinal?: boolean;
}) => Promise<R>;
/** Select one owner before domain admission and retain offline custody through resource settlement. */
export declare function runWithLocalStateOwner<T>(params: {
  method: string;
  /** Lazy input is collected only for Gateway dispatch, never for the local path. */
  params: Record<string, unknown> | ((signal: AbortSignal) => Promise<Record<string, unknown>>);
  target: string;
  recoveryCommand?: string;
  /** Caller-owned guidance for commands that cannot route to a running owner. */
  onlineAlternative?: string;
  /** Internal manifest-bound recovery; never routed to or borrowed from a running owner. */
  databasePortRecovery?: DatabasePortRecoveryIntent;
  /** Engine transitions retire native handles while retaining exclusive schema custody. */
  databasePortMaintenance?: true;
  /** Resolve configured engines only after offline custody, before runtime config can write state. */
  databaseEngine?: "configured";
  /** Bounded config repairs keep offline custody while leaving every database untouched. */
  databaseAccess?: "none";
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
export {};