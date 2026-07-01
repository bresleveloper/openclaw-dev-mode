/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so callers must treat this as untrusted content.
 */
export declare function buildUntrustedChannelMetadata(params: {
    source: string;
    label: string;
    entries: Array<string | null | undefined>;
    maxChars?: number;
}): string | undefined;
