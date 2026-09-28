import { ui as PluginRuntime } from "../agent-harness-runtime-CWL0fcg5.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { A as ChannelPairingAdapter } from "../types.adapters-dxHXA2rq.js";
import "../types.public-B8oQ1D30.js";
import { n as readChannelAllowFromStoreSync, t as readChannelAllowFromStore } from "../pairing-store-CecnwoKE.js";
//#region src/pairing/pairing-challenge.d.ts
type PairingMeta = Record<string, string | undefined>;
type PairingChallengeParams = {
  channel: string;
  accountId?: string;
  senderId: string;
  senderIdLine: string;
  meta?: PairingMeta;
  upsertPairingRequest: (params: {
    id: string;
    meta?: PairingMeta;
  }) => Promise<{
    code: string;
    created: boolean;
  }>;
  sendPairingReply: (text: string) => Promise<void>;
  buildReplyText?: (params: {
    code: string;
    senderIdLine: string;
  }) => string;
  onCreated?: (params: {
    code: string;
  }) => void;
  onReplyError?: (err: unknown) => void;
};
/**
 * Shared pairing challenge issuance for DM pairing policy pathways.
 * Ensures every channel follows the same create-if-missing + reply flow.
 */
declare function issuePairingChallenge(params: PairingChallengeParams): Promise<{
  created: boolean;
  code?: string;
}>;
//#endregion
//#region src/plugin-sdk/pairing-access.d.ts
type PairingApi = PluginRuntime["channel"]["pairing"];
type ScopedUpsertInput = Omit<Parameters<PairingApi["upsertPairingRequest"]>[0], "channel" | "accountId">;
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
declare function createScopedPairingAccess(params: {
  /** Plugin runtime that owns the channel pairing store API. */
  core: PluginRuntime;
  /** Channel id permanently attached to store reads and writes from this helper. */
  channel: ChannelId;
  /** Channel account id normalized once before store operations. */
  accountId: string;
}): {
  /** Normalized account id used by every channel-scoped pairing store operation. */
  accountId: string;
  /** Read allow-list entries for the scoped channel/account pair. */
  readAllowFromStore: () => Promise<string[]>;
  /** Delete one approval after the owning channel durably consumes it. */
  removeAllowFromStoreEntry: (entry: string | number) => Promise<{
    changed: boolean;
    allowFrom: string[];
  }>;
  /** Read another channel/account allow-list for DM policy cross-checks. */
  readStoreForDmPolicy: (provider: ChannelId, accountId: string) => Promise<string[]>;
  /** Upsert a pairing request with the scoped channel/account injected. */
  upsertPairingRequest: (input: ScopedUpsertInput) => Promise<{
    code: string;
    created: boolean;
  }>;
};
//#endregion
//#region src/channels/plugins/pairing-adapters.d.ts
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
//#endregion
//#region src/plugin-sdk/channel-pairing.d.ts
type ScopedPairingAccess = ReturnType<typeof createScopedPairingAccess>;
/** Pairing helpers scoped to one channel account. */
export type ChannelPairingController = ScopedPairingAccess & {
  /** Issue a pairing challenge using the controller's channel and scoped store writer. */
  issueChallenge: (params: Omit<Parameters<typeof issuePairingChallenge>[0], "channel" | "accountId" | "upsertPairingRequest">) => ReturnType<typeof issuePairingChallenge>;
};
/** Pre-bind the channel id and storage sink for pairing challenges. */
export declare function createChannelPairingChallengeIssuer(params: {
  /** Channel id attached to every challenge issued by the returned helper. */
  channel: ChannelId;
  /** Optional channel account id attached to pairing-request hook payloads. */
  accountId?: string;
  /** Store writer that persists pending pairing requests for the bound channel. */
  upsertPairingRequest: Parameters<typeof issuePairingChallenge>[0]["upsertPairingRequest"];
}): (
/** Challenge details supplied at message handling time. */
challenge: Omit<Parameters<typeof issuePairingChallenge>[0], "channel" | "accountId" | "upsertPairingRequest">) => Promise<{
  created: boolean;
  code?: string;
}>;
/** Build the full scoped pairing controller used by channel runtime code. */
export declare function createChannelPairingController(params: {
  /** Plugin runtime that provides pairing store operations. */
  core: PluginRuntime;
  /** Channel id scoped into reads, writes, and issued challenges. */
  channel: ChannelId;
  /** Channel account id normalized before pairing store access. */
  accountId: string;
}): ChannelPairingController;
//#endregion
export { readChannelAllowFromStore, readChannelAllowFromStoreSync };