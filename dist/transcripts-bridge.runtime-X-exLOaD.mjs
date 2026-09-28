import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { L as TranscriptsSummaryChangedError } from "./store-sqlite-write-C8OaAvQF.mjs";
import { i as createTranscriptSummaryUpdates, n as sanitizeTranscriptSourceLocator, o as persistTranscriptSummary } from "./source-locator-CLW5DWGY.mjs";
import { t as TranscriptsStore } from "./store-K2ivV-ir.mjs";
import { t as resolveTranscriptsConfig } from "./config-qnAcplqt.mjs";
import { n as MeetingTranscriptDeliveryError } from "./session-transcript-store--EhAbY95.mjs";
import path from "node:path";
//#region src/meeting-bot/transcripts-bridge.runtime.ts
const CAPTURE_INTERVAL_MS = 5e3;
function descriptorForSession(session, options) {
	return {
		sessionId: session.id,
		title: `${options.providerName} meeting`,
		source: sanitizeTranscriptSourceLocator({
			providerId: options.providerId,
			kind: "live-caption",
			meetingUrl: session.url
		}),
		startedAt: session.createdAt,
		metadata: {
			agentId: session.agentId,
			sessionIdOrigin: "supplied",
			meetingSessionId: session.id,
			mode: session.mode,
			participantIdentity: session.participantIdentity
		}
	};
}
function utteranceFromLine(params) {
	return {
		id: `${params.session.id}:${params.sequence}`,
		sessionId: params.session.id,
		startedAt: params.line.at,
		speaker: params.line.speaker ? { label: params.line.speaker } : void 0,
		text: params.line.text,
		final: true,
		metadata: {
			agentId: params.session.agentId,
			meetingSessionId: params.session.id
		}
	};
}
function createMeetingDurableTranscriptBridge(params) {
	const config = resolveTranscriptsConfig(params.options.config);
	const isEnabled = params.isEnabled ?? (() => config.enabled);
	const stateDir = params.options.stateDir ?? resolveStateDir();
	const store = new TranscriptsStore(path.join(stateDir, "transcripts"), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} });
	const captures = /* @__PURE__ */ new Map();
	const pendingSubscribers = /* @__PURE__ */ new Map();
	const subscribers = /* @__PURE__ */ new Map();
	const lifecycleTasks = new KeyedAsyncQueue();
	const tasks = new KeyedAsyncQueue();
	const reportCaptureError = (sessionId, error) => {
		params.logger.debug?.(`[meeting-transcripts] capture ignored session=${sessionId}: ${coerceErrorMessage(error)}`);
	};
	const notifySubscriberStatus = async (subscriber, status) => {
		try {
			await subscriber.onStatus?.(status);
		} catch (error) {
			params.logger.warn(`[meeting-transcripts] subscriber status failed session=${status.sessionId ?? "unknown"}: ${coerceErrorMessage(error)}`);
		}
	};
	return {
		get enabled() {
			return isEnabled();
		},
		async start(session, capture) {
			await lifecycleTasks.enqueue(session.id, async () => {
				if (!isEnabled() || captures.has(session.id)) return;
				const descriptor = descriptorForSession(session, params.options);
				const active = {
					closing: false,
					descriptor,
					initialized: false,
					initializationWarned: false,
					polling: false,
					utteranceCount: 0
				};
				captures.set(session.id, active);
				const initialize = async () => {
					if (active.initialized) return;
					try {
						active.utteranceCount = (await store.readSummarySnapshot(descriptor, 1))?.nextSequence ?? 0;
						await store.writeSession(descriptor);
						active.summaryUpdates = await createTranscriptSummaryUpdates({
							config,
							cfg: params.options.openclawConfig,
							store,
							session: descriptor,
							logger: params.logger,
							isCaptureActive: () => captures.get(session.id) === active && active.initialized && !active.closing,
							assertCurrent: () => {
								if (captures.get(session.id) !== active || active.closing) throw new TranscriptsSummaryChangedError();
							}
						});
						active.summaryUpdates.start();
						active.initialized = true;
						active.initializationWarned = false;
					} catch (error) {
						if (!active.initializationWarned) {
							params.logger.warn(`[meeting-transcripts] durable capture initialization pending session=${session.id}: ${coerceErrorMessage(error)}`);
							active.initializationWarned = true;
						}
					}
				};
				const timer = setInterval(() => {
					if (!isEnabled() || active.polling || active.closing) return;
					active.polling = true;
					lifecycleTasks.enqueue(session.id, async () => {
						if (captures.get(session.id) !== active || active.closing || !isEnabled()) return;
						await initialize();
						await capture();
					}).catch((error) => reportCaptureError(session.id, error)).finally(() => {
						active.polling = false;
					});
				}, CAPTURE_INTERVAL_MS);
				timer.unref?.();
				active.timer = timer;
				active.polling = true;
				try {
					await initialize();
					await capture().catch((error) => reportCaptureError(session.id, error));
				} finally {
					active.polling = false;
				}
			});
		},
		async ingest(session, lines) {
			const active = captures.get(session.id);
			if (!active || lines.length === 0) return;
			await tasks.enqueue(session.id, async () => {
				for (const line of lines) {
					const sequence = active.utteranceCount;
					const utterance = utteranceFromLine({
						line,
						session,
						sequence
					});
					await store.appendUtteranceForSession(active.descriptor, utterance);
					for (const [subscriberSessionId, subscriber] of subscribers) {
						if (subscriber.meetingSessionId !== session.id || utterance.id && subscriber.deliveredUtteranceIds.has(utterance.id)) continue;
						const subscriberUtterance = {
							...utterance,
							id: `${subscriberSessionId}:${utterance.id ?? sequence}`,
							sessionId: subscriberSessionId
						};
						try {
							await subscriber.onUtterance(subscriberUtterance);
							if (utterance.id) subscriber.deliveredUtteranceIds.add(utterance.id);
						} catch (error) {
							subscribers.delete(subscriberSessionId);
							params.logger.warn(`[meeting-transcripts] detached failing subscriber session=${subscriberSessionId}: ${coerceErrorMessage(error)}`);
							notifySubscriberStatus(subscriber, {
								sessionId: subscriberSessionId,
								active: false,
								message: "Detached after transcript delivery failed.",
								source: active.descriptor.source
							});
						}
					}
					active.utteranceCount += 1;
				}
			});
		},
		async stop(session, finalCapture) {
			return await lifecycleTasks.enqueue(session.id, async () => {
				const active = captures.get(session.id);
				if (!active) return false;
				active.closing = true;
				if (active.timer) {
					clearInterval(active.timer);
					delete active.timer;
				}
				const summariesStopped = active.summaryUpdates?.stop();
				try {
					let initializationError;
					if (!active.initialized) try {
						await store.writeSession(active.descriptor);
						active.initialized = true;
					} catch (error) {
						initializationError = error instanceof Error ? error : new Error("could not initialize durable transcript session", { cause: error });
					}
					let deliveryError;
					for (let attempt = 0; attempt < 3; attempt += 1) try {
						await finalCapture();
						deliveryError = void 0;
						break;
					} catch (error) {
						if (!(error instanceof MeetingTranscriptDeliveryError)) {
							reportCaptureError(session.id, error);
							active.finalCaptureError = coerceErrorMessage(error);
							active.finalCaptureFailedAt ??= (/* @__PURE__ */ new Date()).toISOString();
							deliveryError = void 0;
							break;
						}
						if (error.finalCaptureError !== void 0) {
							active.finalCaptureError = error.finalCaptureError;
							active.finalCaptureFailedAt ??= (/* @__PURE__ */ new Date()).toISOString();
						}
						deliveryError = error;
					}
					if (deliveryError) throw deliveryError;
					if (initializationError !== void 0) throw initializationError;
					await summariesStopped;
					const finalCaptureError = active.finalCaptureError;
					const stoppedAt = (/* @__PURE__ */ new Date()).toISOString();
					const stopped = {
						...active.descriptor,
						stoppedAt,
						...finalCaptureError !== void 0 ? { metadata: {
							...active.descriptor.metadata,
							finalCaptureError,
							finalCaptureFailedAt: active.finalCaptureFailedAt
						} } : {}
					};
					try {
						await tasks.enqueue(session.id, async () => {
							await store.writeSession(stopped);
							await persistTranscriptSummary({
								config,
								cfg: params.options.openclawConfig,
								store,
								session: stopped,
								assertCurrent: () => {
									if (captures.get(session.id) !== active || !active.closing) throw new TranscriptsSummaryChangedError();
								}
							});
						});
					} catch (error) {
						params.logger.warn(`[meeting-transcripts] could not finalize durable capture session=${session.id}: ${coerceErrorMessage(error)}`);
						throw error;
					}
				} finally {
					await summariesStopped;
					await tasks.enqueue(session.id, async () => {
						for (const [subscriberSessionId, subscriber] of subscribers) {
							if (subscriber.meetingSessionId !== session.id) continue;
							notifySubscriberStatus(subscriber, {
								sessionId: subscriberSessionId,
								active: false,
								message: `${params.options.providerName} meeting capture ended.`,
								source: active.descriptor.source
							});
							subscribers.delete(subscriberSessionId);
						}
					});
				}
				captures.delete(session.id);
				return true;
			});
		},
		async attach(session, request) {
			const active = captures.get(session.id);
			if (!isEnabled() || !active || active.closing) return {
				ok: false,
				error: `${params.options.providerName} meeting capture is not active.`
			};
			if (subscribers.has(request.session.sessionId) || pendingSubscribers.has(request.session.sessionId)) return {
				ok: false,
				error: `transcripts session already attached: ${request.session.sessionId}`
			};
			let attached = false;
			const isCurrent = () => isEnabled() && captures.get(session.id) === active && !active.closing;
			const subscriber = {
				agentId: session.agentId,
				meetingSessionId: session.id,
				deliveredUtteranceIds: /* @__PURE__ */ new Set(),
				onStatus: request.onStatus,
				onUtterance: request.onUtterance
			};
			pendingSubscribers.set(request.session.sessionId, subscriber);
			try {
				await tasks.enqueue(session.id, async () => {
					if (!isCurrent()) return;
					const utterances = await store.readUtterancesForSession(active.descriptor);
					const { deliveredUtteranceIds } = subscriber;
					for (const utterance of utterances) {
						if (!isCurrent()) return;
						await request.onUtterance({
							...utterance,
							id: `${request.session.sessionId}:${utterance.id ?? "replay"}`,
							sessionId: request.session.sessionId
						});
						if (utterance.id) deliveredUtteranceIds.add(utterance.id);
					}
					if (!isCurrent()) return;
					subscribers.set(request.session.sessionId, subscriber);
					try {
						await request.onStatus?.({
							sessionId: request.session.sessionId,
							active: true,
							message: `Attached to active ${params.options.providerName} meeting capture.`,
							source: active.descriptor.source
						});
						attached = true;
					} catch (error) {
						subscribers.delete(request.session.sessionId);
						throw error;
					}
				});
			} finally {
				pendingSubscribers.delete(request.session.sessionId);
			}
			return attached ? {
				ok: true,
				session: request.session
			} : {
				ok: false,
				error: `${params.options.providerName} meeting capture is ending.`
			};
		},
		async detach(request) {
			const subscriber = subscribers.get(request.sessionId);
			const pending = pendingSubscribers.get(request.sessionId);
			const owner = subscriber ?? pending;
			if (!owner) return {
				ok: true,
				sessionId: request.sessionId,
				stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (request.source.agentId !== owner.agentId) return {
				ok: false,
				error: "transcripts session belongs to another agent"
			};
			return await tasks.enqueue(owner.meetingSessionId, async () => {
				const current = subscribers.get(request.sessionId);
				if (current !== owner) return {
					ok: true,
					sessionId: request.sessionId,
					stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				subscribers.delete(request.sessionId);
				notifySubscriberStatus(current, {
					sessionId: request.sessionId,
					active: false,
					message: `Detached from ${params.options.providerName} meeting capture.`,
					source: request.source
				});
				return {
					ok: true,
					sessionId: request.sessionId,
					stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
			});
		}
	};
}
//#endregion
export { createMeetingDurableTranscriptBridge };
