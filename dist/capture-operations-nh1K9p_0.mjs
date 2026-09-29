import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { c as runPluginCleanup } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import { t as acquirePluginCapabilityProviders } from "./capability-provider-acquisition-HOf9mUO-.mjs";
import { I as TranscriptSessionConflictError, L as TranscriptsSummaryChangedError } from "./store-sqlite-write-C8OaAvQF.mjs";
import { i as createTranscriptSummaryUpdates, n as sanitizeTranscriptSourceLocator, o as persistTranscriptSummary, r as sourceFromParams, s as readSummaryCaptureLiveness, t as readTranscriptStringParam } from "./source-locator-DLbmH8mM.mjs";
import { t as TranscriptsStore } from "./store-K2ivV-ir.mjs";
import { t as resolveTranscriptsConfig } from "./config-qnAcplqt.mjs";
import { t as getTranscriptSourceProvider } from "./provider-registry-C4yhY9He.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/transcripts/capture-startup.ts
var TranscriptStartError = class extends Error {
	constructor(code, cause, retry) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.code = code;
		this.retry = retry;
		this.name = "TranscriptStartError";
	}
};
const pendingStartRetries = /* @__PURE__ */ new Set();
function retainTranscriptStartRetry(stateDir, retry) {
	const owner = {
		stateDir,
		session: retry.session
	};
	pendingStartRetries.add(owner);
	return {
		session: retry.session,
		revision: retry.revision,
		assertCurrent: () => {
			if (!pendingStartRetries.has(owner)) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error("transcript changed or stopped before startup retry"));
		},
		release: () => pendingStartRetries.delete(owner)
	};
}
function revokeTranscriptStartRetries(stateDir, session) {
	for (const owner of pendingStartRetries) if (owner.stateDir === stateDir && owner.session.sessionId === session.sessionId && owner.session.startedAt === session.startedAt) pendingStartRetries.delete(owner);
}
const capturePolicyTransitions = /* @__PURE__ */ new Map();
function assertTranscriptCaptureEnabled(ctx) {
	if (ctx.config?.transcripts?.enabled === false || capturePolicyTransitions.has(ctx.stateDir)) throw new Error("transcripts are disabled");
}
function createStartupAbortScope(parent) {
	const controller = new AbortController();
	const abortFromParent = () => controller.abort(parent?.reason);
	if (parent?.aborted) abortFromParent();
	else parent?.addEventListener("abort", abortFromParent, { once: true });
	return {
		signal: controller.signal,
		abort: () => controller.abort(),
		detach: () => parent?.removeEventListener("abort", abortFromParent)
	};
}
//#endregion
//#region src/transcripts/capture-appends.ts
/** Accepted speech belongs to its capture until the store has settled it. */
function createTranscriptCaptureAppends(assertCurrent) {
	let tail = Promise.resolve();
	const pending = /* @__PURE__ */ new Set();
	return {
		async run(prepare) {
			const previous = tail;
			const settled = createDeferredCore();
			let active = true;
			pending.add(settled.promise);
			tail = previous.then(() => settled.promise).then(() => void 0);
			const assertAccepted = () => {
				if (!active) throw new Error("Transcript append has already settled");
				assertCurrent();
			};
			const schedule = (write) => previous.then(() => {
				assertAccepted();
				return write(assertAccepted);
			});
			const finish = (outcome) => {
				active = false;
				pending.delete(settled.promise);
				settled.resolve(outcome);
			};
			try {
				await prepare(schedule);
				finish({ ok: true });
			} catch (error) {
				finish({
					ok: false,
					error
				});
				throw error;
			}
		},
		async drain() {
			const failures = (await Promise.all(pending)).flatMap((outcome) => outcome.ok ? [] : [outcome.error]);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Accepted transcript appends failed");
		}
	};
}
//#endregion
//#region src/transcripts/manual-source.ts
/**
* Manual transcript import provider.
*
* This provider turns pasted text into final transcript utterances, optionally
* splitting "Speaker: text" prefixes into speaker labels.
*/
function parseSpeakerLine(line) {
	const match = /^([^:\n]{1,80}):\s+(.+)$/.exec(line.trim());
	if (!match) return { text: line.trim() };
	return {
		speakerLabel: match[1]?.trim(),
		text: match[2]?.trim() ?? ""
	};
}
/** Built-in provider for post-hoc transcript text imports. */
const manualTranscriptSourceProvider = {
	id: "manual-transcript",
	aliases: ["import", "transcript"],
	name: "Manual Transcript Import",
	sourceKinds: ["posthoc-transcript"],
	async importTranscript(request) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		return request.text.split(/\r?\n/).map((line) => parseSpeakerLine(line)).filter((entry) => entry.text).map((entry, index) => ({
			id: `${request.session.sessionId}-${index + 1}`,
			sessionId: request.session.sessionId,
			startedAt: now,
			final: true,
			speaker: { label: entry.speakerLabel ?? request.speakerLabel ?? "Speaker" },
			text: entry.text
		}));
	}
};
//#endregion
//#region src/transcripts/capture.ts
const ACCOUNT_ID_OUTPUT_MAX_CHARS = 64;
function formatTranscriptAccountId(accountId) {
	return JSON.stringify(truncateUtf16Safe(accountId, ACCOUNT_ID_OUTPUT_MAX_CHARS));
}
const activeSessions = /* @__PURE__ */ new Map();
function isTranscriptSelectionOwned(selection) {
	return activeSessions.get(selection.session.sessionId) === selection.activeCandidate;
}
async function isTranscriptSelectionCurrent(selection, store) {
	if (!isTranscriptSelectionOwned(selection)) return false;
	if (selection.selectedActive) return true;
	if (selection.historicalRevision === void 0) return false;
	const revision = await store.readSummaryInputRevision(selection.session);
	return isTranscriptSelectionOwned(selection) && revision === selection.historicalRevision;
}
/** Read-only process facts; a retained stop/cleanup owner does not prove capture is armed. */
function readTranscriptCaptureSnapshot() {
	return [...[...activeSessions.values()].filter((entry) => entry.phase !== "terminal" && entry.phase !== "failed").map((entry) => ({
		session: {
			sessionId: entry.session.sessionId,
			startedAt: entry.session.startedAt,
			source: { ...entry.session.source }
		},
		providerId: entry.providerId,
		configuredSource: entry.configuredSource ? { ...entry.configuredSource } : void 0,
		lifecycleToken: entry.lifecycleToken,
		state: entry.phase === "active" && !entry.stopping && !entry.cleanupPending ? "armed" : "unknown"
	})), ...readSummaryCaptureLiveness().filter(({ session }) => activeSessions.get(session.sessionId)?.session.startedAt !== session.startedAt)];
}
function isTranscriptSessionActive(session) {
	const entry = activeSessions.get(session.sessionId);
	return entry?.session.startedAt === session.startedAt ? entry.phase !== "terminal" : readSummaryCaptureLiveness().some(({ session: capture }) => capture.sessionId === session.sessionId && capture.startedAt === session.startedAt);
}
const startingSessions = /* @__PURE__ */ new Map();
function isTranscriptSessionStarting(sessionId) {
	return startingSessions.has(sessionId);
}
async function settleTranscriptCaptureWork(entry) {
	const failures = (await Promise.allSettled([entry.appends.drain(), entry.summaryUpdates?.stop()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "Transcript append and summary shutdown failed");
}
function finalizeTranscriptCapture(params) {
	const { entry } = params;
	entry.phase = "terminal";
	entry.session = {
		...entry.session,
		stoppedAt: entry.session.stoppedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!entry.finalization) {
		const persisted = (async () => {
			await settleTranscriptCaptureWork(entry);
			const assertCurrent = () => {
				if (activeSessions.get(entry.session.sessionId) !== entry) throw new TranscriptsSummaryChangedError();
			};
			await params.store.writeSession(entry.session, { assertCurrent });
			return await persistTranscriptSummary({
				config: resolveTranscriptsConfig(params.ctx.config?.transcripts),
				cfg: params.ctx.config,
				store: params.store,
				session: entry.session,
				assertCurrent
			});
		})();
		const released = persisted.then(async (result) => {
			await entry.releaseProvider();
			if (!entry.stopping && activeSessions.get(entry.session.sessionId) === entry) activeSessions.delete(entry.session.sessionId);
			return result;
		}).catch((error) => {
			delete entry.finalization;
			params.ctx.logger.warn(`transcripts finalization failed session=${entry.session.sessionId}; capture ended, use transcripts stop to retry: ${String(error)}`);
			throw error;
		});
		entry.finalization = {
			persisted,
			released
		};
		released.catch(() => {});
	}
	const { persisted, released } = entry.finalization;
	return params.providerCallback ? persisted.then((result) => entry.providerStopping ? result : released) : released;
}
function createTranscriptSessionId() {
	return `transcript-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
}
function resolveSourceProvider(providerId, ctx) {
	return providerId === manualTranscriptSourceProvider.id ? manualTranscriptSourceProvider : getTranscriptSourceProvider(providerId, ctx.config);
}
async function authorizeTranscriptSource(params) {
	params.ctx.assertCallerActive?.();
	const ownership = params.provider.accessControl;
	if (!ownership) return;
	const caller = params.ctx.caller;
	if (!caller) throw new Error("transcripts caller authorization is unavailable");
	const authorization = await ownership.authorize({
		action: params.action,
		caller,
		cfg: params.ctx.config,
		source: params.source
	});
	params.ctx.assertCallerActive?.();
	if (!authorization.ok) throw new Error(authorization.error);
}
function resolveTranscriptSourceOwnership(params) {
	const ownership = params.provider.accessControl;
	const caller = params.ctx.caller;
	let trustedAccountId;
	if (ownership && caller?.kind !== "operator") {
		const ownerChannel = ownership.channelId.trim().toLowerCase();
		if (!ownerChannel) throw new Error(`transcripts provider ${params.provider.id} has an invalid account owner channel`);
		const channel = caller?.channel?.trim().toLowerCase();
		trustedAccountId = caller?.accountId?.trim();
		if (channel && channel !== ownerChannel) throw new Error(`transcripts provider ${params.provider.id} can only ${params.operation} from ${ownerChannel} or a channel-less local tool`);
		if (channel && !trustedAccountId) throw new Error(`transcripts provider ${params.provider.id} requires trusted account context from ${channel}`);
	}
	const sourceForResolution = trustedAccountId ? {
		...params.source,
		accountId: trustedAccountId
	} : params.source;
	const accountResolution = ownership?.resolveAccountId({
		cfg: params.ctx.config,
		source: sourceForResolution
	});
	if (accountResolution && !accountResolution.ok) throw new Error(accountResolution.error);
	const resolvedAccountId = accountResolution ? accountResolution.value?.trim() : sourceForResolution.accountId?.trim();
	if (trustedAccountId && resolvedAccountId !== trustedAccountId) throw new Error(`transcripts provider ${params.provider.id} could not use trusted account ${formatTranscriptAccountId(trustedAccountId)}`);
	const providerSource = ownership ? {
		...sourceForResolution,
		accountId: resolvedAccountId
	} : sourceForResolution;
	if (params.configuredLifecycle && ownership && !providerSource.accountId?.trim()) throw new Error(`transcripts provider ${params.provider.id} could not resolve an account for configured auto-start`);
	const channel = ownership?.channelId;
	if (params.configuredLifecycle && !params.ctx.agentId && params.ctx.config && channel && providerSource.channelId) providerSource.agentId = resolveAgentRoute({
		cfg: params.ctx.config,
		channel,
		accountId: providerSource.accountId,
		guildId: providerSource.guildId,
		peer: {
			kind: "channel",
			id: providerSource.channelId
		}
	}).agentId;
	return providerSource;
}
function stopTranscriptProviderCapture(params) {
	const { entry } = params;
	if (entry.phase === "terminal") return Promise.resolve(void 0);
	return entry.providerStopping ??= (async () => {
		const summariesStopped = entry.summaryUpdates?.stop();
		let error;
		try {
			const result = await entry.stopProvider({
				cfg: params.ctx.config,
				sessionId: entry.session.sessionId,
				source: entry.session.source,
				reason: params.reason
			});
			error = result.ok ? void 0 : result.error;
		} catch (cause) {
			error = cause instanceof Error ? cause.message : String(cause);
		} finally {
			await summariesStopped;
		}
		if (error !== void 0 && activeSessions.get(entry.session.sessionId) === entry && entry.phase !== "terminal") entry.cleanupPending = true;
		return error;
	})().finally(() => {
		delete entry.providerStopping;
	});
}
async function startTranscripts(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const getConfig = createRuntimeConfigReader(params.ctx.config ?? {});
		const assertEnabled = () => assertTranscriptCaptureEnabled({
			...params.ctx,
			config: getConfig()
		});
		assertEnabled();
		if (params.abortSignal?.aborted) throw new Error("transcripts start aborted");
		const requestedSource = {
			...sourceFromParams(params.rawParams),
			...params.ctx.agentId ? { agentId: params.ctx.agentId } : {}
		};
		const configuredSource = params.configuredLifecycle ? {
			providerId: requestedSource.providerId,
			accountId: requestedSource.accountId,
			guildId: requestedSource.guildId,
			channelId: requestedSource.channelId,
			meetingUrl: Boolean(requestedSource.meetingUrl)
		} : void 0;
		const acquired = await acquirePluginCapabilityProviders({
			key: "transcriptSourceProviders",
			providerId: requestedSource.providerId,
			cfg: params.ctx.config
		});
		const providerScope = _usingCtx$1.a(new AsyncDisposableStack());
		providerScope.defer(acquired.release);
		const provider = acquired.providers[0];
		const startProvider = provider?.start;
		if (!provider || !startProvider) throw new Error(`transcripts provider ${requestedSource.providerId} cannot start live capture`);
		const providerSource = resolveTranscriptSourceOwnership({
			ctx: params.ctx,
			operation: "start",
			provider,
			source: requestedSource,
			configuredLifecycle: params.configuredLifecycle
		});
		const agentId = params.ctx.agentId ?? providerSource.agentId;
		if (params.existingSession && agentId !== void 0 && (params.existingSession.metadata?.agentId ?? "main") !== agentId) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error("transcripts capture belongs to a different agent; start a new capture"));
		if (!params.configuredLifecycle) await authorizeTranscriptSource({
			action: "start",
			ctx: params.ctx,
			provider,
			source: providerSource
		});
		assertEnabled();
		const requestedSessionId = readTranscriptStringParam(params.rawParams, "sessionId");
		const session = {
			sessionId: params.existingSession?.sessionId ?? requestedSessionId ?? createTranscriptSessionId(),
			title: params.existingSession ? params.existingSession.title : readTranscriptStringParam(params.rawParams, "title"),
			source: params.existingSession?.source ?? sanitizeTranscriptSourceLocator(providerSource),
			startedAt: params.existingSession?.startedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			metadata: params.existingSession ? params.existingSession.metadata : {
				...agentId ? { agentId } : {},
				sessionIdOrigin: params.sessionIdOrigin ?? (requestedSessionId ? "supplied" : "generated")
			}
		};
		if (activeSessions.has(session.sessionId) || startingSessions.has(session.sessionId)) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error(`transcripts session already active: ${session.sessionId}`));
		const startupAbort = createStartupAbortScope(params.abortSignal);
		const startupSettled = createDeferredCore();
		const entry = {
			abortStartup: startupAbort.abort,
			appends: createTranscriptCaptureAppends(() => {
				const current = activeSessions.get(session.sessionId);
				if (current !== entry && (current !== void 0 || startingSessions.get(session.sessionId) !== entry)) throw new Error("Transcript capture no longer owns its accepted append");
			}),
			session,
			providerId: provider.id,
			stopProvider: (request) => acquired.run(() => runPluginCleanup(provider, () => {
				const stop = provider.stop;
				if (!stop) throw new Error(`transcripts provider ${provider.id} cannot stop live capture`);
				return stop.call(provider, request);
			})),
			releaseProvider: acquired.release,
			phase: "starting",
			configuredSource,
			lifecycleToken: params.lifecycleToken
		};
		if (!params.configuredLifecycle) entry.directCapture = {
			stateDir: params.ctx.stateDir,
			async drain() {
				await startupSettled.promise;
				if (activeSessions.get(session.sessionId) !== entry) return;
				const error = await stopTranscriptProviderCapture({
					ctx: params.ctx,
					entry,
					reason: "capture-disabled"
				});
				if (error !== void 0 && entry.phase !== "terminal") throw new Error(`transcripts provider cleanup failed: ${error}`);
				await finalizeTranscriptCapture({
					...params,
					entry
				});
			}
		};
		startingSessions.set(session.sessionId, entry);
		let admitted = false;
		let retry;
		try {
			try {
				await params.store.writeSession(session, params.existingSessionCondition);
			} catch (error) {
				if (error instanceof TranscriptsSummaryChangedError) throw new TranscriptStartError("id-conflict", error);
				throw error;
			}
			admitted = true;
			try {
				assertEnabled();
				startupAbort.signal.throwIfAborted();
				entry.summaryUpdates = await createTranscriptSummaryUpdates({
					config: resolveTranscriptsConfig(params.ctx.config?.transcripts),
					cfg: params.ctx.config,
					store: params.store,
					session,
					logger: params.ctx.logger,
					assertCurrent: () => {
						if (activeSessions.get(session.sessionId) !== entry || entry.phase !== "active" || entry.stopping || entry.cleanupPending) throw new TranscriptsSummaryChangedError();
					}
				});
			} catch (error) {
				entry.phase = "failed";
				throw error;
			}
			let result;
			try {
				assertEnabled();
				acquired.assertOpen();
				startupAbort.signal.throwIfAborted();
				result = await acquired.run(() => startProvider.call(provider, {
					cfg: params.ctx.config,
					session: {
						...session,
						source: { ...providerSource },
						metadata: { ...session.metadata }
					},
					abortSignal: startupAbort.signal,
					startupWaitMs: params.startupWaitMs,
					onUtterance: async (utterance) => {
						if (isTranscriptArtifactText(utterance.text) || entry.phase === "terminal" || entry.phase === "failed" || entry.cleanupPending || (entry.phase === "starting" ? startupAbort.signal?.aborted : activeSessions.get(session.sessionId) !== entry)) return;
						await entry.appends.run((schedule) => params.store.appendUtteranceForSession(session, utterance, schedule));
					},
					onStatus: async (status) => {
						if (status.active || entry.phase === "failed" || entry.phase === "terminal") return;
						if (entry.phase !== "starting" && activeSessions.get(session.sessionId) !== entry) return;
						entry.phase = "terminal";
						entry.session = {
							...session,
							stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
						};
						if (activeSessions.get(session.sessionId) === entry) try {
							await finalizeTranscriptCapture({
								...params,
								entry,
								providerCallback: true
							});
						} finally {
							if (!entry.stopping) params.onCaptureEnded?.();
						}
					}
				}));
				if (!result.ok) throw new Error(result.error);
			} catch (error) {
				entry.phase = "failed";
				throw error;
			}
			providerScope.move();
			activeSessions.set(session.sessionId, entry);
			if (!params.existingSession && !session.title) {
				const title = truncateUtf16Safe(result.session.title?.trim() ?? "", 120);
				if (title) {
					session.title = title;
					entry.session = {
						...entry.session,
						title
					};
					await params.store.writeSession(entry.session);
				}
			}
			if (startupAbort.signal?.aborted) {
				entry.cleanupPending = true;
				const cleanupError = await stopTranscriptProviderCapture({
					ctx: params.ctx,
					entry,
					reason: "service-stop"
				});
				if (cleanupError !== void 0) throw new Error(`transcripts start aborted; provider cleanup failed: ${cleanupError}`);
				await finalizeTranscriptCapture({
					...params,
					entry
				});
				throw new Error("transcripts start aborted");
			}
			if (entry.phase === "terminal") {
				await finalizeTranscriptCapture({
					...params,
					entry
				});
				return {
					status: "ended",
					session: entry.session
				};
			}
			entry.phase = "active";
			entry.summaryUpdates.start();
			return {
				status: "active",
				session,
				providerId: provider.id
			};
		} catch (error) {
			const cleanupWasPending = entry.cleanupPending;
			entry.cleanupPending = true;
			let failure = error;
			let settlementFailed = false;
			try {
				await settleTranscriptCaptureWork(entry);
			} catch (settlementError) {
				settlementFailed = true;
				failure = new AggregateError([error, settlementError], "Transcript startup and capture settlement failed");
			}
			try {
				if (entry.phase === "starting" && !cleanupWasPending && activeSessions.get(session.sessionId) === entry) {
					const cleanupError = await stopTranscriptProviderCapture({
						ctx: params.ctx,
						entry,
						reason: "startup-failed"
					});
					if (cleanupError !== void 0) throw new Error(`transcripts start failed session=${session.sessionId}; provider cleanup failed: ${cleanupError}`, { cause: error });
					await finalizeTranscriptCapture({
						...params,
						entry
					});
				}
				if (entry.phase === "failed") {
					const restored = params.existingSession ?? {
						...session,
						stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					await params.store.writeSession(restored);
					const revision = await params.store.readSummaryInputRevision(restored);
					if (revision !== void 0) retry = {
						session: restored,
						revision
					};
				}
			} catch (cleanupError) {
				failure = settlementFailed ? new AggregateError([failure, cleanupError], "Transcript startup restoration failed") : cleanupError;
				retry = void 0;
			}
			if (!admitted && failure instanceof TranscriptSessionConflictError) throw new TranscriptStartError("id-conflict", failure);
			throw admitted ? new TranscriptStartError("admitted-start-failed", failure, retry) : failure;
		} finally {
			startupAbort.detach();
			try {
				await providerScope.disposeAsync();
			} finally {
				startupSettled.resolve();
				delete entry.abortStartup;
				if (startingSessions.get(session.sessionId) === entry) startingSessions.delete(session.sessionId);
			}
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
//#region src/transcripts/capture-operations.ts
function createTranscriptsStore(ctx) {
	return new TranscriptsStore(path.join(ctx.stateDir, "transcripts"), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: ctx.stateDir
	} });
}
async function exportTranscriptSummary(store, session, { summary, intendedSummaryPath }) {
	try {
		return {
			summary,
			summaryPath: (await store.materializeSessionArtifacts(session, "all")).summaryPath
		};
	} catch (error) {
		return {
			summary,
			intendedSummaryPath,
			summaryExportError: String(error)
		};
	}
}
async function stopTranscriptCapture(params) {
	const { selection } = params;
	const { session, selector, selectedActive } = selection;
	const sessionId = session.sessionId;
	const skip = (reason) => ({
		status: "skipped",
		reason,
		sessionId,
		selector
	});
	const current = await isTranscriptSelectionCurrent(selection, params.store);
	params.ctx.assertCallerActive?.();
	if (!current || !isTranscriptSelectionOwned(selection)) return skip("inactive");
	if (isTranscriptSessionStarting(sessionId)) return skip("starting");
	if (selectedActive?.stopping) return skip("stopping");
	revokeTranscriptStartRetries(params.ctx.stateDir, session);
	if (selectedActive) selectedActive.stopping = true;
	let finalized = false;
	try {
		let providerStopError;
		if (selectedActive && selectedActive.phase !== "terminal") {
			providerStopError = await stopTranscriptProviderCapture({
				ctx: params.ctx,
				entry: selectedActive,
				reason: "tool-stop"
			});
			if (activeSessions.get(sessionId) !== selectedActive) return skip("inactive");
		}
		if (providerStopError !== void 0 && selectedActive?.phase !== "terminal") throw new Error(`transcripts provider cleanup failed: ${providerStopError}. Use transcripts stop to retry.`);
		let persisted;
		let stoppedSession;
		if (selectedActive) {
			persisted = await finalizeTranscriptCapture({
				...params,
				entry: selectedActive
			});
			stoppedSession = selectedActive.session;
			finalized = true;
		} else {
			const assertCurrent = () => {
				params.ctx.assertCallerActive?.();
				if (!isTranscriptSelectionOwned(selection) || isTranscriptSessionStarting(sessionId)) throw new TranscriptsSummaryChangedError();
			};
			stoppedSession = {
				...session,
				stoppedAt: session.stoppedAt ?? (/* @__PURE__ */ new Date()).toISOString()
			};
			if (!session.stoppedAt) try {
				await params.store.writeSession(stoppedSession, {
					expectedInputRevision: selection.historicalRevision,
					assertCurrent
				});
			} catch (error) {
				if (error instanceof TranscriptsSummaryChangedError) return skip("inactive");
				throw error;
			}
			persisted = await persistTranscriptSummary({
				config: resolveTranscriptsConfig(params.ctx.config?.transcripts),
				cfg: params.ctx.config,
				store: params.store,
				session: stoppedSession,
				expectedInputRevision: session.stoppedAt ? selection.historicalRevision : void 0,
				assertCurrent
			});
		}
		const { summaryPath, intendedSummaryPath, summary, summaryExportError } = await exportTranscriptSummary(params.store, stoppedSession, persisted);
		return {
			status: "stopped",
			sessionId,
			selector,
			...providerStopError !== void 0 ? { providerStopError } : {},
			...summaryExportError ? { summaryExportError } : {},
			...intendedSummaryPath ? { intendedSummaryPath } : {},
			summary,
			...summaryPath ? { summaryPath } : {}
		};
	} finally {
		if (selectedActive && activeSessions.get(sessionId) === selectedActive) {
			delete selectedActive.stopping;
			if (finalized) activeSessions.delete(sessionId);
		}
	}
}
function prepareTranscriptCaptureDisable(stateDir) {
	const transition = Symbol("capture-policy");
	capturePolicyTransitions.set(stateDir, transition);
	const entries = [.../* @__PURE__ */ new Set([...startingSessions.values(), ...activeSessions.values()])].filter((entry) => entry.directCapture?.stateDir === stateDir);
	for (const entry of entries) {
		entry.cleanupPending = true;
		entry.abortStartup?.();
	}
	return {
		async drain() {
			const failures = (await Promise.allSettled(entries.map(async (entry) => entry.directCapture?.drain()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError(failures, "Transcript capture policy drainage failed");
		},
		resume: () => {
			if (capturePolicyTransitions.get(stateDir) === transition) capturePolicyTransitions.delete(stateDir);
		}
	};
}
//#endregion
export { manualTranscriptSourceProvider as _, activeSessions as a, retainTranscriptStartRetry as b, formatTranscriptAccountId as c, isTranscriptSessionActive as d, isTranscriptSessionStarting as f, startTranscripts as g, resolveTranscriptSourceOwnership as h, stopTranscriptCapture as i, isTranscriptSelectionCurrent as l, resolveSourceProvider as m, exportTranscriptSummary as n, authorizeTranscriptSource as o, readTranscriptCaptureSnapshot as p, prepareTranscriptCaptureDisable as r, createTranscriptSessionId as s, createTranscriptsStore as t, isTranscriptSelectionOwned as u, TranscriptStartError as v, assertTranscriptCaptureEnabled as y };
