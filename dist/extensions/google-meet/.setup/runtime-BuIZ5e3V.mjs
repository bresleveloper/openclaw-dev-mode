import { n as GOOGLE_MEET_NODE_COMMAND, t as GOOGLE_MEET_BROWSER_NODE_ADAPTER } from "./google-meet-platform-constants-Bs5iAg3E.mjs";
import { t as normalizeMeetUrl } from "./meet-url-BP2Jlvjs.mjs";
import { c as callBrowserProxyOnNode, l as resolveChromeNode, u as resolveChromeNodeInfo } from "./chrome-create-BZRBHJp9.mjs";
import { n as normalizeDialInNumber, t as GOOGLE_MEET_PLATFORM_ADAPTER } from "./google-meet-platform-adapter-DQZ74Kd5.mjs";
import { asOptionalRecord, asRecord, normalizeOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { GatewayClient, startGatewayClientWhenEventLoopReady } from "openclaw/plugin-sdk/gateway-runtime";
import path from "node:path";
import { isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
import { MeetingPlatformAdapter, MeetingSessionRuntime, addMeetingSetupCheck, createMeetingSession, createMeetingSetupStatus, createMeetingVoiceCallGateway, endMeetingVoiceCallGatewayCall, getMeetingVoiceCallGatewayCall, isMeetingVoiceCallMissingError, joinMeetingViaVoiceCallGateway, leaveMeetingWithBrowser, readMeetingTranscriptWithBrowser, recoverMeetingBrowserTab, resolveLocalMeetingBrowserRequest, speakMeetingViaVoiceCallGateway } from "openclaw/plugin-sdk/meeting-runtime";
import { resolveDefaultAgentId } from "openclaw/plugin-sdk/agent-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import fs from "node:fs";
import os from "node:os";
import { resolveTranscriptsConfig } from "openclaw/plugin-sdk/transcripts";
//#region extensions/google-meet/src/runtime-probes.ts
function resolveProbeTimeoutMs(input, fallback) {
	if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
	if (!Number.isFinite(input) || input <= 0) throw new Error("timeoutMs must be a positive number");
	return Math.min(Math.trunc(input), 12e4);
}
const probes = MeetingPlatformAdapter.createRuntimeProbes({
	defaultSpeechMessage: "Say exactly: Google Meet speech test complete.",
	invalidRequest: (message) => new Error(message),
	resolveTimeoutMs: resolveProbeTimeoutMs,
	shouldWaitForListening: (session) => Boolean((session.transport === "chrome" || session.transport === "chrome-node") && session.chrome?.launched),
	talkBackMode: MeetingPlatformAdapter.isTalkBackMode,
	normalizeUrl: normalizeMeetUrl,
	resolveRequestMode: (mode) => mode === "realtime" ? "agent" : mode,
	defaultTransport: (config) => config.defaultTransport,
	validateListeningTransport: (transport) => {
		if (transport === "twilio") throw new Error("test_listen supports chrome or chrome-node transports");
	},
	resolveSpeechTimeoutMs: (_request, config) => Math.min(config.chrome.joinTimeoutMs, 5e3),
	refreshCaptionHealth: async (context, session) => await context.refreshCaptionHealth(session),
	speechModeError: "test_speech requires mode: agent or bidi; use join mode: transcribe for observe-only sessions.",
	listeningModeError: "test_listen requires mode: transcribe; use test_speech for talk-back sessions."
});
const testGoogleMeetListening = probes.testListening;
const testGoogleMeetSpeech = probes.testSpeech;
//#endregion
//#region extensions/google-meet/src/runtime-session.ts
function resolveTransport(input, config) {
	return input ?? config.defaultTransport;
}
function resolveMode(input, config) {
	return input === "realtime" ? "agent" : input ?? config.defaultMode;
}
function withSessionAgentConfig(config, agentId) {
	return config.realtime.agentId === agentId ? config : {
		...config,
		realtime: {
			...config.realtime,
			agentId
		}
	};
}
function isBrowserTransport(transport) {
	return transport === "chrome" || transport === "chrome-node";
}
function noteSession(session, note) {
	session.notes = [...session.notes.filter((item) => item !== note), note];
}
//#endregion
//#region extensions/google-meet/src/setup.ts
function resolveUserPath(input) {
	if (input === "~") return os.homedir();
	if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
	return input;
}
function isProviderUnreachableWebhookUrl(webhookUrl) {
	try {
		const parsed = new URL(webhookUrl);
		return isBlockedHostnameOrIp(parsed.hostname);
	} catch {
		return false;
	}
}
function resolveVoiceCallSetupValue(configured, fallback) {
	return normalizeOptionalString(configured) ?? normalizeOptionalString(fallback);
}
function getVoiceCallWebhookExposureCheck(voiceCallConfig) {
	const publicUrl = normalizeOptionalString(voiceCallConfig.publicUrl);
	const tunnel = asRecord(voiceCallConfig.tunnel);
	const tailscale = asRecord(voiceCallConfig.tailscale);
	const tunnelProvider = normalizeOptionalString(tunnel.provider);
	const tailscaleMode = normalizeOptionalString(tailscale.mode);
	if (publicUrl) {
		const ok = !isProviderUnreachableWebhookUrl(publicUrl);
		return {
			id: "twilio-voice-call-webhook",
			ok,
			message: ok ? `Voice-call public webhook URL configured: ${publicUrl}` : `Voice-call publicUrl is local/private and cannot be reached by Twilio: ${publicUrl}`
		};
	}
	if (tunnelProvider && tunnelProvider !== "none") return {
		id: "twilio-voice-call-webhook",
		ok: true,
		message: "Voice-call webhook exposure configured through tunnel"
	};
	if (tailscaleMode && tailscaleMode !== "off") return {
		id: "twilio-voice-call-webhook",
		ok: true,
		message: "Voice-call webhook exposure configured through Tailscale"
	};
	return {
		id: "twilio-voice-call-webhook",
		ok: false,
		message: "Set plugins.entries.voice-call.config.publicUrl or configure voice-call tunnel/tailscale exposure for Twilio dialing"
	};
}
function getGoogleMeetSetupStatus(config, options) {
	const checks = [];
	const env = options?.env ?? process.env;
	const fullConfig = asRecord(options?.fullConfig);
	const mode = options?.mode ?? config.defaultMode;
	const transport = options?.transport ?? config.defaultTransport;
	const needsChromeRealtimeAudio = MeetingPlatformAdapter.isTalkBackMode(mode) && (transport === "chrome" || transport === "chrome-node");
	const pluginEntries = asRecord(asRecord(fullConfig.plugins).entries);
	const pluginAllow = asRecord(fullConfig.plugins).allow;
	const voiceCallEntry = asRecord(pluginEntries["voice-call"]);
	const voiceCallConfig = asRecord(voiceCallEntry.config);
	const voiceCallTwilioConfig = asRecord(voiceCallConfig.twilio);
	if (config.auth.tokenPath) {
		const tokenPath = resolveUserPath(config.auth.tokenPath);
		checks.push({
			id: "google-oauth-token",
			ok: fs.existsSync(tokenPath),
			message: fs.existsSync(tokenPath) ? "Google OAuth token file found" : `Google OAuth token file missing at ${config.auth.tokenPath}`
		});
	} else checks.push({
		id: "google-oauth-token",
		ok: true,
		message: "Google OAuth token path not configured; Chrome profile auth will be used"
	});
	checks.push({
		id: "chrome-profile",
		ok: true,
		message: config.chrome.browserProfile ? "Local Chrome uses the OpenClaw browser profile; chrome.browserProfile is passed to chrome-node hosts" : "Local Chrome uses the OpenClaw browser profile; configure browser.defaultProfile to choose another profile"
	});
	if (needsChromeRealtimeAudio) {
		const hasCommandPair = Boolean(config.chrome.audioInputCommand && config.chrome.audioOutputCommand);
		const hasExternalBridge = Boolean(config.chrome.audioBridgeCommand);
		const agentModeExternalBridgeInvalid = mode === "agent" && hasExternalBridge;
		checks.push({
			id: "audio-bridge",
			ok: mode === "agent" ? hasCommandPair && !agentModeExternalBridgeInvalid : hasExternalBridge || hasCommandPair,
			message: agentModeExternalBridgeInvalid ? "Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand; chrome.audioBridgeCommand is bidi-only" : hasExternalBridge ? "Chrome audio bridge command configured" : hasCommandPair ? `Chrome command-pair talk-back audio bridge configured (${config.chrome.audioFormat})` : "Chrome talk-back audio bridge not configured"
		});
	} else if (transport === "chrome" || transport === "chrome-node") checks.push({
		id: "audio-bridge",
		ok: true,
		message: "Chrome observe-only mode does not require a realtime audio bridge"
	});
	checks.push({
		id: "guest-join-defaults",
		ok: Boolean(config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab),
		message: config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab ? "Guest auto-join and tab reuse defaults are enabled" : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins"
	});
	checks.push({
		id: "chrome-node-target",
		ok: config.defaultTransport !== "chrome-node" || Boolean(config.chromeNode.node),
		message: config.defaultTransport === "chrome-node" && !config.chromeNode.node ? "chrome-node default should pin chromeNode.node when multiple nodes may be connected" : config.chromeNode.node ? `Chrome node pinned to ${config.chromeNode.node}` : "Chrome node not pinned; automatic selection works when exactly one capable node is connected"
	});
	if (needsChromeRealtimeAudio) checks.push({
		id: "intro-after-in-call",
		ok: config.chrome.waitForInCallMs > 0,
		message: config.chrome.waitForInCallMs > 0 ? `Realtime intro waits up to ${config.chrome.waitForInCallMs}ms for the Meet tab to be in-call` : "Set chrome.waitForInCallMs to delay realtime intro until the Meet tab is in-call"
	});
	if (transport === "twilio") {
		const hasRequestDialPlan = Boolean(options?.twilioDialInNumber);
		const hasDefaultDialPlan = Boolean(config.twilio.defaultDialInNumber);
		const hasDialPlan = hasRequestDialPlan || hasDefaultDialPlan;
		checks.push({
			id: "twilio-dial-plan",
			ok: hasDialPlan,
			message: hasRequestDialPlan ? "Twilio request includes a Meet dial-in number" : hasDefaultDialPlan ? "Twilio default Meet dial-in number is configured" : "Twilio joins require a Meet dial-in phone number; pass dialInNumber with optional pin/dtmfSequence or configure twilio.defaultDialInNumber"
		});
	}
	if (config.voiceCall.enabled && (transport === "twilio" || Boolean(config.twilio.defaultDialInNumber) || Object.hasOwn(pluginEntries, "voice-call"))) {
		const voiceCallAllowed = !Array.isArray(pluginAllow) || pluginAllow.includes("voice-call");
		const voiceCallEnabled = Object.hasOwn(pluginEntries, "voice-call") && voiceCallEntry.enabled !== false;
		checks.push({
			id: "twilio-voice-call-plugin",
			ok: voiceCallAllowed && voiceCallEnabled,
			message: voiceCallAllowed && voiceCallEnabled ? "Twilio transport can delegate dialing to the voice-call plugin" : "Enable plugins.entries.voice-call and include voice-call in plugins.allow for Twilio dialing"
		});
		if ((normalizeOptionalString(voiceCallConfig.provider) ?? "twilio") === "twilio") {
			const accountSid = resolveVoiceCallSetupValue(voiceCallTwilioConfig.accountSid, env.TWILIO_ACCOUNT_SID);
			const authToken = resolveVoiceCallSetupValue(voiceCallTwilioConfig.authToken, env.TWILIO_AUTH_TOKEN);
			const fromNumber = resolveVoiceCallSetupValue(voiceCallConfig.fromNumber, env.TWILIO_FROM_NUMBER);
			const twilioReady = Boolean(accountSid && authToken && fromNumber);
			checks.push({
				id: "twilio-voice-call-credentials",
				ok: twilioReady,
				message: twilioReady ? "Twilio voice-call credentials are configured" : "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER or configure voice-call Twilio credentials"
			});
			checks.push(getVoiceCallWebhookExposureCheck(voiceCallConfig));
		}
	}
	return createMeetingSetupStatus(checks);
}
function addGoogleMeetSetupCheck(status, check) {
	return addMeetingSetupCheck(status, check);
}
//#endregion
//#region extensions/google-meet/src/transports/chrome.ts
const chromeTransport = MeetingPlatformAdapter.createChromeTransportWithExternalAudio({
	browserNodeAdapter: GOOGLE_MEET_BROWSER_NODE_ADAPTER,
	isRealtimeRouteReady: (mode, health) => !MeetingPlatformAdapter.isTalkBackMode(mode) || MeetingPlatformAdapter.isRealtimeRouteReady(mode, health),
	isTalkBackMode: MeetingPlatformAdapter.isTalkBackMode,
	meetingLabel: "Google Meet",
	nodeCommandName: GOOGLE_MEET_NODE_COMMAND,
	platform: GOOGLE_MEET_PLATFORM_ADAPTER,
	preserveTrackedBrowserOnEngineFailure: false,
	startupFailurePolicy: "owned",
	runtime: MeetingPlatformAdapter.createChromeRuntimeBindings()
});
const assertGoogleMeetAudioAvailable = chromeTransport.assertAudioDeviceAvailable;
const launchChromeMeetOnNode = chromeTransport.launchOnNode;
async function launchChromeMeet(params) {
	const result = await chromeTransport.launchInChrome(params);
	return {
		...result,
		audioBridge: result.audioBridge
	};
}
function shouldCaptureCaptions(mode, fullConfig) {
	return mode === "transcribe" || !fullConfig || resolveTranscriptsConfig(fullConfig.transcripts).enabled;
}
function chromeNodeBrowserRequest(runtime, nodeId) {
	return async (request) => await callBrowserProxyOnNode({
		runtime,
		nodeId,
		method: request.method,
		path: request.path,
		body: request.body,
		timeoutMs: request.timeoutMs
	});
}
async function leaveChromeMeet(params) {
	const node = params.transport === "chrome-node" ? { nodeId: params.nodeId ?? await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	}) } : void 0;
	return await leaveMeetingWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: node ? chromeNodeBrowserRequest(params.runtime, node.nodeId) : await resolveLocalMeetingBrowserRequest(params.runtime),
		launch: params.config.chrome.launch,
		meetingSessionId: params.meetingSessionId,
		meetingUrl: params.meetingUrl,
		tab: params.tab,
		timeoutMs: params.config.chrome.joinTimeoutMs
	});
}
async function readChromeMeetTranscript(params) {
	const node = params.transport === "chrome-node" ? { nodeId: params.nodeId ?? await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	}) } : void 0;
	return await readMeetingTranscriptWithBrowser({
		adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
		callBrowser: node ? chromeNodeBrowserRequest(params.runtime, node.nodeId) : await resolveLocalMeetingBrowserRequest(params.runtime),
		finalize: params.finalize === true,
		meetingUrl: params.meetingUrl,
		meetingSessionId: params.meetingSessionId,
		tab: params.tab,
		timeoutMs: Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4)
	});
}
async function recoverCurrentMeetTab(params) {
	const node = params.transport === "chrome-node" ? { nodeId: await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	}) } : void 0;
	return {
		...node ? {
			transport: "chrome-node",
			nodeId: node.nodeId
		} : { transport: "chrome" },
		...await recoverMeetingBrowserTab({
			adapter: GOOGLE_MEET_PLATFORM_ADAPTER,
			callBrowser: node ? chromeNodeBrowserRequest(params.runtime, node.nodeId) : await resolveLocalMeetingBrowserRequest(params.runtime),
			captureCaptions: shouldCaptureCaptions(params.mode ?? "bidi", params.fullConfig),
			config: params.config.chrome,
			locationLabel: node ? "on the selected Chrome node" : "in local Chrome",
			mode: params.mode ?? "bidi",
			readOnly: params.readOnly,
			requestedMeetingUrl: params.url,
			trackedMeetingUrl: params.trackedMeetingUrl,
			trackedTargetId: params.trackedTargetId
		})
	};
}
//#endregion
//#region extensions/google-meet/src/runtime-setup.ts
function collectChromeAudioCommands(config) {
	const commands = config.chrome.audioBridgeCommand ? [config.chrome.audioBridgeCommand[0]] : [
		config.chrome.audioInputCommand?.[0],
		config.chrome.audioOutputCommand?.[0],
		config.chrome.bargeInInputCommand?.[0]
	];
	return uniqueStrings(commands.filter((value) => Boolean(value?.trim())));
}
async function commandExists(runtime, command) {
	return (await runtime.system.runCommandWithTimeout([
		"/bin/sh",
		"-lc",
		"command -v \"$1\" >/dev/null 2>&1",
		"sh",
		command
	], { timeoutMs: 5e3 })).code === 0;
}
async function getGoogleMeetRuntimeSetupStatus(params) {
	const options = params.options ?? {};
	const transport = options.transport ?? params.config.defaultTransport;
	const mode = options.mode === "realtime" ? "agent" : options.mode ?? params.config.defaultMode;
	const twilioDialInNumber = transport === "twilio" ? normalizeDialInNumber(options.dialInNumber) : void 0;
	const shouldCheckChromeNode = transport === "chrome-node" || !options.transport && Boolean(params.config.chromeNode.node);
	let status = getGoogleMeetSetupStatus(params.config, {
		fullConfig: params.fullConfig,
		mode,
		transport,
		twilioDialInNumber
	});
	if (shouldCheckChromeNode) try {
		const node = await resolveChromeNodeInfo({
			runtime: params.runtime,
			requestedNode: params.config.chromeNode.node
		});
		const label = node.displayName ?? node.remoteIp ?? node.nodeId ?? "connected node";
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-node-connected",
			ok: true,
			message: `Connected Google Meet node ready: ${label}`
		});
		if ((mode === "agent" || mode === "bidi") && node.nodeId) {
			const setup = await params.runtime.nodes.invoke({
				nodeId: node.nodeId,
				command: GOOGLE_MEET_NODE_COMMAND,
				params: {
					action: "setup",
					audioBackend: params.config.chrome.audioBackend,
					audioFormat: params.config.chrome.audioFormat,
					audioBufferBytes: params.config.chrome.audioBufferBytes,
					...params.config.chrome.audioInputCommandOverride ? { audioInputCommand: params.config.chrome.audioInputCommandOverride } : {},
					...params.config.chrome.audioOutputCommandOverride ? { audioOutputCommand: params.config.chrome.audioOutputCommandOverride } : {}
				},
				timeoutMs: 12e3
			});
			status = addGoogleMeetSetupCheck(status, {
				id: "chrome-node-audio-prerequisites",
				ok: true,
				message: setup ? "Remote virtual audio backend and command-pair prerequisites are ready" : "Remote audio setup completed"
			});
		}
	} catch (error) {
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-node-connected",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	if (transport !== "chrome" || mode !== "agent" && mode !== "bidi") return status;
	try {
		await assertGoogleMeetAudioAvailable({
			runtime: params.runtime,
			config: params.config,
			timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
		});
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: true,
			message: "Virtual meeting audio backend is ready"
		});
	} catch (error) {
		status = addGoogleMeetSetupCheck(status, {
			id: "chrome-local-audio-device",
			ok: false,
			message: formatErrorMessage(error)
		});
	}
	const commands = collectChromeAudioCommands(params.config);
	const missingCommands = [];
	for (const command of commands) try {
		if (!await commandExists(params.runtime, command)) missingCommands.push(command);
	} catch {
		missingCommands.push(command);
	}
	return addGoogleMeetSetupCheck(status, {
		id: "chrome-local-audio-commands",
		ok: commands.length > 0 && missingCommands.length === 0,
		message: commands.length === 0 ? "Chrome talk-back audio commands are not configured" : missingCommands.length === 0 ? `Chrome audio command${commands.length === 1 ? "" : "s"} available: ${commands.join(", ")}` : `Chrome audio command${missingCommands.length === 1 ? "" : "s"} missing: ${missingCommands.join(", ")}`
	});
}
//#endregion
//#region extensions/google-meet/src/voice-call-gateway.ts
const GOOGLE_MEET_VOICE_CALL_SURFACE = {
	clientDisplayName: "Google Meet plugin",
	configPath: "google-meet voiceCall.gatewayUrl",
	logScope: "[google-meet]",
	meetingLabel: "Meet",
	providerLabel: "Twilio"
};
async function createConnectedGatewayClient(params) {
	let client;
	const abortStart = new AbortController();
	let timer;
	try {
		await new Promise((resolve, reject) => {
			timer = setTimeout(() => {
				abortStart.abort();
				reject(/* @__PURE__ */ new Error("gateway connect timeout"));
			}, params.config.requestTimeoutMs);
			client = new GatewayClient({
				url: params.config.gatewayUrl,
				token: params.config.token,
				requestTimeoutMs: params.config.requestTimeoutMs,
				clientName: "cli",
				clientDisplayName: params.surface.clientDisplayName,
				scopes: ["operator.write"],
				onHelloOk: () => {
					clearTimeout(timer);
					resolve();
				},
				onConnectError: (error) => {
					clearTimeout(timer);
					abortStart.abort();
					reject(error);
				}
			});
			startGatewayClientWhenEventLoopReady(client, {
				timeoutMs: params.config.requestTimeoutMs,
				signal: abortStart.signal
			}).then((readiness) => {
				if (!readiness.ready && !readiness.aborted) {
					clearTimeout(timer);
					reject(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
				}
			}).catch((error) => {
				clearTimeout(timer);
				reject(error instanceof Error ? error : new Error(String(error)));
			});
		});
		return client;
	} catch (error) {
		clearTimeout(timer);
		abortStart.abort();
		await client?.stopAndWait().catch(() => {});
		throw error;
	}
}
function createVoiceCallGateway(params) {
	return createMeetingVoiceCallGateway({
		config: params.config.voiceCall,
		runtime: params.runtime,
		surface: GOOGLE_MEET_VOICE_CALL_SURFACE,
		connectClient: createConnectedGatewayClient
	});
}
const isVoiceCallMissingError = isMeetingVoiceCallMissingError;
async function joinMeetViaVoiceCallGateway(params) {
	return await joinMeetingViaVoiceCallGateway({
		...params,
		config: params.config.voiceCall,
		surface: GOOGLE_MEET_VOICE_CALL_SURFACE
	});
}
async function endMeetVoiceCallGatewayCall(params) {
	await endMeetingVoiceCallGatewayCall(params);
}
async function getMeetVoiceCallGatewayCall(params) {
	return await getMeetingVoiceCallGatewayCall(params);
}
async function speakMeetViaVoiceCallGateway(params) {
	await speakMeetingViaVoiceCallGateway(params);
}
//#endregion
//#region extensions/google-meet/src/runtime.ts
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
var GoogleMeetRuntime = class {
	#createdBrowserTabs;
	#voiceCallGateway;
	#sessions;
	reconcileTranscriptPolicy(enabled) {
		return this.#sessions.reconcileTranscriptPolicy(enabled);
	}
	constructor(params) {
		this.params = params;
		this.#createdBrowserTabs = /* @__PURE__ */ new Map();
		this.transcriptSourceRuntime = () => this.#sessions;
		const adapter = GOOGLE_MEET_PLATFORM_ADAPTER;
		this.#voiceCallGateway = createVoiceCallGateway(params);
		this.#sessions = new MeetingSessionRuntime({
			logger: params.logger,
			logScope: "[google-meet]",
			formatError: formatErrorMessage,
			reuseExistingBrowserTab: params.config.chrome.reuseExistingTab,
			waitForInCallMs: params.config.chrome.waitForInCallMs,
			joinTimeoutMs: params.config.chrome.joinTimeoutMs,
			defaultSpeechInstructions: params.config.realtime.introMessage,
			transientSpeechBlockedReasons: /* @__PURE__ */ new Set([
				"not-in-call",
				"browser-unverified",
				"meet-microphone-muted"
			]),
			messages: {
				previousBrowserLeaveFailed: "Could not leave the previous Meet browser tab before reassignment.",
				reassignedSessionNote: "Ended before the same Meet tab was reassigned to another agent.",
				reusedSessionNote: "Reused existing active Meet session.",
				replacementBrowserLeaveFailed: "Could not leave the previous Meet browser tab before reassignment.",
				speechBlockedFallback: "Realtime speech blocked until Google Meet is ready.",
				speech: {
					audioBridgeUnavailable: "Realtime speech requires an active Chrome audio bridge.",
					browserUnverified: "Google Meet browser state has not been verified yet.",
					microphoneMuted: "Turn on the OpenClaw Google Meet microphone before asking OpenClaw to speak.",
					microphoneMutedReason: "meet-microphone-muted",
					notInCall: "Google Meet has not reported that the browser participant is in the call.",
					notInCallReason: "not-in-call",
					browserUnverifiedReason: "browser-unverified",
					audioBridgeUnavailableReason: "audio-bridge-unavailable"
				}
			},
			resolveJoin: (request) => ({
				url: adapter.urls.validateAndNormalize(request.url),
				transport: resolveTransport(request.transport, params.config),
				mode: resolveMode(request.mode, params.config),
				agentId: this.#resolveAgentId(request.agentId)
			}),
			createSession: ({ resolved, createdAt }) => createMeetingSession({
				platform: adapter,
				config: params.config,
				resolved,
				createdAt
			}),
			resolveSpeechInstructions: (request) => request.message ?? params.config.realtime.introMessage,
			isBrowserTransport,
			isTalkBackMode: (mode) => MeetingPlatformAdapter.isTalkBackMode(mode),
			isTranscribeMode: (mode) => mode === "transcribe",
			sameMeetingUrl: (left, right) => adapter.urls.isSameMeeting(left, right),
			normalizeMeetingUrlForReuse: (url) => adapter.urls.normalizeForReuse(url),
			getBrowser: (session) => session.chrome ? {
				launched: session.chrome.launched,
				nodeId: session.chrome.nodeId,
				tab: session.chrome.browserTab,
				health: session.chrome.health,
				hasAudioBridge: Boolean(session.chrome.audioBridge)
			} : void 0,
			setBrowserTab: (session, tab) => {
				if (session.chrome) session.chrome.browserTab = tab;
			},
			setBrowserHealth: (session, health) => {
				if (session.chrome) session.chrome.health = health;
			},
			joinTransport: async ({ request, session, context }) => await this.#joinTransport(request, session, context),
			releaseBrowserTab: async (session) => await this.#releaseBrowserTab(session),
			refreshBrowserHealth: async (session, options) => await this.#refreshBrowserHealth(session, options),
			refreshStatus: async (session) => await this.#refreshStatus(session),
			refreshReusableSession: async (session, _request, _resolved) => {
				if (session.transport === "twilio") await this.#refreshTwilioVoiceCallStatus(session);
			},
			ensureRealtimeBridge: async (session) => await this.#ensureChromeRealtimeBridge(session),
			captureTranscript: async (session, options) => await this.#captureTranscript(session, options),
			speakViaTransport: async (session, instructions) => await this.#speakViaTransport(session, instructions),
			durableTranscripts: {
				config: params.fullConfig.transcripts,
				openclawConfig: params.fullConfig,
				providerId: "google-meet",
				providerName: "Google Meet"
			}
		});
	}
	list() {
		return this.#sessions.list();
	}
	async status(sessionId) {
		return await this.#sessions.status(sessionId);
	}
	async transcript(sessionId, options = {}) {
		return await this.#sessions.transcript(sessionId, options);
	}
	async setupStatus(options = {}) {
		return await getGoogleMeetRuntimeSetupStatus({
			config: this.params.config,
			fullConfig: this.params.fullConfig,
			runtime: this.params.runtime,
			options
		});
	}
	async createViaBrowser() {
		const result = await GOOGLE_MEET_PLATFORM_ADAPTER.create.browser({
			runtime: this.params.runtime,
			config: this.params.config
		});
		if (result.openedByPlugin && result.targetId) this.#createdBrowserTabs.set(`${result.nodeId}:${result.targetId}`, result.meetingUri);
		return result;
	}
	async recoverCurrentTab(request = {}) {
		const transport = resolveTransport(request.transport, this.params.config);
		if (transport === "twilio") throw new Error("recover_current_tab only supports chrome or chrome-node transports");
		const url = request.url ? GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(request.url) : void 0;
		return await recoverCurrentMeetTab({
			runtime: this.params.runtime,
			config: this.params.config,
			fullConfig: this.params.fullConfig,
			transport,
			url
		});
	}
	async join(request) {
		return await this.#sessions.join(request);
	}
	async leave(sessionId, options) {
		return await this.#sessions.leave(sessionId, options);
	}
	async speak(sessionId, instructions) {
		return await this.#sessions.speak(sessionId, instructions);
	}
	async testSpeech(request) {
		return await testGoogleMeetSpeech(this.#probeContext(), request);
	}
	async testListen(request) {
		return await testGoogleMeetListening(this.#probeContext(), request);
	}
	#probeContext() {
		return {
			config: this.params.config,
			resolveAgentId: (request) => this.#resolveAgentId(request.agentId),
			list: () => this.list(),
			join: async (request) => await this.join(request),
			isReusable: (session, resolved) => this.#sessions.isReusableSession(session, resolved),
			hasHealthHandle: (sessionId) => this.#sessions.hasHealthHandle(sessionId),
			refreshHealth: (sessionId) => this.#sessions.refreshHealth(sessionId),
			refreshCaptionHealth: async (session) => await this.#sessions.refreshCaptionHealth(session)
		};
	}
	#resolveAgentId(requestedAgentId) {
		return normalizeAgentId(requestedAgentId ?? this.params.config.realtime.agentId ?? resolveDefaultAgentId(this.params.fullConfig));
	}
	async #joinTransport(request, session, context) {
		if (isBrowserTransport(session.transport)) {
			const chromeConfig = withSessionAgentConfig(this.params.config, session.agentId);
			const result = await (session.transport === "chrome-node" ? launchChromeMeetOnNode : launchChromeMeet)({
				runtime: this.params.runtime,
				config: chromeConfig,
				fullConfig: this.params.fullConfig,
				meetingSessionId: session.id,
				requesterSessionKey: request.requesterSessionKey,
				mode: session.mode,
				url: session.url,
				logger: this.params.logger
			});
			const nodeId = "nodeId" in result ? result.nodeId : void 0;
			let tab = result.tab;
			const createdKey = session.transport === "chrome-node" && nodeId && tab ? `${nodeId}:${tab.targetId}` : void 0;
			const createdUrl = createdKey ? this.#createdBrowserTabs.get(createdKey) : void 0;
			if (createdKey) this.#createdBrowserTabs.delete(createdKey);
			if (tab && GOOGLE_MEET_PLATFORM_ADAPTER.urls.isSameMeeting(createdUrl, session.url)) tab = {
				...tab,
				openedByPlugin: true
			};
			tab = context.inheritedBrowserTab({
				session,
				transport: session.transport,
				nodeId,
				meetingUrl: session.url,
				tab
			});
			session.chrome = {
				audioBackend: result.audioBackend,
				launched: result.launched,
				nodeId,
				browserProfile: this.params.config.chrome.browserProfile,
				browserTab: tab,
				health: result.browser
			};
			const handles = this.#attachChromeAudioBridge(session, result.audioBridge);
			if (handles) context.attachRuntimeHandles(session, handles);
			session.notes.push(result.audioBridge ? session.transport === "chrome-node" ? "Chrome node transport joins as the signed-in Google profile on the selected node and routes realtime audio through the node bridge." : "Chrome transport joins as the signed-in Google profile and routes realtime audio through the configured bridge." : MeetingPlatformAdapter.isTalkBackMode(session.mode) ? "Chrome transport is waiting for verified virtual input/output audio routing." : "Chrome transport joins as the signed-in Google profile without starting the realtime audio bridge.");
			this.#sessions.refreshSpeechReadiness(session);
			return {};
		}
		const dialPlan = GOOGLE_MEET_PLATFORM_ADAPTER.dialIn.buildPlan({
			dialInNumber: request.dialInNumber,
			defaultDialInNumber: this.params.config.twilio.defaultDialInNumber,
			pin: request.pin,
			defaultPin: this.params.config.twilio.defaultPin,
			dtmfSequence: request.dtmfSequence,
			defaultDtmfSequence: this.params.config.twilio.defaultDtmfSequence,
			dtmfDelayMs: this.params.config.voiceCall.dtmfDelayMs
		});
		const dialInNumber = dialPlan.number;
		if (!dialInNumber) throw new Error("Twilio transport requires a Meet dial-in phone number. Google Meet URLs do not include dial-in details; pass dialInNumber with optional pin/dtmfSequence, configure twilio.defaultDialInNumber, or use chrome/chrome-node transport.");
		const dtmfSequence = dialPlan.dtmfSequence;
		const delegatedAgentId = Boolean(normalizeOptionalString(request.agentId) || normalizeOptionalString(this.params.config.realtime.agentId)) ? session.agentId : void 0;
		const voiceCallResult = this.params.config.voiceCall.enabled ? await joinMeetViaVoiceCallGateway({
			config: this.params.config,
			gateway: this.#voiceCallGateway,
			dialInNumber,
			dtmfSequence,
			logger: this.params.logger,
			...request.requesterSessionKey ? { requesterSessionKey: request.requesterSessionKey } : {},
			agentId: delegatedAgentId,
			sessionKey: delegatedAgentId ? `agent:${delegatedAgentId}:google-meet:${session.id}` : `voice:google-meet:${session.id}`,
			message: MeetingPlatformAdapter.isTalkBackMode(session.mode) ? request.message ?? this.params.config.voiceCall.introMessage ?? this.params.config.realtime.introMessage : void 0
		}) : void 0;
		session.twilio = {
			dialInNumber,
			pinProvided: Boolean(dialPlan.pin),
			dtmfSequence,
			voiceCallId: voiceCallResult?.callId,
			dtmfSent: voiceCallResult?.dtmfSent,
			introSent: voiceCallResult?.introSent
		};
		if (voiceCallResult?.callId) context.attachRuntimeHandles(session, { stop: async () => {
			await endMeetVoiceCallGatewayCall({
				gateway: this.#voiceCallGateway,
				callId: voiceCallResult.callId
			});
		} });
		session.notes.push(this.params.config.voiceCall.enabled ? dtmfSequence ? "Twilio transport delegated the phone leg to the voice-call plugin, then queued configured DTMF before realtime connect." : "Twilio transport delegated the call to the voice-call plugin without configured DTMF." : "Twilio transport is an explicit dial plan; voice-call delegation is disabled.");
		return { delegatedSpoken: Boolean(voiceCallResult?.introSent) };
	}
	#attachChromeAudioBridge(session, audioBridge) {
		if (!session.chrome || !audioBridge) return;
		session.chrome.audioBridge = {
			type: audioBridge.type,
			provider: audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair" ? audioBridge.providerId : void 0
		};
		return audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair" ? {
			stop: audioBridge.stop,
			speak: audioBridge.speak,
			getHealth: audioBridge.getHealth
		} : void 0;
	}
	async #ensureChromeRealtimeBridge(session) {
		if (!MeetingPlatformAdapter.isTalkBackMode(session.mode) || !isBrowserTransport(session.transport) || session.state !== "active" || !session.chrome || session.chrome.audioBridge || !MeetingPlatformAdapter.isRealtimeRouteReady(session.mode, session.chrome.health)) return;
		const config = withSessionAgentConfig(this.params.config, session.agentId);
		const recoveryConfig = {
			...config,
			chrome: {
				...config.chrome,
				launch: false
			},
			...session.chrome.nodeId ? { chromeNode: {
				...config.chromeNode,
				node: session.chrome.nodeId
			} } : {}
		};
		const result = await (session.transport === "chrome-node" ? launchChromeMeetOnNode : launchChromeMeet)({
			runtime: this.params.runtime,
			config: recoveryConfig,
			fullConfig: this.params.fullConfig,
			meetingSessionId: session.id,
			mode: session.mode,
			url: session.url,
			logger: this.params.logger
		});
		session.updatedAt = nowIso();
		return this.#attachChromeAudioBridge(session, result.audioBridge);
	}
	async #refreshBrowserHealth(session, options = {}) {
		try {
			const result = await recoverCurrentMeetTab({
				runtime: this.params.runtime,
				config: this.params.config,
				fullConfig: this.params.fullConfig,
				transport: session.transport === "chrome-node" ? "chrome-node" : "chrome",
				mode: session.mode,
				readOnly: options.readOnly,
				trackedMeetingUrl: session.url,
				trackedTargetId: session.chrome?.browserTab?.targetId,
				url: session.url
			});
			if (result.found && session.chrome) {
				if (result.targetId) {
					const currentTab = session.chrome.browserTab;
					session.chrome.browserTab = {
						targetId: result.targetId,
						openedByPlugin: result.targetId === currentTab?.targetId ? currentTab.openedByPlugin : false
					};
				}
				if (result.browser) session.chrome.health = {
					...session.chrome.health,
					...result.browser
				};
				session.updatedAt = nowIso();
			}
		} catch (error) {
			this.params.logger.debug?.(`[google-meet] browser readiness refresh ignored: ${formatErrorMessage(error)}`);
		}
	}
	async #refreshStatus(session) {
		if (isBrowserTransport(session.transport)) await this.#sessions.refreshBrowserHealth(session, {
			force: true,
			readOnly: true
		});
		else if (session.transport === "twilio") await this.#refreshTwilioVoiceCallStatus(session);
		else this.#sessions.refreshSpeechReadiness(session);
	}
	async #refreshTwilioVoiceCallStatus(session) {
		const callId = session.twilio?.voiceCallId;
		if (!callId || session.state !== "active") {
			this.#sessions.refreshSpeechReadiness(session);
			return;
		}
		try {
			const status = await getMeetVoiceCallGatewayCall({
				gateway: this.#voiceCallGateway,
				callId
			});
			const call = asOptionalRecord(status.call);
			if (status.found === false || call?.endedAt !== void 0 || call?.endReason !== void 0) this.#sessions.markSessionEnded(session, "Voice Call is no longer active.");
		} catch (error) {
			this.params.logger.debug?.(`[google-meet] voice-call status refresh ignored: ${formatErrorMessage(error)}`);
		}
		this.#sessions.refreshSpeechReadiness(session);
	}
	async #speakViaTransport(session, instructions) {
		if (session.transport !== "twilio" || !session.twilio?.voiceCallId) return;
		try {
			await speakMeetViaVoiceCallGateway({
				gateway: this.#voiceCallGateway,
				callId: session.twilio.voiceCallId,
				message: instructions || this.params.config.voiceCall.introMessage || this.params.config.realtime.introMessage || ""
			});
		} catch (error) {
			if (!isVoiceCallMissingError(error)) throw error;
			this.#sessions.markSessionEnded(session, "Voice Call is no longer active.");
			return {
				handled: true,
				spoken: false
			};
		}
		session.twilio.introSent = true;
		session.updatedAt = nowIso();
		return {
			handled: true,
			spoken: true
		};
	}
	async #captureTranscript(session, options = {}) {
		const tab = session.chrome?.browserTab;
		if (!tab) return;
		return await readChromeMeetTranscript({
			runtime: this.params.runtime,
			...session.transport === "chrome-node" ? {
				transport: "chrome-node",
				nodeId: session.chrome?.nodeId
			} : {},
			config: this.params.config,
			...options.finalize === void 0 ? {} : { finalize: options.finalize },
			meetingUrl: session.url,
			meetingSessionId: session.id,
			tab
		});
	}
	async #releaseBrowserTab(session) {
		if (!isBrowserTransport(session.transport)) return;
		const tab = session.chrome?.browserTab;
		if (!tab) {
			noteSession(session, "No tracked Meet browser tab for this session; close the Meet tab manually if it is still in the call.");
			session.browserLeft = false;
			return false;
		}
		if (this.list().some((other) => other.id !== session.id && other.state === "active" && isBrowserTransport(other.transport) && other.chrome?.browserTab?.targetId === tab.targetId && other.chrome?.nodeId === session.chrome?.nodeId)) {
			noteSession(session, "Kept the shared Meet tab open because another active session uses it.");
			session.browserLeft = void 0;
			return;
		}
		let left;
		try {
			const result = await leaveChromeMeet({
				runtime: this.params.runtime,
				...session.transport === "chrome-node" ? {
					transport: "chrome-node",
					nodeId: session.chrome?.nodeId
				} : {},
				config: this.params.config,
				meetingSessionId: session.id,
				meetingUrl: session.url,
				tab
			});
			noteSession(session, result.note);
			left = result.left;
		} catch (error) {
			noteSession(session, `Browser control could not leave the Meet tab: ${formatErrorMessage(error)}`);
			left = false;
		}
		if (session.chrome && left) {
			session.chrome.browserTab = void 0;
			if (session.chrome.health) session.chrome.health = {
				...session.chrome.health,
				captioning: false,
				audioOutputRouted: false,
				providerConnected: false,
				realtimeReady: false,
				audioInputActive: false,
				audioOutputActive: false
			};
		}
		session.browserLeft = left;
		return left;
	}
};
//#endregion
export { GoogleMeetRuntime };
