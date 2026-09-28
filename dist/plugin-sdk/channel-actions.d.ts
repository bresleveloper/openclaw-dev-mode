import { i as resolvePollMaxSelections } from "../polls-sXqxREW1.js";
import { a as parseAvailableTags, c as readNumberParam, d as readStringArrayParam, f as readStringOrNumberParam, i as imageResultFromFile, l as readPositiveIntegerParam, m as jsonResult, p as readToolStringParam, r as createActionGate, s as readNonNegativeIntegerParam, t as ActionGate, u as readReactionParams } from "../common-BCM4z2Iy.js";
import { t as ToolAuthorizationError } from "../tool-input-error-BsUaQSlb.js";
import { a as optionalFiniteNumberSchema, c as optionalStringEnum, l as stringEnum, n as withNormalizedTimestamp, o as optionalNonNegativeIntegerSchema, s as optionalPositiveIntegerSchema } from "../date-time-VcU4Scm1.js";
//#region src/channels/plugins/actions/shared.d.ts
/**
 * Shared channel action helpers.
 *
 * Filters token-backed accounts and composes account-level action gates.
 */
type OptionalDefaultGate<TKey extends string> = (key: TKey, defaultValue?: boolean) => boolean;
type TokenSourcedAccount = {
  tokenSource?: string | null;
};
/**
 * Filters out accounts explicitly marked as tokenless.
 */
export declare function listTokenSourcedAccounts<TAccount extends TokenSourcedAccount>(accounts: readonly TAccount[]): TAccount[];
/**
 * Creates an action gate that is enabled when any account-level gate enables the action.
 */
export declare function createUnionActionGate<TAccount, TKey extends string>(accounts: readonly TAccount[], createGate: (account: TAccount) => OptionalDefaultGate<TKey>): OptionalDefaultGate<TKey>;
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.d.ts
type ReactionToolContext = {
  currentMessageId?: string | number;
};
/**
 * Resolves the message id for reaction tools from explicit args or current tool context.
 */
export declare function resolveReactionMessageId(params: {
  args: Record<string, unknown>;
  toolContext?: ReactionToolContext;
}): string | number | undefined;
//#endregion
//#region src/agents/sandbox-paths.d.ts
export declare function assertMediaNotDataUrl(media: string): void;
//#endregion
export { type ActionGate, ToolAuthorizationError, createActionGate, imageResultFromFile, jsonResult, optionalFiniteNumberSchema, optionalNonNegativeIntegerSchema, optionalPositiveIntegerSchema, optionalStringEnum, parseAvailableTags, readNonNegativeIntegerParam, readNumberParam, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringOrNumberParam, readToolStringParam as readStringParam, resolvePollMaxSelections, stringEnum, withNormalizedTimestamp };