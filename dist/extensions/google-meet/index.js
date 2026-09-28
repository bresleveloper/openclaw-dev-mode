import { t as GOOGLE_MEET_CLI_DESCRIPTOR } from "./.setup/cli-output-mode-BwH_6tH8.mjs";
import { n as GOOGLE_MEET_NODE_COMMAND } from "./.setup/google-meet-platform-constants-Bs5iAg3E.mjs";
import { r as resolveGoogleMeetConfig } from "./.setup/config-C-6enWkx.mjs";
import { a as createLazyGoogleMeetNodeInvokePolicy, c as loadGoogleMeetCliModule, d as normalizeMode, f as normalizeTransport, h as shouldJoinCreatedMeet, i as createGoogleMeetRuntimeAccessor, l as loadGoogleMeetNodeHostModule, m as sendGoogleMeetGatewayError, n as assertGoogleMeetAgentToolActionSupported, o as formatGoogleMeetGatewayError, p as resolveMeetingInput, r as callGoogleMeetGatewayFromTool, s as keepTrustedToolAgentId, t as asParamRecord, u as loadGoogleMeetPluginHelpers } from "./.setup/plugin-registration-B3LXKV4R.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { optionalPositiveIntegerSchema } from "openclaw/plugin-sdk/channel-actions";
import { Type } from "typebox";
//#region extensions/google-meet/src/plugin-schema.ts
const googleMeetConfigSchema = { parse(value) {
	return resolveGoogleMeetConfig(value);
} };
const GoogleMeetToolSchema = Type.Object({
	action: Type.String({
		enum: [
			"join",
			"create",
			"status",
			"transcript",
			"setup_status",
			"resolve_space",
			"preflight",
			"latest",
			"calendar_events",
			"artifacts",
			"attendance",
			"export",
			"recover_current_tab",
			"leave",
			"end_active_conference",
			"speak",
			"test_speech",
			"test_listen"
		],
		description: "Google Meet action to run. create creates and joins by default; pass join=false to only mint a URL. After a timeout or unclear browser state, call recover_current_tab before retrying join."
	}),
	join: Type.Optional(Type.Boolean({ description: "For action=create, set false to create the URL without joining." })),
	accessType: Type.Optional(Type.String({
		enum: [
			"OPEN",
			"TRUSTED",
			"RESTRICTED"
		],
		description: "For action=create with Google Meet OAuth, configure who can join without knocking."
	})),
	entryPointAccess: Type.Optional(Type.String({
		enum: ["ALL", "CREATOR_APP_ONLY"],
		description: "For action=create with Google Meet OAuth, configure allowed join entry points."
	})),
	url: Type.Optional(Type.String({ description: "Explicit https://meet.google.com/... URL" })),
	transport: Type.Optional(Type.String({
		enum: [
			"chrome",
			"chrome-node",
			"twilio"
		],
		description: "Join transport"
	})),
	mode: Type.Optional(Type.String({
		enum: [
			"agent",
			"bidi",
			"transcribe"
		],
		description: "Join mode. agent uses realtime transcription, the configured OpenClaw agent, and regular TTS. bidi uses the realtime voice model directly. transcribe joins observe-only."
	})),
	dialInNumber: Type.Optional(Type.String({ description: "Meet dial-in phone number for Twilio. Required for Twilio unless twilio.defaultDialInNumber is configured; Meet URLs cannot be dialed directly." })),
	pin: Type.Optional(Type.String({ description: "Meet phone PIN for Twilio; # is appended if omitted" })),
	dtmfSequence: Type.Optional(Type.String({ description: "Explicit DTMF sequence for Twilio" })),
	sessionId: Type.Optional(Type.String({ description: "Meet session ID" })),
	sinceIndex: Type.Optional(Type.Integer({
		description: "For transcript, resume from the previous response's nextIndex.",
		minimum: 0
	})),
	message: Type.Optional(Type.String({ description: "Realtime instructions to speak now" })),
	timeoutMs: optionalPositiveIntegerSchema({ description: "Probe timeout in milliseconds" }),
	meeting: Type.Optional(Type.String({ description: "Meet URL, meeting code, or spaces/{id}" })),
	today: Type.Optional(Type.Boolean({ description: "For latest, artifacts, or attendance, find a Meet link on today's calendar." })),
	event: Type.Optional(Type.String({ description: "For latest, artifacts, or attendance, find a matching Calendar event." })),
	calendarId: Type.Optional(Type.String({ description: "Calendar id for today/event lookup" })),
	conferenceRecord: Type.Optional(Type.String({ description: "Meet conferenceRecords/{id} resource name or id" })),
	pageSize: optionalPositiveIntegerSchema({ description: "Meet API page size for list actions" }),
	includeTranscriptEntries: Type.Optional(Type.Boolean({ description: "For artifacts, include structured transcript entries" })),
	includeDocumentBodies: Type.Optional(Type.Boolean({ description: "For artifacts/export, export linked transcript and smart-note Google Docs text through Drive." })),
	outputDir: Type.Optional(Type.String({ description: "For export, output directory" })),
	zip: Type.Optional(Type.Boolean({ description: "For export, also write a .zip archive" })),
	dryRun: Type.Optional(Type.Boolean({ description: "For export, return the manifest without writing files." })),
	includeAllConferenceRecords: Type.Optional(Type.Boolean({ description: "For artifacts, attendance, or export with meeting input, fetch all conference records instead of only the latest." })),
	mergeDuplicateParticipants: Type.Optional(Type.Boolean({ description: "For attendance, merge duplicate participant resources." })),
	lateAfterMinutes: optionalPositiveIntegerSchema({ description: "For attendance, mark participants late after this many minutes." }),
	earlyBeforeMinutes: optionalPositiveIntegerSchema({ description: "For attendance, mark early leavers before this many minutes." }),
	accessToken: Type.Optional(Type.String({ description: "Access token override" })),
	refreshToken: Type.Optional(Type.String({ description: "Refresh token override" })),
	clientId: Type.Optional(Type.String({ description: "OAuth client id override" })),
	clientSecret: Type.Optional(Type.String({ description: "OAuth client secret override" })),
	expiresAt: Type.Optional(Type.Number({ description: "Cached access token expiry ms" }))
});
//#endregion
//#region extensions/google-meet/index.ts
var google_meet_default = definePluginEntry({
	id: "google-meet",
	name: "Google Meet",
	description: "Join Google Meet calls through Chrome or Twilio transports",
	configSchema: googleMeetConfigSchema,
	register(api) {
		const config = googleMeetConfigSchema.parse(api.pluginConfig);
		const ensureRuntime = createGoogleMeetRuntimeAccessor({
			api,
			config
		});
		const registerGatewayMethod = (method, handler) => {
			api.registerGatewayMethod(method, async (options) => {
				try {
					await handler(options);
				} catch (err) {
					sendGoogleMeetGatewayError(options.respond, err);
				}
			});
		};
		const resolveTrustedJoinParams = ({ params, client }) => {
			const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
			return {
				url: resolveMeetingInput(config, trustedParams.url),
				transport: normalizeTransport(trustedParams.transport),
				mode: normalizeMode(trustedParams.mode),
				dialInNumber: normalizeOptionalString(trustedParams.dialInNumber),
				pin: normalizeOptionalString(trustedParams.pin),
				dtmfSequence: normalizeOptionalString(trustedParams.dtmfSequence),
				message: normalizeOptionalString(trustedParams.message),
				requesterSessionKey: normalizeOptionalString(trustedParams.requesterSessionKey),
				agentId: normalizeOptionalString(trustedParams.agentId)
			};
		};
		const queryActions = {
			latest: async (raw) => {
				const helpers = await loadGoogleMeetPluginHelpers();
				const token = await helpers.resolveGoogleMeetTokenFromParams(config, raw);
				const resolved = await helpers.resolveMeetingFromParams({
					config,
					raw,
					accessToken: token.accessToken
				});
				return {
					...await helpers.fetchLatestGoogleMeetConferenceRecord({
						accessToken: token.accessToken,
						meeting: resolved.meeting
					}),
					...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
				};
			},
			calendar_events: async (raw) => {
				const helpers = await loadGoogleMeetPluginHelpers();
				const token = await helpers.resolveGoogleMeetTokenFromParams(config, raw);
				const window = raw.today === true ? helpers.buildGoogleMeetCalendarDayWindow() : {};
				return helpers.listGoogleMeetCalendarEvents({
					accessToken: token.accessToken,
					calendarId: normalizeOptionalString(raw.calendarId),
					eventQuery: normalizeOptionalString(raw.event),
					...window
				});
			},
			artifacts: async (raw) => {
				const helpers = await loadGoogleMeetPluginHelpers();
				return helpers.fetchResolvedGoogleMeetArtifacts(await helpers.resolveArtifactQueryFromParams(config, raw));
			},
			attendance: async (raw) => {
				const helpers = await loadGoogleMeetPluginHelpers();
				return helpers.fetchResolvedGoogleMeetAttendance(await helpers.resolveArtifactQueryFromParams(config, raw));
			}
		};
		const transcriptSourceRuntime = async () => (await ensureRuntime()).transcriptSourceRuntime();
		api.registerTranscriptSourceProvider({
			id: "google-meet",
			aliases: ["googlemeet", "meet"],
			name: "Google Meet",
			sourceKinds: ["live-caption"],
			start: async (request) => await (await transcriptSourceRuntime()).startTranscriptSource(request),
			stop: async (request) => await (await transcriptSourceRuntime()).stopTranscriptSource(request)
		});
		registerGatewayMethod("googlemeet.join", async (options) => {
			const runtime = await ensureRuntime();
			options.respond(true, await runtime.join(resolveTrustedJoinParams(options)));
		});
		registerGatewayMethod("googlemeet.create", async ({ params, client, respond }) => {
			const raw = keepTrustedToolAgentId(asParamRecord(params), client);
			const helpers = await loadGoogleMeetPluginHelpers();
			respond(true, shouldJoinCreatedMeet(raw) ? await helpers.createAndJoinMeetFromParams({
				config,
				runtime: api.runtime,
				raw,
				ensureRuntime
			}) : await helpers.createMeetFromParams({
				config,
				runtime: api.runtime,
				raw
			}));
		});
		registerGatewayMethod("googlemeet.status", async ({ params, respond }) => {
			respond(true, await (await ensureRuntime()).status(normalizeOptionalString(params?.sessionId)));
		});
		registerGatewayMethod("googlemeet.transcript", async ({ params, respond }) => {
			const sessionId = normalizeOptionalString(params?.sessionId);
			if (!sessionId) {
				sendGoogleMeetGatewayError(respond, /* @__PURE__ */ new Error("sessionId required"), "INVALID_REQUEST");
				return;
			}
			const sinceIndex = params?.sinceIndex;
			if (sinceIndex !== void 0 && (typeof sinceIndex !== "number" || !Number.isSafeInteger(sinceIndex) || sinceIndex < 0)) {
				sendGoogleMeetGatewayError(respond, /* @__PURE__ */ new Error("sinceIndex must be a non-negative safe integer"), "INVALID_REQUEST");
				return;
			}
			respond(true, await (await ensureRuntime()).transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }));
		});
		registerGatewayMethod("googlemeet.recoverCurrentTab", async ({ params, respond }) => {
			respond(true, await (await ensureRuntime()).recoverCurrentTab({
				url: normalizeOptionalString(params?.url),
				transport: normalizeTransport(params?.transport)
			}));
		});
		registerGatewayMethod("googlemeet.setup", async ({ params, respond }) => {
			respond(true, await (await ensureRuntime()).setupStatus({
				transport: normalizeTransport(params?.transport),
				mode: normalizeMode(params?.mode),
				dialInNumber: normalizeOptionalString(params?.dialInNumber)
			}));
		});
		for (const [method, action] of [
			["googlemeet.latest", "latest"],
			["googlemeet.calendarEvents", "calendar_events"],
			["googlemeet.artifacts", "artifacts"],
			["googlemeet.attendance", "attendance"]
		]) registerGatewayMethod(method, async ({ params, respond }) => {
			respond(true, await queryActions[action](asParamRecord(params)));
		});
		registerGatewayMethod("googlemeet.export", async ({ params, respond }) => {
			respond(true, await (await loadGoogleMeetPluginHelpers()).exportGoogleMeetBundleFromParams(config, asParamRecord(params)));
		});
		registerGatewayMethod("googlemeet.leave", async ({ params, respond }) => {
			const sessionId = normalizeOptionalString(params?.sessionId);
			if (!sessionId) {
				sendGoogleMeetGatewayError(respond, /* @__PURE__ */ new Error("sessionId required"), "INVALID_REQUEST");
				return;
			}
			respond(true, await (await ensureRuntime()).leave(sessionId));
		});
		registerGatewayMethod("googlemeet.endActiveConference", async ({ params, respond }) => {
			const raw = asParamRecord(params);
			const helpers = await loadGoogleMeetPluginHelpers();
			const token = await helpers.resolveGoogleMeetTokenFromParams(config, raw);
			respond(true, await helpers.endGoogleMeetActiveConference({
				accessToken: token.accessToken,
				meeting: resolveMeetingInput(config, raw.meeting)
			}));
		});
		registerGatewayMethod("googlemeet.speak", async ({ params, respond }) => {
			const sessionId = normalizeOptionalString(params?.sessionId);
			if (!sessionId) {
				sendGoogleMeetGatewayError(respond, /* @__PURE__ */ new Error("sessionId required"), "INVALID_REQUEST");
				return;
			}
			respond(true, await (await ensureRuntime()).speak(sessionId, normalizeOptionalString(params?.message)));
		});
		registerGatewayMethod("googlemeet.testSpeech", async (options) => {
			const runtime = await ensureRuntime();
			options.respond(true, await runtime.testSpeech(resolveTrustedJoinParams(options)));
		});
		registerGatewayMethod("googlemeet.testListen", async ({ params, client, respond }) => {
			const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
			const runtime = await ensureRuntime();
			const { readPositiveIntegerParam } = await import("openclaw/plugin-sdk/param-readers");
			respond(true, await runtime.testListen({
				url: resolveMeetingInput(config, trustedParams.url),
				transport: normalizeTransport(trustedParams.transport),
				mode: normalizeMode(trustedParams.mode),
				agentId: normalizeOptionalString(trustedParams.agentId),
				timeoutMs: readPositiveIntegerParam(trustedParams, "timeoutMs")
			}));
		});
		api.registerTool((toolContext) => ({
			name: "google_meet",
			label: "Google Meet",
			description: "Join and track Google Meet sessions through Chrome or Twilio. Call setup_status before join/create/test_listen/test_speech; if it reports a Chrome node offline, local audio missing, or missing Twilio dial plan, surface that blocker instead of retrying or switching transports. Twilio cannot dial a Meet URL directly: provide dialInNumber plus optional pin/dtmfSequence, or configure twilio.defaultDialInNumber. Offline nodes are diagnostics only, not usable candidates. Local Chrome talk-back needs macOS with BlackHole 2ch or Linux with PipeWire-Pulse; otherwise use mode=transcribe, transport=twilio, or a supported chrome-node. If a Meet tab is already open after a timeout, call recover_current_tab before retrying join to report login, permission, or admission blockers without opening another tab.",
			parameters: GoogleMeetToolSchema,
			async execute(_toolCallId, params) {
				const raw = asParamRecord(params);
				const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
				try {
					const { normalizeAgentId, parseAgentSessionKey } = await import("openclaw/plugin-sdk/routing");
					const contextAgentId = toolContext.agentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
					const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
					const needsTrustedAgentRouting = Boolean(agentId && agentId !== "main");
					const useTrustedRuntime = needsTrustedAgentRouting ? await api.runtime.gateway.isAvailable() : false;
					if (needsTrustedAgentRouting && !useTrustedRuntime) throw new Error("Per-agent Google Meet routing requires a Gateway-hosted agent run.");
					const rawWithRequester = {
						...raw,
						...requesterSessionKey ? { requesterSessionKey } : {},
						...useTrustedRuntime ? { agentId } : {}
					};
					assertGoogleMeetAgentToolActionSupported({
						config,
						raw
					});
					switch (raw.action) {
						case "join":
						case "create":
						case "test_speech":
						case "test_listen": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: raw.action,
							raw: rawWithRequester,
							runtime: useTrustedRuntime ? api.runtime : void 0
						}));
						case "status":
						case "transcript":
						case "recover_current_tab":
						case "setup_status":
						case "end_active_conference": return jsonResult(await callGoogleMeetGatewayFromTool({
							config,
							action: raw.action,
							raw
						}));
						case "resolve_space": {
							const { token: _token, ...result } = await (await loadGoogleMeetPluginHelpers()).resolveSpaceFromParams(config, raw);
							return jsonResult(result);
						}
						case "preflight": {
							const helpers = await loadGoogleMeetPluginHelpers();
							const { meeting, token, space } = await helpers.resolveSpaceFromParams(config, raw);
							return jsonResult(helpers.buildGoogleMeetPreflightReport({
								input: meeting,
								space,
								previewAcknowledged: config.preview.enrollmentAcknowledged,
								tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
							}));
						}
						case "latest":
						case "calendar_events":
						case "artifacts":
						case "attendance": return jsonResult(await queryActions[raw.action](raw));
						case "export": {
							const helpers = await loadGoogleMeetPluginHelpers();
							return jsonResult(await helpers.exportGoogleMeetBundleFromParams(config, raw));
						}
						case "leave":
						case "speak":
							if (!normalizeOptionalString(raw.sessionId)) throw new Error("sessionId required");
							return jsonResult(await callGoogleMeetGatewayFromTool({
								config,
								action: raw.action,
								raw
							}));
						default: throw new Error("unknown google_meet action");
					}
				} catch (err) {
					return jsonResult(formatGoogleMeetGatewayError(err));
				}
			}
		}), { name: "google_meet" });
		let nodeHost;
		api.registerNodeHostCommand({
			command: GOOGLE_MEET_NODE_COMMAND,
			cap: "google-meet",
			dangerous: true,
			hasActiveWork: () => nodeHost?.handleGoogleMeetNodeHostCommand.hasActiveWork() ?? false,
			handle: async (paramsJSON) => {
				nodeHost ??= await loadGoogleMeetNodeHostModule();
				return await nodeHost.handleGoogleMeetNodeHostCommand(paramsJSON);
			}
		});
		api.registerNodeInvokePolicy(createLazyGoogleMeetNodeInvokePolicy(config));
		api.registerCli(async ({ program }) => {
			const { registerGoogleMeetCli } = await loadGoogleMeetCliModule();
			registerGoogleMeetCli({
				program,
				config,
				ensureRuntime
			});
		}, {
			commands: ["googlemeet"],
			descriptors: [GOOGLE_MEET_CLI_DESCRIPTOR]
		});
	}
});
//#endregion
export { google_meet_default as default };
