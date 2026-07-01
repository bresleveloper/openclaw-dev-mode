import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext } from "../templating.js";
import type { BuildMentionRegexesOptions, ExplicitMentionSignal } from "./mentions.types.js";
export type { BuildMentionRegexesOptions, ExplicitMentionSignal } from "./mentions.types.js";
export declare const CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
/** Builds mention regexes from config, agent identity, and channel policy. */
export declare function buildMentionRegexes(cfg: OpenClawConfig | undefined, agentId?: string, options?: BuildMentionRegexesOptions): RegExp[];
/** Normalizes text before mention matching. */
export declare function normalizeMentionText(text: string): string;
/** Returns true when text matches one of the configured mention patterns. */
export declare function matchesMentionPatterns(text: string, mentionRegexes: RegExp[]): boolean;
/** Combines regex mention matching with provider-native explicit mention metadata. */
export declare function matchesMentionWithExplicit(params: {
    text: string;
    mentionRegexes: RegExp[];
    explicit?: ExplicitMentionSignal;
    transcript?: string;
}): boolean;
/** Removes structural prompt prefixes before mention stripping. */
export declare function stripStructuralPrefixes(text: string): string;
/** Removes bot mentions from command text before command normalization. */
export declare function stripMentions(text: string, ctx: MsgContext, cfg: OpenClawConfig | undefined, agentId?: string): string;
