type MergePatchOptions = {
    mergeObjectArraysById?: boolean;
    replaceArrayPaths?: ReadonlySet<string>;
    path?: string;
};
/**
 * Applies an RFC 7396-style object merge patch with OpenClaw config safeguards.
 *
 * Non-object patches replace the base, `null` deletes keys, blocked prototype
 * keys are ignored, and id-keyed arrays may merge when the caller opts in.
 */
export declare function applyMergePatch(base: unknown, patch: unknown, options?: MergePatchOptions): unknown;
export {};
