import { a as AcpRuntimeEnsureInput, c as AcpRuntimePromptMode, d as AcpRuntimeTurn, f as AcpRuntimeTurnAttachment, g as AcpSessionUpdateTag, h as AcpRuntimeTurnResultError, i as AcpRuntimeDoctorReport, l as AcpRuntimeSessionMode, m as AcpRuntimeTurnResult, n as AcpRuntimeCapabilities, o as AcpRuntimeEvent, p as AcpRuntimeTurnInput, r as AcpRuntimeControl, s as AcpRuntimeHandle, t as AcpRuntime, u as AcpRuntimeStatus } from "../types-Z2-ObWHA.js";
import { l as normalizeOptionalString } from "../string-coerce-DJnd-JG-.js";
import { a as SessionAcpIdentity, c as SessionAcpMeta, i as AcpSessionRuntimeOptions, l as SessionId, n as AcpServerOptions, o as SessionAcpIdentitySource, r as AcpSession, s as SessionAcpIdentityState, t as AcpProvenanceMode, u as normalizeAcpProvenanceMode } from "../types-Bst3_XVW2.js";
import { a as isAcpRuntimeError, i as formatAcpErrorChain, n as AcpRuntimeError, o as toAcpRuntimeError, r as AcpRuntimeErrorCode, s as withAcpRuntimeErrorBoundary, t as ACP_ERROR_CODES } from "../errors-Buu3ylDF.js";
import { i as asOptionalRecord } from "../record-coerce-BCQdFoCN.js";
import { i as readString, n as readNonNegativeInteger, r as readNumber, t as readBool } from "../meta-CdA3evUi.js";
import { t as resolveIntegerOption } from "../numeric-options-DUEUHG-w.js";
import { n as isRequesterParentOfBackgroundAcpSession, t as isParentOwnedBackgroundAcpSession } from "../session-interaction-mode-Djh-EbBw.js";
import { n as AcpSessionLineageRow, r as toAcpSessionLineageMeta, t as AcpSessionLineageMeta } from "../session-lineage-meta-BcZlCzhy.js";
import { n as createInMemorySessionStore, r as defaultAcpSessionStore, t as AcpSessionStore } from "../session-BD-ZdzFl.js";
import { n as toAcpRuntimeErrorText, t as formatAcpRuntimeErrorText } from "../error-text-DOVTxln3.js";
import { a as resolveAcpSessionIdentifierLinesFromIdentity, i as resolveAcpSessionIdentifierLines, n as AcpSessionIdentifierRenderMode, o as resolveAcpThreadSessionDetailLines, r as resolveAcpSessionCwd, t as ACP_SESSION_IDENTITY_RENDERER_VERSION } from "../session-identifiers-B-VaRbwG.js";
import { a as identityHasStableSessionId, c as resolveRuntimeHandleIdentifiersFromIdentity, i as identityEquals, l as resolveRuntimeResumeSessionId, n as createIdentityFromHandleEvent, o as isSessionIdentityPending, r as createIdentityFromStatus, s as mergeSessionIdentity, t as createIdentityFromEnsure, u as resolveSessionIdentityFromMeta } from "../session-identity-C8hXIV9I.js";

//#region packages/acp-core/src/error-format.d.ts
/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
declare function configureAcpErrorRedactor(redactor: ((value: string) => string) | undefined): void;
/** Redacts common provider, GitHub, HTTP, payment, bot, and private-key secrets from error text. */
declare function redactSensitiveText(value: string): string;
/**
 * Render a non-Error `cause` value without leaking `[object Object]` or throwing
 * while formatting nested ACP runtime failures.
 */
declare function stringifyNonErrorCause(value: unknown): string;
//#endregion
export { ACP_ERROR_CODES, ACP_SESSION_IDENTITY_RENDERER_VERSION, AcpProvenanceMode, AcpRuntime, AcpRuntimeCapabilities, AcpRuntimeControl, AcpRuntimeDoctorReport, AcpRuntimeEnsureInput, AcpRuntimeError, AcpRuntimeErrorCode, AcpRuntimeEvent, AcpRuntimeHandle, AcpRuntimePromptMode, AcpRuntimeSessionMode, AcpRuntimeStatus, AcpRuntimeTurn, AcpRuntimeTurnAttachment, AcpRuntimeTurnInput, AcpRuntimeTurnResult, AcpRuntimeTurnResultError, AcpServerOptions, AcpSession, AcpSessionIdentifierRenderMode, AcpSessionLineageMeta, AcpSessionLineageRow, AcpSessionRuntimeOptions, AcpSessionStore, AcpSessionUpdateTag, SessionAcpIdentity, SessionAcpIdentitySource, SessionAcpIdentityState, SessionAcpMeta, SessionId, asOptionalRecord as asRecord, configureAcpErrorRedactor, createIdentityFromEnsure, createIdentityFromHandleEvent, createIdentityFromStatus, createInMemorySessionStore, defaultAcpSessionStore, formatAcpErrorChain, formatAcpRuntimeErrorText, identityEquals, identityHasStableSessionId, isAcpRuntimeError, isParentOwnedBackgroundAcpSession, isRequesterParentOfBackgroundAcpSession, isSessionIdentityPending, mergeSessionIdentity, normalizeAcpProvenanceMode, normalizeOptionalString as normalizeText, readBool, readNonNegativeInteger, readNumber, readString, redactSensitiveText, resolveAcpSessionCwd, resolveAcpSessionIdentifierLines, resolveAcpSessionIdentifierLinesFromIdentity, resolveAcpThreadSessionDetailLines, resolveIntegerOption, resolveRuntimeHandleIdentifiersFromIdentity, resolveRuntimeResumeSessionId, resolveSessionIdentityFromMeta, stringifyNonErrorCause, toAcpRuntimeError, toAcpRuntimeErrorText, toAcpSessionLineageMeta, withAcpRuntimeErrorBoundary };