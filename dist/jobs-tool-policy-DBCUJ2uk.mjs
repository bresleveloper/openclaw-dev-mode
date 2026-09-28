import { a as isRuntimeToolAllowed } from "./tool-policy-match-Bv2XOvEF.mjs";
import { n as createTrustedCronScheduledToolPolicy, r as normalizeCronScheduledToolCallerOrigin, s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { a as cloneCronRuntimeAuthority, i as resolveCronAuthenticatedChannelRequester, n as normalizeCronToolsAllowProvenance, r as resolveCronAuthenticatedCallerOrigin } from "./tools-allow-provenance-CBVsstVi.mjs";
import { n as cronJobUsesToolRuntime } from "./tools-allow-BSqnFkMT.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/service/jobs-tool-policy.ts
function resolveCronJobScheduledMessagePolicy(job) {
	const policy = resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		scheduledToolPolicy: job.scheduledToolPolicy,
		owner: job.owner
	});
	return cronJobUsesToolRuntime(job) && policy && isRuntimeToolAllowed("message", job.payload.toolsAllow) ? policy : void 0;
}
/** Snapshots the permissions used by all scheduled message actions. */
function resolveCronJobMessageToolAuthorityInputs(job) {
	const policy = resolveCronJobScheduledMessagePolicy(job);
	return policy ? { policy } : void 0;
}
/** Snapshots the normalized permissions used by scheduled message access. */
function resolveCronJobMessageActionAuthorityInputs(job) {
	const policy = resolveCronJobScheduledMessagePolicy(job);
	if (!policy) return;
	const channelRequester = resolveCronAuthenticatedChannelRequester(job);
	const callerOrigin = normalizeCronScheduledToolCallerOrigin(job.toolsAllowProvenance?.callerOrigin);
	return {
		policy,
		...policy.mode === "account" ? {
			callerOrigin,
			...channelRequester || callerOrigin.kind !== "unknown" ? {
				...channelRequester ? { channelRequester } : {},
				executableRevision: resolveCronRequesterExecutionRevision(job)
			} : {}
		} : {}
	};
}
function cronJobMessageToolAuthorityInputsEqual(previous, next) {
	return isDeepStrictEqual(resolveCronJobMessageToolAuthorityInputs(previous), resolveCronJobMessageToolAuthorityInputs(next));
}
function cronJobMessageActionAuthorityInputsEqual(previous, next) {
	return isDeepStrictEqual(resolveCronJobMessageActionAuthorityInputs(previous), resolveCronJobMessageActionAuthorityInputs(next));
}
/** Binds native requester authority to executable inputs using the canonical storage projection. */
function resolveCronRequesterExecutionRevision(job) {
	const { description: _description, displayName: _displayName, createdActor: _createdActor, toolsAllowProvenance: _toolsAllowProvenance, ...executableJob } = job;
	return resolveCronJobConfigRevision(executableJob);
}
/** Rebinds or clears authenticated requester facts after the complete mutation is known. */
function reconcileCronChannelRequesterAuthority(params) {
	const { job, previousJob } = params;
	if (!job.toolsAllowProvenance?.callerOrigin && !job.toolsAllowProvenance?.channelRequester && !previousJob?.toolsAllowProvenance?.callerOrigin && !previousJob?.toolsAllowProvenance?.channelRequester && !params.toolsAllowProvenance?.callerOrigin && !params.toolsAllowProvenance?.channelRequester) return;
	const captured = normalizeCronToolsAllowProvenance(params.toolsAllowProvenance);
	const current = normalizeCronToolsAllowProvenance(job.toolsAllowProvenance);
	const previous = normalizeCronToolsAllowProvenance(previousJob?.toolsAllowProvenance);
	const unchangedCap = previousJob !== void 0 && isDeepStrictEqual(previousJob.payload.toolsAllow, job.payload.toolsAllow) && previousJob.payload.toolsAllowIsDefault === true === (job.payload.toolsAllowIsDefault === true);
	const fullSurface = current?.source === "final-executable-surface" ? current : unchangedCap && previous?.source === "final-executable-surface" ? previous : void 0;
	const executionUnchanged = previousJob !== void 0 && resolveCronRequesterExecutionRevision(previousJob) === resolveCronRequesterExecutionRevision(job) && isDeepStrictEqual(previousJob.state.triggerState, job.state.triggerState);
	const acceptsCapture = !executionUnchanged || params.reauthorize === true;
	const acceptsCallerOriginCapture = !executionUnchanged || params.reauthorizeCallerOrigin === true;
	let callerOrigin = cronJobUsesToolRuntime(job) && acceptsCallerOriginCapture ? resolveCronAuthenticatedCallerOrigin({
		...job,
		toolsAllowProvenance: captured
	}) : void 0;
	if (!callerOrigin && (!acceptsCallerOriginCapture || params.toolsAllowProvenance?.callerOrigin === void 0) && previousJob && cronJobUsesToolRuntime(job) && executionUnchanged) callerOrigin = resolveCronAuthenticatedCallerOrigin({
		...job,
		toolsAllowProvenance: previous
	});
	let channelRequester = cronJobUsesToolRuntime(job) && acceptsCapture ? resolveCronAuthenticatedChannelRequester({
		...job,
		toolsAllowProvenance: captured
	}) : void 0;
	if (!channelRequester && (!acceptsCapture || params.toolsAllowProvenance?.channelRequester === void 0) && previousJob && cronJobUsesToolRuntime(job) && executionUnchanged) channelRequester = resolveCronAuthenticatedChannelRequester({
		...job,
		toolsAllowProvenance: previous
	});
	if (fullSurface) {
		const { callerOrigin: _previousOrigin, channelRequester: _previousRequester, ...provenance } = fullSurface;
		job.toolsAllowProvenance = {
			...provenance,
			callerOrigin: callerOrigin ?? { kind: "unknown" },
			...channelRequester ? { channelRequester } : {}
		};
	} else if (callerOrigin) job.toolsAllowProvenance = {
		version: 1,
		source: "authenticated-requester",
		callerOrigin,
		...channelRequester ? { channelRequester } : {}
	};
	else if (channelRequester) job.toolsAllowProvenance = {
		version: 1,
		source: "authenticated-requester",
		channelRequester
	};
	else delete job.toolsAllowProvenance;
}
function consumeRuntimeAuthorityMutationOptions(opts) {
	opts?.commitGuard?.();
	return {
		captured: opts?.captureRuntimeAuthority !== void 0,
		runtimeAuthority: opts?.captureRuntimeAuthority?.()
	};
}
function stampScheduledToolPolicy(job, scheduledToolPolicy) {
	if (!cronJobUsesToolRuntime(job) || job.payload.toolsAllow === void 0 || scheduledToolPolicy === null) {
		delete job.scheduledToolPolicy;
		return;
	}
	const policy = scheduledToolPolicy ?? createTrustedCronScheduledToolPolicy();
	if (policy.mode === "account" && (job.owner?.sessionKey !== policy.ownerSessionKey || job.owner?.accountId !== policy.ownerAccountId)) throw new Error("scheduled account policy must match the persisted job owner");
	job.scheduledToolPolicy = structuredClone(policy);
}
function reconcileScheduledToolPolicy(params) {
	const { job } = params;
	const current = resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow ?? [],
		scheduledToolPolicy: job.scheduledToolPolicy,
		owner: job.owner
	});
	if (!cronJobUsesToolRuntime(job) || job.payload.toolsAllow === void 0) {
		if (current?.mode === "account") job.scheduledToolPolicy = current;
		else delete job.scheduledToolPolicy;
		return;
	}
	if (current) {
		job.scheduledToolPolicy = current;
		return;
	}
	delete job.scheduledToolPolicy;
	if (params.explicitlyMutatesToolsAllow || !params.previouslyUsedToolRuntime) stampScheduledToolPolicy(job, params.scheduledToolPolicy);
}
/**
* Stamps or clears the restrict-only exec pin alongside the cap it was
* captured with. The pin exists only while the job grants canonical `exec`
* from a creator surface whose exec capability was host-pinned; explicit cap
* rewrites without that server-verified fact clear it, falling back to the
* baseline unpinned exec policy.
*/
function reconcileToolsAllowExecTarget(params) {
	const { job } = params;
	if (!cronJobUsesToolRuntime(job) || job.payload.toolsAllow === void 0) {
		delete job.toolsAllowExecTarget;
		delete job.toolsAllowExecTargetRequirement;
		return;
	}
	if (!params.explicitlyMutatesToolsAllow) return;
	const grantsExec = Array.isArray(job.payload.toolsAllow) && job.payload.toolsAllow.includes("exec");
	if (params.toolsAllowExecTarget && grantsExec) {
		job.toolsAllowExecTarget = structuredClone(params.toolsAllowExecTarget);
		job.toolsAllowExecTargetRequirement = {
			version: 1,
			target: structuredClone(params.toolsAllowExecTarget),
			grantIndex: job.payload.toolsAllow.indexOf("exec")
		};
	} else {
		delete job.toolsAllowExecTarget;
		delete job.toolsAllowExecTargetRequirement;
	}
}
function reconcileToolsAllowProvenance(params) {
	if (!params.explicitlyMutatesToolsAllow) return;
	if (cronJobUsesToolRuntime(params.job) && params.job.payload.toolsAllow !== void 0 && params.toolsAllowProvenance?.version === 1 && params.toolsAllowProvenance.source === "final-executable-surface") {
		params.job.toolsAllowProvenance = structuredClone(params.toolsAllowProvenance);
		return;
	}
	delete params.job.toolsAllowProvenance;
}
/** Reconciles runtime-owned opaque authority with the mutation that owns this write. */
function reconcileRuntimeAuthority(params) {
	if (!cronJobUsesToolRuntime(params.job)) {
		delete params.job.runtimeAuthority;
		delete params.job.runtimeAuthorityRecoveryRequired;
		return;
	}
	if (params.captured) {
		delete params.job.runtimeAuthorityRecoveryRequired;
		const runtimeAuthority = params.runtimeAuthority ? cloneCronRuntimeAuthority(params.runtimeAuthority) : void 0;
		if (params.runtimeAuthority && !runtimeAuthority) throw new TypeError("captured cron runtime authority is invalid");
		if (runtimeAuthority) params.job.runtimeAuthority = runtimeAuthority;
		else delete params.job.runtimeAuthority;
		return;
	}
	if (params.explicitlyMutatesToolsAllow) {
		if (params.job.runtimeAuthority) {
			params.job.runtimeAuthorityRecoveryRequired = true;
			delete params.job.runtimeAuthority;
		}
	}
}
/** Reconciles the scheduled policy, capture provenance, and exec pin as one cap-authority unit. */
function reconcileToolsAllowAuthority(params) {
	reconcileScheduledToolPolicy(params);
	reconcileToolsAllowProvenance(params);
	reconcileToolsAllowExecTarget(params);
}
//#endregion
export { reconcileRuntimeAuthority as a, resolveCronJobMessageToolAuthorityInputs as c, reconcileCronChannelRequesterAuthority as i, cronJobMessageActionAuthorityInputsEqual as n, reconcileToolsAllowAuthority as o, cronJobMessageToolAuthorityInputsEqual as r, resolveCronJobMessageActionAuthorityInputs as s, consumeRuntimeAuthorityMutationOptions as t };
