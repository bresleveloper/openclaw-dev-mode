import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as clearAgentRunContext, y as registerAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { b as runWithGatewayDetachedWorkAdmission, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { s as createOperationalRunInstanceRef, u as prepareAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-CPayZwJR.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { i as validateSessionTranscriptContextAnchor } from "./session-accessor.sqlite-model-context-BsF77Klz.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-C8iJzbV2.mjs";
import { o as resolveToolDisplay } from "./tool-display-B85JC1BH.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-aezDQHzt.mjs";
import { t as createBackgroundWorkOwner } from "./background-work-53N6rVrD.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-5Lc00M9N.mjs";
import { r as recordSkillExperienceReviewOutcome } from "./collection-review-state-HIkTXhVF.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { n as SKILL_WORKSHOP_MAINTENANCE_TOOLS } from "./maintenance-prompt-zOCiE9ju.mjs";
import { t as buildSkillExperienceReviewPrompt } from "./experience-review-prompt-Dn_vp_X-.mjs";
import { n as rootedAgentRunParams } from "./rooted-run-params-CvFhdnHJ.mjs";
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
//#region src/skills/workshop/experience-review.ts
const reviews = createBackgroundWorkOwner({
	owner: "core:skill-workshop",
	maxConcurrent: 1
});
async function prepareSkillExperienceReviewCandidate(candidate, config) {
	if (isIncognitoSessionKey(candidate.source.sessionKey) || resolveSkillWorkshopConfig(config).autonomous.mode === "off") return;
	const { resolveConversationCapabilityProfile } = await import("./agents/conversation-capability-profile.js");
	const { resolveSandboxRuntimeStatus } = await import("./sandbox-26SMG2xH.mjs");
	const { isToolAllowedByPolicies } = await import("./tool-policy-match-DPvjurtq.mjs");
	const { mergeAlsoAllowPolicy } = await import("./tool-policy-rpbbR_jd.mjs");
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
		groupId: foreground.groupId,
		groupChannel: foreground.groupChannel,
		groupSpace: foreground.groupSpace,
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
	const outcomeStore = { context: captureOpenClawStateWorkerContext() };
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
		const { listWritableWorkshopSkillSummaries } = await import("./workspace-skill-read-2e_6BR9q.mjs");
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
		const run = async () => {
			const reviewAbortSignal = AbortSignal.any([getGatewayRestartDrainSignal(), abortSignal]);
			const reviewParams = {
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
				abortSignal: reviewAbortSignal,
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
				...capability ? { cronCreatorAuthorityCapability: capability } : {},
				lane: reviews.lane,
				agentHarnessId: "openclaw",
				agentHarnessRuntimeOverride: "openclaw",
				modelSelectionLocked: true,
				modelFallbacksOverride: [],
				requestedRouteResolution: "resolved",
				disableTrajectory: true,
				cleanupBundleMcpOnRunEnd: true,
				verboseLevel: "off"
			};
			reviewAbortSignal.throwIfAborted();
			try {
				const { runEmbeddedAgent } = await import("./embedded-agent-BA01iFq8.mjs");
				return await runEmbeddedAgent(reviewParams);
			} finally {
				preparedRunAdmission.close();
			}
		};
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
		await recordSkillExperienceReviewOutcome(foregroundPromptContext.agentId, workspaceDir, {
			attemptedAtMs,
			outcome: "failed",
			error: truncateUtf16Safe(String(error), 300)
		}, outcomeStore);
		throw error;
	} finally {
		if (executionRoot) bumpSkillsSnapshotVersion({ reason: "workshop" });
		clearAgentRunContext(runId);
	}
	await recordSkillExperienceReviewOutcome(foregroundPromptContext.agentId, workspaceDir, {
		attemptedAtMs,
		outcome,
		...proposalId ? { proposalId } : {},
		...usage ? { usage } : {}
	}, outcomeStore);
}
//#endregion
export { prepareSkillExperienceReviewCandidate, runSkillExperienceReview };
