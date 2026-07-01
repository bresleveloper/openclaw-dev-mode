import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { a as TranscriptSourceLocator, c as TranscriptStartRequest, d as TranscriptsStartResult, f as TranscriptsStopResult, i as TranscriptSourceKind, l as TranscriptStopRequest, n as TranscriptParticipant, o as TranscriptSourceProvider, r as TranscriptSessionDescriptor, s as TranscriptSourceStatus, t as TranscriptImportRequest, u as TranscriptUtterance } from "./provider-types-CmtVOB-u.js";

//#region src/transcripts/provider-registry.d.ts
/**
 * Transcript source provider registry.
 *
 * Transcript providers are plugin capability providers; this module exposes
 * canonical/alias lookup and keeps direct plugin resolution ahead of map fallback.
 */
/** Normalize transcript source provider ids for registry lookup. */
declare function normalizeTranscriptSourceProviderId(providerId: string | undefined): string | undefined;
/** List canonical transcript source providers for a config snapshot. */
declare function listTranscriptSourceProviders(cfg?: OpenClawConfig): TranscriptSourceProvider[];
/** Resolve a transcript provider by canonical id or alias. */
declare function getTranscriptSourceProvider(providerId: string | undefined, cfg?: OpenClawConfig): TranscriptSourceProvider | undefined;
//#endregion
export { type TranscriptImportRequest, type TranscriptParticipant, type TranscriptSessionDescriptor, type TranscriptSourceKind, type TranscriptSourceLocator, type TranscriptSourceProvider, type TranscriptSourceStatus, type TranscriptStartRequest, type TranscriptStopRequest, type TranscriptUtterance, type TranscriptsStartResult, type TranscriptsStopResult, getTranscriptSourceProvider, listTranscriptSourceProviders, normalizeTranscriptSourceProviderId };