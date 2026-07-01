/**
 * Channel pairing adapter helpers.
 *
 * Creates prefix-stripping normalizers and logged/text pairing approval notifiers.
 */
import type { ChannelPairingAdapter } from "./types.adapters.js";
type PairingNotifyParams = Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0];
/**
 * Creates an allowlist normalizer that strips a channel-specific target prefix.
 */
export declare function createPairingPrefixStripper(prefixRe: RegExp, map?: (entry: string) => string): NonNullable<ChannelPairingAdapter["normalizeAllowEntry"]>;
/**
 * Creates a pairing notifier that logs a formatted approval message.
 */
export declare function createLoggedPairingApprovalNotifier(format: string | ((params: PairingNotifyParams) => string), log?: (message: string) => void): NonNullable<ChannelPairingAdapter["notifyApproval"]>;
/**
 * Creates a text-message pairing adapter with optional allowlist normalization.
 */
export declare function createTextPairingAdapter(params: {
    idLabel: string;
    message: string;
    normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
    notify: (params: PairingNotifyParams & {
        message: string;
    }) => Promise<void> | void;
}): ChannelPairingAdapter;
export {};
