import type { MsgContext } from "../../auto-reply/templating.js";
import type { GroupKeyResolution } from "./types.js";
/** Builds a compact display label for group sessions from channel metadata or ids. */
export declare function buildGroupDisplayName(params: {
    provider?: string;
    subject?: string;
    groupChannel?: string;
    space?: string;
    id?: string;
    key: string;
}): string;
/**
 * Resolves channel/group chat context into the persisted group session key.
 *
 * Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
 * fallback for older channel surfaces that cannot yet express the generic route shape.
 */
export declare function resolveGroupSessionKey(ctx: MsgContext): GroupKeyResolution | null;
