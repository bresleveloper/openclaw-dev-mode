import "./zod-schema.implicit-mentions-C4-S3AOR.js";
import "./zod-schema.channel-messaging-common-BWwimiKt.js";
import "./zod-schema.core-Dz-kUJQU.js";
/** Validates an absolute inbound root pattern with whole-segment wildcards only. */
declare function isValidInboundPathRootPattern(value: string): boolean;
/** Normalizes configured inbound attachment roots, dropping invalid or duplicate patterns. */
declare function normalizeInboundPathRoots(roots?: readonly string[]): string[];
/** Merges inbound attachment root lists while preserving first-seen priority. */
declare function mergeInboundPathRoots(...rootsLists: Array<readonly string[] | undefined>): string[];
/** Checks whether a candidate inbound media path is covered by configured or fallback roots. */
declare function isInboundPathAllowed(params: {
  filePath: string;
  roots: readonly string[];
  fallbackRoots?: readonly string[];
}): boolean;
/** Return true when a value is safe for the SCP host position. */
declare function isSafeScpRemoteHost(value: string | null | undefined): boolean;
export { normalizeInboundPathRoots as a, mergeInboundPathRoots as i, isInboundPathAllowed as n, isValidInboundPathRootPattern as r, isSafeScpRemoteHost as t };