import { n as GOOGLE_MEET_NODE_COMMAND, r as GoogleMeetBrowserManualActionError } from "./google-meet-platform-constants-CnRfrYX7.mjs";
import { i as resolveGoogleMeetGatewayOperationTimeoutMs } from "./config-BXGAMntj.mjs";
import { asNonArrayRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/google-meet/src/plugin-registration.ts
const loadGoogleMeetPluginHelpers = createLazyRuntimeModule(() => import("./plugin-helpers-D1OyyzEZ.mjs").then((n) => n.i));
const loadGoogleMeetCliModule = createLazyRuntimeModule(() => import("./cli-Bfm5LpNM.mjs"));
const loadGoogleMeetCreateModule = createLazyRuntimeModule(() => import("./create-DyYbmN11.mjs").then((n) => n.t));
const loadGoogleMeetNodeHostModule = createLazyRuntimeModule(() => import("./node-host-CyFclhO_.mjs"));
const loadGoogleMeetRuntimeModule = createLazyRuntimeModule(() => import("./runtime-DQgxZ2Na.mjs"));
const loadGoogleMeetNodeInvokePolicyModule = createLazyRuntimeModule(() => import("./node-invoke-policy-BnX3PaH7.mjs"));
const loadGoogleMeetGatewayRuntimeModule = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/gateway-runtime"));
const loadGoogleMeetNodeInvokePolicy = async (config) => (await loadGoogleMeetNodeInvokePolicyModule()).createGoogleMeetChromeNodeInvokePolicy(config);
function normalizeTransport(value) {
	return value === "chrome" || value === "chrome-node" || value === "twilio" ? value : void 0;
}
function normalizeMode(value) {
	if (value === "realtime") return "agent";
	return value === "agent" || value === "bidi" || value === "transcribe" ? value : void 0;
}
function resolveMeetingInput(config, value) {
	const meeting = normalizeOptionalString(value) ?? config.defaults.meeting;
	if (!meeting) throw new Error("Meeting input is required");
	return meeting;
}
function shouldJoinCreatedMeet(raw) {
	return raw.join !== false && raw.join !== "false";
}
const googleMeetToolDeps = { platform: () => process.platform };
const googleMeetGatewayMethods = {
	participation_context: "googlemeet.participationContext",
	recover_current_tab: "googlemeet.recoverCurrentTab",
	setup_status: "googlemeet.setup",
	test_speech: "googlemeet.testSpeech",
	test_listen: "googlemeet.testListen",
	end_active_conference: "googlemeet.endActiveConference"
};
function readGoogleMeetParticipationParams(raw) {
	const sessionId = normalizeOptionalString(raw.sessionId);
	if (!sessionId) throw new Error("sessionId required");
	const requestId = normalizeOptionalString(raw.requestId);
	if (!requestId) throw new Error("requestId required");
	for (const name of ["sourceId", "correctionOf"]) if (raw[name] !== void 0 && !normalizeOptionalString(raw[name])) throw new Error(`${name} must be a non-empty string`);
	const action = asNonArrayRecord(raw.participationAction);
	const type = normalizeOptionalString(action.type);
	if (!type) throw new Error("participationAction.type required");
	for (const name of ["text", "reaction"]) if (action[name] !== void 0 && typeof action[name] !== "string") throw new Error(`participationAction.${name} must be a string`);
	return {
		sessionId,
		request: {
			requestId,
			...raw.sourceId !== void 0 ? { sourceId: normalizeOptionalString(raw.sourceId) } : {},
			...raw.correctionOf !== void 0 ? { correctionOf: normalizeOptionalString(raw.correctionOf) } : {},
			action: {
				...action,
				type
			}
		}
	};
}
function assertGoogleMeetAgentToolActionSupported(params) {
	const platform = googleMeetToolDeps.platform();
	if (platform === "darwin" || platform === "linux") return;
	const action = params.raw.action;
	if (action !== "join" && action !== "test_speech" && !(action === "create" && shouldJoinCreatedMeet(params.raw))) return;
	const transport = normalizeTransport(params.raw.transport) ?? params.config.defaultTransport;
	const mode = action === "test_speech" ? "agent" : normalizeMode(params.raw.mode) ?? params.config.defaultMode;
	if (transport !== "chrome" || mode !== "agent" && mode !== "bidi") return;
	throw new Error("Google Meet local Chrome talk-back audio requires macOS with BlackHole 2ch or Linux with PipeWire-Pulse. On this host, use mode: transcribe, transport: twilio, or a supported chrome-node.");
}
async function callGoogleMeetGatewayFromTool(params) {
	const method = googleMeetGatewayMethods[params.action] ?? `googlemeet.${params.action}`;
	try {
		if (params.runtime) return await params.runtime.gateway.request(method, params.raw, {
			timeoutMs: resolveGoogleMeetGatewayOperationTimeoutMs(params.config),
			scopes: ["operator.admin"]
		});
		return await (googleMeetToolDeps.callGatewayFromCli ?? (await loadGoogleMeetGatewayRuntimeModule()).callGatewayFromCli)(method, {
			json: true,
			timeout: String(resolveGoogleMeetGatewayOperationTimeoutMs(params.config))
		}, params.raw, {
			progress: false,
			scopes: ["operator.admin"]
		});
	} catch (err) {
		const details = err && typeof err === "object" && "details" in err ? err.details : void 0;
		if (details && typeof details === "object") return details;
		throw err;
	}
}
function keepTrustedToolAgentId(raw, client) {
	const { agentId: rawAgentId, ...rest } = raw;
	if (client?.internal?.pluginRuntimeOwnerId !== "google-meet") return rest;
	const agentId = normalizeOptionalString(rawAgentId);
	return agentId ? {
		...rest,
		agentId
	} : rest;
}
function createGoogleMeetRuntimeAccessor(params) {
	let transcriptsEnabled = params.api.config.transcripts?.enabled !== false;
	let runtime;
	let runtimePromise;
	params.api.registerService({
		id: "google-meet-transcripts",
		reload: { configPrefixes: ["transcripts.enabled"] },
		start: ({ config }) => {
			transcriptsEnabled = config.transcripts?.enabled !== false;
			return runtime?.reconcileTranscriptPolicy(transcriptsEnabled);
		},
		stop: () => {
			transcriptsEnabled = false;
			return runtime?.reconcileTranscriptPolicy(false);
		}
	});
	return async () => {
		if (!params.config.enabled) throw new Error("Google Meet plugin disabled in plugin config");
		runtimePromise ??= loadGoogleMeetRuntimeModule().then(async ({ GoogleMeetRuntime: Runtime }) => {
			runtime = new Runtime({
				config: params.config,
				fullConfig: params.api.config,
				runtime: params.api.runtime,
				logger: params.api.logger
			});
			await runtime.reconcileTranscriptPolicy(transcriptsEnabled);
			return runtime;
		});
		return await runtimePromise;
	};
}
function createLazyGoogleMeetNodeInvokePolicy(config, loadPolicy = loadGoogleMeetNodeInvokePolicy) {
	let policyPromise;
	return {
		commands: [GOOGLE_MEET_NODE_COMMAND],
		dangerous: true,
		async handle(ctx) {
			let policy;
			try {
				policyPromise ??= loadPolicy(config);
				policy = await policyPromise;
			} catch (error) {
				return {
					ok: false,
					code: "PLUGIN_POLICY_UNAVAILABLE",
					message: `google-meet PLUGIN_POLICY_UNAVAILABLE: node.invoke policy unavailable: ${formatErrorMessage(error)}`,
					unavailable: true
				};
			}
			return await policy.handle(ctx);
		}
	};
}
function formatGoogleMeetGatewayError(err) {
	return err instanceof GoogleMeetBrowserManualActionError ? err.payload : { error: formatErrorMessage(err) };
}
function sendGoogleMeetGatewayError(respond, err, code = "UNAVAILABLE") {
	const payload = formatGoogleMeetGatewayError(err);
	respond(false, payload, {
		code,
		message: typeof payload.error === "string" ? payload.error : "Google Meet request failed",
		details: payload
	});
}
//#endregion
export { formatGoogleMeetGatewayError as a, loadGoogleMeetCreateModule as c, normalizeMode as d, normalizeTransport as f, shouldJoinCreatedMeet as g, sendGoogleMeetGatewayError as h, createLazyGoogleMeetNodeInvokePolicy as i, loadGoogleMeetNodeHostModule as l, resolveMeetingInput as m, callGoogleMeetGatewayFromTool as n, keepTrustedToolAgentId as o, readGoogleMeetParticipationParams as p, createGoogleMeetRuntimeAccessor as r, loadGoogleMeetCliModule as s, assertGoogleMeetAgentToolActionSupported as t, loadGoogleMeetPluginHelpers as u };
