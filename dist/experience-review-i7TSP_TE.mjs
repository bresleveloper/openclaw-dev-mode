import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { b as runWithGatewayDetachedWorkAdmission, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { _ as registerAgentRunContext, a as clearAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-Xwd1VHk2.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { i as validateSessionTranscriptContextAnchor } from "./session-accessor.sqlite-model-context-Dxi3aFzy.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission, l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { o as resolveToolDisplay } from "./tool-display-DjrvDE8J.mjs";
import { t as createBackgroundWorkOwner } from "./background-work-DnTXrmXN.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-DhhZn7kB.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { n as SKILL_WORKSHOP_MAINTENANCE_TOOLS } from "./maintenance-prompt-zOCiE9ju.mjs";
import { t as buildSkillExperienceReviewPrompt } from "./experience-review-prompt-__4dKrZw.mjs";
import { i as recordSkillExperienceReviewOutcome } from "./collection-review-state-Co_eCFXB.mjs";
import { n as rootedAgentRunParams } from "./rooted-run-params-BC-utLzW.mjs";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/review-outcome.ts
function assertSkillReviewRunSucceeded(result) {
	const errorPayload = result.payloads?.find((payload) => payload.isError);
	const unresolvedError = result.meta.toolSummary?.unresolvedError;
	const message = result.meta.error?.message.trim() || result.meta.failureSignal?.message.trim() || (result.meta.aborted ? "Skill review model run aborted." : void 0) || errorPayload?.text?.trim() || (unresolvedError ? `${resolveToolDisplay({ name: unresolvedError.toolName }).label} failed.` : void 0);
	if (message || errorPayload) throw new Error(message || "Skill review model run failed.");
}
//#endregion
//#region src/skills/workshop/review-run.ts
const reviews = createBackgroundWorkOwner({
	owner: "core:skill-workshop",
	maxConcurrent: 1
});
/** Experience reviews retain admission, model locking, and background capacity. */
async function runSkillWorkshopReview(params) {
	const restartSignal = getGatewayRestartDrainSignal();
	const abortSignal = params.abortSignal ? AbortSignal.any([restartSignal, params.abortSignal]) : restartSignal;
	abortSignal.throwIfAborted();
	const preparedRunAdmission = params.preparedRunAdmission ?? prepareSystemAgentRunAdmission(params.config, params.runId, params.agentId, "skill-workshop.experience");
	try {
		const { runEmbeddedAgent } = await import("./embedded-agent-BakffRTS.mjs");
		return await runEmbeddedAgent({
			...params,
			preparedRunAdmission,
			abortSignal,
			lane: reviews.lane,
			agentHarnessId: "openclaw",
			agentHarnessRuntimeOverride: "openclaw",
			modelSelectionLocked: true,
			modelFallbacksOverride: [],
			requestedRouteResolution: "resolved",
			disableTrajectory: true,
			skillWorkshopProposalOnly: params.skillWorkshopProposalOnly ?? true,
			cleanupBundleMcpOnRunEnd: true,
			verboseLevel: "off"
		});
	} finally {
		preparedRunAdmission.close();
	}
}
//#endregion
//#region src/skills/workshop/experience-review.ts
async function prepareSkillExperienceReviewCandidate(candidate, config) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "off") return;
	const { resolveConversationCapabilityProfile } = await import("./agents/conversation-capability-profile.js");
	const { resolveSandboxRuntimeStatus } = await import("./sandbox-DtUi4At8.mjs");
	const { isToolAllowedByPolicies } = await import("./tool-policy-match-CgrEQaD6.mjs");
	const { mergeAlsoAllowPolicy } = await import("./tool-policy-BFtbULCH.mjs");
	const foreground = candidate.ctx.foregroundPromptContext;
	const sessionKey = candidate.source.sessionKey;
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "propose" && resolveSandboxRuntimeStatus({
		cfg: config,
		sessionKey,
		agentId: foreground.agentId
	}).sandboxed) return;
	const capabilityProfile = resolveConversationCapabilityProfile({
		config,
		sessionKey,
		sandboxSessionKey: sessionKey,
		agentId: foreground.agentId,
		agentAccountId: foreground.agentAccountId,
		messageProvider: foreground.messageProvider,
		messageChannel: foreground.messageChannel,
		chatType: foreground.chatType,
		groupId: foreground.groupId,
		groupChannel: foreground.groupChannel,
		groupSpace: foreground.groupSpace,
		memberRoleIds: foreground.memberRoleIds,
		spawnedBy: foreground.spawnedBy,
		senderId: foreground.senderId,
		senderName: foreground.senderName,
		senderUsername: foreground.senderUsername,
		senderE164: foreground.senderE164,
		senderIsOwner: foreground.senderIsOwner,
		modelProvider: candidate.ctx.modelProviderId,
		modelId: candidate.ctx.modelId,
		workspaceDir: candidate.ctx.workspaceDir
	});
	if (!isToolAllowedByPolicies("skill_workshop", [
		mergeAlsoAllowPolicy(capabilityProfile.policy.profilePolicy, capabilityProfile.policy.profileAlsoAllow),
		mergeAlsoAllowPolicy(capabilityProfile.policy.providerProfilePolicy, capabilityProfile.policy.providerProfileAlsoAllow),
		capabilityProfile.policy.globalPolicy,
		capabilityProfile.policy.globalProviderPolicy,
		capabilityProfile.policy.agentPolicy,
		capabilityProfile.policy.agentProviderPolicy,
		capabilityProfile.policy.groupPolicy,
		capabilityProfile.policy.senderPolicy,
		capabilityProfile.policy.subagentPolicy,
		capabilityProfile.policy.inheritedToolPolicy
	])) return;
	return {
		...candidate,
		config
	};
}
async function runSkillExperienceReview(candidate) {
	await runWithGatewayDetachedWorkAdmission(() => runSkillExperienceReviewInner(candidate), "skills:experience-review");
}
async function runSkillExperienceReviewInner(candidate) {
	const abortSignal = getGatewayRestartDrainSignal();
	const { foregroundPromptContext, workspaceDir } = candidate.ctx;
	const { sessionKey } = candidate.source;
	const config = candidate.config;
	const mode = resolveSkillWorkshopConfig(config).autonomous.mode;
	if (mode === "off") return;
	const executionRoot = mode === "auto" ? resolveWorkshopSkillsDir(config, foregroundPromptContext.agentId) : void 0;
	const runId = `skill-workshop-review:${randomUUID()}`;
	const reviewSession = resolveInternalSessionEffectsIdentity({
		agentId: foregroundPromptContext.agentId,
		runId
	});
	const origin = foregroundPromptContext.cronCreatorCallerOrigin;
	const capability = origin ? createCronCreatorAuthorityCapability(runId, origin) : void 0;
	const proposalMutationBudget = mode === "propose" ? {
		remaining: 1,
		readSkillHashes: /* @__PURE__ */ new Map()
	} : void 0;
	const attemptedAtMs = Date.now();
	let outcome;
	let proposalId;
	let usage;
	registerAgentRunContext(runId, {
		agentId: foregroundPromptContext.agentId,
		sessionId: reviewSession.sessionId,
		sessionKey: reviewSession.sessionKey,
		isControlUiVisible: false,
		projectSessionActive: false,
		projectSessionLifecycle: false,
		projectSessionMessages: false
	});
	try {
		abortSignal.throwIfAborted();
		if (executionRoot) await fs.mkdir(executionRoot, { recursive: true });
		const sessionManager = await SessionManager.openModelContextAsync(candidate.source, {
			cwd: executionRoot ?? workspaceDir,
			through: candidate.source,
			signal: abortSignal
		});
		abortSignal.throwIfAborted();
		const { listWritableWorkshopSkillSummaries } = await import("./workspace-skill-read-DjHs82GG.mjs");
		abortSignal.throwIfAborted();
		const sourceEntry = loadSessionEntryReadOnly({
			...candidate.source,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest"
		});
		if (sourceEntry?.sessionId !== candidate.source.sessionId) throw new Error("Skill experience review source session was deleted or replaced.");
		const existingSkills = mode === "propose" ? listWritableWorkshopSkillSummaries({
			config,
			agentId: foregroundPromptContext.agentId
		}) : void 0;
		validateSessionTranscriptContextAnchor(candidate.source, candidate.source);
		const assertSourceCurrent = () => {
			abortSignal.throwIfAborted();
			if (mode === "auto" && resolveSkillWorkshopConfig(getRuntimeConfig()).autonomous.mode !== "auto") throw new Error("Automatic Skill Workshop maintenance was disabled during review.");
			const current = loadSessionEntryReadOnly({
				...candidate.source,
				hydrateSkillPromptRefs: false,
				readConsistency: "latest"
			});
			if (current?.sessionId !== candidate.source.sessionId || current?.permissionMode !== sourceEntry.permissionMode) throw new Error("Skill experience review source session was deleted, replaced, or changed permissions.");
			validateSessionTranscriptContextAnchor(candidate.source, candidate.source);
		};
		const preparedRunAdmission = prepareAgentRunAdmission({
			cfg: config,
			operationalRunInstance: createOperationalRunInstanceRef(runId),
			facts: {
				runId,
				agentId: foregroundPromptContext.agentId,
				ingress: {
					kind: "system",
					boundary: "skill-workshop.experience",
					state: "present"
				}
			},
			assertSourceCurrent
		});
		const run = () => runSkillWorkshopReview({
			...foregroundPromptContext,
			preparedRunAdmission,
			sessionId: reviewSession.sessionId,
			sessionKey: reviewSession.sessionKey,
			messageActionTurnCapability: void 0,
			sessionManager,
			sessionPersistence: "detached",
			workspaceDir,
			...executionRoot ? rootedAgentRunParams(workspaceDir, executionRoot) : {},
			permissionMode: sourceEntry.permissionMode ?? foregroundPromptContext.permissionMode,
			...executionRoot ? { skillsSnapshot: {
				prompt: "",
				skills: []
			} } : {},
			config,
			abortSignal,
			prompt: buildSkillExperienceReviewPrompt({
				...candidate,
				existingSkills
			}, mode),
			provider: candidate.ctx.modelProviderId,
			model: candidate.ctx.modelId,
			...candidate.ctx.authProfileId ? {
				authProfileId: candidate.ctx.authProfileId,
				authProfileIdSource: "user"
			} : {},
			timeoutMs: resolveAgentTimeoutMs({ cfg: config }),
			runId,
			silentExpected: true,
			allowEmptyAssistantReplyAsSilent: true,
			terminalReplyExpectation: "optional",
			toolExecutionAllow: mode === "auto" ? [...SKILL_WORKSHOP_MAINTENANCE_TOOLS] : ["skill_workshop"],
			skillWorkshopProposalOnly: mode === "propose",
			skillWorkshopUpdateProposals: mode === "propose",
			skillWorkshopAutonomousCapture: mode === "propose",
			skillWorkshopProposalMutationBudget: proposalMutationBudget,
			skillWorkshopOrigin: {
				agentId: foregroundPromptContext.agentId,
				sessionKey,
				...candidate.ctx.runId ? { runId: candidate.ctx.runId } : {}
			},
			...capability ? { cronCreatorAuthorityCapability: capability } : {}
		});
		const embeddedResult = capability ? await runWithCronCreatorAuthorityCapability(capability, run) : await run();
		preparedRunAdmission.assertSourceCurrent();
		assertSkillReviewRunSucceeded(embeddedResult);
		const proposalIds = [...proposalMutationBudget?.mutatedProposalIds ?? []];
		proposalId = proposalIds[0];
		outcome = mode === "auto" ? "completed" : proposalIds.length === 0 ? "nothing" : "proposed";
		const agentUsage = embeddedResult.meta?.agentMeta?.usage;
		usage = agentUsage ? {
			inputTokens: (agentUsage.input ?? 0) + (agentUsage.cacheRead ?? 0) + (agentUsage.cacheWrite ?? 0),
			cachedInputTokens: agentUsage.cacheRead ?? 0,
			outputTokens: agentUsage.output ?? 0
		} : void 0;
	} catch (error) {
		recordSkillExperienceReviewOutcome(foregroundPromptContext.agentId, workspaceDir, {
			attemptedAtMs,
			outcome: "failed",
			error: truncateUtf16Safe(String(error), 300)
		});
		throw error;
	} finally {
		if (executionRoot) bumpSkillsSnapshotVersion({ reason: "workshop" });
		clearAgentRunContext(runId);
	}
	recordSkillExperienceReviewOutcome(foregroundPromptContext.agentId, workspaceDir, {
		attemptedAtMs,
		outcome,
		...proposalId ? { proposalId } : {},
		...usage ? { usage } : {}
	});
}
//#endregion
export { prepareSkillExperienceReviewCandidate, runSkillExperienceReview };
