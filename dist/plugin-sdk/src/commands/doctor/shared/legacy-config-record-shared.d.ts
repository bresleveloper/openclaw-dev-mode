type JsonRecord = Record<string, unknown>;
import { isRecord } from "../../../utils.js";
export type { JsonRecord };
export { isRecord };
/** Clone a record-like config section, treating undefined as an empty object. */
export declare function cloneRecord<T extends JsonRecord>(value: T | undefined): T;
/** Ensure a nested config value is a mutable record and return it. */
export declare function ensureRecord(target: JsonRecord, key: string): JsonRecord;
/** Own-property guard used by migrations that must preserve falsy values. */
export declare function hasOwnKey(target: JsonRecord, key: string): boolean;
