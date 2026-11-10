import { u as ContextVisibilityMode } from "./types.base-6bKsSmWG.js";
import "./config-contracts-CY87ANNp.js";
import "./openclaw-state-db-CsmosWKr.js";
import "./manifest-registry-DcAsDGQ5.js";
import "./diagnostic-run-activity-hzzl6lha.js";
import "./ssrf-C2_EXt4_.js";
import "./fs-safe-Be4CnQth.js";
import { assertNoSymlinkParents, assertNoSymlinkParentsSync, pathScope, resolveExistingPathsWithinRoot, resolveStrictExistingPathsWithinRoot, sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import { Root } from "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/durability";
import { FileStore, FileStoreSync } from "@openclaw/fs-safe/store";
import { ReplaceFileAtomicFileSystem, ReplaceFileAtomicOptions, movePathWithCopyFallback, replaceFileAtomic } from "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/watch";
//#region src/security/external-content.d.ts
type ExternalContentSource = "email" | "webhook" | "api" | "browser" | "channel_metadata" | "web_search" | "web_fetch" | "unknown";
/** Bound sanitized external prose while preserving its exact retained source prefix. */
declare function truncateSanitizedExternalContent(value: string, maxChars: number): {
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
declare function wrapExternalContent(content: string, options: WrapExternalContentOptions): string;
declare function wrapWebContent(content: string, source?: "web_search" | "web_fetch"): string;
//#endregion
//#region src/infra/net/proxy-env.d.ts
/** Return whether any supported proxy environment variable is non-blank. */
declare function hasProxyEnvConfigured(env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/plugin-sdk/file-access-runtime.d.ts
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
declare function fileExists(filePath: string): boolean;
//#endregion
//#region src/security/channel-metadata.d.ts
/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so keep the result externally wrapped.
 */
declare function buildChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined;
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
declare const buildUntrustedChannelMetadata: typeof buildChannelMetadata;
//#endregion
//#region src/security/context-visibility.d.ts
/** Supplemental context classes that can be hidden independently from the main message. */
type ContextVisibilityKind = "history" | "thread" | "quote" | "forwarded";
type ContextVisibilityDecisionReason = "mode_all" | "sender_allowed" |
/** Quote-only visibility mode permits quoted context even when sender is not allowed. */
"quote_override" | "blocked";
type ContextVisibilityDecision = {
  include: boolean;
  reason: ContextVisibilityDecisionReason;
};
declare function evaluateSupplementalContextVisibility(params: {
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  senderAllowed: boolean;
}): ContextVisibilityDecision;
declare function shouldIncludeSupplementalContext(params: {
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  senderAllowed: boolean;
}): boolean;
declare function filterSupplementalContextItems<T>(params: {
  /** Candidate supplemental context items in original delivery order. */
  items: readonly T[];
  mode: ContextVisibilityMode;
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
declare function compileSafeRegexDetailed(source: string, flags?: string): SafeRegexCompileResult;
//#endregion
//#region src/infra/net/hostname.d.ts
/** Normalize a hostname for policy comparisons. */
declare function normalizeHostname(hostname: string): string;
//#endregion
//#region src/infra/private-file-store.d.ts
/** Create a sync private file store rooted at `rootDir`. */
declare function privateFileStoreSync(rootDir: string): FileStoreSync;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
//#region src/plugin-sdk/security-runtime.d.ts
declare const replaceFileAtomic$1: (options: ReplaceFileAtomicOptions & {
  fileSystem?: {
    promises: ReplaceFileAtomicFileSystem["promises"] & {
      /** @deprecated Omit this member; permissions use the retained FileHandle. */
      chmod?: typeof import("node:fs/promises").chmod;
    };
  };
}) => ReturnType<typeof replaceFileAtomic>;
//#endregion
export { truncateSanitizedExternalContent as C, hasProxyEnvConfigured as S, wrapWebContent as T, buildUntrustedChannelMetadata as _, resolveStrictExistingPathsWithinRoot as a, fileExists as b, privateFileStoreSync as c, compileSafeRegexDetailed as d, ContextVisibilityDecision as f, buildChannelMetadata as g, shouldIncludeSupplementalContext as h, resolveExistingPathsWithinRoot as i, normalizeHostname as l, filterSupplementalContextItems as m, pathScope as n, sanitizeUntrustedFileName as o, evaluateSupplementalContextVisibility as p, replaceFileAtomic$1 as r, safeEqualSecret as s, movePathWithCopyFallback as t, SafeRegexRejectReason as u, assertNoSymlinkParents as v, wrapExternalContent as w, isPathInside as x, assertNoSymlinkParentsSync as y };