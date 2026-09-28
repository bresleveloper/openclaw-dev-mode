import { definePluginEntry } from "./runtime-api.js";
import "./api.js";
import { VOICE_CALL_CLI_DESCRIPTOR } from "./cli-output-mode.js";
import { i as resolveVoiceCallConfig, t as VoiceCallConfigSchema, u as validateProviderConfig } from "./.setup/config-72FnMWHb.mjs";
import { t as createVoiceCallRuntime } from "./.setup/runtime-entry-dDRm6RgA.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { asNonArrayRecord, asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
import { resolveTimerTimeoutMs, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { randomUUID } from "node:crypto";
//#region extensions/voice-call/src/command-service.ts
var VoiceCallCommandInputError = class extends Error {};
function toVoiceCallStatus(call) {
	return {
		callId: call.callId,
		...call.providerCallId !== void 0 ? { providerCallId: call.providerCallId } : {},
		provider: call.provider,
		direction: call.direction,
		state: call.state,
		startedAt: call.startedAt,
		...call.answeredAt !== void 0 ? { answeredAt: call.answeredAt } : {},
		...call.endedAt !== void 0 ? { endedAt: call.endedAt } : {},
		...call.endReason !== void 0 ? { endReason: call.endReason } : {}
	};
}
function requireInput(value, message) {
	if (!value) throw new VoiceCallCommandInputError(message);
	return value;
}
function requireSuccess(result, fallback) {
	if (!result.success) throw new Error(result.error || fallback);
}
function createVoiceCallCommandService(ensureRuntime) {
	const describeHistoricalCall = async (rt, callId) => {
		const call = await rt.manager.getCallFromMemoryOrStore(callId);
		if (!call) return;
		const endedAt = timestampMsToIsoString(call.endedAt);
		return `call is not active (${[
			`last state=${call.state}`,
			call.endReason ? `endReason=${call.endReason}` : void 0,
			endedAt ? `endedAt=${endedAt}` : void 0
		].filter(Boolean).join(", ")})`;
	};
	const resolveCallMessage = async (callId, message) => {
		const resolvedCallId = requireInput(callId, "callId and message required");
		const resolvedMessage = requireInput(message, "callId and message required");
		const rt = await ensureRuntime();
		const activeCall = rt.manager.getCall(resolvedCallId) ?? rt.manager.getCallByProviderCallId(resolvedCallId);
		if (!activeCall) throw new VoiceCallCommandInputError(await describeHistoricalCall(rt, resolvedCallId) ?? "Call not found");
		return {
			rt,
			callId: activeCall.callId,
			message: resolvedMessage
		};
	};
	const prepareContinue = async (callId, message) => {
		const request = await resolveCallMessage(callId, message);
		return {
			rt: request.rt,
			callId: request.callId,
			run: async () => {
				const result = await request.rt.manager.continueCall(request.callId, request.message);
				requireSuccess(result, "continue failed");
				return {
					success: true,
					transcript: result.transcript
				};
			}
		};
	};
	return {
		prepareContinue,
		async initiate(params, missingToMessage = "to required") {
			const rt = await ensureRuntime();
			const to = requireInput(params.to ?? rt.config.toNumber, missingToMessage);
			const result = await rt.manager.initiateCall(to, params.sessionKey, {
				message: params.message,
				mode: params.mode,
				dtmfSequence: params.dtmfSequence,
				...params.requesterSessionKey ? { requesterSessionKey: params.requesterSessionKey } : {},
				...params.agentId ? { agentId: params.agentId } : {}
			});
			requireSuccess(result, "initiate failed");
			return {
				callId: result.callId,
				initiated: true
			};
		},
		async continueCall(callId, message) {
			return await (await prepareContinue(callId, message)).run();
		},
		async speak(params) {
			const request = await resolveCallMessage(params.callId, params.message);
			if (request.rt.config.realtime.enabled) {
				const realtimeResult = request.rt.webhookServer.speakRealtime(request.callId, request.message);
				if (realtimeResult.success) return { success: true };
				if (params.allowTwimlFallback === false) return {
					success: false,
					error: realtimeResult.error ?? "Realtime bridge is not active"
				};
			}
			requireSuccess(await request.rt.manager.speak(request.callId, request.message), "speak failed");
			return { success: true };
		},
		async sendDtmf(callId, digits) {
			const resolvedCallId = requireInput(callId, "callId and digits required");
			const resolvedDigits = requireInput(digits, "callId and digits required");
			requireSuccess(await (await ensureRuntime()).manager.sendDtmf(resolvedCallId, resolvedDigits), "dtmf failed");
			return { success: true };
		},
		async endCall(callId) {
			const resolvedCallId = requireInput(callId, "callId required");
			requireSuccess(await (await ensureRuntime()).manager.endCall(resolvedCallId), "end failed");
			return { success: true };
		},
		async status(callId) {
			const rt = await ensureRuntime();
			if (!callId) return {
				found: true,
				calls: rt.manager.getActiveCalls().map(toVoiceCallStatus)
			};
			const call = await rt.manager.getCallFromMemoryOrStore(callId);
			return call ? {
				found: true,
				call: toVoiceCallStatus(call)
			} : { found: false };
		}
	};
}
//#endregion
//#region extensions/voice-call/src/gateway-continue-operation.ts
const VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS = 3e4;
const VOICE_CALL_CONTINUE_OPERATION_CLEANUP_MS = 3e5;
/** Create a process-local operation store for gateway continue-call polling. */
function createVoiceCallContinueOperationStore(params) {
	const operations = /* @__PURE__ */ new Map();
	const resolvePollTimeoutMs = (rt) => {
		const ttsTimeoutMs = rt.config.tts?.timeoutMs ?? params.config.tts?.timeoutMs ?? params.coreConfig.tts?.timeoutMs ?? 8e3;
		return resolveTimerTimeoutMs((rt.config.transcriptTimeoutMs ?? params.config.transcriptTimeoutMs) + ttsTimeoutMs + VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS, VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS);
	};
	const scheduleCleanup = (operationId) => {
		setTimeout(() => {
			operations.delete(operationId);
		}, VOICE_CALL_CONTINUE_OPERATION_CLEANUP_MS).unref?.();
	};
	const start = (request) => {
		const operationId = randomUUID();
		const startedAtMs = Date.now();
		const pollTimeoutMs = resolvePollTimeoutMs(request.rt);
		operations.set(operationId, {
			operationId,
			status: "pending",
			callId: request.callId,
			startedAtMs,
			pollTimeoutMs
		});
		request.run().then((result) => {
			const current = operations.get(operationId);
			if (!current || current.status !== "pending") return;
			operations.set(operationId, {
				operationId,
				status: "completed",
				callId: request.callId,
				startedAtMs,
				completedAtMs: Date.now(),
				pollTimeoutMs,
				result: {
					success: true,
					transcript: result.transcript
				}
			});
		}).catch((err) => {
			const current = operations.get(operationId);
			if (!current || current.status !== "pending") return;
			operations.set(operationId, {
				operationId,
				status: "failed",
				callId: request.callId,
				startedAtMs,
				completedAtMs: Date.now(),
				pollTimeoutMs,
				error: formatErrorMessage(err)
			});
		}).finally(() => {
			scheduleCleanup(operationId);
		});
		return {
			operationId,
			status: "pending",
			pollTimeoutMs
		};
	};
	const read = (operationId) => {
		const operation = operations.get(operationId);
		if (!operation) return {
			ok: false,
			error: "operation not found"
		};
		if (operation.status === "pending") return {
			ok: true,
			payload: {
				operationId,
				status: "pending",
				pollTimeoutMs: operation.pollTimeoutMs
			}
		};
		if (operation.status === "failed") {
			operations.delete(operationId);
			return {
				ok: true,
				payload: {
					operationId,
					status: "failed",
					error: operation.error
				}
			};
		}
		operations.delete(operationId);
		return {
			ok: true,
			payload: {
				operationId,
				status: "completed",
				result: operation.result
			}
		};
	};
	return {
		start,
		read
	};
}
//#endregion
//#region extensions/voice-call/index.ts
const VOICE_CALL_WRITE_METHOD_SCOPE = { scope: "operator.write" };
const VOICE_CALL_READ_METHOD_SCOPE = { scope: "operator.read" };
const voiceCallConfigSchema = { parse(value) {
	const config = asOptionalRecord(value) ?? {};
	const enabled = typeof config.enabled === "boolean" ? config.enabled : true;
	return VoiceCallConfigSchema.parse({
		...config,
		enabled,
		provider: config.provider ?? (enabled ? "mock" : void 0)
	});
} };
const VoiceCallToolSchema = Type.Union([
	Type.Object({
		action: Type.Literal("initiate_call"),
		to: Type.Optional(Type.String({ description: "Call target" })),
		message: Type.String({ description: "Intro message" }),
		mode: Type.Optional(Type.Union([Type.Literal("notify"), Type.Literal("conversation")])),
		sessionKey: Type.Optional(Type.String({ description: "OpenClaw session key for the call" })),
		dtmfSequence: Type.Optional(Type.String({ description: "DTMF digits to play before connect" }))
	}),
	Type.Object({
		action: Type.Literal("continue_call"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Follow-up message" })
	}),
	Type.Object({
		action: Type.Literal("speak_to_user"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Message to speak" })
	}),
	Type.Object({
		action: Type.Literal("send_dtmf"),
		callId: Type.String({ description: "Call ID" }),
		digits: Type.String({ description: "DTMF digits to send" })
	}),
	Type.Object({
		action: Type.Literal("end_call"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		action: Type.Literal("get_status"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		mode: Type.Optional(Type.Union([Type.Literal("call"), Type.Literal("status")])),
		to: Type.Optional(Type.String({ description: "Call target" })),
		sid: Type.Optional(Type.String({ description: "Call SID" })),
		message: Type.Optional(Type.String({ description: "Optional intro message" })),
		sessionKey: Type.Optional(Type.String({ description: "OpenClaw session key for the call" })),
		dtmfSequence: Type.Optional(Type.String({ description: "DTMF digits to play before connect" }))
	})
]);
function isCliOnlyProcess() {
	return process.env.OPENCLAW_CLI === "1" && !process.argv.slice(2).includes("gateway");
}
const VOICE_CALL_RUNTIME_COORDINATOR_KEY = Symbol.for("openclaw.voice-call.runtimeCoordinator");
var VoiceCallRuntimeLifecycleError = class extends Error {};
function getVoiceCallRuntimeCoordinator() {
	return resolveGlobalSingleton(VOICE_CALL_RUNTIME_COORDINATOR_KEY, () => ({ epochCounter: 0 }));
}
function activateVoiceCallRuntimeGeneration(coordinator, registration, generation) {
	if (registration.epoch < (coordinator.current?.epoch ?? 0) || registration.generation !== generation) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation was superseded; use the current plugin registration");
	if (generation.retired) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation is retired; use the current plugin registration");
	if (coordinator.current !== registration) {
		if (coordinator.current) coordinator.current.generation.retired = true;
		coordinator.current = registration;
	}
}
function stopVoiceCallRuntimeGeneration(coordinator, generation) {
	const ownedSlot = coordinator.slot?.owner === generation ? coordinator.slot : void 0;
	if (!ownedSlot || ownedSlot.state === "stopping") return ownedSlot?.promise ?? Promise.resolve();
	const stopPromise = Promise.resolve().then(async () => {
		await (ownedSlot.state === "running" ? ownedSlot.runtime : await ownedSlot.promise).stop();
	});
	const stoppingSlot = {
		state: "stopping",
		owner: generation,
		promise: stopPromise
	};
	if (coordinator.slot === ownedSlot) coordinator.slot = stoppingSlot;
	return stopPromise.finally(() => {
		if (coordinator.slot === stoppingSlot) coordinator.slot = void 0;
	});
}
var voice_call_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call",
	description: "Voice-call plugin with Telnyx/Twilio/Plivo providers",
	configSchema: voiceCallConfigSchema,
	register(api) {
		const config = resolveVoiceCallConfig(voiceCallConfigSchema.parse(api.pluginConfig));
		const validation = validateProviderConfig(config);
		const runtimeCoordinator = getVoiceCallRuntimeCoordinator();
		const runtimeRegistration = api.registrationMode !== "full" && runtimeCoordinator.current ? runtimeCoordinator.current : {
			epoch: ++runtimeCoordinator.epochCounter,
			generation: { retired: false }
		};
		const continueOperationStore = createVoiceCallContinueOperationStore({
			config,
			coreConfig: api.config
		});
		const activateRuntimeGeneration = (generation) => activateVoiceCallRuntimeGeneration(runtimeCoordinator, runtimeRegistration, generation);
		const ensureRuntimeForGeneration = async (runtimeGeneration) => {
			activateRuntimeGeneration(runtimeGeneration);
			if (!config.enabled) throw new Error("Voice call disabled in plugin config");
			if (!validation.valid) throw new Error(validation.errors.join("; "));
			while (true) {
				activateRuntimeGeneration(runtimeGeneration);
				const slot = runtimeCoordinator.slot;
				if (slot) {
					if (slot.owner !== runtimeGeneration) {
						if (slot.owner.retired) {
							await stopVoiceCallRuntimeGeneration(runtimeCoordinator, slot.owner);
							continue;
						}
						throw new VoiceCallRuntimeLifecycleError("A previous voice call runtime generation is still active; retry after it stops");
					}
					if (slot.state === "running") return slot.runtime;
					if (slot.state === "stopping") {
						await slot.promise;
						continue;
					}
					let createdRuntime;
					try {
						createdRuntime = await slot.promise;
					} catch (err) {
						if (runtimeCoordinator.slot === slot) runtimeCoordinator.slot = void 0;
						throw err;
					}
					activateRuntimeGeneration(runtimeGeneration);
					if (runtimeCoordinator.slot !== slot) continue;
					runtimeCoordinator.slot = {
						state: "running",
						owner: runtimeGeneration,
						runtime: createdRuntime
					};
					return createdRuntime;
				}
				const startingSlot = {
					state: "starting",
					owner: runtimeGeneration,
					promise: createVoiceCallRuntime({
						config,
						coreConfig: api.config,
						fullConfig: api.config,
						agentRuntime: api.runtime.agent,
						stateRuntime: api.runtime.state,
						ttsRuntime: api.runtime.tts,
						logger: api.logger
					})
				};
				runtimeCoordinator.slot = startingSlot;
			}
		};
		const ensureRuntime = async (runtimeGeneration = runtimeRegistration.generation) => {
			try {
				const runtime = await ensureRuntimeForGeneration(runtimeGeneration);
				runtimeGeneration.serviceHealth?.clearFailure();
				return runtime;
			} catch (err) {
				if (!(err instanceof VoiceCallRuntimeLifecycleError)) runtimeGeneration.serviceHealth?.reportFailure(err);
				throw err;
			}
		};
		const commands = createVoiceCallCommandService(ensureRuntime);
		const registerGatewayCommand = (method, handler, scope) => {
			api.registerGatewayMethod(method, async (options) => {
				try {
					options.respond(true, await handler(options));
				} catch (err) {
					const code = err instanceof VoiceCallCommandInputError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
					options.respond(false, void 0, errorShape(code, formatErrorMessage(err)));
				}
			}, scope);
		};
		registerGatewayCommand("voicecall.initiate", async ({ params }) => {
			const message = normalizeOptionalString(params?.message);
			if (!message) throw new VoiceCallCommandInputError("message required");
			return await commands.initiate({
				to: normalizeOptionalString(params?.to),
				message,
				mode: params?.mode === "notify" || params?.mode === "conversation" ? params.mode : void 0,
				sessionKey: normalizeOptionalString(params?.sessionKey),
				requesterSessionKey: normalizeOptionalString(params?.requesterSessionKey)
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue", ({ params }) => commands.continueCall(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.message)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue.start", async ({ params }) => continueOperationStore.start(await commands.prepareContinue(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.message))), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue.result", ({ params }) => {
			const operationId = normalizeOptionalString(params?.operationId);
			if (!operationId) throw new VoiceCallCommandInputError("operationId required");
			const operation = continueOperationStore.read(operationId);
			if (!operation.ok) throw new VoiceCallCommandInputError(operation.error);
			return operation.payload;
		}, VOICE_CALL_READ_METHOD_SCOPE);
		registerGatewayCommand("voicecall.speak", ({ params }) => commands.speak({
			callId: normalizeOptionalString(params?.callId),
			message: normalizeOptionalString(params?.message),
			allowTwimlFallback: params?.allowTwimlFallback !== false
		}), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.dtmf", ({ params }) => commands.sendDtmf(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.digits)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.end", ({ params }) => commands.endCall(normalizeOptionalString(params?.callId)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.status", ({ params }) => commands.status(normalizeOptionalString(params?.callId) ?? normalizeOptionalString(params?.sid)), VOICE_CALL_READ_METHOD_SCOPE);
		registerGatewayCommand("voicecall.start", async ({ params, client }) => {
			const to = normalizeOptionalString(params?.to);
			const requestedAgentId = normalizeOptionalString(params?.agentId);
			const normalizedAgentId = requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0;
			const pluginOwnerId = normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId);
			if (requestedAgentId && (!pluginOwnerId || normalizedAgentId !== requestedAgentId.toLowerCase())) throw new VoiceCallCommandInputError("agentId requires a trusted plugin caller and a valid agent id");
			if (!to) throw new VoiceCallCommandInputError("to required");
			return await commands.initiate({
				to,
				message: normalizeOptionalString(params?.message),
				mode: params?.mode === "notify" || params?.mode === "conversation" ? params.mode : void 0,
				dtmfSequence: normalizeOptionalString(params?.dtmfSequence),
				sessionKey: normalizeOptionalString(params?.sessionKey),
				requesterSessionKey: normalizeOptionalString(params?.requesterSessionKey),
				agentId: normalizedAgentId
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		api.registerTool((toolContext) => ({
			name: "voice_call",
			label: "Voice Call",
			description: "Make phone calls and have voice conversations via the voice-call plugin.",
			parameters: VoiceCallToolSchema,
			async execute(_toolCallId, params) {
				const rawParams = asNonArrayRecord(params);
				const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
				const contextAgentId = normalizeOptionalString(toolContext.agentId) ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
				const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
				try {
					await ensureRuntime();
					if (typeof rawParams.action === "string") switch (rawParams.action) {
						case "initiate_call": {
							const message = normalizeOptionalString(rawParams.message);
							if (!message) throw new VoiceCallCommandInputError("message required");
							return jsonResult(await commands.initiate({
								to: normalizeOptionalString(rawParams.to),
								message,
								dtmfSequence: normalizeOptionalString(rawParams.dtmfSequence),
								mode: rawParams.mode === "notify" || rawParams.mode === "conversation" ? rawParams.mode : void 0,
								sessionKey: normalizeOptionalString(rawParams.sessionKey),
								agentId,
								requesterSessionKey
							}));
						}
						case "continue_call": return jsonResult(await commands.continueCall(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.message)));
						case "speak_to_user": return jsonResult(await commands.speak({
							callId: normalizeOptionalString(rawParams.callId),
							message: normalizeOptionalString(rawParams.message)
						}));
						case "send_dtmf": return jsonResult(await commands.sendDtmf(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.digits)));
						case "end_call": return jsonResult(await commands.endCall(normalizeOptionalString(rawParams.callId)));
						case "get_status": {
							const callId = normalizeOptionalString(rawParams.callId);
							if (!callId) throw new VoiceCallCommandInputError("callId required");
							return jsonResult(await commands.status(callId));
						}
					}
					if ((rawParams.mode ?? "call") === "status") {
						const sid = normalizeOptionalString(rawParams.sid) ?? "";
						if (!sid) throw new Error("sid required for status");
						return jsonResult(await commands.status(sid));
					}
					return jsonResult(await commands.initiate({
						to: normalizeOptionalString(rawParams.to),
						dtmfSequence: normalizeOptionalString(rawParams.dtmfSequence),
						message: normalizeOptionalString(rawParams.message),
						sessionKey: normalizeOptionalString(rawParams.sessionKey),
						agentId,
						requesterSessionKey
					}, "to required for call"));
				} catch (err) {
					return jsonResult({ error: formatErrorMessage(err) });
				}
			}
		}));
		api.registerCli(async ({ program }) => {
			const { registerVoiceCallCli } = await import("./.setup/cli-D6j7ppuN.mjs");
			registerVoiceCallCli({
				program,
				config,
				coreConfig: api.config,
				ensureRuntime,
				stateRuntime: api.runtime.state,
				logger: api.logger
			});
		}, {
			commands: ["voicecall"],
			descriptors: [VOICE_CALL_CLI_DESCRIPTOR]
		});
		api.registerService({
			id: "voicecall",
			start: (ctx) => {
				if (isCliOnlyProcess()) return;
				try {
					if (runtimeRegistration.generation.retired) {
						if (runtimeCoordinator.current !== runtimeRegistration) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation was superseded; use the current plugin registration");
						runtimeRegistration.generation = { retired: false };
					}
					runtimeRegistration.generation.serviceHealth = ctx.serviceHealth;
					activateRuntimeGeneration(runtimeRegistration.generation);
				} catch (err) {
					ctx.serviceHealth?.reportFailure(err);
					api.logger.error(`[voice-call] Failed to start runtime: ${formatErrorMessage(err)}`);
					return;
				}
				if (!config.enabled) return;
				if (!validation.valid) {
					const error = /* @__PURE__ */ new Error(`setup incomplete: ${validation.errors.join("; ")}`);
					ctx.serviceHealth?.reportFailure(error);
					api.logger.error(`[voice-call] Runtime not started: ${error.message}`);
					return;
				}
				const startingGeneration = runtimeRegistration.generation;
				ensureRuntime(startingGeneration).catch((err) => {
					if (err instanceof VoiceCallRuntimeLifecycleError) return;
					ctx.serviceHealth?.reportFailure(err);
					api.logger.error(`[voice-call] Failed to start runtime: ${formatErrorMessage(err)}`);
				});
			},
			stop: async () => {
				const runtimeGeneration = runtimeRegistration.generation;
				runtimeGeneration.retired = true;
				try {
					await stopVoiceCallRuntimeGeneration(runtimeCoordinator, runtimeGeneration);
				} finally {
					runtimeGeneration.serviceHealth = void 0;
				}
			}
		});
	}
});
//#endregion
export { voice_call_default as default };
