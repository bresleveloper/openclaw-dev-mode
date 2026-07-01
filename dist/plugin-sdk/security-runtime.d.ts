import { a as parseAccessGroupAllowFromEntry, t as ACCESS_GROUP_ALLOW_FROM_PREFIX } from "./allow-from-Bdiy2LH6.js";
import { a as SecretResolverWarningCode, c as createResolverContext, d as isEnabledFlag, f as pushAssignment, h as SecretRefResolveCache, i as SecretResolverWarning, l as hasOwnProperty, m as pushWarning, n as SecretAssignment, o as applyResolvedAssignments, p as pushInactiveSurfaceWarning, r as SecretDefaults, s as collectSecretInputAssignment, t as ResolverContext, u as isChannelAccountEffectivelyEnabled } from "./runtime-shared-D5iTR4VR.js";
import { a as SecretTargetExpected, i as SecretTargetConfigFile, n as DiscoveredConfigSecretTarget, o as SecretTargetRegistryEntry, r as ResolvedPlanTarget, s as SecretTargetShape, t as AuthProfileType } from "./target-registry-types-Dt3AyW6H.js";
import { a as resolveAccessGroupAllowFromMatches, i as expandAllowFromWithAccessGroups, n as AccessGroupMembershipResolver, o as resolveAccessGroupAllowFromState, r as ResolvedAccessGroupAllowFromState, t as AccessGroupMembershipLookup } from "./access-groups-BgFo4Ybh.js";
import { c as isRecord } from "./utils-CR2kVvQb.js";
import { S as resolvePinnedHostnameWithPolicy, a as SsrFBlockedError, g as isPrivateNetworkAllowedByPolicy, o as SsrFPolicy, p as isBlockedHostnameOrIp, t as LookupFn, v as matchesHostnameAllowlist } from "./ssrf-skjEI_i5.js";
import { a as formatErrorMessage, i as extractErrorCode } from "./errors-BICDLNaN.js";
import { B as resolveRegularFileAppendFlags, C as ensureAbsoluteDirectory, D as openLocalFileSafely, I as resolveAbsolutePathForRead, J as writeExternalFileWithinRoot, L as resolveAbsolutePathForWrite, N as readRegularFile, O as pathExists, P as readRegularFileSync, R as resolveLocalPathFromRootsSync, S as canonicalPathFromExistingAncestor, U as statRegularFile, V as root, W as statRegularFileSync, a as ExternalFileWriteResult, b as appendRegularFileSync, d as ResolvedAbsolutePath, f as ResolvedWritableAbsolutePath, i as ExternalFileWriteOptions, k as pathExistsSync, l as OpenResult, n as EnsureAbsoluteDirectoryOptions, o as FsSafeError, q as withTimeout, r as EnsureAbsoluteDirectoryResult, s as FsSafeErrorCode, t as AbsolutePathSymlinkPolicy, w as findExistingAncestor, x as assertAbsolutePathInput, y as appendRegularFile } from "./fs-safe-Dff5zUCF.js";
import { a as hasProxyEnvConfigured } from "./proxy-env-CRHrWZla.js";
import { f as redactSensitiveText } from "./redact-DGZUBxVF.js";
import { a as getHookType, c as wrapWebContent, d as mapHookExternalContentSource, f as resolveHookExternalContentSource, i as detectSuspiciousPatterns, l as HookExternalContentSource, n as WrapExternalContentOptions, o as sanitizeModelSpecialTokens, r as buildSafeExternalPrompt, s as wrapExternalContent, t as ExternalContentSource, u as isExternalHookSession } from "./external-content-C64gU-f-.js";
import { a as filterSupplementalContextItems, i as evaluateSupplementalContextVisibility, n as ContextVisibilityDecisionReason, o as shouldIncludeSupplementalContext, r as ContextVisibilityKind, t as ContextVisibilityDecision } from "./context-visibility-DWgENS82.js";
import { i as generateSecureToken } from "./secure-random-BTcaoAnv.js";
import { a as resolveDmAllowState, c as resolveDmGroupAccessWithLists, d as resolvePinnedMainDmOwnerFromAllowlist, i as readStoreAllowFromForDmPolicy, l as resolveEffectiveAllowFromLists, n as DmGroupAccessDecision, o as resolveDmGroupAccessDecision, r as DmGroupAccessReasonCode, s as resolveDmGroupAccessWithCommandGate, t as DM_GROUP_ACCESS_REASON, u as resolveOpenDmAllowlistAccess } from "./dm-policy-shared-CbXY3hb3.js";
import { a as collectNestedChannelFieldAssignments, c as getChannelSurface, d as normalizeSecretStringValue, f as resolveChannelAccountSurface, i as collectConditionalChannelFieldAssignments, l as hasConfiguredSecretInputValue, n as ChannelAccountPredicate, o as collectSimpleChannelFieldAssignments, r as ChannelAccountSurface, s as getChannelRecord, t as ChannelAccountEntry, u as isBaseFieldActiveForChannelSurface } from "./channel-secret-basic-runtime-CVYp10nA.js";
import { a as parseDotPath, c as toDotPath, i as normalizePositiveTimerMs, l as writeJsonFileSecure, n as isNonEmptyString, o as parseEnvValue, r as normalizePositiveInt, s as readTextFileIfExists, t as ensureDirForFile, u as writeTextFileAtomic } from "./shared-g6FLaf8b.js";
import { t as collectNestedChannelTtsAssignments } from "./channel-secret-tts-runtime-CWO-cDxL.js";
import { r as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-ubX-9dkk.js";
import { t as normalizeHostname } from "./hostname-BVCWBh-K.js";
import { AssertNoSymlinkParentsOptions, WriteSiblingTempFileOptions, WriteSiblingTempFileResult, assertNoSymlinkParents, assertNoSymlinkParentsSync, pathScope, resolveExistingPathsWithinRoot, resolvePathWithinRoot, resolvePathsWithinRoot, resolveStrictExistingPathsWithinRoot, resolveWritablePathWithinRoot, sanitizeUntrustedFileName, writeSiblingTempFile, writeViaSiblingTempPath } from "@openclaw/fs-safe/advanced";
import { MovePathWithCopyFallbackOptions as MovePathWithCopyFallbackOptions$1, ReplaceFileAtomicFileSystem, ReplaceFileAtomicOptions, ReplaceFileAtomicResult, ReplaceFileAtomicSyncFileSystem, ReplaceFileAtomicSyncOptions, replaceFileAtomic as replaceFileAtomic$1, replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
import { isNotFoundPathError, isPathInside } from "@openclaw/fs-safe/path";
import { FileStore, FileStoreSync } from "@openclaw/fs-safe/store";

//#region src/security/channel-metadata.d.ts
/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so callers must treat this as untrusted content.
 */
declare function buildUntrustedChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined;
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
declare function testRegexWithBoundedInput(regex: RegExp, input: string, maxWindow?: number): boolean;
declare function hasNestedRepetition(source: string): boolean;
declare function compileSafeRegexDetailed(source: string, flags?: string): SafeRegexCompileResult;
declare function compileSafeRegex(source: string, flags?: string): RegExp | null;
//#endregion
//#region src/infra/private-file-store.d.ts
type PrivateFileStore = FileStore;
/** Create an async private file store rooted at `rootDir`. */
declare function privateFileStore(rootDir: string): FileStore;
type PrivateFileStoreSync = FileStoreSync;
/** Create a sync private file store rooted at `rootDir`. */
declare function privateFileStoreSync(rootDir: string): PrivateFileStoreSync;
//#endregion
//#region src/infra/replace-file.d.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
declare const replaceFileAtomic: typeof replaceFileAtomic$1;
/** Options for moving paths while optionally rejecting hardlinked source files. */
type MovePathWithCopyFallbackOptions = MovePathWithCopyFallbackOptions$1 & {
  sourceHardlinks?: "allow" | "reject";
};
/**
 * Moves a path using fs-safe's copy fallback, with an OpenClaw hardlink guard
 * for install/update flows that must not preserve package-manager links.
 */
declare function movePathWithCopyFallback(options: MovePathWithCopyFallbackOptions): Promise<void>;
//#endregion
//#region src/infra/ports.d.ts
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
declare function ensurePortAvailable(port: number, host?: string): Promise<void>;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
//#region src/plugin-sdk/security-runtime.d.ts
/** Safely open a path beneath a trusted root while rejecting hardlinks and unsafe symlinks by default. */
declare function openFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
}): Promise<OpenResult>;
/** Copy a source file into a path beneath a trusted root using fs-safe root policy. */
declare function writeFileFromPathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  sourcePath: string;
  mkdir?: boolean;
}): Promise<void>;
//#endregion
export { ACCESS_GROUP_ALLOW_FROM_PREFIX, type AbsolutePathSymlinkPolicy, type AccessGroupMembershipLookup, type AccessGroupMembershipResolver, type AssertNoSymlinkParentsOptions, type AuthProfileType, type ChannelAccountEntry, type ChannelAccountPredicate, type ChannelAccountSurface, ContextVisibilityDecision, ContextVisibilityDecisionReason, ContextVisibilityKind, DM_GROUP_ACCESS_REASON, type DiscoveredConfigSecretTarget, DmGroupAccessDecision, DmGroupAccessReasonCode, type EnsureAbsoluteDirectoryOptions, type EnsureAbsoluteDirectoryResult, ExternalContentSource, type ExternalFileWriteOptions, type ExternalFileWriteResult, FsSafeError, FsSafeError as SafeOpenError, type HookExternalContentSource, type LookupFn, type MovePathWithCopyFallbackOptions, type PrivateFileStore, type ReplaceFileAtomicFileSystem, type ReplaceFileAtomicOptions, type ReplaceFileAtomicResult, type ReplaceFileAtomicSyncFileSystem, type ReplaceFileAtomicSyncOptions, type ResolvedAbsolutePath, type ResolvedAccessGroupAllowFromState, type ResolvedPlanTarget, type ResolvedWritableAbsolutePath, ResolverContext, type FsSafeErrorCode as SafeOpenErrorCode, SafeRegexCompileResult, SafeRegexRejectReason, SecretAssignment, SecretDefaults, type SecretRefResolveCache, SecretResolverWarning, SecretResolverWarningCode, type SecretTargetConfigFile, type SecretTargetExpected, type SecretTargetRegistryEntry, type SecretTargetShape, SsrFBlockedError, type SsrFPolicy, WrapExternalContentOptions, type WriteSiblingTempFileOptions, type WriteSiblingTempFileResult, appendRegularFile, appendRegularFileSync, applyResolvedAssignments, assertAbsolutePathInput, assertNoSymlinkParents, assertNoSymlinkParentsSync, buildSafeExternalPrompt, buildUntrustedChannelMetadata, canonicalPathFromExistingAncestor, collectConditionalChannelFieldAssignments, collectNestedChannelFieldAssignments, collectNestedChannelTtsAssignments, collectSecretInputAssignment, collectSimpleChannelFieldAssignments, compileSafeRegex, compileSafeRegexDetailed, createResolverContext, detectSuspiciousPatterns, ensureAbsoluteDirectory, ensureDirForFile, ensurePortAvailable, evaluateSupplementalContextVisibility, expandAllowFromWithAccessGroups, extractErrorCode, filterSupplementalContextItems, findExistingAncestor, formatErrorMessage, generateSecureToken, getChannelRecord, getChannelSurface, getHookType, hasConfiguredSecretInputValue, hasNestedRepetition, hasOwnProperty, hasProxyEnvConfigured, isBaseFieldActiveForChannelSurface, isBlockedHostnameOrIp, isChannelAccountEffectivelyEnabled, isEnabledFlag, isExternalHookSession, isNonEmptyString, isNotFoundPathError, isPathInside, isPrivateNetworkAllowedByPolicy, isRecord, mapHookExternalContentSource, matchesHostnameAllowlist, movePathWithCopyFallback, normalizeHostname, normalizePositiveInt, normalizePositiveTimerMs, normalizeSecretStringValue, openFileWithinRoot, openLocalFileSafely, parseAccessGroupAllowFromEntry, parseDotPath, parseEnvValue, pathExists, pathExistsSync, pathScope, privateFileStore, privateFileStoreSync, pushAssignment, pushInactiveSurfaceWarning, pushWarning, readRegularFile, readRegularFileSync, readStoreAllowFromForDmPolicy, readTextFileIfExists, redactSensitiveText, replaceFileAtomic, replaceFileAtomicSync, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveAccessGroupAllowFromMatches, resolveAccessGroupAllowFromState, resolveChannelAccountSurface, resolveDmAllowState, resolveDmGroupAccessDecision, resolveDmGroupAccessWithCommandGate, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveExistingPathsWithinRoot, resolveHookExternalContentSource, resolveLocalPathFromRootsSync, resolveOpenDmAllowlistAccess, resolvePathWithinRoot, resolvePathsWithinRoot, resolvePinnedHostnameWithPolicy, resolvePinnedMainDmOwnerFromAllowlist, resolvePreferredOpenClawTmpDir, resolveRegularFileAppendFlags, resolveStrictExistingPathsWithinRoot, resolveWritablePathWithinRoot, root, safeEqualSecret, sanitizeModelSpecialTokens, sanitizeUntrustedFileName, shouldIncludeSupplementalContext, statRegularFile, statRegularFileSync, testRegexWithBoundedInput, toDotPath, withTimeout, wrapExternalContent, wrapWebContent, writeExternalFileWithinRoot, writeFileFromPathWithinRoot, writeJsonFileSecure, writeSiblingTempFile, writeTextFileAtomic, writeViaSiblingTempPath };