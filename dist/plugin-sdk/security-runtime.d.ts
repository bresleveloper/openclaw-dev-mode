import "../manifest-registry-CMnhqUB6.js";
import "../fs-safe-defaults-ypw0M2Xi.js";
import { n as assertNoSymlinkParentsSync, r as sanitizeUntrustedFileName, t as assertNoSymlinkParents } from "../fs-safe-advanced-CgWxxJBc.js";
import { S as resolvePinnedHostnameWithPolicy, a as SsrFBlockedError, g as isPrivateNetworkAllowedByPolicy, o as SsrFPolicy, t as LookupFn, v as matchesHostnameAllowlist } from "../ssrf-CkjpArdF.js";
import { D as openLocalFileSafely, H as statRegularFile, I as resolveAbsolutePathForRead, K as withTimeout, L as resolveAbsolutePathForWrite, N as readRegularFile, O as pathExists, P as readRegularFileSync, R as resolveLocalPathFromRootsSync, S as canonicalPathFromExistingAncestor, U as statRegularFileSync, V as root, k as pathExistsSync, o as FsSafeError, q as writeExternalFileWithinRoot, w as findExistingAncestor, y as appendRegularFile } from "../fs-safe-DBBalKLY.js";
import { n as redactSensitiveText } from "../redact-CMkWZvEP.js";
import { r as extractErrorCode } from "../error-coercion-vrFGEpI-.js";
import { f as hasProxyEnvConfigured, t as normalizeHostname } from "../hostname-x0B--rdn.js";
import { t as formatErrorMessage } from "../errors-D-udqO7F.js";
import { a as parseAccessGroupAllowFromEntry } from "../allow-from-Bdiy2LH6.js";
import { i as shouldIncludeSupplementalContext, n as evaluateSupplementalContextVisibility, r as filterSupplementalContextItems, t as ContextVisibilityDecision } from "../context-visibility-CNXHuDNv.js";
import { i as expandAllowFromWithAccessGroups } from "../access-groups-DN0bv1gV.js";
import { s as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-BXVdVRPm.js";
import { r as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-BVXh5Mbm.js";
import { pathScope, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/durability";
import { FileStoreSync } from "@openclaw/fs-safe/store";
import { movePathWithCopyFallback, replaceFileAtomic as replaceFileAtomic$1 } from "@openclaw/fs-safe/atomic";
//#region src/security/external-content.d.ts
type ExternalContentSource = "email" | "webhook" | "api" | "browser" | "channel_metadata" | "web_search" | "web_fetch" | "unknown";
/** Bound sanitized external prose while preserving its exact retained source prefix. */
export declare function truncateSanitizedExternalContent(value: string, maxChars: number): {
  text: string;
  truncated: boolean;
  retainedRawChars: number;
};
type WrapExternalContentOptions = {
  /** Source of the external content */
  source: ExternalContentSource;
  /** Original sender information (e.g., email address) */
  sender?: string;
  /** Subject line (for emails) */
  subject?: string;
  /** External task label associated with the content */
  taskName?: string;
  /** Whether to include detailed security warning */
  includeWarning?: boolean;
};
/**
 * Wraps external untrusted content with security boundaries and warnings.
 *
 * This function should be used whenever processing content from external sources
 * (emails, webhooks, API calls from untrusted clients) before passing to LLM.
 *
 * @example
 * ```ts
 * const safeContent = wrapExternalContent(emailBody, {
 *   source: "email",
 *   sender: "user@example.com",
 *   subject: "Help request"
 * });
 * // Pass safeContent to LLM instead of raw emailBody
 * ```
 */
export declare function wrapExternalContent(content: string, options: WrapExternalContentOptions): string;
/**
 * Wraps web search/fetch content with security markers.
 * This is a simpler wrapper for web tools that just need content wrapped.
 */
export declare function wrapWebContent(content: string, source?: "web_search" | "web_fetch"): string;
//#endregion
//#region src/plugin-sdk/file-access-runtime.d.ts
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
export declare function fileExists(filePath: string): boolean;
//#endregion
//#region src/security/channel-metadata.d.ts
/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so keep the result externally wrapped.
 */
export declare function buildChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined;
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
export declare const buildUntrustedChannelMetadata: typeof buildChannelMetadata;
//#endregion
//#region src/security/safe-regex.d.ts
type SafeRegexRejectReason = "empty" | "unsafe-nested-repetition" | "invalid-regex";
type SafeRegexCompileResult = {
  regex: RegExp;
  source: string;
  flags: string;
  reason: null;
} | {
  regex: null;
  source: string;
  flags: string;
  reason: SafeRegexRejectReason;
};
export declare function compileSafeRegexDetailed(source: string, flags?: string): SafeRegexCompileResult;
//#endregion
//#region src/infra/private-file-store.d.ts
type PrivateFileStoreSync = FileStoreSync;
/** Create a sync private file store rooted at `rootDir`. */
export declare function privateFileStoreSync(rootDir: string): PrivateFileStoreSync;
//#endregion
//#region src/infra/replace-file.d.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
export declare const replaceFileAtomic: typeof replaceFileAtomic$1;
//#endregion
//#region src/infra/ports.d.ts
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
export declare function ensurePortAvailable(port: number, host?: string, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
export declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
export { type ContextVisibilityDecision, FsSafeError, type LookupFn, type SafeRegexRejectReason, SsrFBlockedError, type SsrFPolicy, appendRegularFile, assertNoSymlinkParents, assertNoSymlinkParentsSync, canonicalPathFromExistingAncestor, evaluateSupplementalContextVisibility, expandAllowFromWithAccessGroups, extractErrorCode, filterSupplementalContextItems, findExistingAncestor, formatErrorMessage, hasProxyEnvConfigured, isPathInside, isPrivateNetworkAllowedByPolicy, matchesHostnameAllowlist, movePathWithCopyFallback, normalizeHostname, openLocalFileSafely, parseAccessGroupAllowFromEntry, pathExists, pathExistsSync, pathScope, readRegularFile, readRegularFileSync, redactSensitiveText, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveExistingPathsWithinRoot, resolveLocalPathFromRootsSync, resolvePinnedHostnameWithPolicy, resolvePinnedMainDmOwnerFromAllowlist, resolvePreferredOpenClawTmpDir, resolveStrictExistingPathsWithinRoot, root, sanitizeUntrustedFileName, shouldIncludeSupplementalContext, statRegularFile, statRegularFileSync, withTimeout, writeExternalFileWithinRoot };