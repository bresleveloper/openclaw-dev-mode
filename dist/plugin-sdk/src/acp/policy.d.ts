/** Policy gates for ACP availability, dispatch, and allowed agent ids. */
import { AcpRuntimeError } from "@openclaw/acp-core/runtime/errors";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns whether ACP is globally enabled by config policy. */
export declare function isAcpEnabledByPolicy(cfg: OpenClawConfig): boolean;
/** Returns the operator-facing dispatch block message, if any. */
export declare function resolveAcpDispatchPolicyMessage(cfg: OpenClawConfig): string | null;
/** Returns the runtime error for dispatch-blocked ACP routing, if blocked. */
export declare function resolveAcpDispatchPolicyError(cfg: OpenClawConfig): AcpRuntimeError | null;
/** Returns the runtime error for explicit ACP turns when ACP itself is disabled. */
export declare function resolveAcpExplicitTurnPolicyError(cfg: OpenClawConfig): AcpRuntimeError | null;
/** Returns the runtime error for agent-policy rejection, if rejected. */
export declare function resolveAcpAgentPolicyError(cfg: OpenClawConfig, agentId: string): AcpRuntimeError | null;
