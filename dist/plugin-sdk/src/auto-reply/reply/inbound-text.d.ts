/** Normalizes real inbound newline characters while preserving literal escape text. */
export declare function normalizeInboundTextNewlines(input: string): string;
/** Security facade for stripping inbound system control tags. */
export { sanitizeInboundSystemTags } from "../../security/system-tags.js";
