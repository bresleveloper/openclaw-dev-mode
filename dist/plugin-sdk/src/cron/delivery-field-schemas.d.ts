import { z, type ZodType } from "zod";
/** Accepts non-empty string fields after trimming and lowercasing user-provided delivery input. */
export declare const LowercaseNonEmptyStringFieldSchema: z.ZodPreprocess<z.ZodString>;
/** Accepts non-empty string fields after trimming delivery input without changing case. */
export declare const TrimmedNonEmptyStringFieldSchema: z.ZodPreprocess<z.ZodString>;
/** Accepts delivery thread identifiers as either trimmed strings or finite numeric ids. */
export declare const DeliveryThreadIdFieldSchema: z.ZodUnion<readonly [z.ZodPreprocess<z.ZodString>, z.ZodNumber]>;
/** Accepts non-negative finite timeout seconds from cron delivery payloads. */
export declare const TimeoutSecondsFieldSchema: z.ZodNumber;
type ParsedDeliveryInput = {
    mode?: "announce" | "none" | "webhook";
    channel?: string;
    to?: string;
    threadId?: string | number;
    accountId?: string;
};
/** Parses optional cron delivery fields while dropping invalid values instead of throwing. */
export declare function parseDeliveryInput(input: Record<string, unknown>): ParsedDeliveryInput;
/** Returns a parsed field value only when the supplied schema accepts it. */
export declare function parseOptionalField<T>(schema: ZodType<T>, value: unknown): T | undefined;
export {};
