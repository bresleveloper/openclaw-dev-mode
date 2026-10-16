import { u as ContextVisibilityMode } from "../types.base-D8MIFbSh.js";
import "../manifest-registry-Bj1Q7bnt.js";
import "../openclaw-state-db-Yba_0aSZ.js";
import { i as SsrFPolicy, l as isPrivateNetworkAllowedByPolicy, p as resolvePinnedHostnameWithPolicy, r as SsrFBlockedError, t as LookupFn, u as matchesHostnameAllowlist } from "../ssrf-Df8OYfGp.js";
import { _ as writeExternalFileWithinRoot, a as openLocalFileSafely, c as readRegularFile, d as resolveAbsolutePathForWrite, f as resolveLocalPathFromRootsSync, g as withTimeout, h as statRegularFileSync, i as findExistingAncestor, l as readRegularFileSync, m as statRegularFile, n as appendRegularFile, o as pathExists, p as root, r as canonicalPathFromExistingAncestor, s as pathExistsSync, t as FsSafeError, u as resolveAbsolutePathForRead } from "../fs-safe-D1a5zN4L.js";
import "../staged-inputs-1c4BFVlD.js";
import { n as redactSensitiveText } from "../redact-yd_kvHoh.js";
import { r as extractErrorCode } from "../error-coercion-BcU5CC86.js";
import { t as formatErrorMessage } from "../errors-CfgKklp4.js";
import { i as parseAccessGroupAllowFromEntry } from "../allow-from-DUowZC7U.js";
import { n as expandAllowFromWithAccessGroups } from "../access-groups-ohtq1rph.js";
import { a as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-BQETzBuF.js";
import { t as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-CZvFGQqf.js";
import { assertNoSymlinkParents, assertNoSymlinkParentsSync, pathScope, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot, sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
import { Root } from "@openclaw/fs-safe/root";
import { FileStore, FileStoreSync } from "@openclaw/fs-safe/store";
import { isPathInside } from "@openclaw/fs-safe/path";
import { ReplaceFileAtomicFileSystem, ReplaceFileAtomicOptions, movePathWithCopyFallback, replaceFileAtomic as replaceFileAtomic$1 } from "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/watch";
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
/** Wrap untrusted content before including it in model context. */
export declare function wrapExternalContent(content: string, options: WrapExternalContentOptions): string;
export declare function wrapWebContent(content: string, source?: "web_search" | "web_fetch"): string;
//#endregion
//#region src/infra/net/proxy-env.d.ts
/** Return whether any supported proxy environment variable is non-blank. */
export declare function hasProxyEnvConfigured(env?: NodeJS.ProcessEnv): boolean;
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
//#region src/security/context-visibility.d.ts
/** Supplemental context classes that can be hidden independently from the main message. */
type ContextVisibilityKind = "history" | "thread" | "quote" | "forwarded";
/** Machine-readable reason for a supplemental context visibility decision. */
type ContextVisibilityDecisionReason =
/** Visibility mode includes all supplemental context. */
"mode_all" |
/** Sender allowlist includes the item source. */
"sender_allowed" |
/** Quote-only visibility mode permits quoted context even when sender is not allowed. */
"quote_override" |
/** Context was omitted by visibility mode or sender policy. */
"blocked";
/** Visibility decision returned to callers that need both the boolean result and audit reason. */
type ContextVisibilityDecision = {
  /** Whether the supplemental context item should be included. */
  include: boolean;
  /** Rule that decided inclusion or omission. */
  reason: ContextVisibilityDecisionReason;
};
/** Evaluates one supplemental context item against mode, kind, and sender allowlist state. */
export declare function evaluateSupplementalContextVisibility(params: {
  /** Configured visibility mode for the current channel or default policy. */
  mode: ContextVisibilityMode;
  /** Supplemental context class being evaluated. */
  kind: ContextVisibilityKind;
  /** Whether the item source is permitted by the sender allowlist. */
  senderAllowed: boolean;
}): ContextVisibilityDecision;
/** Boolean shorthand for callers that do not need the audit reason. */
export declare function shouldIncludeSupplementalContext(params: {
  /** Configured visibility mode for the current channel or default policy. */
  mode: ContextVisibilityMode;
  /** Supplemental context class being evaluated. */
  kind: ContextVisibilityKind;
  /** Whether the item source is permitted by the sender allowlist. */
  senderAllowed: boolean;
}): boolean;
/** Filters supplemental context items and reports how many were omitted by visibility policy. */
export declare function filterSupplementalContextItems<T>(params: {
  /** Candidate supplemental context items in original delivery order. */
  items: readonly T[];
  /** Configured visibility mode for the current channel or default policy. */
  mode: ContextVisibilityMode;
  /** Shared supplemental context class for every candidate item. */
  kind: ContextVisibilityKind;
  /** Per-item allowlist predicate for the sender or source identity. */
  isSenderAllowed: (item: T) => boolean;
}): {
  items: T[];
  omitted: number;
};
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
//#region src/infra/net/hostname.d.ts
/** Normalize a hostname for policy comparisons. */
export declare function normalizeHostname(hostname: string): string;
//#endregion
//#region src/infra/private-file-store.d.ts
/** Create a sync private file store rooted at `rootDir`. */
export declare function privateFileStoreSync(rootDir: string): FileStoreSync;
//#endregion
//#region src/infra/ports.d.ts
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
export declare function ensurePortAvailable(port: number, host?: string, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
export declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
//#region src/plugin-sdk/security-runtime.d.ts
export declare const replaceFileAtomic: (options: ReplaceFileAtomicOptions & {
  fileSystem?: {
    promises: ReplaceFileAtomicFileSystem["promises"] & {
      /** @deprecated Omit this member; permissions use the retained FileHandle. */
      chmod?: typeof import("node:fs/promises").chmod;
    };
  };
}) => ReturnType<typeof replaceFileAtomic$1>;
//#endregion
export { type ContextVisibilityDecision, FsSafeError, type LookupFn, type SafeRegexRejectReason, SsrFBlockedError, type SsrFPolicy, appendRegularFile, assertNoSymlinkParents, assertNoSymlinkParentsSync, canonicalPathFromExistingAncestor, expandAllowFromWithAccessGroups, extractErrorCode, findExistingAncestor, formatErrorMessage, isPathInside, isPrivateNetworkAllowedByPolicy, matchesHostnameAllowlist, movePathWithCopyFallback, openLocalFileSafely, parseAccessGroupAllowFromEntry, pathExists, pathExistsSync, pathScope, readRegularFile, readRegularFileSync, redactSensitiveText, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveExistingPathsWithinRoot, resolveLocalPathFromRootsSync, resolvePinnedHostnameWithPolicy, resolvePinnedMainDmOwnerFromAllowlist, resolvePreferredOpenClawTmpDir, resolveStrictExistingPathsWithinRoot, root, sanitizeUntrustedFileName, statRegularFile, statRegularFileSync, withTimeout, writeExternalFileWithinRoot };