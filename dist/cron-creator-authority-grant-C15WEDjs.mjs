import { O as validateAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { r as normalizeCronScheduledToolCallerOrigin } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { a as cloneCronRuntimeAuthority, t as normalizeCronAuthenticatedChannelRequester } from "./tools-allow-provenance-CBVsstVi.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
//#region src/gateway/cron-creator-authority-grant.ts
const CRON_MANAGEMENT_METHODS = [
	"cron.list",
	"cron.get",
	"cron.update",
	"cron.run",
	"cron.remove"
];
const activeManagement = new AsyncLocalStorage();
const grantsByToken = /* @__PURE__ */ new Map();
const channelRequestersByScope = /* @__PURE__ */ new WeakMap();
function expiredAuthorityError() {
	return Object.assign(/* @__PURE__ */ new TypeError("Configured MCP cron authority is no longer active for this run. Retry the automation mutation from a fresh authenticated creator turn."), {
		name: "CronCreatorAuthorityExpiredError",
		status: 403
	});
}
function createCronCreatorAuthorityRunScope(runId, callerOrigin = { kind: "unknown" }, managementEntitlement, isCurrent, channelRequester, requesterOwner, callerScopedCreation) {
	const abortController = new AbortController();
	const requester = normalizeCronAuthenticatedChannelRequester(channelRequester);
	const scope = {
		runId,
		callerOrigin: normalizeCronScheduledToolCallerOrigin(callerOrigin),
		signal: abortController.signal,
		grantTokens: /* @__PURE__ */ new Set(),
		...managementEntitlement ? { managementEntitlement } : {},
		...requesterOwner ? { requesterOwner } : {},
		...callerScopedCreation ? { callerScopedCreation } : {},
		get controlUiAdmin() {
			return managementEntitlement?.source === "control-ui-admin" ? true : void 0;
		},
		...isCurrent ? { isCurrent } : {},
		active: true,
		abort: () => abortController.abort(expiredAuthorityError())
	};
	if (requester) channelRequestersByScope.set(scope, Object.freeze(requester));
	return scope;
}
/** Keeps native identity out of the capability transported through harness contracts. */
function hasCronChannelRequester(scope) {
	return channelRequestersByScope.has(scope);
}
function hasCronAuthenticatedRequester(scope) {
	return scope.callerOrigin.kind === "local" || hasCronChannelRequester(scope) || scope.callerScopedCreation === true;
}
function mintCronCreatorAuthorityGrant(scope, operationSignal, runtimeAuthority, management, capture = "runtime", isCurrent) {
	if (!scope.active || scope.signal.aborted || operationSignal?.aborted || scope.isCurrent?.() === false || isCurrent?.() === false || scope.managementEntitlement?.source === "channel-owner" && !scope.managementEntitlement.isCurrent()) throw management ? expiredManagementError() : expiredAuthorityError();
	if (!management && scope.managementEntitlement && scope.callerOrigin.kind === "unknown" && !(capture === "requester" && scope.callerScopedCreation)) throw new TypeError("Automation creation is not granted to this turn. Use the Automations page to create an automation.");
	if (capture === "requester" && (!hasCronAuthenticatedRequester(scope) || runtimeAuthority || management)) throw new TypeError("requester-only cron authority requires authenticated creator facts");
	if (management && (!scope.managementEntitlement || !CRON_MANAGEMENT_METHODS.some((method) => method === management.method) || management.authority.operationalRunInstance.runId !== scope.runId || !validateAgentRunDelegatedAuthority(management.authority))) throw expiredManagementError();
	const token = randomBytes(32).toString("base64url");
	const normalizedRuntimeAuthority = runtimeAuthority ? cloneCronRuntimeAuthority(runtimeAuthority) : void 0;
	if (runtimeAuthority && !normalizedRuntimeAuthority) throw new TypeError("cron creator runtime authority is invalid");
	const entry = {
		scope,
		capturesRuntimeAuthority: capture === "runtime",
		...isCurrent ? { isCurrent } : {},
		operationSignal,
		...normalizedRuntimeAuthority ? { runtimeAuthority: normalizedRuntimeAuthority } : {},
		...management ? { management: {
			...management,
			expiresAtMs: Date.now() + 6e4
		} } : {}
	};
	if (operationSignal) entry.onOperationAbort = () => revokeCronCreatorAuthorityGrant(token);
	grantsByToken.set(token, entry);
	scope.grantTokens.add(token);
	if (operationSignal && entry.onOperationAbort) operationSignal.addEventListener("abort", entry.onOperationAbort, { once: true });
	return Object.freeze({
		runId: scope.runId,
		token
	});
}
/** Reads private capture facts only for the same live, authenticated run. */
function resolveCronCreatorAuthorityGrantProvenance(grant, runId) {
	const entry = grantsByToken.get(grant.token);
	const scope = entry?.scope;
	if (!entry || !scope || entry.management || !scope.active || scope.signal.aborted || entry.operationSignal?.aborted || entry.isCurrent?.() === false || scope.isCurrent?.() === false || scope.managementEntitlement?.source === "channel-owner" && !scope.managementEntitlement.isCurrent() || scope.runId !== grant.runId || scope.runId !== runId) return;
	const channelRequester = channelRequestersByScope.get(scope);
	return {
		capturesRuntimeAuthority: entry.capturesRuntimeAuthority,
		...scope.callerOrigin.kind === "local" ? { callerOrigin: { kind: "local" } } : {},
		...channelRequester ? { channelRequester: { ...channelRequester } } : {}
	};
}
/** A requester grant proves identity without claiming a complete executable surface. */
function hasCronCreatorGrantProvenance(input, runId) {
	if (!input.cronCreatorAuthorityGrant || input.cronToolsAllowCapture === "final-executable-surface") return true;
	const provenance = resolveCronCreatorAuthorityGrantProvenance(input.cronCreatorAuthorityGrant, runId);
	return Boolean(provenance?.callerOrigin || provenance?.channelRequester);
}
function revokeCronCreatorAuthorityGrant(token) {
	const entry = grantsByToken.get(token);
	if (!entry) return;
	grantsByToken.delete(token);
	entry.scope.grantTokens.delete(token);
	if (entry.operationSignal && entry.onOperationAbort) entry.operationSignal.removeEventListener("abort", entry.onOperationAbort);
}
function revokeCronCreatorAuthorityRunScope(scope) {
	if (!scope.active) return;
	scope.active = false;
	scope.abort();
	channelRequestersByScope.delete(scope);
	for (const token of scope.grantTokens) revokeCronCreatorAuthorityGrant(token);
}
/** Consumes one live exact-run grant synchronously at the cron commit boundary. */
function consumeCronCreatorAuthorityGrant(grant) {
	const runId = grant.runId.trim();
	const token = grant.token.trim();
	const entry = token ? grantsByToken.get(token) : void 0;
	if (!entry) throw expiredAuthorityError();
	const scope = entry.scope;
	const issuerIsCurrent = entry.isCurrent?.() !== false;
	if (entry.management || !scope.active || scope.signal.aborted || entry.operationSignal?.aborted || !issuerIsCurrent || scope.isCurrent?.() === false || scope.managementEntitlement?.source === "channel-owner" && !scope.managementEntitlement.isCurrent() || scope.runId !== runId) {
		if (!scope.active || scope.signal.aborted || entry.operationSignal?.aborted || !issuerIsCurrent) revokeCronCreatorAuthorityGrant(token);
		throw expiredAuthorityError();
	}
	revokeCronCreatorAuthorityGrant(token);
	return entry.runtimeAuthority ? cloneCronRuntimeAuthority(entry.runtimeAuthority) : void 0;
}
function expiredManagementError() {
	return /* @__PURE__ */ new TypeError("Automation admin grant is missing, expired, or already used. Retry from a fresh authenticated configured channel owner or Control UI administrator turn, or use the Automations page.");
}
/** Redeem once, retaining the exact operational owner through every await and commit. */
async function withCronManagementGrant(grant, identity, method, run) {
	const entry = grantsByToken.get(grant.token);
	const management = entry?.management;
	const authority = identity.delegatedAuthority;
	if (!entry || !management || management.method !== method || grant.runId !== entry.scope.runId || management.authority.operationalRunInstance.instanceId !== identity.operationalRunInstance.instanceId || management.authority.operationalRunInstance.runId !== identity.operationalRunInstance.runId || management.authority.lifecycleGeneration !== authority.lifecycleGeneration || management.authority.claimId !== authority.claimId) throw expiredManagementError();
	revokeCronCreatorAuthorityGrant(grant.token);
	const assertActive = () => {
		if (!entry.scope.active || entry.scope.signal.aborted || entry.operationSignal?.aborted || entry.scope.isCurrent?.() === false || entry.scope.managementEntitlement?.source === "channel-owner" && !entry.scope.managementEntitlement.isCurrent() || Date.now() >= management.expiresAtMs || !validateAgentRunDelegatedAuthority(management.authority)) throw expiredManagementError();
	};
	assertActive();
	return await activeManagement.run({
		identity,
		assertActive,
		...entry.scope.callerOrigin.kind === "local" ? { callerOrigin: { kind: "local" } } : {},
		channelRequester: channelRequestersByScope.get(entry.scope)
	}, run);
}
function getCronManagementAuthority(identity) {
	const management = activeManagement.getStore();
	return management?.identity === identity ? management.assertActive : void 0;
}
function getCronManagementChannelRequester(identity) {
	const management = activeManagement.getStore();
	if (management?.identity !== identity) return;
	management.assertActive();
	return management.channelRequester ? { ...management.channelRequester } : void 0;
}
function getCronManagementCallerOrigin(identity) {
	const management = activeManagement.getStore();
	if (management?.identity !== identity) return;
	management.assertActive();
	return management.callerOrigin ? { ...management.callerOrigin } : void 0;
}
//#endregion
export { getCronManagementCallerOrigin as a, hasCronCreatorGrantProvenance as c, revokeCronCreatorAuthorityRunScope as d, withCronManagementGrant as f, getCronManagementAuthority as i, mintCronCreatorAuthorityGrant as l, consumeCronCreatorAuthorityGrant as n, getCronManagementChannelRequester as o, createCronCreatorAuthorityRunScope as r, hasCronChannelRequester as s, CRON_MANAGEMENT_METHODS as t, resolveCronCreatorAuthorityGrantProvenance as u };
