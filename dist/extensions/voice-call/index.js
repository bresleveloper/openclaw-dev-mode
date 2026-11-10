import { definePluginEntry } from "./api.js";
import { VOICE_CALL_CLI_DESCRIPTOR } from "./cli-output-mode.js";
import { g as CallBriefSchema, i as resolveVoiceCallConfig, t as VoiceCallConfigSchema, u as validateProviderConfig } from "./.setup/config-BdbTQCSh.mjs";
import { C as TerminalStates, t as createVoiceCallRuntime } from "./.setup/runtime-entry-Cy51Uayg.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolvePluginServiceScheduler } from "openclaw/plugin-sdk/runtime";
import { asNonArrayRecord, asOptionalRecord, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { resolveTimerTimeoutMs, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { randomUUID } from "node:crypto";
import { Type } from "typebox";
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
			const parsedBrief = CallBriefSchema.optional().safeParse(params.brief);
			if (!parsedBrief.success) throw new VoiceCallCommandInputError(`Invalid brief: ${parsedBrief.error.message}`);
			const result = await rt.manager.initiateCall(to, params.sessionKey, {
				message: params.message,
				mode: params.mode,
				brief: parsedBrief.data,
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
		async steer(params) {
			const callId = requireInput(params.callId, "callId and message required");
			const message = requireInput(params.message?.trim(), "callId and message required");
			if (message.length > 500) throw new VoiceCallCommandInputError("Steering message must be at most 500 characters");
			const rt = await ensureRuntime();
			params.assertCurrent?.();
			const call = rt.manager.getCall(callId);
			if (!call || TerminalStates.has(call.state)) throw new VoiceCallCommandInputError("Call is not active");
			const requester = call.metadata?.requesterSessionKey;
			if (!params.operator && (!params.requesterSessionKey || requester !== params.requesterSessionKey)) throw new VoiceCallCommandInputError("Only the requester session or an operator may steer this call");
			if (!rt.config.realtime.enabled) throw new VoiceCallCommandInputError("Steering requires an active realtime call");
			await rt.manager.updateCallMetadata(call, (metadata) => ({
				...metadata,
				ownerInstructions: [...Array.isArray(metadata?.ownerInstructions) ? metadata.ownerInstructions : [], message].slice(-8)
			}), {
				persist: true,
				assertCurrent: params.assertCurrent
			});
			params.assertCurrent?.();
			if (rt.manager.getCall(callId) !== call || TerminalStates.has(call.state)) throw new VoiceCallCommandInputError("Call is not active");
			const instruction = params.mode === "say" ? `Owner instruction for this call: say this now, verbatim, then listen. Answer: ${JSON.stringify(message)}` : `Owner instruction for this call: ${JSON.stringify(message)}. Apply this guidance from now on while respecting the call brief's disclosure and approval limits.`;
			requireSuccess(rt.webhookServer.speakRealtime(callId, instruction), "Steering failed");
			return { success: true };
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
		async endCall(callId, execution) {
			const resolvedCallId = requireInput(callId, "callId required");
			const rt = execution?.runtime ?? await ensureRuntime();
			execution?.assertAuthority?.();
			requireSuccess(await rt.manager.endCall(resolvedCallId), "end failed");
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
	const start = (request) => {
		const operationId = randomUUID();
		const pollTimeoutMs = resolvePollTimeoutMs(request.rt);
		operations.set(operationId, {
			operationId,
			status: "pending",
			pollTimeoutMs
		});
		request.run().then((result) => {
			operations.set(operationId, {
				operationId,
				status: "completed",
				result: {
					success: true,
					transcript: result.transcript
				}
			});
		}).catch((err) => {
			operations.set(operationId, {
				operationId,
				status: "failed",
				error: formatErrorMessage(err)
			});
		}).finally(() => {
			setTimeout(() => {
				operations.delete(operationId);
			}, VOICE_CALL_CONTINUE_OPERATION_CLEANUP_MS).unref?.();
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
		if (operation.status !== "pending") operations.delete(operationId);
		return {
			ok: true,
			payload: { ...operation }
		};
	};
	return {
		start,
		read
	};
}
//#endregion
//#region extensions/voice-call/src/tool-call-scope.ts
async function resolveActiveVoiceCallToolScope(params) {
	if (!isRecord(params.binding)) return;
	const binding = params.binding;
	const callId = normalizeOptionalString(binding.callId);
	if (binding.kind !== "active-call" || !callId) return;
	if (params.action !== "end_call") throw new VoiceCallCommandInputError("This realtime consult may only end_call.");
	const requestedCallId = normalizeOptionalString(params.requestedCallId);
	if (requestedCallId && requestedCallId !== callId) throw new VoiceCallCommandInputError(`This realtime consult is bound to call ${callId}.`);
	params.assertAuthority();
	params.signal?.throwIfAborted();
	const activeCall = await params.runtime.manager.getCallForStream(callId);
	if (!activeCall || activeCall.callId !== callId) throw new VoiceCallCommandInputError("The bound realtime call is no longer active.");
	return {
		callId,
		execution: {
			runtime: params.runtime,
			assertAuthority: params.assertAuthority
		}
	};
}
//#endregion
//#region extensions/voice-call/src/tool-schema.ts
const VoiceCallBriefToolSchema = Type.Object({
	task: Type.Optional(Type.String({ maxLength: 2e3 })),
	context: Type.Optional(Type.String({ maxLength: 4e3 })),
	language: Type.Optional(Type.String({ maxLength: 100 })),
	identity: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Object({
		introduction: Type.String({ maxLength: 500 }),
		disclose: Type.Optional(Type.Union([Type.Literal("volunteer"), Type.Literal("when-asked")]))
	}, { additionalProperties: false })])),
	disclosures: Type.Optional(Type.Array(Type.String({ maxLength: 500 }), { maxItems: 20 })),
	approvals: Type.Optional(Type.String({ maxLength: 2e3 })),
	voicemailMessage: Type.Optional(Type.String({ maxLength: 1e3 })),
	successCriteria: Type.Optional(Type.String({ maxLength: 1e3 })),
	maxDurationSeconds: Type.Optional(Type.Integer({ minimum: 1 }))
}, { additionalProperties: false });
const VoiceCallToolSchema = Type.Union([
	Type.Object({
		action: Type.Literal("initiate_call"),
		brief: Type.Optional(VoiceCallBriefToolSchema),
		to: Type.Optional(Type.String({ description: "Call target" })),
		message: Type.String({ description: "Intro message" }),
		mode: Type.Optional(Type.Union([Type.Literal("notify"), Type.Literal("conversation")])),
		sessionKey: Type.Optional(Type.String({ description: "OpenClaw session key for the call" })),
		dtmfSequence: Type.Optional(Type.String({ description: "DTMF digits to play before connect" }))
	}),
	Type.Object({
		action: Type.Literal("steer_call"),
		callId: Type.String({ description: "Exact active call ID" }),
		message: Type.String({
			maxLength: 500,
			description: "Owner instruction for the live call"
		}),
		mode: Type.Optional(Type.Union([Type.Literal("say"), Type.Literal("guidance")]))
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
function isCliOnlyProcess() {
	return process.env.OPENCLAW_CLI === "1" && !process.argv.slice(2).includes("gateway");
}
const VOICE_CALL_RUNTIME_COORDINATOR_KEY = Symbol.for("openclaw.voice-call.runtimeCoordinator");
var VoiceCallRuntimeLifecycleError = class extends Error {};
function getVoiceCallRuntimeCoordinator() {
	return resolveGlobalSingleton(VOICE_CALL_RUNTIME_COORDINATOR_KEY, () => ({}));
}
function activateVoiceCallRuntimeGeneration(coordinator, registration, generation) {
	if (generation.retired) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation is retired; use the current plugin registration");
	if (coordinator.current !== registration) {
		if (coordinator.current) coordinator.current.generation.retired = true;
		coordinator.current = registration;
	}
}
function stopVoiceCallRuntimeGeneration(coordinator, generation) {
	const ownedSlot = coordinator.slot?.owner === generation ? coordinator.slot : void 0;
	if (!ownedSlot) return Promise.resolve();
	return ownedSlot.stopPromise ??= ownedSlot.promise.then((runtime) => runtime.stop()).finally(() => {
		if (coordinator.slot === ownedSlot) coordinator.slot = void 0;
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
		const runtimeRegistration = {
			generation: { retired: false },
			ensureRuntime: () => ensureRegisteredRuntime()
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
			if ((config.reports.enabled || config.live.transcript) && !runtimeGeneration.runInServiceContext) throw new VoiceCallRuntimeLifecycleError("Voice call requester reporting requires service startup");
			const previous = runtimeCoordinator.slot;
			if (previous && (previous.owner !== runtimeGeneration || previous.stopPromise)) {
				await stopVoiceCallRuntimeGeneration(runtimeCoordinator, previous.owner);
				activateRuntimeGeneration(runtimeGeneration);
			}
			if (!runtimeCoordinator.slot) {
				const scheduler = runtimeGeneration.scheduler;
				if (!scheduler || scheduler.signal.aborted) throw new VoiceCallRuntimeLifecycleError("Voice call service is not running; start the Gateway and retry");
				runtimeCoordinator.slot = {
					owner: runtimeGeneration,
					promise: createVoiceCallRuntime({
						scheduler,
						config,
						coreConfig: api.config,
						fullConfig: api.config,
						agentRuntime: api.runtime.agent,
						stateRuntime: api.runtime.state,
						ttsRuntime: api.runtime.tts,
						deliveryRuntime: api.runtime,
						runInServiceContext: runtimeGeneration.runInServiceContext,
						logger: api.logger
					})
				};
			}
			const slot = runtimeCoordinator.slot;
			let runtime;
			try {
				runtime = await slot.promise;
			} catch (err) {
				if (runtimeCoordinator.slot === slot && !slot.stopPromise) runtimeCoordinator.slot = void 0;
				throw err;
			}
			activateRuntimeGeneration(runtimeGeneration);
			return runtime;
		};
		const ensureRegisteredRuntime = async (runtimeGeneration = runtimeRegistration.generation) => {
			try {
				const runtime = await ensureRuntimeForGeneration(runtimeGeneration);
				runtimeGeneration.serviceHealth?.clearFailure();
				return runtime;
			} catch (err) {
				if (!(err instanceof VoiceCallRuntimeLifecycleError)) runtimeGeneration.serviceHealth?.reportFailure(err);
				throw err;
			}
		};
		const ensureRuntime = () => (runtimeCoordinator.current ?? runtimeRegistration).ensureRuntime();
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
				requesterSessionKey: normalizeOptionalString(params?.requesterSessionKey),
				brief: params?.brief
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.steer", ({ params, client, hasCurrentClientAuthority, signal }) => {
			const scopes = client?.connect.scopes ?? [];
			const operator = scopes.includes("operator.write") || scopes.includes("operator.admin");
			if (params.mode !== void 0 && params.mode !== "say" && params.mode !== "guidance") throw new VoiceCallCommandInputError("mode must be say or guidance");
			return commands.steer({
				callId: normalizeOptionalString(params.callId),
				message: normalizeOptionalString(params.message),
				mode: params.mode,
				requesterSessionKey: client?.internal?.agentToolCaller?.sessionKey,
				operator,
				assertCurrent: () => {
					signal?.throwIfAborted();
					if (hasCurrentClientAuthority && !hasCurrentClientAuthority()) throw new VoiceCallCommandInputError("Steering caller authority expired");
				}
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
				brief: params?.brief,
				agentId: normalizedAgentId
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		api.registerTool((toolContext) => {
			const boundRuntimeRegistration = asOptionalRecord(toolContext.toolBindings?.voice_call)?.kind === "active-call" ? runtimeCoordinator.current : void 0;
			const boundRuntimeGeneration = boundRuntimeRegistration?.generation;
			const assertActiveCallAuthority = () => {
				if (!boundRuntimeRegistration || !boundRuntimeGeneration || runtimeCoordinator.current !== boundRuntimeRegistration || boundRuntimeRegistration.generation !== boundRuntimeGeneration || boundRuntimeGeneration.retired) throw new VoiceCallCommandInputError("The bound realtime call service is no longer active.");
			};
			return {
				name: "voice_call",
				label: "Voice Call",
				description: "Make phone calls and have voice conversations via the voice-call plugin.",
				parameters: VoiceCallToolSchema,
				async execute(_toolCallId, params, signal) {
					const rawParams = asNonArrayRecord(params);
					const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
					const contextAgentId = normalizeOptionalString(toolContext.agentId) ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
					const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
					try {
						const rt = await ensureRuntime();
						const callScope = await resolveActiveVoiceCallToolScope({
							action: rawParams.action,
							binding: toolContext.toolBindings?.voice_call,
							requestedCallId: rawParams.callId,
							runtime: rt,
							assertAuthority: assertActiveCallAuthority,
							signal
						});
						const initiateParams = {
							to: normalizeOptionalString(rawParams.to),
							message: normalizeOptionalString(rawParams.message),
							dtmfSequence: normalizeOptionalString(rawParams.dtmfSequence),
							sessionKey: normalizeOptionalString(rawParams.sessionKey),
							agentId,
							requesterSessionKey,
							brief: rawParams.brief
						};
						if (typeof rawParams.action === "string") switch (rawParams.action) {
							case "initiate_call":
								if (!initiateParams.message) throw new VoiceCallCommandInputError("message required");
								return jsonResult(await commands.initiate({
									...initiateParams,
									mode: rawParams.mode === "notify" || rawParams.mode === "conversation" ? rawParams.mode : void 0
								}));
							case "steer_call":
								if (rawParams.mode !== void 0 && rawParams.mode !== "say" && rawParams.mode !== "guidance") throw new VoiceCallCommandInputError("mode must be say or guidance");
								return jsonResult(await commands.steer({
									callId: normalizeOptionalString(rawParams.callId),
									message: normalizeOptionalString(rawParams.message),
									mode: rawParams.mode,
									requesterSessionKey,
									assertCurrent: () => signal?.throwIfAborted()
								}));
							case "continue_call": return jsonResult(await commands.continueCall(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.message)));
							case "speak_to_user": return jsonResult(await commands.speak({
								callId: normalizeOptionalString(rawParams.callId),
								message: normalizeOptionalString(rawParams.message)
							}));
							case "send_dtmf": return jsonResult(await commands.sendDtmf(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.digits)));
							case "end_call":
								if (!callScope) signal?.throwIfAborted();
								return jsonResult(await commands.endCall(callScope?.callId ?? normalizeOptionalString(rawParams.callId), callScope?.execution));
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
						return jsonResult(await commands.initiate(initiateParams, "to required for call"));
					} catch (err) {
						return jsonResult({ error: formatErrorMessage(err) });
					}
				}
			};
		});
		api.registerCli(async ({ program }) => {
			const { registerVoiceCallCli } = await import("./.setup/cli-B4FxOsgU.mjs");
			registerVoiceCallCli({
				program,
				config,
				coreConfig: api.config,
				ensureRuntime: () => {
					runtimeRegistration.generation.scheduler = resolvePluginServiceScheduler();
					return ensureRuntime();
				},
				stateRuntime: api.runtime.state
			});
		}, {
			commands: ["voicecall"],
			descriptors: [VOICE_CALL_CLI_DESCRIPTOR]
		});
		api.registerService({
			id: "voicecall",
			apiVersion: 2,
			start: (ctx) => {
				if (isCliOnlyProcess()) return;
				try {
					if (runtimeRegistration.generation.retired) {
						if (runtimeCoordinator.current !== runtimeRegistration) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation was superseded; use the current plugin registration");
						runtimeRegistration.generation = { retired: false };
					}
					runtimeRegistration.generation.scheduler = ctx.scheduler;
					const serviceContext = AsyncLocalStorage.snapshot();
					runtimeRegistration.generation.runInServiceContext = (run) => serviceContext(run);
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
				ensureRegisteredRuntime().catch((err) => {
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
					runtimeGeneration.scheduler = void 0;
					runtimeGeneration.serviceHealth = void 0;
				}
			}
		});
	}
});
//#endregion
export { voice_call_default as default };
