import type { FinalizedMsgContext } from "../templating.js";
/** Message context fields that can carry user-visible command text. */
export type ContextTextKey = "BodyForAgent" | "BodyForCommands" | "CommandBody" | "RawBody" | "Body";
/** Returns the first string field from a finalized message context. */
export declare function resolveFirstContextText(ctx: FinalizedMsgContext, keys: readonly ContextTextKey[]): string;
/** Resolves normalized text for slash/bang command parsing. */
export declare function resolveCommandContextText(ctx: FinalizedMsgContext): string;
/** Checks whether the inbound context carries an explicit command prefix. */
export declare function hasExplicitCommandContextText(ctx: FinalizedMsgContext): boolean;
