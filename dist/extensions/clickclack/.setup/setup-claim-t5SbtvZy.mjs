import { a as isClickClackSetupLoopbackHost, i as buildClickClackSetupClaimUrl, o as requireClickClackSetupApiBaseUrl } from "./setup-surface-BBl3rvVx.mjs";
import { withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { createProviderOperationDeadline, readProviderJsonResponse, readResponseTextLimited, resolveProviderOperationTimeoutMs } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, resolvePinnedHostnameWithPolicy, ssrfPolicyFromHttpBaseUrlAllowedHostname } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/clickclack/src/setup-claim.ts
const CLICKCLACK_ERROR_BODY_LIMIT_BYTES = 8192;
const CLICKCLACK_SETUP_CODE_CLAIM_JSON_LIMIT_BYTES = 65536;
const CLICKCLACK_SETUP_CODE_CLAIM_TIMEOUT_MS = 3e4;
var ClickClackSetupCodeClaimError = class extends Error {
	constructor(status, detail) {
		super(`ClickClack setup code claim failed (${status}): ${detail}`);
		this.status = status;
	}
};
function requireRecord(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`ClickClack setup code claim returned invalid ${label}`);
	return value;
}
function requireString(record, key, label) {
	const value = record[key];
	if (typeof value !== "string" || !value.trim()) throw new Error(`ClickClack setup code claim returned invalid ${label}.${key}`);
	return value;
}
function parseClickClackSetupCodeClaim(value, expectedClaimUrl) {
	const claim = requireRecord(value, "response");
	const bot = requireRecord(claim.bot, "bot");
	const workspace = requireRecord(claim.workspace, "workspace");
	const defaults = requireRecord(claim.defaults, "defaults");
	const defaultTo = defaults.defaultTo;
	const allowFrom = defaults.allowFrom;
	const agentActivity = defaults.agentActivity;
	if (defaultTo !== void 0 && typeof defaultTo !== "string") throw new Error("ClickClack setup code claim returned invalid defaults.defaultTo");
	if (allowFrom !== void 0 && (!Array.isArray(allowFrom) || !allowFrom.every((entry) => typeof entry === "string"))) throw new Error("ClickClack setup code claim returned invalid defaults.allowFrom");
	if (agentActivity !== void 0 && typeof agentActivity !== "boolean") throw new Error("ClickClack setup code claim returned invalid defaults.agentActivity");
	const contractVersion = claim.contract_version;
	const apiBaseUrlValue = claim.api_base_url;
	const hasContractMetadata = contractVersion !== void 0 || apiBaseUrlValue !== void 0;
	if (expectedClaimUrl && !hasContractMetadata) throw new Error("ClickClack setup code claim returned a legacy response for an exact endpoint");
	let contract = {};
	if (hasContractMetadata) {
		if (contractVersion !== 1 || typeof apiBaseUrlValue !== "string") throw new Error("ClickClack setup code claim returned invalid v1 contract metadata");
		const apiBaseUrl = requireClickClackSetupApiBaseUrl(apiBaseUrlValue, "setup code claim response.api_base_url");
		const canonicalClaimUrl = buildClickClackSetupClaimUrl(apiBaseUrl);
		if (expectedClaimUrl && expectedClaimUrl !== canonicalClaimUrl) throw new Error("ClickClack setup code claim returned an API base that does not match the claim URL");
		contract = {
			contract_version: 1,
			api_base_url: apiBaseUrl
		};
	}
	return {
		...contract,
		token: requireString(claim, "token", "response"),
		bot: {
			id: requireString(bot, "id", "bot"),
			handle: requireString(bot, "handle", "bot"),
			display_name: requireString(bot, "display_name", "bot")
		},
		workspace: {
			id: requireString(workspace, "id", "workspace"),
			route_id: requireString(workspace, "route_id", "workspace"),
			slug: requireString(workspace, "slug", "workspace"),
			name: requireString(workspace, "name", "workspace")
		},
		defaults: {
			...defaultTo !== void 0 ? { defaultTo } : {},
			...allowFrom !== void 0 ? { allowFrom } : {},
			...agentActivity !== void 0 ? { agentActivity } : {}
		}
	};
}
/** Claims a one-time setup code without sending any existing bot credential. */
async function claimClickClackSetupCode(params) {
	let parsedClaimUrl;
	try {
		parsedClaimUrl = new URL(params.claimUrl);
	} catch {
		throw new Error("ClickClack setup code claim URL must be a valid HTTP(S) endpoint.");
	}
	if (parsedClaimUrl.protocol !== "http:" && parsedClaimUrl.protocol !== "https:" || parsedClaimUrl.username || parsedClaimUrl.password || parsedClaimUrl.search || parsedClaimUrl.hash || !parsedClaimUrl.pathname.endsWith("/api/bot-setup-codes/claim")) throw new Error("ClickClack setup code claim URL must be a valid HTTP(S) endpoint.");
	const deadline = createProviderOperationDeadline({
		label: "ClickClack setup code claim",
		timeoutMs: CLICKCLACK_SETUP_CODE_CLAIM_TIMEOUT_MS
	});
	let pinnedHttpTarget;
	if (parsedClaimUrl.protocol === "http:") {
		const resolveTimeoutMs = resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: CLICKCLACK_SETUP_CODE_CLAIM_TIMEOUT_MS
		});
		const pinned = await withTimeout(resolvePinnedHostnameWithPolicy(parsedClaimUrl.hostname, {
			lookupFn: params.lookupFn,
			policy: { dangerouslyAllowPrivateNetwork: true }
		}), resolveTimeoutMs, { message: `ClickClack setup code claim timed out after ${CLICKCLACK_SETUP_CODE_CLAIM_TIMEOUT_MS}ms` });
		if (!pinned.addresses.every((address) => isClickClackSetupLoopbackHost(address))) throw new Error("ClickClack setup codes require HTTPS unless the server is on loopback.");
		pinnedHttpTarget = {
			hostname: pinned.hostname,
			addresses: pinned.addresses
		};
	}
	const { response, release } = await fetchWithSsrFGuard({
		url: params.claimUrl,
		fetchImpl: params.fetch,
		init: {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ code: params.code })
		},
		maxRedirects: 0,
		timeoutMs: resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: CLICKCLACK_SETUP_CODE_CLAIM_TIMEOUT_MS
		}),
		requireHttps: parsedClaimUrl.protocol === "https:",
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.claimUrl),
		lookupFn: params.lookupFn,
		...pinnedHttpTarget ? { dispatcherPolicy: {
			mode: "direct",
			pinnedHostname: pinnedHttpTarget
		} } : {},
		auditContext: "ClickClack setup code claim"
	});
	try {
		if (!response.ok) {
			const detail = await readResponseTextLimited(response, CLICKCLACK_ERROR_BODY_LIMIT_BYTES);
			throw new ClickClackSetupCodeClaimError(response.status, detail);
		}
		return parseClickClackSetupCodeClaim(await readProviderJsonResponse(response, "ClickClack setup code claim", { maxBytes: CLICKCLACK_SETUP_CODE_CLAIM_JSON_LIMIT_BYTES }), params.expectedClaimUrl);
	} finally {
		await release();
	}
}
//#endregion
export { claimClickClackSetupCode };
