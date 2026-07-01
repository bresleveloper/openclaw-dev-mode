/** Provider/model pair parsed from a generation model reference like `provider/model`. */
export type ParsedGenerationModelRef = {
    provider: string;
    model: string;
};
/** Parses strict generation model refs and rejects missing provider or model segments. */
export declare function parseGenerationModelRef(raw: string | undefined): ParsedGenerationModelRef | null;
