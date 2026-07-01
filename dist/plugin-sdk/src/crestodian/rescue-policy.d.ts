import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Policy checks for remote Crestodian rescue commands.
 *
 * Rescue intentionally opens only for owner-controlled, non-sandboxed YOLO host
 * posture unless config explicitly enables it, because remote commands can write local state.
 */
type CrestodianRescueDecision = {
    allowed: true;
    enabled: true;
    ownerDmOnly: boolean;
    pendingTtlMinutes: number;
    yolo: true;
    sandboxActive: false;
} | {
    allowed: false;
    enabled: boolean;
    ownerDmOnly: boolean;
    pendingTtlMinutes: number;
    yolo: boolean;
    sandboxActive: boolean;
    reason: "disabled" | "sandbox-active" | "not-yolo" | "not-owner" | "not-direct-message";
    message: string;
};
type CrestodianRescuePolicyInput = {
    cfg: OpenClawConfig;
    agentId?: string;
    senderIsOwner: boolean;
    isDirectMessage: boolean;
};
/** Decide whether a message-channel rescue command is allowed for this sender/context. */
export declare function resolveCrestodianRescuePolicy(input: CrestodianRescuePolicyInput): CrestodianRescueDecision;
export {};
