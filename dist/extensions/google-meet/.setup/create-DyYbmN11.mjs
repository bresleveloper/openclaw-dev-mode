import { g as __exportAll, o as resolveGoogleMeetTokenFromParams, u as createGoogleMeetSpace } from "./plugin-helpers-D1OyyzEZ.mjs";
import { d as normalizeMode, f as normalizeTransport } from "./plugin-registration-BP83dqMw.mjs";
import { t as createMeetWithBrowserProxyOnNode } from "./chrome-create-Bh1L33pr.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/google-meet/src/create.ts
var create_exports = /* @__PURE__ */ __exportAll({
	createAndJoinMeetFromParams: () => createAndJoinMeetFromParams,
	createMeetFromParams: () => createMeetFromParams,
	hasCreateSpaceConfigInput: () => hasCreateSpaceConfigInput,
	resolveCreateSpaceConfig: () => resolveCreateSpaceConfig
});
function normalizeGoogleMeetAccessType(value) {
	const normalized = normalizeOptionalString(value)?.toUpperCase().replaceAll("-", "_");
	return normalized === "OPEN" || normalized === "TRUSTED" || normalized === "RESTRICTED" ? normalized : void 0;
}
function normalizeGoogleMeetEntryPointAccess(value) {
	const normalized = normalizeOptionalString(value)?.toUpperCase().replaceAll("-", "_");
	return normalized === "ALL" || normalized === "CREATOR_APP_ONLY" ? normalized : void 0;
}
function resolveCreateSpaceConfig(raw) {
	const rawAccessType = normalizeOptionalString(raw.accessType);
	const rawEntryPointAccess = normalizeOptionalString(raw.entryPointAccess);
	const accessType = normalizeGoogleMeetAccessType(raw.accessType);
	const entryPointAccess = normalizeGoogleMeetEntryPointAccess(raw.entryPointAccess);
	if (rawAccessType !== void 0 && !accessType) throw new Error("Invalid Google Meet accessType. Expected OPEN, TRUSTED, or RESTRICTED.");
	if (rawEntryPointAccess !== void 0 && !entryPointAccess) throw new Error("Invalid Google Meet entryPointAccess. Expected ALL or CREATOR_APP_ONLY.");
	const config = {
		...accessType ? { accessType } : {},
		...entryPointAccess ? { entryPointAccess } : {}
	};
	return Object.keys(config).length > 0 ? config : void 0;
}
function hasCreateSpaceConfigInput(raw) {
	return normalizeOptionalString(raw.accessType) !== void 0 || normalizeOptionalString(raw.entryPointAccess) !== void 0;
}
async function createSpaceFromParams(config, raw) {
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	return {
		source: "api",
		token,
		...await createGoogleMeetSpace({
			accessToken: token.accessToken,
			config: resolveCreateSpaceConfig(raw)
		})
	};
}
function hasGoogleMeetOAuth(config, raw) {
	return Boolean(normalizeOptionalString(raw.accessToken) ?? normalizeOptionalString(raw.refreshToken) ?? config.oauth.accessToken ?? config.oauth.refreshToken);
}
async function createMeetFromParams(params) {
	if (hasGoogleMeetOAuth(params.config, params.raw)) {
		const { token: _token, ...result } = await createSpaceFromParams(params.config, params.raw);
		return {
			...result,
			joined: false,
			nextAction: "URL-only creation was requested. Call google_meet with action=join and url=meetingUri to enter the meeting."
		};
	}
	if (hasCreateSpaceConfigInput(params.raw)) throw new Error("Google Meet access policy options require OAuth/API room creation. Configure Google Meet OAuth or remove accessType/entryPointAccess.");
	const browser = await createMeetWithBrowserProxyOnNode({
		runtime: params.runtime,
		config: params.config
	});
	return {
		source: browser.source,
		meetingUri: browser.meetingUri,
		joined: false,
		nextAction: "URL-only creation was requested. Call google_meet with action=join and url=meetingUri to enter the meeting.",
		space: {
			name: `browser/${browser.meetingUri.split("/").pop()}`,
			meetingUri: browser.meetingUri
		},
		browser: {
			nodeId: browser.nodeId,
			targetId: browser.targetId,
			browserUrl: browser.browserUrl,
			browserTitle: browser.browserTitle,
			notes: browser.notes
		}
	};
}
async function createAndJoinMeetFromParams(params) {
	const created = await createMeetFromParams(params);
	const join = await (await params.ensureRuntime()).join({
		url: created.meetingUri,
		transport: normalizeTransport(params.raw.transport),
		mode: normalizeMode(params.raw.mode),
		dialInNumber: normalizeOptionalString(params.raw.dialInNumber),
		pin: normalizeOptionalString(params.raw.pin),
		dtmfSequence: normalizeOptionalString(params.raw.dtmfSequence),
		message: normalizeOptionalString(params.raw.message),
		requesterSessionKey: normalizeOptionalString(params.raw.requesterSessionKey),
		agentId: normalizeOptionalString(params.raw.agentId)
	});
	return {
		...created,
		joined: true,
		nextAction: "Share meetingUri with participants; the OpenClaw agent has started the join flow.",
		join
	};
}
//#endregion
export { hasCreateSpaceConfigInput as n, resolveCreateSpaceConfig as r, create_exports as t };
