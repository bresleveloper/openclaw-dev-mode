import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as createTrustedCronScheduledToolPolicy, t as createAccountCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { n as bindGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { n as resolveCronJobEffectiveAgentId, r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { a as getCronManagementCallerOrigin, d as resolveCronCreatorAuthorityGrantProvenance, i as getCronManagementAuthority, n as consumeCronCreatorAuthorityGrant, o as getCronManagementChannelRequester } from "./cron-creator-authority-grant-BdRpVx3w.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-B3KjbGu2.mjs";
//#region src/gateway/server-methods/cron-caller-scope.ts
function resolveCronCreatorAuthorityCapture(callerScope) {
	const grant = callerScope?.cronCreatorAuthorityGrant;
	if (!grant) return;
	if (resolveCronCreatorAuthorityGrantProvenance(grant, grant.runId)?.capturesRuntimeAuthority === false) return;
	if (callerScope.toolsAllowProvenance?.source !== "final-executable-surface") throw new TypeError("cron creator authority grant is missing tool-surface provenance");
	let consumed;
	return {
		captureRuntimeAuthority() {
			consumed = consumeCronCreatorAuthorityGrant(grant);
			return consumed.authority;
		},
		assertCurrent() {
			consumed?.assertCurrent();
		}
	};
}
function resolveCronMutationCommitGuard(client, context, jobScope, callerAuthority) {
	const validatesAuthority = client?.internal?.agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority;
	const identity = client?.internal?.agentRuntimeIdentity;
	const manageAll = identity ? getCronManagementAuthority(identity) : void 0;
	const creatorGrant = identity?.cronCreatorAuthorityGrant;
	const requesterGrant = creatorGrant && identity && resolveCronCreatorAuthorityGrantProvenance(creatorGrant, identity.operationalRunInstance.runId)?.capturesRuntimeAuthority === false ? creatorGrant : void 0;
	if (!validatesAuthority && !jobScope?.callerScope && !manageAll && !requesterGrant && !callerAuthority?.sessionMutationCommitGuard && !callerAuthority?.hasCurrentClientAuthority) return;
	let consumedRequester;
	return bindGatewayDeviceRevocation(() => {
		callerAuthority?.sessionMutationCommitGuard?.();
		if (callerAuthority?.hasCurrentClientAuthority?.() === false) throw new TypeError("Gateway caller authority is no longer active.");
		manageAll?.();
		if (validatesAuthority) assertActiveAgentRuntimeAuthority(client, context);
		if (jobScope?.callerScope) {
			const callerScope = readCronCallerScope(client);
			const job = context.cron.getJob(jobScope.jobId);
			if (!callerScope || !job || jobScope.expectedConfigRevision !== void 0 && resolveCronJobConfigRevision(job) !== jobScope.expectedConfigRevision || !cronJobMatchesCallerScope({
				job,
				callerScope,
				defaultAgentId: context.cron.getDefaultAgentId(),
				allowCurrentJob: jobScope.allowCurrentJob
			})) throw new TypeError(`unknown cron job id: ${jobScope.jobId}`);
		}
		if (requesterGrant) {
			if (consumedRequester) consumedRequester.assertCurrent();
			else consumedRequester = consumeCronCreatorAuthorityGrant(requesterGrant);
		}
	}, callerAuthority?.hasCurrentClientAuthority);
}
function readCronCallerScope(client) {
	const identity = client?.internal?.agentRuntimeIdentity;
	if (!identity?.agentId) return;
	const cronSelfManagementContext = identity.cronSelfManagementContext;
	const currentJobId = cronSelfManagementContext && Date.now() < cronSelfManagementContext.expiresAtMs ? cronSelfManagementContext.jobId.trim() || void 0 : void 0;
	const sourceChannel = identity.turnSourceChannel?.trim().toLowerCase();
	const manageAll = getCronManagementAuthority(identity);
	const fallbackCallerOrigin = sourceChannel ? {
		kind: "external",
		channel: sourceChannel
	} : identity.turnSourceLocal === true ? { kind: "local" } : { kind: "unknown" };
	const grantProvenance = identity.cronCreatorAuthorityGrant ? resolveCronCreatorAuthorityGrantProvenance(identity.cronCreatorAuthorityGrant, identity.operationalRunInstance.runId) : void 0;
	const requester = manageAll ? getCronManagementChannelRequester(identity) : grantProvenance?.channelRequester;
	const authenticatedCallerOrigin = manageAll ? getCronManagementCallerOrigin(identity) : grantProvenance?.callerOrigin;
	const callerOrigin = authenticatedCallerOrigin ?? fallbackCallerOrigin;
	const channelRequester = requester && requester.channel === sourceChannel && requester.accountId === normalizeAccountId(identity.turnSourceAccountId) ? requester : void 0;
	const surfaceProvenance = identity.cronToolsAllowCapture === "final-executable-surface" ? {
		version: 1,
		source: "final-executable-surface",
		callerOrigin
	} : void 0;
	const authenticatedRequesterProvenance = authenticatedCallerOrigin ? {
		version: 1,
		source: "authenticated-requester",
		callerOrigin: authenticatedCallerOrigin,
		...channelRequester ? { channelRequester } : {}
	} : channelRequester ? {
		version: 1,
		source: "authenticated-requester",
		channelRequester
	} : void 0;
	const toolsAllowProvenance = surfaceProvenance ? {
		...surfaceProvenance,
		...channelRequester ? { channelRequester } : {}
	} : authenticatedRequesterProvenance;
	return {
		kind: "agentTool",
		agentId: normalizeAgentId(identity.agentId),
		sessionKey: identity.sessionKey?.trim() || void 0,
		accountId: normalizeAccountId(identity.turnSourceAccountId),
		currentJobId,
		manageAll,
		...toolsAllowProvenance ? { toolsAllowProvenance } : {},
		...surfaceProvenance && identity.cronExecToolTarget?.host === "gateway" ? { toolsAllowExecTarget: {
			version: 1,
			...identity.cronExecToolTarget
		} } : {},
		...identity.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: identity.cronCreatorAuthorityGrant } : {}
	};
}
/** Management access can reauthorize origin, but cannot lend another account native identity. */
function resolveCronRequesterProvenanceForJob(job, callerScope) {
	const provenance = callerScope?.toolsAllowProvenance;
	if (!provenance?.channelRequester) return provenance;
	if (job.owner?.sessionKey === callerScope?.sessionKey && normalizeAccountId(job.owner?.accountId) === callerScope?.accountId) return provenance;
	if (provenance.source === "final-executable-surface") {
		const { channelRequester: _requester, ...surfaceProvenance } = provenance;
		return surfaceProvenance;
	}
	return provenance.callerOrigin ? {
		version: 1,
		source: "authenticated-requester",
		callerOrigin: provenance.callerOrigin
	} : void 0;
}
/** Converts the authenticated gateway caller into server-only scheduled authority provenance. */
function resolveCronScheduledToolPolicyForCaller(callerScope) {
	if (!callerScope) return createTrustedCronScheduledToolPolicy();
	const policy = callerScope.sessionKey ? createAccountCronScheduledToolPolicy({
		ownerSessionKey: callerScope.sessionKey,
		ownerAccountId: callerScope.accountId
	}) : void 0;
	if (!policy) throw new TypeError("agent-runtime cron mutations require an authenticated session identity");
	return policy;
}
function parseAgentIdFromSessionRef(value, fallbackAgentId) {
	const trimmed = value?.trim();
	return trimmed ? parseAgentSessionKey(trimmed)?.agentId ?? fallbackAgentId : void 0;
}
function resolveCronJobOwnerAgentId(job) {
	const ownerAgentId = job.owner?.agentId?.trim() || parseAgentIdFromSessionRef(job.owner?.sessionKey);
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function isOperatorCommandCronJob(job) {
	return job.payload.kind === "command" || job.schedule.kind === "on-exit" || job.schedule.kind === "stream";
}
function cronJobMatchesCallerScope(params) {
	if (!params.callerScope) return true;
	if (params.callerScope.manageAll) {
		params.callerScope.manageAll();
		return true;
	}
	if (isOperatorCommandCronJob(params.job)) return false;
	const effectiveAgentId = tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId);
	const policy = params.job.scheduledToolPolicy;
	if (params.allowCurrentJob === true && params.callerScope.currentJobId === params.job.id && effectiveAgentId === params.callerScope.agentId && (policy?.mode !== "account" || normalizeAccountId(policy.ownerAccountId) === params.callerScope.accountId)) return true;
	if (policy && (policy.mode === "trusted" || params.callerScope.sessionKey?.trim() !== policy.ownerSessionKey || params.job.owner?.sessionKey?.trim() !== policy.ownerSessionKey || params.callerScope.accountId !== normalizeAccountId(policy.ownerAccountId))) return false;
	const ownerAccountId = params.job.owner?.accountId;
	if (ownerAccountId && normalizeAccountId(ownerAccountId) !== params.callerScope.accountId) return false;
	const ownerAgentId = resolveCronJobOwnerAgentId(params.job);
	if (ownerAgentId) return ownerAgentId === params.callerScope.agentId;
	if (effectiveAgentId !== params.callerScope.agentId) return false;
	return cronPatchSessionRefsMatchCaller(params.job, params.callerScope);
}
function cronJobMatchesDeclarationScope(params) {
	if (params.callerScope) return cronJobMatchesCallerScope(params);
	if (normalizeAccountId(params.job.owner?.accountId) !== normalizeAccountId(params.input.owner?.accountId)) return false;
	const inputOwnerSessionKey = params.input.owner?.sessionKey;
	const inputOwnerAgentId = resolveCronJobOwnerAgentId(params.input);
	if (inputOwnerSessionKey && !inputOwnerAgentId) return params.job.owner?.sessionKey === inputOwnerSessionKey;
	const inputAgentId = inputOwnerAgentId ?? resolveCronJobEffectiveAgentId(params.input, params.defaultAgentId);
	return (resolveCronJobOwnerAgentId(params.job) ?? tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId)) === inputAgentId;
}
function cronCreateMatchesCallerScope(params) {
	if (!params.callerScope) return true;
	if (resolveCronJobEffectiveAgentId(params.job, params.defaultAgentId) !== params.callerScope.agentId) return false;
	return cronPatchSessionRefsMatchCaller(params.job, params.callerScope);
}
function applyCronCreateCallerScopeDefault(job, callerScope) {
	if (!callerScope) return job;
	return {
		...job,
		agentId: job.agentId?.trim() ? job.agentId : callerScope.agentId,
		owner: {
			agentId: callerScope.agentId,
			...callerScope.sessionKey ? { sessionKey: callerScope.sessionKey } : {},
			accountId: callerScope.accountId
		}
	};
}
function cronPatchSessionRefsMatchCaller(patch, callerScope) {
	if (!callerScope || callerScope.manageAll) {
		callerScope?.manageAll?.();
		return true;
	}
	const target = patch.sessionTarget?.trim();
	return [patch.sessionKey, target?.startsWith("session:") ? target.slice(8) : void 0].every((ref) => {
		const agentId = parseAgentIdFromSessionRef(ref, callerScope.agentId);
		return !agentId || normalizeAgentId(agentId) === callerScope.agentId;
	});
}
//#endregion
export { cronPatchSessionRefsMatchCaller as a, resolveCronJobOwnerAgentId as c, resolveCronScheduledToolPolicyForCaller as d, cronJobMatchesDeclarationScope as i, resolveCronMutationCommitGuard as l, cronCreateMatchesCallerScope as n, readCronCallerScope as o, cronJobMatchesCallerScope as r, resolveCronCreatorAuthorityCapture as s, applyCronCreateCallerScopeDefault as t, resolveCronRequesterProvenanceForJob as u };
