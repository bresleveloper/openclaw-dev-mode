import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as captureAsyncWorkTracker } from "./async-work-scope-BYeX3gh6.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-Jag53zwP.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { p as hasLiveAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-BjYQE8Yy.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-WXO5HScp.mjs";
import { d as resolveRuntimeAuthProfileAgentDir } from "./store-SwwRUDrm.mjs";
import { a as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { o as resolveContextEngine } from "./registry-BIuAP_WM.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { n as isKnownCliHistoryBoundary, r as runWithCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { n as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-m7NE2aEm.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-00MgEWj5.mjs";
import { c as getAdmittedRunDelegatedAuthority, f as readAdmittedRunOperatorAuthority, g as resolvePreparedRunAdmission, h as resolveAdmittedRunActiveAssertion, m as readRunOperatorAuthority, n as assertOperatorModelAllowed, p as readPreparedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-CzdLbOjb.mjs";
import { a as resolveAuthProfileOrder, c as isSetupCredentialAccessible } from "./order-B7W96aON.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-Qx0DZ2Si.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-NbdrO8vA.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-Dyv8bBue.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { a as isWorkspaceBootstrapPending } from "./workspace-C0xiByg0.mjs";
import { i as overlayConfiguredModelCatalog, n as loadManifestModelCatalog } from "./model-catalog-CwZMTjpw.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { a as runWithSessionTranscriptReadFence, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-D1LHo5Qj.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { r as validateSessionTranscriptContextAdmission } from "./session-accessor.sqlite-model-context-BsF77Klz.mjs";
import { t as buildSessionContext } from "./session-manager-codec-Dl5j6GJ-.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { a as hashCliSessionText, c as resolveCliSessionReuse } from "./cli-session-BGS0cWwl.mjs";
import { n as createAgentQuestionAnswerAuthority } from "./host-private-capabilities-D9XrALSb.mjs";
import { i as buildGenericCliContextEngineHostSupport, r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { t as ensureContextEnginesInitialized } from "./init-CLvlMRF6.mjs";
import { o as resolveContextTokensForModel } from "./context-DtziOKiU.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-l7Gq7Nji.mjs";
import { n as resolveExecConfigState } from "./exec-defaults-tLsLm83r.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { r as messageToolOwnsVisibleReply, t as buildHarnessVisibleReplyGuidance } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { h as resolveWorkspaceBootstrapRouting, m as isPrimaryBootstrapRun } from "./openclaw-tools-D_lVJ00z.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { s as resolveModelContextWindowProfile } from "./session-utils-model-JtZ-2MzK.mjs";
import { t as prepareReplyToolAuthority } from "./reply-tool-authority-DGgSwsqC.mjs";
import { n as assertNativeCronCreatorCapabilities } from "./cron-tool-C0K_7xO_.mjs";
import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as resolveSandboxSkillRuntimeInputs, r as remapSkillReferencePaths, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-8n2dfUP3.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-CRJePlvi.mjs";
import { r as buildCurrentInboundPrompt } from "./runtime-context-prompt-CKrto4c6.mjs";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-CuoxtIGZ.mjs";
import { n as resolveEmbeddedRunSkillEntries, t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-Cc1ujrgp.mjs";
import { i as buildBootstrapTruncationReportMeta, n as buildBootstrapBudgetState, r as buildBootstrapInjectionStats, s as buildBootstrapPromptWarningNotice } from "./bootstrap-budget-D83uJB7U.mjs";
import { i as resolveBootstrapContextForRun, r as makeBootstrapWarn } from "./bootstrap-files-C4UH2yRG.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-BsEuTEPJ.mjs";
import "./sandbox-Ds9JeFO_.mjs";
import { c as resolvePromptBuildHookResult, n as waitForDeferredTurnMaintenanceForSession } from "./context-engine-maintenance-DDo1CHf0.mjs";
import { a as resolveContextWindowInfo } from "./context-window-guard-CdJSElvf.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import { t as SessionManager } from "./session-manager-fHN-UyrU.mjs";
import { n as appendModelIdentitySystemPrompt, r as buildModelIdentityPromptLine } from "./system-prompt-config-CnJZjjCb.mjs";
import { t as buildSystemPromptReport } from "./system-prompt-report-BNCA4Pw3.mjs";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-B-YEtKIs.mjs";
import { i as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-DoWDi1TY.mjs";
import { t as recordAdmittedModelRoutingDecision } from "./model-routing-decision-Dat4xk8C.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-C1qC-k1J.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
import { a as buildSystemAgentToolsMcpServerConfig } from "./openclaw-tools-serve-config-BTwSHtye.mjs";
import { n as resolveCliAuthBindingFingerprint, r as resolveCliAuthEpoch } from "./cli-auth-epoch-Bl-_bpyJ.mjs";
import { n as cliBackendLog } from "./log-C-xabBWt.mjs";
import { a as normalizeCliModel, i as isClaudeCliBackendId } from "./helpers-BbufZccY.mjs";
import { t as bindAgentRunTerminalWriteContext } from "./agent-run-terminal-writes-CXNCfj5F.mjs";
import { t as CliBackendAuthProfilePreparationError } from "./cli-backend-errors-ngojFnXq.mjs";
import { c as CLAUDE_MANAGED_MCP_TIMEOUT_MS, i as prependCliSessionDriftUserContext, l as applyClaudeManagedMcpTimeout, n as prepareCliSystemPrompt, o as prepareCliBundleMcpConfig, r as prepareCliTurnPromptContext, s as resolveCliNativeWebSearchEnabled, t as composeCliPromptContext } from "./prompt-context-aN350Ev5.mjs";
import { C as runCliCleanup, S as retainCliPluginExecutionConsumer, b as createCliRunCurrentAssertion, o as getCliLiveSessionGeneration, x as resolveCliExecutionTarget } from "./cli-live-session-registry-Ci6tcreu.mjs";
import { a as createMcpLoopbackServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-DZTsAR6S.mjs";
import { f as revokeMcpLoopbackClientGrant, i as deactivateMcpLoopbackClientGrantCapture, m as transferMcpLoopbackClientGrant, n as activateMcpLoopbackClientGrantCapture, o as mintMcpLoopbackClientGrant, r as bindMcpLoopbackClientGrantAdmission } from "./server-connection-work-CCPgXdCH.mjs";
import { n as ensureMcpLoopbackServer } from "./mcp-http-BKmh85d-.mjs";
import { n as resolveMcpLoopbackPolicyTools, r as resolveMcpLoopbackScopedTools } from "./mcp-http.runtime-BmMDN4xD.mjs";
import { a as loadCliSessionPromptContext, c as resolveCliSessionId, f as claudeCliSessionTranscriptHasContent, i as loadCliSessionHistoryMessages, n as hasCliSessionTranscript, o as resolveAutoCliSessionReseedHistoryChars, p as claudeCliSessionTranscriptHasOrphanedToolUse, t as buildCliSessionHistoryPrompt, u as CliAuthProfilePreparationError } from "./session-history-B7_oaIp0.mjs";
import { t as prepareRootedExecutionCapability } from "./rooted-run-params-CNVei1_1.mjs";
import { t as ensureWritableSkillDirectories } from "./skill-directory-modes-DeO1nfYy.mjs";
import { n as buildCliMcpGrantContext, r as finalizeCliMcpGrant } from "./mcp-grant-context-B1goWGKl.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { ensureSystemPromptCacheBoundary, splitSystemPromptRelocatableBoundary } from "@openclaw/ai/internal/shared";
//#region src/agents/cli-runner/bootstrap-transport.ts
function canTransportSystemPrompt(backend) {
	return backend.systemPromptWhen !== "never" && Boolean(backend.systemPromptArg || backend.systemPromptFileArg || backend.systemPromptFileConfigKey);
}
/** Refresh first-only and live CLI prompts when personal context changes or disappears. */
function resolveCliBootstrapPromptHash(params) {
	const personal = params.contextFiles.filter((file) => file.personalUser);
	if (params.bootstrapMode === "none" && params.bootstrapTruncationNotice === void 0 && personal.length === 0) return params.baseHash;
	return hashCliSessionText(JSON.stringify([
		params.baseHash ?? null,
		params.bootstrapMode,
		params.bootstrapTruncationNotice !== void 0,
		...personal.length ? [personal] : []
	]));
}
//#endregion
//#region src/agents/cli-runner/claude-skills-plugin.ts
/**
* Materializes selected OpenClaw skills as a temporary Claude CLI plugin.
*/
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const OPENCLAW_CLAUDE_PLUGIN_NAME = "openclaw-skills";
function sanitizeSkillDirName(name, used) {
	const base = name.trim().replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "skill";
	const safeBase = base.startsWith(".") ? `skill-${base.replace(/^\.+/, "") || "skill"}` : base;
	let candidate = safeBase;
	for (let index = 2; used.has(candidate); index += 1) candidate = `${safeBase}-${index}`;
	used.add(candidate);
	return candidate;
}
async function linkOrCopySkillDir(params) {
	try {
		await fs$1.symlink(params.sourceDir, params.targetDir, process.platform === "win32" ? "junction" : "dir");
	} catch {
		await fs$1.cp(params.sourceDir, params.targetDir, {
			recursive: true,
			force: true,
			verbatimSymlinks: true
		});
		await ensureWritableSkillDirectories(path.dirname(params.targetDir), path.basename(params.targetDir));
	}
}
/** Prepares Claude CLI `--plugin-dir` args for the current session skill snapshot. */
async function prepareClaudeCliSkillsPlugin(params) {
	if (normalizeLowercaseStringOrEmpty(params.backendId) !== CLAUDE_CLI_BACKEND_ID) return {
		args: [],
		cleanup: async () => {}
	};
	if (params.skillsSnapshot?.librarySelections?.length) return {
		args: [],
		cleanup: async () => {}
	};
	const usedTargetNames = /* @__PURE__ */ new Set();
	const skills = (params.skillsSnapshot?.resolvedSkills ?? []).flatMap((skill) => {
		const name = skill.name?.trim();
		const skillFilePath = skill.filePath?.trim();
		if (!name || !skillFilePath) return [];
		if (!existsSync(skillFilePath)) {
			cliBackendLog.warn(`claude skill plugin skipped missing skill file: ${skillFilePath}`);
			return [];
		}
		return [{
			name,
			sourceDir: path.dirname(skillFilePath),
			targetDirName: sanitizeSkillDirName(name, usedTargetNames)
		}];
	});
	if (skills.length === 0) return {
		args: [],
		cleanup: async () => {}
	};
	const tempDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-claude-skills-"));
	const pluginDir = path.join(tempDir, OPENCLAW_CLAUDE_PLUGIN_NAME);
	const manifestDir = path.join(pluginDir, ".claude-plugin");
	const skillsDir = path.join(pluginDir, "skills");
	await fs$1.mkdir(manifestDir, {
		recursive: true,
		mode: 448
	});
	await fs$1.mkdir(skillsDir, {
		recursive: true,
		mode: 448
	});
	const manifest = {
		name: OPENCLAW_CLAUDE_PLUGIN_NAME,
		version: "0.0.0",
		description: "Session-scoped OpenClaw skills selected for this agent run.",
		skills: "./skills"
	};
	await fs$1.writeFile(path.join(manifestDir, "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
		encoding: "utf-8",
		mode: 384
	});
	let linkedSkillCount = 0;
	for (const skill of skills) try {
		await linkOrCopySkillDir({
			sourceDir: skill.sourceDir,
			targetDir: path.join(skillsDir, skill.targetDirName)
		});
		linkedSkillCount += 1;
	} catch (error) {
		cliBackendLog.warn(`claude skill plugin skipped ${skill.name}: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (linkedSkillCount === 0) {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
		return {
			args: [],
			cleanup: async () => {}
		};
	}
	return {
		args: ["--plugin-dir", pluginDir],
		pluginDir,
		cleanup: async () => {
			await fs$1.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
//#region src/agents/cli-runner/history-boundary.ts
/**
* History belongs to the local transcript, not the latest native handle. Cover only
* a proven-empty start or the contiguous events of the previously admitted CLI run.
* An account transition, old-runtime write, import or unknown legacy prefix stays
* unknown until an explicitly empty context starts a new history boundary.
*/
async function prepareCliHistoryBoundary(params, identity) {
	const source = params.sessionTarget;
	if (params.sessionManager || !source || source.sessionId !== params.sessionId || params.sessionKey !== void 0 && params.sessionKey !== source.sessionKey || !resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal)) return;
	const target = {
		...source,
		storePath: resolveSessionTranscriptDatabasePath(source)
	};
	const assertCurrent = createCliRunCurrentAssertion(params);
	await waitForSessionTranscriptProjection(target, params.abortSignal);
	assertCurrent();
	const snapshot = loadSessionEntryReadOnly(target);
	if (!snapshot || snapshot.sessionId !== target.sessionId) return;
	const watermark = readSessionTranscriptWatermark(target);
	const admission = resolveSessionTranscriptReadFence(target);
	validateSessionTranscriptContextAdmission(target, admission);
	const priorMaxSeq = admission ? admission.rawSeq - 1 : watermark.maxSeq;
	const currentUserIsLast = !admission || watermark.maxSeq === admission.rawSeq;
	const stored = snapshot.cliHistoryBoundary;
	const credential = identity.credential;
	const owner = credential?.type === "oauth" ? credential.accountId?.trim() || credential.email?.trim() ? [
		"oauth",
		credential.provider,
		credential.accountId,
		credential.email,
		credential.clientId,
		credential.enterpriseUrl,
		credential.projectId
	] : void 0 : credential?.type === "api_key" && credential.key?.trim() ? [
		"api_key",
		credential.provider,
		credential.key
	] : credential?.type === "token" && credential.token?.trim() ? [
		"token",
		credential.provider,
		credential.token
	] : void 0;
	const fingerprint = owner ? sha256Hex(JSON.stringify([
		"cli-history-v1",
		normalizeProviderId(params.provider),
		owner
	])) : void 0;
	const writerRunId = params.expectedWriterRunId ?? params.runId;
	let allowed = Boolean(fingerprint && currentUserIsLast && params.cliSessionBinding?.forceReuse !== true && isKnownCliHistoryBoundary(stored) && stored.sessionId === target.sessionId && stored.authFingerprint === fingerprint && stored.generation === watermark.generation && (stored.maxSeq === priorMaxSeq || admission && stored.writerRunId === writerRunId && stored.maxSeq === watermark.maxSeq));
	if (!allowed && fingerprint && currentUserIsLast && !params.cliSessionId && !params.cliSessionBinding) {
		let truncated = false;
		const branch = (await SessionManager.openBoundedAsync(target, {
			signal: params.abortSignal,
			maxBytes: 1048576,
			maxEvents: 100,
			onTruncated: () => {
				truncated = true;
			}
		})).getBranch();
		assertCurrent();
		allowed = !truncated && buildSessionContext(branch).messages.length === 0;
	}
	allowed &&= watermark.maxSeq === null || typeof watermark.generation === "string";
	if (!allowed && !stored) return;
	const boundary = allowed && fingerprint ? {
		version: 1,
		sessionId: target.sessionId,
		state: "known",
		authFingerprint: fingerprint,
		generation: watermark.generation,
		maxSeq: watermark.maxSeq,
		writerRunId
	} : {
		version: 1,
		sessionId: target.sessionId,
		state: "unknown"
	};
	if (!await patchSessionEntryCore(target, (current) => {
		if (current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== snapshot.activeWriterRunId || params.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== params.expectedLifecycleRevision) throw new Error("CLI history owner changed before preparation");
		return {
			activeWriterRunId: writerRunId,
			cliHistoryBoundary: boundary
		};
	}, {
		preserveActivity: true,
		skipMaintenance: true,
		onCommitted: (entry) => {
			const callerEntry = params.sessionEntry;
			if (callerEntry?.sessionId === snapshot.sessionId && callerEntry.lifecycleRevision === snapshot.lifecycleRevision && callerEntry.activeWriterRunId === snapshot.activeWriterRunId) callerEntry.activeWriterRunId = entry.activeWriterRunId;
		},
		assertCommitAllowed: () => {
			assertCurrent();
			if (snapshot.activeWriterRunId !== void 0 && snapshot.activeWriterRunId !== writerRunId && hasLiveAgentRunContext(snapshot.activeWriterRunId)) throw new Error("CLI history owner changed before preparation");
			assertOwnedTranscriptWriteCommit(target);
			validateSessionTranscriptContextAdmission(target, admission);
			const fresh = readSessionTranscriptWatermark(target);
			if (fresh.generation !== watermark.generation || fresh.maxSeq !== watermark.maxSeq) throw new Error("CLI history changed before preparation");
		}
	}) || !allowed || boundary.state !== "known") return;
	const assertActive = resolveAdmittedRunActiveAssertion(params.admittedRunContext);
	const assertWriterCurrent = () => {
		params.assertCurrent?.();
		if (!assertActive) throw new Error("CLI history writer is no longer active");
		assertActive();
	};
	const writer = {
		target: { ...target },
		runId: writerRunId,
		authFingerprint: boundary.authFingerprint,
		lifecycleRevision: snapshot.lifecycleRevision,
		assertCurrent: assertWriterCurrent,
		assertReadable: () => {
			assertWriterCurrent();
			const current = loadSessionEntryReadOnly(target);
			const proof = current?.cliHistoryBoundary;
			const tip = readSessionTranscriptWatermark(target);
			if (!current || current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== writerRunId || !isKnownCliHistoryBoundary(proof) || proof.sessionId !== target.sessionId || proof.writerRunId !== writerRunId || proof.authFingerprint !== boundary.authFingerprint || proof.generation !== tip.generation || proof.maxSeq !== tip.maxSeq) throw new Error("CLI history authority changed before execution");
		}
	};
	const authority = getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	if (!authority) throw new Error("CLI history writer is no longer active");
	bindAgentRunTerminalWriteContext(authority, { run: (write) => runWithCliHistoryWriter(writer, write) });
	return writer;
}
//#endregion
//#region src/agents/cli-runner/model-capabilities.ts
/** Selects both CLI capabilities from the same logical/native catalog identity. */
function resolveCliCatalogCapabilities(params) {
	const providers = uniqueStrings([params.provider, params.modelProvider].filter((provider) => Boolean(provider)));
	const models = uniqueStrings([params.modelId, params.normalizedModel]);
	let thinkingEntry;
	let selectableContextEntry;
	for (const provider of providers) {
		for (const modelId of models) {
			const entry = findModelCatalogEntry(params.catalog, {
				provider,
				modelId
			});
			thinkingEntry ??= entry;
			if (entry?.contextWindows?.length) {
				selectableContextEntry = entry;
				break;
			}
		}
		if (selectableContextEntry) break;
	}
	return {
		selectableContextEntry,
		providerThinkingLevel: resolveProviderThinkingLevel({
			provider: thinkingEntry?.provider ?? params.modelProvider ?? params.provider,
			model: thinkingEntry?.id ?? params.normalizedModel,
			catalog: params.catalog,
			agentRuntime: params.agentRuntime,
			level: params.thinkLevel
		})
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-claude.ts
const CLAUDE_CLI_CONTEXT_MODEL_ALIASES = {
	opus: "claude-opus-5-5",
	"opus-5": "claude-opus-5",
	"opus-5.5": "claude-opus-5-5",
	"opus-5-5": "claude-opus-5-5",
	"opus-4.8": "claude-opus-4-8",
	"opus-4-8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4-7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"opus-4-6": "claude-opus-4-6",
	sonnet: "claude-sonnet-5-5",
	"sonnet-5.5": "claude-sonnet-5-5",
	"sonnet-5-5": "claude-sonnet-5-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet-4.6": "claude-sonnet-4-6",
	"sonnet-4-6": "claude-sonnet-4-6",
	fable: "claude-fable-5-1",
	"fable-5": "claude-fable-5",
	"fable-5.1": "claude-fable-5-1",
	"fable-5-1": "claude-fable-5-1"
};
function resolveClaudeCliContextModelId(modelId) {
	const trimmed = modelId.trim();
	return CLAUDE_CLI_CONTEXT_MODEL_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}
function detectNodeClaudePlacement(params) {
	if (params.backendId === "claude-cli" && params.execHost === "node" && !params.execNode?.trim()) throw new Error("node-placed Claude CLI session is missing execNode");
	return params.backendId === "claude-cli" && params.execHost === "node" && Boolean(params.execNode?.trim());
}
//#endregion
//#region src/agents/cli-runner/run-admission.ts
/** Keep the logical model ceiling across CLI transport mapping and asynchronous preparation. */
function prepareCliRunModelAuthority(params) {
	const operatorAuthority = readRunOperatorAuthority(params);
	const model = params.requesterModel;
	assertOperatorModelAllowed(operatorAuthority, model);
	if (!operatorAuthority) return params;
	const assertCallerCurrent = params.assertCurrent;
	return {
		...params,
		assertCurrent: () => {
			assertCallerCurrent?.();
			assertOperatorModelAllowed(operatorAuthority, model);
		}
	};
}
async function admitCliRunParams(candidate, agentId) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: candidate.runId,
		runtimeKind: "embedded",
		admittedRunContext: candidate.admittedRunContext,
		preparedRunAdmission: candidate.preparedRunAdmission
	});
	candidate.assertCurrent?.();
	const { preparedRunAdmission: _preparedRunAdmission, ...rest } = candidate;
	return {
		...rest,
		agentId,
		admittedRunContext
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-mcp.ts
/** Project the CLI tool surface before prompt construction, retaining its exact run admission. */
async function prepareCliMcpToolProjection(params, options) {
	const requestedToolsAllow = options.runtimeToolsAllowPolicy ?? (options.scope.rootedExecution ? options.rootedToolsAllow : params.cliToolAvailability?.openClaw);
	const context = requestedToolsAllow !== void 0 ? {
		...options.context,
		toolsAllow: [...requestedToolsAllow]
	} : options.context;
	const resolveTools = options.runtimeToolsAllowPolicy !== void 0 || options.scope.rootedExecution && options.rootedToolsAllow === void 0 ? options.resolvePolicyTools : options.resolveScopedTools;
	const admittedParams = await admitCliRunParams(params, options.agentId);
	const { tools } = await resolveTools({
		...options.scope,
		defaultMediatedToolNames: options.defaultMediatedToolNames,
		signal: admittedParams.abortSignal,
		context,
		admittedRunContext: admittedParams.admittedRunContext
	});
	return {
		params: admittedParams,
		tools
	};
}
/** Resolve default coding ownership without changing exact, standalone, or node runs. */
function resolveCliMcpToolOwnership(run, options) {
	return {
		hostOwnedTools: options.enabled && resolveExecConfigState({
			cfg: run.config,
			sessionEntry: run.sessionEntry,
			execOverrides: run.execOverrides,
			agentId: run.agentId,
			sessionKey: run.sessionKey
		}).host !== "node" && !options.rooted && run.cliToolAvailability === void 0 && options.backend.nativeToolMode === "selectable" && options.backend.toolAvailabilityEnforcement === "execution-args" && options.backend.resolveExecutionArgs !== void 0 ? options.backend.hostOwnedTools?.map(normalizeToolPolicyName) : void 0,
		nodeWorkshopEnabled: options.nodePlacement && !options.skipPreparation && run.disableTools !== true && run.skillLibraryAuthoring !== void 0
	};
}
/** Bind the projected catalog and native authority to one prepared CLI grant. */
function prepareCliMcpGrant(run, options) {
	const exclusiveTools = run.cliToolAvailability !== void 0 || options.promptBuildRestrictsTools;
	const toolsAllow = run.cliToolAvailability?.openClaw ?? (exclusiveTools || options.hostOwnedTools !== void 0 ? options.tools.map((tool) => tool.name) : void 0);
	const projectNativeToolAuthority = options.nativeAuthorityAllowed && run.disableTools !== true ? options.projectNativeToolAuthority : void 0;
	return {
		exclusiveTools,
		projectNativeToolAuthority,
		mcpGrant: finalizeCliMcpGrant(options.context, toolsAllow, Boolean(projectNativeToolAuthority), run)
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-tool-policy.ts
/**
* Translate the caller's runtime tool cap into the CLI run's exact tool availability.
* A trusted completion handoff inherits the requester's persisted cap: native CLI tools
* cannot enforce it, so its whole surface goes through the policy projection as mediated
* MCP tools.
*/
function resolveCliRuntimeToolPolicy(input) {
	let { params } = input;
	let runtimeToolsAllowPolicy;
	if (params.toolsAllow !== void 0) {
		if (params.cliToolAvailability !== void 0) throw new Error(`CLI backend ${input.backendId} received conflicting runtime tool policies`);
		if (params.toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*")) params = {
			...params,
			toolsAllow: void 0
		};
		else {
			runtimeToolsAllowPolicy = [...params.toolsAllow];
			const fallbackOpenClawTools = uniqueStrings(expandToolGroups(params.toolsAllow).map((toolName) => normalizeToolPolicyName(toolName)).filter(Boolean));
			if (fallbackOpenClawTools.includes("write") && !fallbackOpenClawTools.includes("apply_patch")) fallbackOpenClawTools.push("apply_patch");
			params = {
				...params,
				toolsAllow: void 0,
				cliToolAvailability: {
					native: [],
					openClaw: fallbackOpenClawTools
				}
			};
		}
	}
	if (params.disableTools === true && !input.isSideQuestion && input.canEnforceExactToolAvailability) {
		runtimeToolsAllowPolicy = void 0;
		params = {
			...params,
			toolsAllow: void 0,
			cliToolAvailability: {
				native: [],
				openClaw: []
			}
		};
	}
	if (params.trustedInternalHandoff && params.disableTools !== true) {
		if (!input.canEnforceExactToolAvailability || !input.bundleMcp || input.skipsTurnPreparation || params.sessionEntry?.execHost === "node" || params.trustedInternalHandoff.settleBatch !== void 0) throw new Error(`CLI backend ${input.backendId} cannot enforce completion tool policy`);
		runtimeToolsAllowPolicy ??= ["*"];
		params = {
			...params,
			toolsAllow: void 0,
			cliToolAvailability: {
				native: [],
				openClaw: []
			}
		};
	}
	return {
		params,
		runtimeToolsAllowPolicy
	};
}
//#endregion
//#region src/agents/cli-runner/skills-prompt.ts
async function resolveCliSkillsPrompt(params) {
	params.assertCurrent();
	const agentWorkspaceDir = resolveAgentWorkspaceDir(params.config ?? {}, params.agentId);
	const executionWorkspace = resolveSessionSkillExecutionWorkspace(params.run.sessionEntry?.worktree?.canonicalWorkspaceDir, params.executionWorkspaceDir);
	const skillsSnapshot = params.run.skillsSnapshot ?? (await resolveReusableWorkspaceSkillSnapshot({
		assertCurrent: params.assertCurrent,
		workspaceDir: agentWorkspaceDir,
		...executionWorkspace,
		config: params.config ?? {},
		agentId: params.agentId,
		watch: false
	})).snapshot;
	params.assertCurrent();
	const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
		skillsSnapshot,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	params.assertCurrent();
	const { skillsEligibility, skillUsagePaths, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
		sandbox: sandboxWorkspace ? {
			...sandboxWorkspace,
			enabled: true
		} : void 0,
		skillsAnchorWorkspace: sandboxWorkspace?.workspaceDir ?? agentWorkspaceDir,
		skillsSnapshot
	});
	const { shouldLoadSkillEntries, skillEntries, loadSkillEntries, preserveEntryOrder } = await resolveEmbeddedRunSkillEntries({
		assertCurrent: params.assertCurrent,
		workspaceDir: skillsWorkspaceDir,
		...sandboxWorkspace ? {} : executionWorkspace,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility,
		skillsSnapshot: skillsSnapshotForRun,
		workspaceOnly
	});
	const promptSkillEntries = mapSandboxSkillEntriesForPrompt({
		entries: shouldLoadSkillEntries ? skillEntries : void 0,
		skillsWorkspaceDir,
		skillsPromptWorkspaceDir
	});
	return {
		...sandboxWorkspace ? { usagePaths: skillUsagePaths } : {},
		prompt: await resolveSkillsPrompt({
			assertCurrent: params.assertCurrent,
			skillsSnapshot: skillsSnapshotForRun,
			entries: promptSkillEntries,
			...sandboxWorkspace ? {} : { loadEntries: loadSkillEntries },
			workspaceDir: skillsPromptWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			eligibility: skillsEligibility,
			preserveEntryOrder
		})
	};
}
//#endregion
//#region src/agents/cli-runner/tool-authority.ts
/** Bind CLI and loopback questions to the original creator, not their callback transport. */
function bindCliQuestionAnswerAuthority(params) {
	return (sessionKey, assertActive) => {
		const source = params.readSource();
		source?.assertCurrent();
		return createAgentQuestionAnswerAuthority({
			sessionKey,
			requesterProfileId: source?.profileId,
			fingerprint: params.fingerprint,
			project: (caller) => params.operation ? params.operation.projectToolAuthorityFingerprint(caller) : params.snapshot?.project(caller, params.route),
			assertActive: () => {
				assertActive();
				source?.assertCurrent();
				params.assertSourceCurrent?.();
				params.signal?.throwIfAborted();
				if (params.operation && (params.operation.result || params.operation.toolAuthorityRoute?.provider !== params.route.provider || params.operation.toolAuthorityRoute.model !== params.route.model || params.operation.toolAuthorityFingerprint !== params.fingerprint)) throw new Error("question creator reply authority is no longer active");
				assertActive();
			}
		});
	};
}
/** Capture the original CLI caller before native tool availability replaces its tool cap. */
function prepareCliReplyToolAuthority(params, workspace) {
	return prepareReplyToolAuthority({
		originatingChannel: normalizeMessageChannel(params.messageChannel),
		toolsAllow: params.toolsAllow,
		disableTools: params.disableTools,
		operatorAuthority: readAdmittedRunOperatorAuthority(params.admittedRunContext) ?? readPreparedRunOperatorAuthority(params.preparedRunAdmission),
		run: {
			...params,
			agentId: workspace.agentId,
			chatType: params.chatType ?? params.sessionEntry?.chatType,
			provider: params.modelProvider ?? params.provider,
			model: params.model ?? "default",
			workspaceDir: workspace.workspaceDir,
			cwd: workspace.cwd,
			permissionMode: params.sessionEntry?.permissionMode,
			toolOverrides: params.toolOverrides ?? params.sessionEntry?.toolOverrides,
			senderId: params.senderId ?? void 0,
			senderName: params.senderName ?? void 0,
			senderUsername: params.senderUsername ?? void 0,
			senderE164: params.senderE164 ?? void 0,
			groupId: params.groupId ?? void 0,
			groupChannel: params.groupChannel ?? void 0,
			groupSpace: params.groupSpace ?? void 0,
			spawnedBy: params.spawnedBy ?? void 0
		}
	});
}
//#endregion
//#region src/agents/cli-runner/types.ts
function captureCliRunStartTime() {
	return {
		started: Date.now(),
		startedMonotonicMs: performance.now()
	};
}
//#endregion
//#region src/agents/cli-runner/prepare.ts
function unsupportedIsolatedCompletionError(backendId) {
	return Object.assign(/* @__PURE__ */ new Error(`CLI backend "${backendId}" does not support isolated completion; OpenClaw did not start the run.`), {
		name: "IsolatedCompletionUnsupportedError",
		code: "unsupported"
	});
}
async function prepareCliRunContext(inputParams) {
	if (!inputParams.sessionManager && inputParams.sessionTarget) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
		await restoreSessionColdTranscript(inputParams.sessionTarget);
	}
	return runWithSessionTranscriptReadFence(inputParams.sessionManager ? void 0 : inputParams.userTurnTranscriptRecorder?.getAdmissionReceipt(), () => prepareCliRunContextWithinReadFence(inputParams));
}
async function prepareCliRunContextWithinReadFence(inputParams) {
	let params = inputParams.config ? inputParams : {
		...inputParams,
		config: getRuntimeConfig()
	};
	if (params.sessionManager) params = {
		...params,
		sessionFile: `in-memory:${params.sessionManager.getSessionId()}`,
		sessionTarget: void 0,
		storePath: void 0,
		expectedLifecycleRevision: void 0,
		expectedWriterRunId: void 0,
		userTurnTranscriptRecorder: void 0,
		persistAssistantTranscript: void 0,
		prepareAssistantTranscriptMessage: void 0,
		contextEngineLogicalTurnLease: void 0,
		onContextEngineTurnCandidate: void 0
	};
	const runConfig = params.config;
	const sessionOwner = normalizeAgentId(parseAgentSessionKey(params.sessionKey)?.agentId || params.agentId?.trim() || "main");
	const workspaceConfig = hasAgentRosterProperty(runConfig) ? runConfig : {
		...runConfig,
		agents: {
			...runConfig.agents,
			entries: { [sessionOwner]: {} }
		}
	};
	const { started, startedMonotonicMs } = captureCliRunStartTime();
	const executionMode = params.executionMode ?? "agent";
	const isSideQuestion = executionMode === "side-question";
	const isControlOperation = params.controlOperation !== void 0;
	const skipsTurnPreparation = isSideQuestion || isControlOperation;
	const runtimeChatType = params.chatType ?? params.sessionEntry?.chatType;
	const workspaceResolution = resolveRunWorkspaceDir({
		workspaceDir: params.rootedExecution?.root ?? params.workspaceDir,
		sessionKey: params.sessionKey,
		agentId: sessionOwner,
		config: workspaceConfig
	});
	const resolvedWorkspace = workspaceResolution.workspaceDir;
	const redactedSessionId = redactRunIdentifier(params.sessionId);
	const redactedSessionKey = redactRunIdentifier(params.sessionKey);
	const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
	if (workspaceResolution.usedFallback) cliBackendLog.warn(`[workspace-fallback] caller=runCliAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`);
	const workspaceDir = resolvedWorkspace;
	const suppliedSessionKey = params.sessionKey?.trim();
	if (suppliedSessionKey) params = {
		...params,
		sessionKey: canonicalizeMainSessionAlias({
			cfg: runConfig,
			agentId: workspaceResolution.agentId,
			sessionKey: suppliedSessionKey
		})
	};
	if (!params.isolatedCompletion && !isControlOperation && !params.sessionManager) await waitForDeferredTurnMaintenanceForSession(params.sessionKey ?? params.sessionId);
	const policySessionKey = params.runtimePolicySessionKey ?? params.sessionKey;
	const policyAgentId = resolveSessionAgentIds({
		sessionKey: policySessionKey,
		config: runConfig,
		fallbackAgentId: params.runtimePolicySessionKey ? params.agentId : workspaceResolution.agentId
	}).sessionAgentId;
	const cwd = params.rootedExecution ? resolveUserPath(params.rootedExecution.root) : params.cwd ? resolveUserPath(params.cwd) : workspaceDir;
	const cwdHash = hashCliSessionText(cwd);
	const backendResolved = resolveCliBackendConfig(params.provider, params.config, { agentId: workspaceResolution.agentId });
	if (!backendResolved) throw new Error(`Unknown CLI backend: ${params.provider}`);
	params = prepareCliRunModelAuthority(params);
	const backendAuthPolicy = resolveBundledCliBackendAuthPolicy(backendResolved.id);
	const canEnforceExactToolAvailability = backendResolved.nativeToolMode === "selectable" && (backendResolved.toolAvailabilityEnforcement === "execution-args" && backendResolved.resolveExecutionArgs !== void 0 || backendResolved.toolAvailabilityEnforcement === "prepare-execution" && backendResolved.prepareExecution !== void 0);
	const questionOperation = params.toolAuthorityFingerprint ? params.replyOperation : void 0;
	const questionSessionKey = params.sessionKey ?? params.sessionId;
	const questionAbortSignal = params.abortSignal;
	const assertQuestionSourceCurrent = params.assertCurrent;
	const questionSnapshot = questionOperation ? void 0 : prepareCliReplyToolAuthority(params, {
		agentId: workspaceResolution.agentId,
		workspaceDir,
		cwd
	});
	const rootedToolsAllow = params.rootedExecution ? params.cliToolAvailability?.openClaw : void 0;
	const toolPolicy = resolveCliRuntimeToolPolicy({
		params,
		backendId: backendResolved.id,
		bundleMcp: backendResolved.bundleMcp,
		canEnforceExactToolAvailability,
		isSideQuestion,
		skipsTurnPreparation
	});
	params = toolPolicy.params;
	const { runtimeToolsAllowPolicy } = toolPolicy;
	const internalParams = params;
	const nodeClaudePlacement = detectNodeClaudePlacement({
		backendId: backendResolved.id,
		execHost: params.sessionEntry?.execHost,
		execNode: params.sessionEntry?.execNode
	});
	let rootedExecution;
	if (params.rootedExecution) {
		const rootedRequest = params.rootedExecution;
		if (backendResolved.isolatesInstructionsWithExactTools !== true) throw new Error(`CLI backend "${backendResolved.id}" does not declare instruction isolation with exact tools; collection review skipped`);
		if (!canEnforceExactToolAvailability || !backendResolved.bundleMcp || nodeClaudePlacement || skipsTurnPreparation || params.disableTools) throw new Error("CLI runtime cannot enforce rooted execution with mediated tools; collection review skipped");
		params = {
			...params,
			workspaceDir,
			cwd,
			disableCliLiveSession: true,
			cliToolAvailability: {
				native: [],
				openClaw: params.cliToolAvailability?.openClaw ?? []
			}
		};
		const admittedParams = await admitCliRunParams(params, workspaceResolution.agentId);
		const assertRootedCurrent = resolveAdmittedRunActiveAssertion(admittedParams.admittedRunContext, params.abortSignal);
		if (!assertRootedCurrent) throw new Error("Rooted CLI execution requires active admitted run authority");
		params = {
			...admittedParams,
			assertCurrent: () => {
				admittedParams.assertCurrent?.();
				admittedParams.abortSignal?.throwIfAborted();
				assertRootedCurrent();
			}
		};
		params.abortSignal?.throwIfAborted();
		assertRootedCurrent();
		rootedExecution = await prepareRootedExecutionCapability({
			rootedExecution: rootedRequest,
			config: params.config,
			agentId: workspaceResolution.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sandboxSessionKey: policySessionKey,
			sandboxAgentId: policyAgentId,
			execOverrides: params.execOverrides,
			permissionMode: params.sessionEntry?.permissionMode,
			skillsSnapshot: params.skillsSnapshot
		});
	}
	params.assertCurrent?.();
	params.abortSignal?.throwIfAborted();
	if (nodeClaudePlacement && params.cliToolAvailability) params = {
		...params,
		cliToolAvailability: {
			native: params.cliToolAvailability.native,
			openClaw: params.cliToolAvailability.openClaw.filter((name) => name === "skill_workshop")
		}
	};
	if (params.cliToolAvailability !== void 0 && !canEnforceExactToolAvailability) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce this run's tool cap. Upgrade its plugin and retry; if current, ask its maintainer to add exact-cap support. OpenClaw did not start the run.`);
	const sideQuestionDisablesNativeTools = isSideQuestion && backendResolved.sideQuestionToolMode === "disabled";
	const requestedNoNativeTools = params.cliToolAvailability?.native.length === 0;
	if (params.disableTools === true && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !requestedNoNativeTools) && !sideQuestionDisablesNativeTools) throw new Error(`CLI backend ${backendResolved.id} cannot run with tools disabled because it exposes native tools`);
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: sessionOwner
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
	const requestedAuthProfileId = params.authProfileId?.trim() || void 0;
	let effectiveAuthProfileId = requestedAuthProfileId ?? backendResolved.defaultAuthProfileId?.trim() ?? void 0;
	let authStore;
	let authCredential;
	let resolvedProfileAuth;
	const loadScopedAuthStore = (options = {}) => {
		params.assertCurrent?.();
		return loadAuthProfileStoreForRuntime(agentDir, {
			readOnly: options.readOnly ?? true,
			profileId: options.profileId,
			externalCli: externalCliDiscoveryForProviderAuth({
				cfg: params.config,
				provider: params.provider,
				...options.profileId ? { profileId: options.profileId } : {}
			})
		});
	};
	if (effectiveAuthProfileId) {
		authStore = loadScopedAuthStore({ profileId: effectiveAuthProfileId });
		authCredential = authStore.profiles[effectiveAuthProfileId];
	} else if (backendResolved.autoSelectAuthProfile !== false && (backendResolved.authEpochMode === "profile-only" || backendResolved.prepareExecution)) {
		authStore = loadScopedAuthStore();
		effectiveAuthProfileId = resolveAuthProfileOrder({
			cfg: params.config,
			store: authStore,
			provider: params.provider,
			includePendingOAuthRefresh: true
		})[0]?.trim() || void 0;
		if (effectiveAuthProfileId) authCredential = authStore.profiles[effectiveAuthProfileId];
	}
	if (effectiveAuthProfileId && authCredential && !isSetupCredentialAccessible({
		profileId: effectiveAuthProfileId,
		credential: authCredential,
		agentDir
	})) throw new Error("This saved sign-in is inactive. Test and activate it in Model Setup.");
	if (backendAuthPolicy?.nativeAuthProfileIds !== void 0 && effectiveAuthProfileId !== void 0 && backendAuthPolicy.nativeAuthProfileIds.includes(effectiveAuthProfileId)) {
		effectiveAuthProfileId = void 0;
		authCredential = void 0;
	} else if (effectiveAuthProfileId && backendAuthPolicy && (authCredential ? authCredential.type !== "oauth" || backendAuthPolicy.oauthRefreshOwner === "core" : backendAuthPolicy.strictSelectedProfile)) {
		const authProfileId = effectiveAuthProfileId;
		const profileResolutionError = (provider, resolvedProfileId) => {
			const loginCommand = buildOAuthRefreshFailureLoginCommand(provider, { profileId: authProfileId });
			const reason = resolvedProfileId !== void 0 ? `selected auth profile "${authProfileId}" resolved as "${resolvedProfileId}"` : `could not materialize selected auth profile "${authProfileId}"`;
			return new CliAuthProfilePreparationError({
				message: `CLI backend "${backendResolved.id}" ${reason}. Re-authenticate with: ${loginCommand}. OpenClaw did not start the run.`,
				profileId: authProfileId,
				provider,
				agentDir
			});
		};
		const writableAuthStore = loadScopedAuthStore({
			profileId: authProfileId,
			readOnly: false
		});
		const resolvedAuth = await resolveApiKeyForProfile({
			cfg: params.config,
			store: writableAuthStore,
			profileId: authProfileId,
			agentDir,
			...backendAuthPolicy?.strictSelectedProfile ? { allowProfileFallback: false } : {}
		});
		params.assertCurrent?.();
		if (!resolvedAuth && backendAuthPolicy?.strictSelectedProfile) throw profileResolutionError(writableAuthStore.profiles[authProfileId]?.provider ?? params.provider);
		if (resolvedAuth && backendAuthPolicy?.strictSelectedProfile && resolvedAuth.profileId !== authProfileId) throw profileResolutionError(writableAuthStore.profiles[authProfileId]?.provider ?? params.provider, resolvedAuth.profileId);
		const resolvedAuthProfileId = resolvedAuth?.profileId ?? authProfileId;
		authStore = loadScopedAuthStore({ profileId: resolvedAuthProfileId });
		authCredential = resolvedAuth?.credential ?? authStore.profiles[resolvedAuthProfileId];
		if (backendAuthPolicy?.strictSelectedProfile && (!authCredential || authCredential.type === "oauth" && !hasUsableOAuthCredential(authCredential))) throw profileResolutionError(resolvedAuth?.provider ?? params.provider);
		if (resolvedAuth && authCredential) {
			effectiveAuthProfileId = resolvedAuthProfileId;
			resolvedProfileAuth = {
				apiKey: resolvedAuth.apiKey,
				profileId: resolvedAuthProfileId,
				source: `profile:${resolvedAuthProfileId}`,
				mode: resolvedAuth.profileType === "api_key" ? "api-key" : resolvedAuth.profileType
			};
			if (authCredential.type === "api_key") authCredential = {
				...authCredential,
				key: resolvedAuth.apiKey
			};
			else if (authCredential.type === "token") authCredential = {
				...authCredential,
				token: resolvedAuth.apiKey
			};
		}
	}
	const extraSystemPrompt = params.extraSystemPrompt?.trim() ?? "";
	const bindingFacts = params.cliSessionBindingFacts;
	const bindingExtraSystemPromptStatic = bindingFacts?.extraSystemPromptStatic ?? params.extraSystemPromptStatic;
	const baseExtraSystemPromptHash = bindingExtraSystemPromptStatic !== void 0 ? hashCliSessionText(bindingExtraSystemPromptStatic.trim() || void 0) : hashCliSessionText(extraSystemPrompt);
	const requireExplicitMessageTarget = params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey);
	const hasCliSessionBindingFacts = bindingFacts !== void 0;
	const bindingRequireExplicitMessageTarget = bindingFacts?.requireExplicitMessageTarget ?? (hasCliSessionBindingFacts ? isSubagentSessionKey(params.sessionKey) : requireExplicitMessageTarget);
	const bindingSourceReplyDeliveryMode = hasCliSessionBindingFacts ? bindingFacts.sourceReplyDeliveryMode : params.sourceReplyDeliveryMode;
	const messageToolPolicyHash = bindingSourceReplyDeliveryMode !== void 0 || (hasCliSessionBindingFacts ? bindingFacts.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget : params.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget) ? hashCliSessionText(JSON.stringify({
		sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
		requireExplicitMessageTarget: bindingRequireExplicitMessageTarget
	})) : void 0;
	const modelId = (params.model ?? "default").trim() || "default";
	const modelProvider = normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.provider) ?? params.provider;
	const normalizedCatalogModel = normalizeCliModel(modelId, backendResolved.config);
	const normalizedModel = backendResolved.resolveModelId?.({
		modelId: normalizedCatalogModel,
		contextWindow: params.contextWindow
	}) ?? normalizedCatalogModel;
	const questionRoute = {
		provider: modelProvider,
		model: modelId
	};
	const questionFingerprint = questionOperation ? questionOperation.bindToolAuthorityRoute(questionRoute) : questionSnapshot?.fingerprint(questionRoute);
	if (questionOperation) params = {
		...params,
		toolAuthorityFingerprint: questionFingerprint
	};
	const bindQuestionAnswerAuthorityForSession = bindCliQuestionAnswerAuthority({
		operation: questionOperation,
		snapshot: questionSnapshot,
		route: questionRoute,
		fingerprint: questionFingerprint,
		readSource: () => readRunOperatorAuthority(params),
		assertSourceCurrent: assertQuestionSourceCurrent,
		signal: questionAbortSignal
	});
	const bindQuestionAnswerAuthority = (assertActive) => bindQuestionAnswerAuthorityForSession(questionSessionKey, assertActive);
	const modelDisplay = `${params.provider}/${modelId}`;
	let openClawHistoryMessages;
	const loadOpenClawHistoryMessages = async () => {
		openClawHistoryMessages ??= await loadCliSessionHistoryMessages(params);
		return openClawHistoryMessages;
	};
	const promptBuildHookContext = {
		runId: params.runId,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir,
		modelProviderId: params.provider,
		modelId,
		trigger: params.trigger,
		inputProvenance: params.inputProvenance,
		...buildAgentHookContextChannelFields(params)
	};
	const promptBuildHookRunner = skipsTurnPreparation ? void 0 : getGlobalHookRunner();
	const promptBuildHookResult = await (async () => {
		if (skipsTurnPreparation) return;
		try {
			return await resolvePromptBuildHookResult({
				config: runConfig,
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages(),
				hookCtx: promptBuildHookContext,
				hookRunner: promptBuildHookRunner
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
			return;
		}
	})();
	const promptBuildToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(promptBuildHookResult?.toolsAllow, { forceMessageTool: messageToolOwnsVisibleReply({ sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode }) });
	const promptBuildRestrictsTools = promptBuildToolsAllow !== void 0 && !promptBuildToolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*");
	const isClaudeCli = isClaudeCliBackendId(params.provider);
	const requestedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(modelId) : modelId;
	const normalizedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(normalizedCatalogModel) : normalizedCatalogModel;
	const contextModelIds = [requestedContextModelId, ...normalizedContextModelId !== requestedContextModelId ? [normalizedContextModelId] : []];
	const resolveContextModelTokens = (contextModelId) => resolveContextTokensForModel({
		cfg: params.config,
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		model: contextModelId,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false,
		allowUnscopedModelLookup: false
	});
	let modelContextTokens;
	for (const contextModelId of contextModelIds) {
		const candidateContextTokens = resolveContextModelTokens(contextModelId);
		if (candidateContextTokens !== void 0) modelContextTokens = modelContextTokens === void 0 ? candidateContextTokens : Math.min(modelContextTokens, candidateContextTokens);
	}
	modelContextTokens ??= DEFAULT_CONTEXT_TOKENS;
	const { selectableContextEntry, providerThinkingLevel } = resolveCliCatalogCapabilities({
		catalog: overlayConfiguredModelCatalog({
			catalog: loadManifestModelCatalog({
				config: runConfig,
				workspaceDir
			}),
			config: runConfig,
			workspaceDir
		}),
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		modelId,
		normalizedModel: normalizedCatalogModel,
		agentRuntime: backendResolved.id,
		thinkLevel: params.thinkLevel
	});
	if (selectableContextEntry) {
		const contextWindowProfile = resolveModelContextWindowProfile({
			catalogEntry: selectableContextEntry,
			selected: params.contextWindow
		});
		if (contextWindowProfile.contextWindow && contextWindowProfile.contextTokens !== void 0) modelContextTokens = Math.min(modelContextTokens, contextWindowProfile.contextTokens);
	}
	const resolvedContextWindowInfo = resolveContextWindowInfo({
		cfg: params.config,
		provider: params.provider,
		modelId,
		modelContextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const contextWindowInfo = resolvedContextWindowInfo.tokens > modelContextTokens ? {
		tokens: modelContextTokens,
		source: "model"
	} : resolvedContextWindowInfo;
	const autoReseedHistoryChars = isClaudeCli ? resolveAutoCliSessionReseedHistoryChars(contextWindowInfo.tokens) : void 0;
	const sessionLabel = params.sessionKey ?? params.sessionId;
	const { bootstrapFiles, contextFiles: resolvedContextFiles } = skipsTurnPreparation ? {
		bootstrapFiles: [],
		contextFiles: []
	} : await resolveBootstrapContextForRun({
		workspaceDir: params.bootstrapWorkspaceDir ?? workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		bootstrapUserProfileId: params.bootstrapUserProfileId,
		chatType: runtimeChatType,
		agentId: sessionAgentId,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn: makeBootstrapWarn({
			sessionLabel,
			workspaceDir,
			warn: (message) => cliBackendLog.warn(message)
		})
	});
	const canonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId));
	const selectedNativeToolsProvideFileAccess = params.cliToolAvailability === void 0 || params.cliToolAvailability.native.length > 0;
	const hasBootstrapFileAccess = (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable") && selectedNativeToolsProvideFileAccess && params.disableTools !== true;
	const bootstrapRouting = skipsTurnPreparation || !canTransportSystemPrompt(backendResolved.config) ? void 0 : await resolveWorkspaceBootstrapRouting({
		isWorkspaceBootstrapPending,
		bootstrapFiles,
		bootstrapFilesProvideAccess: false,
		bootstrapContextRunKind: params.bootstrapContextRunKind,
		trigger: params.trigger,
		sessionKey: params.sessionKey,
		isPrimaryRun: isPrimaryBootstrapRun(params.sessionKey),
		isCanonicalWorkspace: canonicalWorkspace === resolvedWorkspace,
		effectiveWorkspace: workspaceDir,
		resolvedWorkspace,
		hasBootstrapFileAccess
	});
	const bootstrapMode = bootstrapRouting?.bootstrapMode ?? "none";
	const includeBootstrapInSystemContext = bootstrapRouting?.includeBootstrapInSystemContext ?? true;
	const contextFiles = includeBootstrapInSystemContext ? resolvedContextFiles : resolvedContextFiles.filter((file) => !/(^|[\\/])BOOTSTRAP\.md$/iu.test(file.path.trim()));
	const bootstrapFilesForInjectionStats = includeBootstrapInSystemContext ? bootstrapFiles : bootstrapFiles.filter((file) => file.name !== DEFAULT_BOOTSTRAP_FILENAME);
	const bootstrapInjectionStats = buildBootstrapInjectionStats({
		bootstrapFiles: bootstrapFilesForInjectionStats,
		injectedFiles: contextFiles
	});
	const { bootstrapAnalysis, bootstrapMaxChars, bootstrapPromptWarning, bootstrapPromptWarningMode, bootstrapTotalMaxChars } = buildBootstrapBudgetState({
		config: params.config,
		agentId: sessionAgentId,
		files: bootstrapInjectionStats,
		seenSignatures: params.bootstrapPromptWarningSignaturesSeen,
		previousSignature: params.bootstrapPromptWarningSignature
	});
	const bootstrapTruncationNotice = buildBootstrapPromptWarningNotice(bootstrapPromptWarning.lines);
	const systemAgentMcpConfig = internalParams.systemAgentTool ? buildSystemAgentToolsMcpServerConfig(internalParams.systemAgentTool) : void 0;
	const bundleMcpEnabled = !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && backendResolved.bundleMcp && params.disableTools !== true;
	let mcpLoopbackRuntime = bundleMcpEnabled ? getActiveMcpLoopbackRuntime() : void 0;
	if (bundleMcpEnabled && !mcpLoopbackRuntime) {
		try {
			await ensureMcpLoopbackServer();
		} catch (error) {
			throw new Error(`Bundled MCP is enabled, but the OpenClaw MCP loopback server failed to start: ${String(error)}`, { cause: error });
		}
		mcpLoopbackRuntime = getActiveMcpLoopbackRuntime();
	}
	if (bundleMcpEnabled && !mcpLoopbackRuntime) throw new Error("Bundled MCP is enabled, but the OpenClaw MCP loopback server did not publish a runtime after startup.");
	const mcpDeliveryCaptureEnabled = bundleMcpEnabled && Boolean(mcpLoopbackRuntime);
	const { nodeWorkshopEnabled, hostOwnedTools } = resolveCliMcpToolOwnership(params, {
		backend: backendResolved,
		enabled: mcpDeliveryCaptureEnabled,
		nodePlacement: nodeClaudePlacement,
		rooted: Boolean(rootedExecution),
		skipPreparation: skipsTurnPreparation
	});
	const shouldMaterializeRuntimePolicy = runtimeToolsAllowPolicy !== void 0 && !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && params.disableTools !== true;
	const skillLibraryAuthoring = nodeWorkshopEnabled && params.skillLibraryAuthoring ? {
		...params.skillLibraryAuthoring,
		defaultTarget: "personal"
	} : params.skillLibraryAuthoring;
	const mcpContextBase = mcpLoopbackRuntime || shouldMaterializeRuntimePolicy || nodeWorkshopEnabled ? buildCliMcpGrantContext({
		run: params,
		config: runConfig,
		requireExplicitMessageTarget,
		agentId: sessionAgentId,
		runtimePolicyAgentId: params.runtimePolicySessionKey ? policyAgentId : void 0,
		modelProvider,
		modelId
	}) : void 0;
	const mcpToolAuthAgentDir = mcpContextBase ? resolveRuntimeAuthProfileAgentDir(agentDir) : void 0;
	const mcpToolAuth = mcpContextBase ? {
		...mcpToolAuthAgentDir ? { agentDir: mcpToolAuthAgentDir } : {},
		store: authStore ?? loadScopedAuthStore()
	} : void 0;
	params.assertCurrent?.();
	const mcpProjection = (bundleMcpEnabled || shouldMaterializeRuntimePolicy || nodeWorkshopEnabled) && mcpContextBase ? await prepareCliMcpToolProjection(params, {
		agentId: workspaceResolution.agentId,
		context: mcpContextBase,
		runtimeToolsAllowPolicy,
		rootedToolsAllow,
		defaultMediatedToolNames: hostOwnedTools,
		scope: {
			cfg: runConfig,
			rootedExecution,
			...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
			...mcpToolAuth ? { authProfileStore: mcpToolAuth.store } : {},
			...mcpToolAuth?.agentDir ? { authProfileStoreAgentDir: mcpToolAuth.agentDir } : {}
		},
		resolvePolicyTools: resolveMcpLoopbackPolicyTools,
		resolveScopedTools: resolveMcpLoopbackScopedTools
	}) : {
		params,
		tools: []
	};
	params = mcpProjection.params;
	params.assertCurrent?.();
	const hookFilteredProjectedTools = applyEmbeddedAttemptToolsAllow(mcpProjection.tools, promptBuildToolsAllow);
	if (promptBuildRestrictsTools && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !canEnforceExactToolAvailability)) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce before_prompt_build tool restrictions. Use a backend with exact tool availability or remove the hook restriction. OpenClaw did not start the run.`);
	if (promptBuildRestrictsTools && params.cliToolAvailability === void 0 && backendResolved.nativeToolMode === "selectable" || runtimeToolsAllowPolicy !== void 0 && shouldMaterializeRuntimePolicy || rootedExecution) params = {
		...params,
		cliToolAvailability: {
			native: [],
			openClaw: hookFilteredProjectedTools.map((tool) => tool.name)
		}
	};
	if (params.cliToolAvailability && promptBuildToolsAllow !== void 0) {
		const filterToolNames = (names) => applyEmbeddedAttemptToolsAllow(names.map((name) => ({ name })), promptBuildToolsAllow).map((tool) => tool.name);
		params = {
			...params,
			cliToolAvailability: {
				native: filterToolNames(params.cliToolAvailability.native),
				openClaw: filterToolNames(params.cliToolAvailability.openClaw)
			}
		};
	}
	const projectedTools = applyEmbeddedAttemptToolsAllow(hookFilteredProjectedTools, params.cliToolAvailability?.openClaw);
	const nodeSkillWorkshop = nodeWorkshopEnabled ? projectedTools.find((tool) => tool.name === "skill_workshop") : void 0;
	const promptTools = bundleMcpEnabled ? projectedTools : nodeSkillWorkshop ? [nodeSkillWorkshop] : [];
	const authorizedPromptBuildResult = await (async () => {
		const toolAuthorityFingerprint = params.toolAuthorityFingerprint;
		if (!promptBuildHookRunner || !toolAuthorityFingerprint) return;
		const admittedParams = await admitCliRunParams(params, workspaceResolution.agentId);
		params = admittedParams;
		const assertHostActive = resolveAdmittedRunActiveAssertion(admittedParams.admittedRunContext, admittedParams.abortSignal);
		if (!assertHostActive) return;
		try {
			return await promptBuildHookRunner.runAuthorizedPromptBuild({
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages()
			}, promptBuildHookContext, {
				toolAuthorityFingerprint,
				activeToolNames: promptTools.map((tool) => tool.name),
				assertHostActive
			});
		} catch (error) {
			cliBackendLog.warn(`authorized CLI prompt-build hook failed: ${String(error)}`);
			return;
		}
	})();
	params.assertCurrent?.();
	const messageToolAvailable = promptTools.some((tool) => normalizeToolPolicyName(tool.name) === "message");
	const resultContentSourceByToolName = new Map(promptTools.flatMap((tool) => tool.resultContentSource ? [[tool.name, tool.resultContentSource]] : []));
	const { mcpGrant, projectNativeToolAuthority, exclusiveTools } = prepareCliMcpGrant(params, {
		context: mcpContextBase,
		tools: projectedTools,
		promptBuildRestrictsTools,
		hostOwnedTools,
		nativeAuthorityAllowed: !skipsTurnPreparation && !nodeClaudePlacement,
		projectNativeToolAuthority: backendResolved.projectNativeToolAuthority
	});
	const extraSystemPromptHash = resolveCliBootstrapPromptHash({
		baseHash: params.cliToolAvailability ? hashCliSessionText(JSON.stringify([
			baseExtraSystemPromptHash ?? null,
			params.cliToolAvailability.native.toSorted(),
			params.cliToolAvailability.openClaw.toSorted()
		])) : baseExtraSystemPromptHash,
		bootstrapMode,
		bootstrapTruncationNotice,
		contextFiles
	});
	let cleanupPreparedResources;
	let preparedExecution;
	try {
		const mcpClientGrant = mcpLoopbackRuntime && mcpGrant ? mintMcpLoopbackClientGrant({
			...mcpGrant,
			runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
			bindQuestionAnswerAuthority: (assertActive) => bindQuestionAnswerAuthorityForSession(mcpGrant.context.sessionKey, assertActive),
			...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
			rootedExecution,
			...mcpToolAuth ? { toolAuth: mcpToolAuth } : {}
		}) : void 0;
		const bindMcpClientGrantAdmission = (admittedRunContext) => {
			if (mcpClientGrant && mcpLoopbackRuntime && !bindMcpLoopbackClientGrantAdmission({
				token: mcpClientGrant.token,
				runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
				admittedRunContext
			})) throw new Error("CLI MCP client grant is no longer valid for this admitted run");
		};
		const mcpClientGrantCapture = mcpClientGrant && mcpLoopbackRuntime ? (() => {
			let activeToken = mcpClientGrant.token;
			let activeCapture = false;
			return {
				transportToken: mcpClientGrant.token,
				adoptProcessToken: (processToken) => {
					if (activeToken === processToken) return;
					if (!transferMcpLoopbackClientGrant({
						sourceToken: mcpClientGrant.token,
						targetToken: processToken,
						runtimeOwnerToken: mcpLoopbackRuntime.ownerToken
					})) throw new Error("CLI MCP client grant could not transfer onto the live process bearer");
					activeToken = processToken;
				},
				revokeProcessToken: () => {
					revokeMcpLoopbackClientGrant(activeToken);
				},
				activate: (captureKey, assertCurrent) => {
					const activated = activateMcpLoopbackClientGrantCapture({
						token: activeToken,
						runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
						captureKey,
						assertCurrent
					});
					if (!activated) throw new Error("CLI MCP client grant is no longer valid for this Gateway runtime");
					activeCapture = activated;
				},
				deactivate: (captureKey) => {
					deactivateMcpLoopbackClientGrantCapture({
						token: activeToken,
						runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
						captureKey
					});
				},
				...projectNativeToolAuthority ? { captureNativeTools: (tools) => {
					params.assertCurrent?.();
					params.abortSignal?.throwIfAborted();
					if (!activeCapture || !activeCapture.captureNativeToolAuthority(null)) throw new Error("Native tool authority capture is no longer active.");
					if (!Array.isArray(tools) || !tools.every((name) => typeof name === "string")) throw new Error("Native runtime reported an invalid tool list; start a fresh session.");
					const selected = params.cliToolAvailability?.native;
					const capabilities = projectNativeToolAuthority(selected ? tools.filter((name) => selected.includes(name)) : tools);
					assertNativeCronCreatorCapabilities(capabilities);
					const allowed = resolveCliNativeWebSearchEnabled(params, backendResolved) ? capabilities : capabilities.filter((name) => name !== "web_search");
					if (!activeCapture.captureNativeToolAuthority(allowed)) throw new Error("Native tool authority capture is no longer active.");
				} } : {}
			};
		})() : void 0;
		let mcpClientGrantRevoked = false;
		const cleanupMcpClientGrant = mcpClientGrant ? async () => {
			if (mcpClientGrantRevoked) return;
			mcpClientGrantRevoked = true;
			revokeMcpLoopbackClientGrant(mcpClientGrant.token);
		} : void 0;
		cleanupPreparedResources = cleanupMcpClientGrant;
		const rawLoopbackServerConfig = mcpLoopbackRuntime ? createMcpLoopbackServerConfig(mcpLoopbackRuntime.port) : void 0;
		const loopbackServerConfig = rawLoopbackServerConfig && backendResolved.bundleMcpMode === "claude-config-file" ? applyClaudeManagedMcpTimeout(rawLoopbackServerConfig) : rawLoopbackServerConfig;
		const sandboxStatus = resolveSandboxRuntimeStatus({
			cfg: runConfig,
			sessionKey: policySessionKey,
			agentId: policyAgentId
		});
		const nativeMcpCapabilityProfile = resolveConversationCapabilityProfile({
			config: runConfig,
			sessionKey: policySessionKey,
			runSessionKey: params.sessionKey && params.sessionKey !== policySessionKey ? params.sessionKey : void 0,
			sessionId: params.sessionId,
			runId: params.runId,
			agentId: policyAgentId,
			agentAccountId: params.agentAccountId,
			messageProvider: params.messageProvider ?? params.messageChannel,
			messageChannel: params.messageChannel,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderIsOwner: params.senderIsOwner,
			modelProvider,
			modelId,
			workspaceDir,
			cwd,
			sandboxToolPolicy: sandboxStatus.sandboxed ? sandboxStatus.toolPolicy : void 0,
			runtimeToolAllowlist: runtimeToolsAllowPolicy,
			inheritRuntimeToolAllowlist: true,
			inputProvenance: params.inputProvenance,
			trustedInternalHandoff: params.trustedInternalHandoff,
			scheduledToolPolicy: params.scheduledToolPolicy
		});
		const preparedBackend = await prepareCliBundleMcpConfig({
			enabled: bundleMcpEnabled || systemAgentMcpConfig !== void 0,
			mode: backendResolved.bundleMcpMode,
			backend: backendResolved.config,
			workspaceDir,
			config: params.config,
			toolOverrides: params.toolOverrides,
			agentDir,
			...systemAgentMcpConfig ? { exclusiveConfig: systemAgentMcpConfig } : exclusiveTools && loopbackServerConfig ? { exclusiveConfig: loopbackServerConfig } : {},
			additionalConfig: exclusiveTools ? void 0 : loopbackServerConfig,
			env: mcpLoopbackRuntime && mcpClientGrant ? {
				OPENCLAW_MCP_TOKEN: mcpClientGrant.token,
				OPENCLAW_MCP_CLI_CAPTURE_KEY: ""
			} : void 0,
			warn: (message) => cliBackendLog.warn(message),
			...!systemAgentMcpConfig && !exclusiveTools ? { nativeMcpPolicy: {
				sessionId: params.sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				capabilityProfile: nativeMcpCapabilityProfile,
				...runtimeToolsAllowPolicy !== void 0 ? { runtimeToolsAllow: runtimeToolsAllowPolicy } : {}
			} } : {}
		});
		const cleanupPreparedBackend = preparedBackend.cleanup || cleanupMcpClientGrant ? async () => {
			try {
				await preparedBackend.cleanup?.();
			} finally {
				await cleanupMcpClientGrant?.();
			}
		} : void 0;
		cleanupPreparedResources = cleanupPreparedBackend;
		const prepareExecutionContext = {
			config: params.config,
			workspaceDir,
			agentDir,
			provider: params.provider,
			modelId,
			...params.contextWindow ? { contextWindow: params.contextWindow } : {},
			contextTokenBudget: contextWindowInfo.tokens,
			thinkingLevel: providerThinkingLevel,
			authProfileId: effectiveAuthProfileId,
			executionMode,
			toolAvailability: params.cliToolAvailability,
			env: preparedBackend.env
		};
		const privatePrepareExecutionContext = params.isolatedCompletion ? {
			...prepareExecutionContext,
			isolatedCompletionCwd: cwd,
			isolatedCompletionModelId: normalizedModel,
			isolatedCompletionPrompt: params.prompt,
			isolatedCompletionSystemPrompt: params.extraSystemPrompt ?? ""
		} : prepareExecutionContext;
		try {
			params.assertCurrent?.();
			const backendPrepareContext = backendAuthPolicy ? {
				...privatePrepareExecutionContext,
				authCredential
			} : privatePrepareExecutionContext;
			preparedExecution = await backendResolved.prepareExecution?.(backendPrepareContext) ?? void 0;
		} catch (error) {
			if (error instanceof CliBackendAuthProfilePreparationError && effectiveAuthProfileId) throw new CliAuthProfilePreparationError({
				message: error.message,
				profileId: effectiveAuthProfileId,
				provider: authStore?.profiles[effectiveAuthProfileId]?.provider ?? params.provider,
				agentDir,
				cause: error
			});
			throw error;
		}
		const pluginExecutionConsumer = retainCliPluginExecutionConsumer(preparedExecution?.execute);
		const preparedBackendCleanup = cleanupPreparedBackend || preparedExecution?.cleanup || pluginExecutionConsumer ? async () => {
			try {
				const cleanupExecution = () => preparedExecution?.cleanup?.();
				await (pluginExecutionConsumer ? pluginExecutionConsumer.run(cleanupExecution) : cleanupExecution());
			} finally {
				try {
					await cleanupPreparedBackend?.();
				} finally {
					pluginExecutionConsumer?.release();
				}
			}
		} : void 0;
		cleanupPreparedResources = preparedBackendCleanup;
		params.assertCurrent?.();
		if (params.isolatedCompletion && preparedExecution?.isolatedCompletionEnforced !== true) throw unsupportedIsolatedCompletionError(backendResolved.id);
		if (params.cliToolAvailability && backendResolved.toolAvailabilityEnforcement === "prepare-execution" && preparedExecution?.toolAvailabilityEnforced !== true) throw new Error(`CLI backend ${backendResolved.id} did not enforce exact per-run tool availability during execution preparation`);
		const skipLocalCredentialEpoch = Boolean(backendResolved.authEpochMode === "profile-only" && effectiveAuthProfileId && authCredential && preparedExecution);
		const authEpoch = await resolveCliAuthEpoch({
			provider: params.provider,
			agentDir,
			authProfileId: effectiveAuthProfileId,
			skipLocalCredential: skipLocalCredentialEpoch
		});
		const authBindingFingerprint = params.onSuccessfulAuthBinding ? resolveCliAuthBindingFingerprint({
			provider: params.provider,
			config: runConfig,
			agentDir,
			...effectiveAuthProfileId ? { authProfileId: effectiveAuthProfileId } : {},
			...resolvedProfileAuth ? { resolvedAuth: resolvedProfileAuth } : {},
			...skipLocalCredentialEpoch ? { skipLocalCredential: true } : {}
		}) : void 0;
		const preparedBackendEnv = preparedExecution?.env && Object.keys(preparedExecution.env).length > 0 ? {
			...preparedBackend.env,
			...preparedExecution.env
		} : preparedBackend.env;
		const preparedBackendBeforeExecution = preparedBackend.beforeExecution || preparedExecution?.beforeExecution ? async () => {
			await preparedBackend.beforeExecution?.();
			await preparedExecution?.beforeExecution?.();
		} : void 0;
		const claudeSkillsPlugin = rootedExecution || skipsTurnPreparation || nodeClaudePlacement ? {
			args: [],
			cleanup: async () => {}
		} : await prepareClaudeCliSkillsPlugin({
			backendId: backendResolved.id,
			skillsSnapshot: params.skillsSnapshot
		});
		let claudeSkillsPluginClaimed = false;
		const claimLiveSessionResources = claudeSkillsPlugin.args.length > 0 ? () => {
			if (claudeSkillsPluginClaimed) return;
			claudeSkillsPluginClaimed = true;
			return claudeSkillsPlugin.cleanup;
		} : void 0;
		const preparedCleanup = preparedBackendCleanup || claudeSkillsPlugin.args.length > 0 ? async () => {
			try {
				if (!claudeSkillsPluginClaimed) await claudeSkillsPlugin.cleanup();
			} finally {
				await preparedBackendCleanup?.();
			}
		} : void 0;
		cleanupPreparedResources = preparedCleanup ?? preparedBackendCleanup;
		const preparedBackendClearEnv = [...preparedBackend.backend.clearEnv ?? [], ...preparedExecution?.clearEnv ?? []];
		const { liveSession: _liveSession, ...processPerTurnBackend } = preparedBackend.backend;
		const preparedBackendFinal = {
			...preparedBackend,
			backend: {
				...isSideQuestion ? {
					...processPerTurnBackend,
					sessionMode: "none"
				} : params.disableCliLiveSession ? processPerTurnBackend : preparedBackend.backend,
				...preparedBackendClearEnv.length > 0 ? { clearEnv: uniqueStrings(preparedBackendClearEnv) } : {}
			},
			...preparedBackendEnv ? { env: preparedBackendEnv } : {},
			...preparedBackendBeforeExecution ? { beforeExecution: preparedBackendBeforeExecution } : {},
			...claimLiveSessionResources ? { claimLiveSessionResources } : {},
			...preparedExecution?.secretInput ? { secretInput: preparedExecution.secretInput } : {},
			...mcpClientGrantCapture ? { mcpClientGrantCapture } : {},
			...preparedCleanup ? { cleanup: preparedCleanup } : {}
		};
		const executionTarget = resolveCliExecutionTarget({
			params,
			backendId: backendResolved.id,
			execute: preparedExecution?.execute
		});
		const promptToolNamesHash = bundleMcpEnabled && mcpLoopbackRuntime ? hashCliSessionText(JSON.stringify(promptTools.map((tool) => tool.name).toSorted())) : void 0;
		const ignoreCliSessionCandidate = isSideQuestion || preparedBackendFinal.backend.sessionMode === "none";
		const controlOperationCliSessionId = isControlOperation ? params.cliSessionBinding?.sessionId?.trim() || params.cliSessionId?.trim() : void 0;
		const reusableCliSessionCandidate = ignoreCliSessionCandidate ? { mode: "none" } : controlOperationCliSessionId ? {
			mode: "reuse",
			sessionId: controlOperationCliSessionId
		} : params.cliSessionBinding ? resolveCliSessionReuse({
			binding: params.cliSessionBinding,
			authProfileId: effectiveAuthProfileId,
			authEpoch,
			authEpochVersion: 7,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			cwdHash,
			mcpConfigHash: preparedBackendFinal.mcpConfigHash,
			mcpResumeHash: preparedBackendFinal.mcpResumeHash
		}) : params.cliSessionId ? {
			mode: "reuse",
			sessionId: params.cliSessionId
		} : { mode: "none" };
		const backendReusableCliSession = reusableCliSessionCandidate.mode === "reuse-with-drift" && !canTransportSystemPrompt(preparedBackendFinal.backend) ? {
			mode: "invalidate",
			invalidatedReason: "system-prompt"
		} : reusableCliSessionCandidate;
		const candidateClaudeCliSessionId = resolveCliSessionId(backendReusableCliSession)?.trim() || void 0;
		const hasClaudeCliCandidate = !isControlOperation && !nodeClaudePlacement && candidateClaudeCliSessionId !== void 0 && isClaudeCliBackendId(params.provider);
		const claudeCliTranscriptMissing = hasClaudeCliCandidate && !await claudeCliSessionTranscriptHasContent({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const managedClaudeLiveSessionGeneration = claudeCliTranscriptMissing && backendResolved.id === "claude-cli" && "liveSession" in preparedBackendFinal.backend && preparedBackendFinal.backend.liveSession === "claude-stdio" && preparedBackendFinal.backend.output === "jsonl" && preparedBackendFinal.backend.input === "stdin" && getCliLiveSessionGeneration({
			backendId: backendResolved.id,
			agentId: workspaceResolution.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
		const hasManagedClaudeLiveSession = Boolean(managedClaudeLiveSessionGeneration);
		const claudeCliTranscriptOrphanedToolUse = hasClaudeCliCandidate && !claudeCliTranscriptMissing && await claudeCliSessionTranscriptHasOrphanedToolUse({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const claudeCliInvalidatedReason = claudeCliTranscriptMissing && !hasManagedClaudeLiveSession ? "missing-transcript" : claudeCliTranscriptOrphanedToolUse ? "orphaned-tool-use" : void 0;
		const reusableCliSession = claudeCliInvalidatedReason ? {
			mode: "invalidate",
			invalidatedReason: claudeCliInvalidatedReason
		} : backendReusableCliSession;
		const reusableCliSessionId = resolveCliSessionId(reusableCliSession);
		const invalidatedReason = reusableCliSession.mode === "invalidate" ? reusableCliSession.invalidatedReason : void 0;
		if (invalidatedReason) cliBackendLog.info(`cli session reset: provider=${params.provider} reason=${invalidatedReason}`);
		const openClawReferences = skipsTurnPreparation ? {
			docsPath: null,
			sourcePath: null
		} : await (await import("./docs-path-D8Pr1WaD.mjs")).resolveOpenClawReferencePaths({
			workspaceDir,
			argv1: process.argv[1],
			cwd,
			moduleUrl: import.meta.url
		});
		const skillPreparationParams = params;
		const assertSkillsCurrent = skillPreparationParams.admittedRunContext ? createCliRunCurrentAssertion({
			...skillPreparationParams,
			admittedRunContext: skillPreparationParams.admittedRunContext
		}) : () => {
			skillPreparationParams.assertCurrent?.();
			skillPreparationParams.abortSignal?.throwIfAborted();
			skillPreparationParams.preparedRunAdmission?.assertSourceCurrent();
		};
		const preparedSkills = rootedExecution ? { prompt: params.skillsSnapshot?.prompt ?? "" } : skipsTurnPreparation || nodeClaudePlacement || claudeSkillsPlugin.args.length > 0 ? { prompt: "" } : await resolveCliSkillsPrompt({
			assertCurrent: assertSkillsCurrent,
			run: params,
			workspaceDir,
			executionWorkspaceDir: cwd,
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey?.trim() || params.sessionId
		});
		assertSkillsCurrent();
		const systemPromptSkillsPrompt = preparedSkills.prompt;
		const runtimeChannel = skipsTurnPreparation ? void 0 : normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = skipsTurnPreparation ? void 0 : collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const requesterProfileId = readRunOperatorAuthority(params)?.profileId;
		const builtSystemPrompt = isControlOperation ? "" : isSideQuestion ? extraSystemPrompt : await prepareCliSystemPrompt({
			requesterProfileId,
			workspaceDir,
			cwd,
			config: params.config,
			extraSystemPrompt,
			sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
			requireExplicitMessageTarget: bindingRequireExplicitMessageTarget,
			silentReplyPromptMode: params.silentReplyPromptMode,
			runtimeChannel,
			runtimeChatType,
			runtimeCapabilities,
			ownerNumbers: params.ownerNumbers,
			docsPath: openClawReferences.docsPath ?? void 0,
			sourcePath: openClawReferences.sourcePath ?? void 0,
			skillsPrompt: systemPromptSkillsPrompt,
			tools: promptTools,
			contextFiles,
			bootstrapMode,
			bootstrapTruncationNotice,
			modelDisplay,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const transformedSystemPrompt = !skipsTurnPreparation ? backendResolved.transformSystemPrompt?.({
			config: params.config,
			workspaceDir,
			provider: params.provider,
			modelId,
			modelDisplay,
			agentId: sessionAgentId,
			systemPrompt: builtSystemPrompt,
			openClawMcpToolNames: systemAgentMcpConfig ? ["openclaw"] : bundleMcpEnabled ? projectedTools.map((tool) => tool.name) : []
		}) ?? builtSystemPrompt : builtSystemPrompt;
		const turnRuntimeFacts = params.runtimeFactsInTurn && !skipsTurnPreparation ? splitSystemPromptRelocatableBoundary(transformedSystemPrompt) : void 0;
		let systemPrompt = turnRuntimeFacts?.remainingPrompt ?? transformedSystemPrompt;
		const allowRawTranscriptReseed = backendResolved.config.reseedFromRawTranscriptWhenUncompacted === true;
		const historyParams = params = await admitCliRunParams(params, workspaceResolution.agentId);
		const cliHistoryWriter = !isSideQuestion ? await prepareCliHistoryBoundary(historyParams, { credential: authCredential }) : void 0;
		const rawTranscriptReseedReason = !(params.sessionManager !== void 0 || cliHistoryWriter !== void 0) ? "auth-unknown" : reusableCliSessionId ? "session-expired" : invalidatedReason ?? (ignoreCliSessionCandidate ? void 0 : "missing-transcript");
		const sessionPromptContext = skipsTurnPreparation || params.isolatedCompletion ? void 0 : await loadCliSessionPromptContext({
			abortSignal: params.abortSignal,
			sessionManager: params.sessionManager,
			sessionTarget: params.sessionTarget,
			allowRawTranscriptReseed,
			rawTranscriptReseedReason
		});
		const effectiveReplyGuidance = skipsTurnPreparation || params.isolatedCompletion ? void 0 : buildHarnessVisibleReplyGuidance({
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			messageToolAvailable,
			requireExplicitMessageTarget
		});
		const finalizedTranscriptPrompt = (params.finalizePromptForResolvedTools || sessionPromptContext?.durableContext || effectiveReplyGuidance) && params.transcriptPrompt === void 0 ? params.prompt : params.transcriptPrompt;
		let promptContext;
		let promptForHooks;
		let preparedPrompt = isControlOperation ? params.prompt : params.finalizePromptForResolvedTools?.({
			prompt: params.prompt,
			messageToolAvailable
		}) ?? params.prompt;
		if (!isControlOperation && params.skillsSnapshot?.librarySelections?.length) preparedPrompt = remapSkillReferencePaths(preparedPrompt, preparedSkills.usagePaths);
		if (!skipsTurnPreparation) {
			({prompt: preparedPrompt, systemPrompt, promptContext, promptForHooks} = await prepareCliTurnPromptContext({
				prompt: preparedPrompt,
				systemPrompt,
				privateContext: executionTarget.kind === "plugin",
				deliveryGuidance: effectiveReplyGuidance,
				hookResult: promptBuildHookResult,
				prependContext: [
					sessionPromptContext?.durableContext,
					promptBuildHookResult?.prependContext,
					authorizedPromptBuildResult?.prependContext
				],
				requesterProfileId,
				capabilityToolNames: new Set(promptTools.map((tool) => tool.name)),
				sessionKey: params.sessionKey,
				agentId: sessionAgentId,
				backend: preparedBackendFinal.backend,
				isNewSession: !reusableCliSessionId?.trim() || reusableCliSession.mode === "reuse-with-drift",
				thinkLevel: params.thinkLevel,
				runtimeContextFragments: params.runtimeContextFragments,
				context: [
					turnRuntimeFacts?.relocatable,
					promptBuildHookResult?.appendContext,
					authorizedPromptBuildResult?.appendContext
				]
			}));
			params.assertCurrent?.();
			params.abortSignal?.throwIfAborted();
		}
		let historyPromptCurrentTurn = preparedPrompt;
		if (!skipsTurnPreparation) {
			const currentInboundContext = prependCliSessionDriftUserContext(params.currentInboundContext, reusableCliSession);
			const renderCurrentPrompt = (prompt, preferResumableText = false) => annotateInterSessionPromptText(buildCurrentInboundPrompt({
				context: currentInboundContext,
				prompt,
				preferResumableText
			}), params.inputProvenance);
			const preferResumableText = params.currentInboundEventKind === "room_event" && Boolean(reusableCliSessionId);
			historyPromptCurrentTurn = renderCurrentPrompt(preparedPrompt);
			preparedPrompt = renderCurrentPrompt(preparedPrompt, preferResumableText);
			if (promptForHooks !== void 0) promptForHooks = renderCurrentPrompt(promptForHooks, preferResumableText);
		}
		let openClawHistoryPrompt = !skipsTurnPreparation && (!reusableCliSessionId || allowRawTranscriptReseed) ? buildCliSessionHistoryPrompt({
			messages: sessionPromptContext?.reseedMessages ?? [],
			prompt: historyPromptCurrentTurn,
			maxHistoryChars: autoReseedHistoryChars
		}) : void 0;
		const systemPromptWithReplacements = skipsTurnPreparation ? systemPrompt : applyPluginTextReplacements(systemPrompt, backendResolved.textTransforms?.input);
		systemPrompt = skipsTurnPreparation ? systemPromptWithReplacements : appendModelIdentitySystemPrompt({
			systemPrompt: buildModelIdentityPromptLine(modelDisplay) && systemPromptWithReplacements.trim().length > 0 ? ensureSystemPromptCacheBoundary(systemPromptWithReplacements) : systemPromptWithReplacements,
			model: modelDisplay
		});
		const systemPromptReport = buildSystemPromptReport({
			source: "run",
			generatedAt: Date.now(),
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			provider: params.provider,
			model: modelId,
			workspaceDir,
			bootstrapMaxChars,
			bootstrapTotalMaxChars,
			bootstrapTruncation: buildBootstrapTruncationReportMeta({
				analysis: bootstrapAnalysis,
				warningMode: bootstrapPromptWarningMode,
				warning: bootstrapPromptWarning
			}),
			sandbox: rootedExecution ? {
				mode: sandboxStatus.mode,
				sandboxed: Boolean(rootedExecution.sandbox)
			} : {
				mode: "off",
				sandboxed: false
			},
			systemPrompt,
			injectedWorkspaceFiles: bootstrapInjectionStats,
			skillsPrompt: systemPromptSkillsPrompt,
			tools: promptTools,
			currentTurn: {
				...params.currentInboundEventKind ? { kind: params.currentInboundEventKind } : {},
				promptChars: preparedPrompt.length,
				runtimeContextChars: [promptContext?.prependContext, promptContext?.appendContext].filter(Boolean).join("\n\n").length
			}
		});
		const buildPreparedContext = (preparedParams) => ({
			params: preparedParams,
			bindQuestionAnswerAuthority,
			effectiveAuthProfileId,
			...authStore ? { authProfileStore: authStore } : {},
			agentDir,
			started,
			startedMonotonicMs,
			workspaceDir,
			cwd,
			backendResolved,
			hostOwnedTools,
			preparedBackend: preparedBackendFinal,
			...loopbackServerConfig && !systemAgentMcpConfig && backendResolved.bundleMcpMode === "claude-config-file" ? { managedMcpToolTimeoutMs: CLAUDE_MANAGED_MCP_TIMEOUT_MS } : {},
			executionTarget,
			...pluginExecutionConsumer ? { pluginExecutionConsumer } : {},
			reusableCliSession,
			contextEngineConfig: runConfig,
			modelId,
			normalizedModel,
			providerThinkingLevel,
			contextWindowInfo,
			systemPrompt,
			systemPromptReport,
			claudeSkillsPluginArgs: claudeSkillsPlugin.args,
			...cliHistoryWriter ? { cliHistoryWriter } : {},
			authEpoch,
			authBindingFingerprint,
			...skipLocalCredentialEpoch ? { authBindingSkipsLocalCredential: true } : {},
			authEpochVersion: 7,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			...resultContentSourceByToolName.size > 0 ? { resultContentSourceByToolName } : {},
			cwdHash,
			...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
		});
		const admitFinalParams = () => admitCliRunParams({
			...params,
			config: runConfig,
			prompt: preparedPrompt,
			transcriptPrompt: finalizedTranscriptPrompt,
			...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
		}, workspaceResolution.agentId);
		const bindPreparedParams = (preparedParams) => {
			bindMcpClientGrantAdmission(preparedParams.admittedRunContext);
			if (!isControlOperation) recordAdmittedModelRoutingDecision({
				admittedRunContext: preparedParams.admittedRunContext,
				abortSignal: preparedParams.abortSignal,
				requestedProvider: params.modelRoutingProvenance?.requestedProvider ?? params.modelProvider ?? params.provider,
				requestedModel: params.modelRoutingProvenance?.requestedModel ?? params.model ?? "default",
				selectedProvider: params.modelProvider ?? params.provider,
				selectedModel: normalizedModel,
				selectionMode: requestedAuthProfileId ? "explicit" : "automatic",
				credentialProfileId: effectiveAuthProfileId,
				fallbackSelected: params.modelRoutingProvenance?.stage === "fallback",
				fallbackReason: params.modelRoutingProvenance?.fallbackReason
			});
		};
		if (skipsTurnPreparation) {
			const preparedParams = await admitFinalParams();
			bindPreparedParams(preparedParams);
			return {
				...buildPreparedContext(preparedParams),
				hadSessionFile: false
			};
		}
		const contextEngineAgentDir = resolveAgentDir(runConfig, sessionAgentId);
		const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({
			backendId: backendResolved.id,
			capabilities: backendResolved.contextEngineHostCapabilities
		});
		let resolvedContextEngine;
		let deferContextEngineDisposalUntil = params.contextEngineLogicalTurnLease?.deferDisposalUntil;
		if (params.contextEngineLogicalTurnLease) {
			selectContextEngineForTranscriptHost({
				lease: params.contextEngineLogicalTurnLease,
				host: contextEngineHostSupport,
				operation: "agent-run",
				recorder: params.userTurnTranscriptRecorder
			});
			await drainPendingContextEngineTurnsBeforeRun({
				admission: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
				isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
				lease: params.contextEngineLogicalTurnLease,
				recorder: params.userTurnTranscriptRecorder,
				sessionTarget: params.sessionTarget
			});
			resolvedContextEngine = params.contextEngineLogicalTurnLease.begin().engine;
		} else {
			const trackDisposal = captureAsyncWorkTracker();
			const ownedEngine = await resolveContextEngine(runConfig, {
				initialize: ensureContextEnginesInitialized,
				agentDir: contextEngineAgentDir,
				workspaceDir
			});
			resolvedContextEngine = ownedEngine;
			const previousCleanup = cleanupPreparedResources;
			const disposalHolds = /* @__PURE__ */ new Set();
			deferContextEngineDisposalUntil = (promise) => {
				disposalHolds.add(promise);
				promise.finally(() => disposalHolds.delete(promise)).catch(() => {});
			};
			cleanupPreparedResources = async () => {
				try {
					if (disposalHolds.size > 0) trackDisposal(async () => {
						await Promise.allSettled(disposalHolds);
						await runCliCleanup(params, "cli-context-engine-release", async () => {
							await ownedEngine.dispose?.();
						});
					}).catch((error) => {
						cliBackendLog.warn(`CLI context engine cleanup failed: ${String(error)}`);
					});
					else await ownedEngine.dispose?.();
				} finally {
					await previousCleanup?.();
				}
			};
			preparedBackendFinal.cleanup = cleanupPreparedResources;
		}
		const contextEngine = resolvedContextEngine.info.id !== "legacy" ? resolvedContextEngine : void 0;
		if (contextEngine) assertContextEngineHostSupport({
			contextEngine,
			operation: "agent-run",
			host: contextEngineHostSupport
		});
		const hadSessionFile = await hasCliSessionTranscript(params);
		const contextEngineTurnPrompt = params.transcriptPrompt ?? params.prompt;
		let preparedParams = await admitFinalParams();
		bindPreparedParams(preparedParams);
		const note = await claimHeartbeatContextForUserRun({
			...preparedParams,
			agentId: sessionAgentId,
			storePath: params.sessionTarget?.storePath ?? params.storePath,
			detached: Boolean(params.sessionManager || params.isolatedCompletion),
			assertCurrent: createCliRunCurrentAssertion(preparedParams)
		});
		if (note) {
			preparedParams = {
				...preparedParams,
				transcriptPrompt: finalizedTranscriptPrompt ?? params.prompt
			};
			const append = (text) => composeCliPromptContext(text, { appendContext: note });
			if (executionTarget.kind === "plugin") {
				promptContext = {
					...promptContext,
					appendContext: append(promptContext?.appendContext ?? "")
				};
				promptForHooks = append(promptForHooks ?? preparedParams.prompt);
			} else {
				preparedParams.prompt = append(preparedParams.prompt);
				if (openClawHistoryPrompt) openClawHistoryPrompt = append(openClawHistoryPrompt);
			}
		}
		return {
			...buildPreparedContext(preparedParams),
			...managedClaudeLiveSessionGeneration ? { requiredClaudeLiveSessionGeneration: managedClaudeLiveSessionGeneration } : {},
			hadSessionFile,
			contextEngine,
			deferContextEngineDisposalUntil,
			contextEngineTurnPrompt,
			...promptContext ? {
				promptContext,
				promptForHooks
			} : {},
			...nodeSkillWorkshop ? { nodeSkillWorkshop } : {},
			...openClawHistoryPrompt ? { openClawHistoryPrompt } : {}
		};
	} catch (err) {
		try {
			await runCliCleanup(params, "cli-prepare-failure", async () => {
				await cleanupPreparedResources?.();
			});
		} catch (cleanupErr) {
			cliBackendLog.warn(`cli backend cleanup after prepare failure failed: ${String(cleanupErr)}`);
		}
		throw err;
	}
}
//#endregion
export { detectNodeClaudePlacement as n, prepareCliRunContext as t };
