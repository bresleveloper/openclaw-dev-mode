import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { c as runPluginCleanup } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-CGngP_UC.mjs";
import { a as activeSessions, b as retainTranscriptStartRetry, f as isTranscriptSessionStarting, g as startTranscripts, h as resolveTranscriptSourceOwnership, i as stopTranscriptCapture, m as resolveSourceProvider, s as createTranscriptSessionId, t as createTranscriptsStore, v as TranscriptStartError } from "./capture-operations-Cb-IOv0_.mjs";
import { n as sanitizeTranscriptSourceLocator, r as sourceFromParams } from "./source-locator-CLW5DWGY.mjs";
import { o as transcriptSessionSelector } from "./store-K2ivV-ir.mjs";
import { t as resolveTranscriptsConfig } from "./config-qnAcplqt.mjs";
import { r as hasSameTranscriptCaptureIntent, t as beginConfiguredTranscriptStarts } from "./configured-start-status-AfSgaknf.mjs";
//#region src/transcripts/auto-start.ts
const AUTO_START_RETRY_ATTEMPTS = 12;
const AUTO_START_RETRY_MS = 5e3;
const AUTO_START_STOP_TIMEOUT_MS = 5e3;
const AUTO_START_PROVIDER_READY_TIMEOUT_MS = 3e4;
const AUTO_START_OCCUPANCY_EMPTY_GRACE_MS = 3e4;
const AUTO_START_OCCUPANCY_REOPEN_WINDOW_MS = 6e5;
function formatAutoStopDiagnostic(value) {
	return JSON.stringify(truncateUtf16Safe(sanitizeTerminalText(formatErrorMessage(value)), 300));
}
function matchesConfiguredSource(owner, config, index) {
	return hasSameTranscriptCaptureIntent({ autoStart: owner.config?.transcripts?.autoStart?.slice(owner.index, owner.index + 1) }, { autoStart: config?.transcripts?.autoStart?.slice(index, index + 1) });
}
/** Own configured captures independently of the room's provider connection. */
function createTranscriptsAutoStartService(ctx, getConfig) {
	const entries = /* @__PURE__ */ new Set();
	const guildOwners = /* @__PURE__ */ new Map();
	const consumedSessions = /* @__PURE__ */ new Map();
	let stopped = false;
	let diagnostics;
	return {
		start(config = ctx.config) {
			if (stopped) return { settled: Promise.resolve() };
			diagnostics = beginConfiguredTranscriptStarts(config?.transcripts);
			const resolved = resolveTranscriptsConfig(config?.transcripts);
			if (!resolved.enabled) return { settled: Promise.resolve() };
			const retained = new Set(entries);
			for (const [index, entry] of resolved.autoStart.entries()) {
				const current = [...retained].find((candidate) => matchesConfiguredSource(candidate.owner, config, index));
				if (current) {
					current.owner.index = index;
					current.owner.config = config;
					if (current.owner.diagnostic) {
						current.owner.diagnostic[0] = index;
						diagnostics.record(...current.owner.diagnostic);
					}
					retained.delete(current);
					continue;
				}
				const providerId = normalizeCapabilityProviderId(entry.providerId);
				const owner = {
					index,
					config
				};
				entries.add({
					owner,
					providerId,
					...startTranscriptsAutoStartEntry({
						...ctx,
						config
					}, entry, owner, guildOwners, consumedSessions, (lifecycleToken, diagnostic) => {
						owner.diagnostic = [
							owner.index,
							lifecycleToken,
							diagnostic
						];
						diagnostics?.record(...owner.diagnostic);
					}, getConfig ?? (() => owner.config))
				});
			}
			return { settled: Promise.allSettled([...entries].flatMap((entry) => Array.from(entry.pendingStarts))).then(() => void 0) };
		},
		async stop(providerIds, nextConfig) {
			stopped ||= providerIds === void 0;
			if (stopped) diagnostics?.clear();
			const next = resolveTranscriptsConfig(nextConfig?.transcripts);
			const retained = new Set(next.enabled ? next.autoStart.map((_, index) => index) : []);
			const selected = [...entries].filter((entry) => {
				if (!providerIds || entry.providerId && providerIds.has(entry.providerId)) return true;
				if (!nextConfig) return false;
				const index = [...retained].find((candidate) => matchesConfiguredSource(entry.owner, nextConfig, candidate));
				if (index === void 0) return true;
				retained.delete(index);
				return false;
			});
			const stopping = Promise.allSettled(selected.map(async (entry) => {
				entry.stopping ??= entry.stop(providerIds !== void 0).finally(() => {
					entry.stopping = void 0;
				});
				if (!await entry.stopping) {
					if (providerIds) throw new Error("Transcript auto-start capture cleanup remains pending");
					return;
				}
				entries.delete(entry);
				for (const [key, owner] of guildOwners) if (owner === entry.owner) guildOwners.delete(key);
			}));
			if (await awaitWithinDeadline(() => Promise.allSettled(selected.flatMap((entry) => Array.from(entry.pendingStarts))), Date.now() + AUTO_START_STOP_TIMEOUT_MS) === ABSOLUTE_DEADLINE_EXPIRED) {
				stopping.then((results) => {
					for (const result of results) if (result.status === "rejected") ctx.logger.warn(`transcripts autoStart cleanup failed: ${formatAutoStopDiagnostic(result.reason)}`);
				});
				if (providerIds) throw new Error("Transcript auto-start stop timed out waiting for pending starts; retry after the provider finishes stopping");
				ctx.logger.warn(`transcripts autoStart stop timed out waiting for pending starts`);
				return;
			}
			const errors = (await stopping).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length) throw new AggregateError(errors, "Transcript auto-start cleanup failed");
		}
	};
}
function startTranscriptsAutoStartEntry(ctx, entry, entryOwner, guildOwners, consumedSessions, recordDiagnostic, getConfig) {
	let stopped = false;
	const store = createTranscriptsStore(ctx);
	const timers = /* @__PURE__ */ new Set();
	let watcher;
	let watchRegistration;
	const startedSessions = /* @__PURE__ */ new Map();
	const controllers = /* @__PURE__ */ new Set();
	const pendingStarts = /* @__PURE__ */ new Set();
	let stopping;
	let startRetry;
	const clearRetry = () => {
		startRetry?.release();
		startRetry = void 0;
	};
	const futureTitle = () => {
		const latest = getConfig();
		const config = hasSameTranscriptCaptureIntent(entryOwner.config?.transcripts, latest?.transcripts) ? latest : entryOwner.config;
		return resolveTranscriptsConfig(config?.transcripts).autoStart[entryOwner.index]?.title;
	};
	const terminalDiagnostic = (error) => error instanceof TranscriptStartError && !error.retry ? error.code : void 0;
	const schedule = (run, delay) => {
		const timer = setTimeout(() => {
			timers.delete(timer);
			run();
		}, delay);
		timer.unref();
		timers.add(timer);
		return timer;
	};
	const cancel = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timers.delete(timer);
		}
	};
	const runPending = (run) => {
		const controller = new AbortController();
		controllers.add(controller);
		const task = run(controller).finally(() => {
			controllers.delete(controller);
			pendingStarts.delete(task);
		});
		pendingStarts.add(task);
		return task;
	};
	const ownsCapture = (capture) => activeSessions.get(capture.sessionId)?.lifecycleToken === capture.lifecycleToken;
	const forgetCapture = (capture) => {
		if (!ownsCapture(capture) && startedSessions.get(capture.sessionId) === capture.lifecycleToken) {
			startedSessions.delete(capture.sessionId);
			if (consumedSessions.get(capture.sessionId) === capture.lifecycleToken) consumedSessions.delete(capture.sessionId);
		}
	};
	const stopCapture = async (capture, requireProviderStop = false) => {
		const warnings = [];
		try {
			const active = activeSessions.get(capture.sessionId);
			if (!active || active.lifecycleToken !== capture.lifecycleToken) {
				forgetCapture(capture);
				return;
			}
			const details = await stopTranscriptCapture({
				ctx,
				store,
				selection: {
					session: active.session,
					selector: transcriptSessionSelector(active.session),
					activeCandidate: active,
					selectedActive: active,
					historicalRevision: void 0
				}
			});
			if (details.status === "skipped") {
				if (requireProviderStop && details.reason !== "inactive") throw new Error(`Transcripts session stop still in progress: ${capture.sessionId}`);
				forgetCapture(capture);
				return;
			}
			if (typeof details.summaryExportError === "string") warnings.push(`summary saved; export failed intendedSummaryPath=${formatAutoStopDiagnostic(details.intendedSummaryPath)}: ${formatAutoStopDiagnostic(details.summaryExportError)}. Correct the export destination, then run openclaw transcripts path <session> or openclaw transcripts show <session>.`);
			if (typeof details.providerStopError === "string") warnings.push(`provider stop failed: ${formatAutoStopDiagnostic(details.providerStopError)}. Check the provider capture status and connection.`);
		} catch (error) {
			if (requireProviderStop) throw error;
			warnings.push(`stop failed: ${formatAutoStopDiagnostic(error)}`);
		}
		for (const warning of warnings) ctx.logger.warn(`transcripts autoStart session=${formatAutoStopDiagnostic(capture.sessionId)}: ${warning}`);
		forgetCapture(capture);
	};
	const startCapture = async (capture, params) => {
		recordDiagnostic(capture.lifecycleToken, "starting");
		try {
			const retry = startRetry;
			const result = await startTranscripts({
				...params,
				existingSession: retry?.session ?? params.existingSession,
				existingSessionCondition: retry ? {
					expectedInputRevision: retry.revision,
					assertCurrent: retry.assertCurrent
				} : params.existingSessionCondition,
				ctx,
				startupWaitMs: AUTO_START_PROVIDER_READY_TIMEOUT_MS,
				configuredLifecycle: true,
				lifecycleToken: capture.lifecycleToken,
				rawParams: {
					...params.rawParams,
					sessionId: capture.sessionId
				}
			});
			clearRetry();
			if (!stopped) recordDiagnostic(capture.lifecycleToken, result.status === "ended" ? "ended" : void 0);
			return result;
		} catch (error) {
			if (error instanceof TranscriptStartError) {
				clearRetry();
				if (!stopped && error.retry) startRetry = retainTranscriptStartRetry(ctx.stateDir, error.retry);
			}
			throw error;
		} finally {
			if (ownsCapture(capture)) {
				startedSessions.set(capture.sessionId, capture.lifecycleToken);
				consumedSessions.set(capture.sessionId, capture.lifecycleToken);
			}
		}
	};
	const startContinuous = (attempt) => {
		if (stopped) return;
		const capture = {
			sessionId: startRetry?.session.sessionId ?? entry.sessionId ?? createTranscriptSessionId(),
			lifecycleToken: Symbol(entry.sessionId)
		};
		runPending(async (controller) => {
			try {
				if (consumedSessions.has(entry.sessionId ?? "")) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error("transcripts session already started by this service"));
				await startCapture(capture, {
					store,
					sessionIdOrigin: entry.sessionId ? "supplied" : "generated",
					abortSignal: controller.signal,
					rawParams: {
						...entry,
						title: futureTitle()
					}
				});
			} catch (error) {
				if (stopped) return;
				const terminal = terminalDiagnostic(error);
				const cleanupPending = ownsCapture(capture);
				if (terminal || cleanupPending || attempt >= AUTO_START_RETRY_ATTEMPTS) {
					clearRetry();
					const diagnostic = terminal ?? "start-failed";
					recordDiagnostic(capture.lifecycleToken, diagnostic);
					ctx.logger.warn(`transcripts autoStart source ${entryOwner.index + 1}: ${diagnostic}. Check Meeting capture health in Settings.`);
				} else {
					recordDiagnostic(capture.lifecycleToken, "retrying");
					schedule(() => startContinuous(attempt + 1), AUTO_START_RETRY_MS);
				}
			}
		});
	};
	const watchEntry = async () => {
		let occupied = false;
		let ready = false;
		let capture;
		let starting;
		let startController;
		let emptyTimer;
		let retryTimer;
		let source;
		let diagnosticToken = Symbol(`transcripts occupancy ${entryOwner.index}`);
		const label = () => `transcripts autoStart[${entryOwner.index}] provider=${entry.providerId}`;
		const retry = (run, attempt, error, phase) => {
			if (stopped) return;
			const terminal = terminalDiagnostic(error);
			if (terminal || attempt >= AUTO_START_RETRY_ATTEMPTS) {
				clearRetry();
				recordDiagnostic(diagnosticToken, terminal ?? "start-failed");
				ctx.logger.warn(`${label()} failed: ${formatAutoStopDiagnostic(error)}; check the entry and provider connection. ${phase === "watch" ? "Reload the provider plugin to retry occupancy watching." : "Waiting for the next occupancy transition."}`);
				return;
			}
			recordDiagnostic(diagnosticToken, "retrying");
			cancel(retryTimer);
			retryTimer = schedule(run, AUTO_START_RETRY_MS);
		};
		const begin = (attempt) => {
			if (stopped || !ready || !occupied || starting || stopping) return;
			if (capture && ownsCapture(capture) && activeSessions.get(capture.sessionId)?.phase === "active") return;
			starting = runPending(async (controller) => {
				startController = controller;
				try {
					if (capture) {
						await stopCapture(capture);
						if (ownsCapture(capture)) throw new Error("previous capture still awaits finalization");
					}
					if (stopped || !occupied || controller.signal.aborted) return;
					const now = Date.now();
					const retained = startRetry;
					const recent = retained ? {
						session: retained.session,
						inputRevision: retained.revision
					} : await store.readRecentStoppedSession(sanitizeTranscriptSourceLocator(source), (/* @__PURE__ */ new Date(now - AUTO_START_OCCUPANCY_REOPEN_WINDOW_MS)).toISOString(), new Date(now).toISOString());
					if (stopped || !occupied || controller.signal.aborted) return;
					const candidate = recent && recent.session.metadata?.sessionIdOrigin === "generated" && (!(source.agentId ?? ctx.agentId) || (recent.session.metadata?.agentId ?? "main") === (source.agentId ?? ctx.agentId)) && !activeSessions.has(recent.session.sessionId) && !isTranscriptSessionStarting(recent.session.sessionId) && !consumedSessions.has(recent.session.sessionId) ? recent : void 0;
					const owned = {
						sessionId: candidate?.session.sessionId ?? createTranscriptSessionId(),
						lifecycleToken: Symbol(label())
					};
					diagnosticToken = owned.lifecycleToken;
					capture = owned;
					if ((await startCapture(owned, {
						store,
						sessionIdOrigin: "generated",
						abortSignal: controller.signal,
						existingSession: candidate?.session,
						existingSessionCondition: candidate ? {
							expectedInputRevision: candidate.inputRevision,
							assertCurrent: () => {
								if (stopped || !occupied || controller.signal.aborted || capture !== owned) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error("transcript occupancy changed before reopening"));
							}
						} : void 0,
						rawParams: {
							...entry,
							...source,
							title: futureTitle()
						},
						onCaptureEnded: () => {
							if (capture !== owned || stopped || !occupied) return;
							forgetCapture(owned);
							cancel(retryTimer);
							retryTimer = schedule(() => begin(1), AUTO_START_RETRY_MS);
						}
					})).status === "ended") throw new Error("capture ended during startup");
				} catch (error) {
					if (capture && !ownsCapture(capture)) capture = void 0;
					if (occupied && !controller.signal.aborted) retry(() => begin(attempt + 1), attempt, error, "capture");
				} finally {
					startController = void 0;
				}
			}).finally(() => {
				starting = void 0;
			});
		};
		const end = () => {
			if (stopping) return;
			stopping = (async () => {
				startController?.abort();
				await starting;
				clearRetry();
				if (capture) {
					await stopCapture(capture);
					if (!ownsCapture(capture)) capture = void 0;
				}
				if (!capture) recordDiagnostic(diagnosticToken);
			})().finally(() => {
				stopping = void 0;
				if (occupied && !stopped) begin(1);
			});
		};
		const arm = (attempt) => {
			if (stopped) return;
			watchRegistration = runPending(async (controller) => {
				try {
					const provider = resolveSourceProvider(entry.providerId, ctx);
					if (!provider) throw new Error("provider is not available");
					if (!provider.watchOccupancy) {
						recordDiagnostic(diagnosticToken, "start-failed");
						ctx.logger.warn(`${label()} cannot report occupancy; remove whenOccupied or select a provider that supports occupancy watching.`);
						return;
					}
					clearRetry();
					source = resolveTranscriptSourceOwnership({
						ctx,
						operation: "start",
						provider,
						source: {
							...sourceFromParams(entry),
							providerId: provider.id
						},
						configuredLifecycle: true
					});
					if (source.guildId) {
						const key = JSON.stringify([
							provider.id,
							source.accountId,
							source.guildId
						]);
						const owner = guildOwners.get(key);
						if (owner !== void 0 && owner !== entryOwner) {
							recordDiagnostic(diagnosticToken, "start-failed");
							ctx.logger.warn(`${label()} skipped: autoStart[${owner.index}] already owns this provider account and guild; configure only one whenOccupied entry per account and guild.`);
							return;
						}
						guildOwners.set(key, entryOwner);
					}
					const result = await provider.watchOccupancy({
						cfg: ctx.config,
						source,
						abortSignal: controller.signal,
						startupWaitMs: AUTO_START_PROVIDER_READY_TIMEOUT_MS,
						onOccupied: () => {
							if (stopped || controller.signal.aborted || occupied) return;
							occupied = true;
							cancel(emptyTimer);
							cancel(retryTimer);
							clearRetry();
							begin(1);
						},
						onEmpty: () => {
							if (stopped || controller.signal.aborted || !occupied) return;
							occupied = false;
							cancel(retryTimer);
							cancel(emptyTimer);
							emptyTimer = schedule(end, AUTO_START_OCCUPANCY_EMPTY_GRACE_MS);
						}
					});
					if (!result.ok) throw new Error(result.error);
					watcher = result.value;
					if (stopped) return;
					ready = true;
					recordDiagnostic(diagnosticToken);
					begin(1);
				} catch (error) {
					controller.abort();
					occupied = false;
					cancel(emptyTimer);
					retry(() => arm(attempt + 1), attempt, error, "watch");
				}
			});
		};
		arm(1);
		await watchRegistration;
		await starting;
	};
	if (entry.whenOccupied) {
		const startup = watchEntry().finally(() => pendingStarts.delete(startup));
		pendingStarts.add(startup);
	} else startContinuous(1);
	const stop = async (strict) => {
		stopped = true;
		clearRetry();
		for (const timer of timers) clearTimeout(timer);
		timers.clear();
		for (const controller of controllers) controller.abort();
		await watchRegistration;
		const failures = [];
		if (watcher) {
			const current = watcher;
			try {
				await runPluginCleanup(current.stop, () => current.stop());
				watcher = void 0;
			} catch (error) {
				failures.push(error);
			}
		}
		await Promise.allSettled(pendingStarts);
		await Promise.allSettled(stopping ? [stopping] : []);
		for (const [sessionId, lifecycleToken] of startedSessions) try {
			await stopCapture({
				sessionId,
				lifecycleToken
			}, strict);
		} catch (error) {
			failures.push(error);
		}
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Transcript entry cleanup failed");
		return startedSessions.size === 0;
	};
	return {
		stop,
		pendingStarts
	};
}
//#endregion
export { createTranscriptsAutoStartService };
