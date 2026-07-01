/**
 * Shared failover policy helpers for auth profile cooldown probing.
 */
import type { FailoverReason } from "./embedded-agent-helpers.js";
/** Returns true when a failed model can be probed during cooldown. */
export declare function shouldAllowCooldownProbeForReason(reason: FailoverReason | null | undefined): boolean;
/** Returns true when a transient failure should consume a cooldown probe slot. */
export declare function shouldUseTransientCooldownProbeSlot(reason: FailoverReason | null | undefined): boolean;
/** Returns true when a non-transient failure should leave transient probe budget intact. */
export declare function shouldPreserveTransientCooldownProbeSlot(reason: FailoverReason | null | undefined): boolean;
