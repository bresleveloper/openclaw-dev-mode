import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { i as listRegisteredPluginAgentPromptGuidance } from "./command-registry-state-BTPHt5Ql.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { o as resolveNodeExecEligibilityAsync } from "./exec-defaults-DrIV-0KT.mjs";
import { t as getRemoteSkillEligibility } from "./remote-CgYoyov-.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DM73_v1a.mjs";
import { n as prepareTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { n as createOpenClawCodingToolsAsync } from "./agent-tools-QGgE-Vnu.mjs";
import { n as resolveRuntimeSkillsPrompt } from "./skills-prompt-2hkPSs7i.mjs";
import { i as resolveBootstrapContextForRun, r as makeBootstrapWarn } from "./bootstrap-files-B2csFCe1.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-Dz5vxKlZ.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { a as resolveAgentPromptSurfaceForSessionKey } from "./system-prompt-BDZF44Ov.mjs";
import { t as resolveAgentRuntimePrompt } from "./runtime-prompt-B854sZAo.mjs";
import { n as resolveEmbeddedFullAccessState } from "./sandbox-info-BXLWQNgU.mjs";
import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-CPfZvCVz.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-DMYLVDi5.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-BGyWa30_.mjs";
//#region src/auto-reply/reply/commands-system-prompt.ts
const log = createSubsystemLogger("auto-reply/commands-system-prompt");
async function resolveCommandSkillsPrompt(params) {
	const { snapshot: skillsSnapshot } = await resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: resolveAgentWorkspaceDir(params.config, params.agentId),
		executionWorkspaceDir: params.executionWorkspaceDir,
		executionWorkspaceFileHost: params.executionWorkspaceFileHost,
		config: params.config,
		agentId: params.agentId,
		resolveEligibility: () => params.eligibility,
		existingSnapshot: params.skillsSnapshot,
		skillFilter: params.skillsSnapshot?.skillFilter,
		skillOverrides: params.skillsSnapshot?.skillOverrides,
		watch: false
	});
	if (params.sandboxed) {
		const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
			skillsSnapshot,
			config: params.config,
			agentId: params.sandboxAgentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		});
		if (!sandboxWorkspace) return "";
		if (sandboxWorkspace.containerWorkdir) {
			const { prompt } = await resolveRuntimeSkillsPrompt({
				sandbox: {
					enabled: true,
					containerWorkdir: sandboxWorkspace.containerWorkdir,
					skillsEligibility: sandboxWorkspace.skillsEligibility,
					skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir || void 0,
					skillUsagePaths: sandboxWorkspace.skillUsagePaths,
					workspaceAccess: sandboxWorkspace.workspaceAccess
				},
				skillsAnchorWorkspace: sandboxWorkspace.workspaceDir,
				skillsSnapshot,
				config: params.config,
				agentId: params.agentId
			});
			return prompt;
		}
	}
	return skillsSnapshot.prompt;
}
async function resolveCommandsSystemPromptBundle(params) {
	const workspaceDir = params.workspaceDir;
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	const sessionAgentId = params.agentId;
	const { bootstrapFiles, contextFiles: injectedFiles } = await resolveBootstrapContextForRun({
		workspaceDir,
		config: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: targetSessionEntry?.sessionId,
		chatType: targetSessionEntry?.chatType,
		agentId: sessionAgentId,
		warn: makeBootstrapWarn({
			sessionLabel: params.sessionKey,
			workspaceDir,
			warn: (message) => log.warn(message)
		})
	});
	const toolPolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: sessionAgentId,
		cfg: params.cfg,
		ctx: params.ctx,
		sessionKey: params.sessionKey
	});
	const sandboxRuntime = await resolveSandboxRuntimeStatusAsync({
		cfg: params.cfg,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		classificationSessionKey: toolPolicySessionKey,
		...toolPolicySessionKey === params.sessionKey ? { preparedSessionEntry: targetSessionEntry ?? null } : {}
	});
	const nodeSkills = await resolveNodeExecEligibilityAsync({
		agentId: sessionAgentId,
		cfg: params.cfg,
		sessionEntry: targetSessionEntry ?? null,
		sessionKey: params.sessionKey
	});
	const skillsPrompt = await resolveCommandSkillsPrompt({
		agentId: sessionAgentId,
		config: params.cfg,
		eligibility: {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		},
		sandboxAgentId: sandboxRuntime.classificationAgentId,
		sandboxed: sandboxRuntime.sandboxed,
		sessionKey: toolPolicySessionKey,
		workspaceDir,
		...resolveSessionSkillExecutionWorkspace(targetSessionEntry?.worktree?.canonicalWorkspaceDir, workspaceDir),
		skillsSnapshot: targetSessionEntry?.skillsSnapshot
	});
	const tools = await createOpenClawCodingToolsAsync({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir,
		sessionKey: toolPolicySessionKey,
		allowGatewaySubagentBinding: true,
		messageProvider: params.command.channel,
		groupId: targetSessionEntry?.groupId ?? void 0,
		groupChannel: targetSessionEntry?.groupChannel ?? void 0,
		groupSpace: targetSessionEntry?.space ?? void 0,
		spawnedBy: targetSessionEntry?.spawnedBy ?? void 0,
		senderId: params.command.senderId,
		senderName: params.ctx.SenderName,
		senderUsername: params.ctx.SenderUsername,
		senderE164: params.ctx.SenderE164,
		modelProvider: params.provider,
		modelId: params.model
	});
	const toolNames = tools.map((t) => t.name);
	const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
	const accountId = params.command.accountId ?? params.ctx.AccountId;
	const { runtimeInfo, reactionGuidance, messageToolHints } = await resolveAgentRuntimePrompt({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir,
		cwd: process.cwd(),
		sessionKey: params.sessionKey,
		sessionId: targetSessionEntry?.sessionId,
		model: `${params.provider}/${params.model}`,
		channel: params.command.channel,
		accountId,
		chatType: normalizeChatType(params.ctx.ChatType ?? targetSessionEntry?.chatType)
	});
	const fullAccessState = resolveEmbeddedFullAccessState({ execElevated: {
		enabled: params.elevated.enabled,
		allowed: params.elevated.allowed,
		defaultLevel: params.resolvedElevatedLevel ?? "off"
	} });
	const sandboxInfo = sandboxRuntime.sandboxed ? {
		enabled: true,
		workspaceDir,
		workspaceAccess: "rw",
		elevated: {
			allowed: params.elevated.allowed,
			defaultLevel: params.resolvedElevatedLevel ?? "off",
			fullAccessAvailable: fullAccessState.available,
			...fullAccessState.blockedReason ? { fullAccessBlockedReason: fullAccessState.blockedReason } : {}
		}
	} : { enabled: false };
	const { getPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	const preparedModelRuntime = getPreparedModelCatalogOwnerSnapshot({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir
	});
	return {
		systemPrompt: buildConfiguredAgentSystemPrompt({
			preparedTtsPreferences: params.opts?.preparedTtsPreferences ?? await prepareTtsPreferences(),
			config: params.cfg,
			preparedModelRuntime,
			agentId: sessionAgentId,
			workspaceDir,
			reasoningLevel: params.resolvedReasoningLevel,
			extraSystemPrompt: void 0,
			ownerNumbers: void 0,
			reasoningTagHint: false,
			toolNames,
			contextFiles: injectedFiles,
			skillsPrompt,
			acpEnabled: isAcpRuntimeSpawnAvailable({
				config: params.cfg,
				sandboxed: sandboxRuntime.sandboxed
			}),
			promptSurface,
			nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: promptSurface }),
			reactionGuidance,
			messageToolHints,
			runtimeInfo,
			sandboxInfo
		}),
		tools,
		skillsPrompt,
		bootstrapFiles,
		injectedFiles,
		sandboxRuntime
	};
}
//#endregion
export { resolveCommandsSystemPromptBundle as t };
