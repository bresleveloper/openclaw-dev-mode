/**
 * Model capability helper for tool-use support.
 *
 * Provider catalogs can opt a model out via `compat.supportsTools === false`;
 * absent metadata remains permissive for older catalog entries.
 */
/** Returns whether a catalog model should be offered tool calls. */
export declare function supportsModelTools(model: {
    compat?: unknown;
}): boolean;
