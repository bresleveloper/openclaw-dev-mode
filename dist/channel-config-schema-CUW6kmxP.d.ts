import "./zod-schema.implicit-mentions-D1hpe8-m.js";
import "./zod-schema.channel-messaging-common-Chrg2YHB.js";
import "./zod-schema.core-BMDlLGfv.js";
//#region packages/media-core/src/inbound-path-policy.d.ts
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
//#endregion
//#region src/infra/scp-host.d.ts
/** Return true when a value is safe for the SCP host position. */
declare function isSafeScpRemoteHost(value: string | null | undefined): boolean;
//#endregion
export { normalizeInboundPathRoots as a, mergeInboundPathRoots as i, isInboundPathAllowed as n, isValidInboundPathRootPattern as r, isSafeScpRemoteHost as t };