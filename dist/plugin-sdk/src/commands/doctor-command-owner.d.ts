import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PairingChannel } from "../pairing/pairing-store.types.js";
/** Returns true when at least one owner sender id is configured. */
export declare function hasConfiguredCommandOwners(cfg: OpenClawConfig): boolean;
/** Formats a channel sender id into the commands.ownerAllowFrom entry shape. */
export declare function formatCommandOwnerFromChannelSender(params: {
    channel: PairingChannel;
    id: string;
}): string | null;
/** Emits setup guidance when privileged command ownership is not configured. */
export declare function noteCommandOwnerHealth(cfg: OpenClawConfig): void;
