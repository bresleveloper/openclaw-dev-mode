import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { OutboundIdentity } from "./identity-types.js";
export type { OutboundIdentity } from "./identity-types.js";
/** Trims outbound identity fields and drops empty identity payloads. */
export declare function normalizeOutboundIdentity(identity?: OutboundIdentity | null): OutboundIdentity | undefined;
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
export declare function resolveAgentOutboundIdentity(cfg: OpenClawConfig, agentId: string): OutboundIdentity | undefined;
