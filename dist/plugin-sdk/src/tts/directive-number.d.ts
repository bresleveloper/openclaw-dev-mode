import type { SpeechDirectiveTokenParseContext, SpeechDirectiveTokenParseResult } from "./provider-types.js";
/** Numeric directive parsing shared by speech providers with bounded knobs. */
type DirectiveNumberRange = {
    min?: number;
    max?: number;
    minExclusive?: boolean;
    maxExclusive?: boolean;
};
/** Parse a numeric speech directive token and return provider overrides when policy allows it. */
export declare function parseSpeechDirectiveNumberOverride(params: {
    ctx: SpeechDirectiveTokenParseContext;
    overrideKey: string;
    range: DirectiveNumberRange;
    warning: (value: string) => string;
    mergeCurrentOverrides?: boolean;
}): SpeechDirectiveTokenParseResult;
export {};
