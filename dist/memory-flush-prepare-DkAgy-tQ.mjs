import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { o as getMemoryProviderRuntime } from "./memory-state-B2gqTM3p.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-CPayZwJR.mjs";
import { o as withSessionContextAdmission } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CJh4GhW9.mjs";
import { i as delegateMemoryAudience, o as resolveMemoryAudienceFromEntry } from "./memory-audience-BXWFf-XD.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { d as resolveModelFallbackOptions } from "./agent-runner-utils-C32xXg2V.mjs";
import { r as resolveMemoryFlushPlanForRun, t as isToolsMemoryFlushPlan } from "./memory-flush-plan-CalvqxH6.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/auto-reply/reply/memory-flush-session.ts
/**
* Derive one UUID-shaped mutation identity from the source session incarnation
* (session ID and lifecycle revision) and its pre-compaction count. The count
* advances after each completed compaction, so retries within one cycle reuse
* the ID and later cycles do not. A reset keeps the session ID and restarts the
* count but rotates the lifecycle revision, so a new incarnation never reuses an ID.
*/
function deriveMemoryFlushId(params) {
	const bytes = crypto.createHash("sha256").update(`openclaw-memory-flush\0${params.sourceSessionId}\0${params.sourceLifecycleRevision ?? ""}\0${params.compactionCount}`).digest().subarray(0, 16);
	bytes[6] = (bytes[6] ?? 0) & 15 | 128;
	bytes[8] = (bytes[8] ?? 0) & 63 | 128;
	const hex = bytes.toString("hex");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
/** Memory inference owns a detached view; an admission excludes its waiting user. */
async function prepareMemoryFlushSession(params) {
	params.signal?.throwIfAborted();
	await waitForSessionTranscriptProjection(params.source, params.signal);
	params.signal?.throwIfAborted();
	const sessionManager = await withSessionContextAdmission(params.source, params.admission, () => SessionManager.openDetachedBoundedAsync(params.source, {
		signal: params.signal,
		cwd: params.workspaceDir,
		maxBytes: MAX_VISIBLE_MESSAGE_MAX_BYTES,
		maxEvents: MAX_VISIBLE_MESSAGE_MAX_MESSAGES,
		onTruncated: () => {
			throw new Error("Memory flush exceeds the bounded conversation view.");
		}
	}));
	const identity = resolveInternalSessionEffectsIdentity({
		agentId: params.source.agentId,
		runId: params.runId
	});
	return {
		...identity,
		sessionFile: identity.sessionKey,
		sessionTarget: {
			agentId: params.source.agentId,
			storePath: params.source.storePath,
			...identity
		},
		sessionManager,
		sessionPersistence: "detached",
		cleanupBundleMcpOnRunEnd: true
	};
}
async function ensureMemoryFlushTargetFile(params) {
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const relativePath = normalizeOptionalString(params.relativePath);
	if (!workspaceDir || !relativePath || path.isAbsolute(relativePath)) throw new Error("Invalid memory flush target path");
	const workspaceRoot = path.resolve(workspaceDir);
	const targetPath = path.resolve(workspaceRoot, relativePath);
	const targetRelativePath = path.relative(workspaceRoot, targetPath);
	if (!targetRelativePath || targetRelativePath.startsWith("..") || path.isAbsolute(targetRelativePath)) throw new Error("Memory flush target path must stay inside the workspace");
	params.assertCurrent();
	await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
	params.assertCurrent();
	const handle = await fs.promises.open(targetPath, "a");
	try {
		params.assertCurrent();
	} finally {
		await handle.close();
	}
}
//#endregion
//#region src/auto-reply/reply/memory-flush-prepare.ts
const log = createSubsystemLogger("auto-reply/memory-flush");
function resolveMemoryFlushModelFallbackOptions(run, model, configOverride = run.config) {
	const options = resolveModelFallbackOptions(run, configOverride);
	const override = normalizeOptionalString(model);
	if (!override) return options;
	const slashIdx = override.indexOf("/");
	if (slashIdx > 0) {
		const overrideProvider = override.slice(0, slashIdx).trim();
		const overrideModel = override.slice(slashIdx + 1).trim();
		if (overrideProvider && overrideModel) return {
			...options,
			provider: overrideProvider,
			model: overrideModel,
			requestedRouteResolution: "raw",
			fallbacksOverride: []
		};
	}
	return {
		...options,
		model: override,
		requestedRouteResolution: "raw",
		fallbacksOverride: []
	};
}
/** Prepare one detached flush, source delegation, and persistence target before model fallback. */
async function prepareMemoryFlushAttempt(params) {
	params.assertCurrent();
	const resolution = resolveMemoryFlushPlanForRun({
		cfg: params.cfg,
		nowMs: Date.now(),
		contextWindowTokens: params.contextWindowTokens
	});
	if (!resolution) return null;
	const plan = resolution.plan;
	if (!isToolsMemoryFlushPlan(plan) && !params.memoryFlushWritable) return null;
	const { sessionKey, sessionEntry, followupRun } = params;
	if (!sessionKey || !sessionEntry) throw new Error("Memory flush has no current transcript target.");
	const agentId = followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg);
	const sourceStorePath = resolveSessionStorePathForScope({
		agentId,
		sessionKey,
		storePath: params.storePath
	}, params.cfg);
	const sourceAudience = isToolsMemoryFlushPlan(plan) && getMemoryProviderRuntime() ? await resolveMemoryAudienceFromEntry({
		agentId,
		sessionKey,
		sessionId: sessionEntry.sessionId,
		senderIsOwner: followupRun.memoryAudienceSenderIsOwner ?? followupRun.run.senderIsOwner,
		storePath: sourceStorePath,
		assertCallerCurrent: params.assertCurrent
	}, sessionEntry) : void 0;
	if (sourceAudience?.status === "denied") {
		log.debug("memory flush skipped: source turn has no memory audience", {
			event: "memory_flush_no_audience",
			sourceSessionKey: sessionKey,
			sourceSessionId: sessionEntry.sessionId,
			pluginId: resolution.pluginId,
			reason: sourceAudience.reason
		});
		return null;
	}
	let delegated;
	const release = () => {
		delegated?.release();
		sourceAudience?.release();
	};
	try {
		params.assertCurrent();
		const memorySession = await prepareMemoryFlushSession({
			admission: params.preflightAdmission,
			source: {
				agentId,
				sessionId: sessionEntry.sessionId,
				sessionKey,
				storePath: sourceStorePath
			},
			runId: params.flushRunId,
			workspaceDir: followupRun.run.workspaceDir,
			signal: params.abortSignal
		});
		if (!isToolsMemoryFlushPlan(plan)) await ensureMemoryFlushTargetFile({
			workspaceDir: followupRun.run.workspaceDir,
			relativePath: plan.relativePath,
			assertCurrent: params.assertCurrent
		});
		const systemPrompt = [followupRun.run.extraSystemPrompt, plan.systemPrompt].filter(Boolean).join("\n\n");
		const selection = resolveMemoryFlushModelFallbackOptions(followupRun.run, plan.model, params.cfg);
		params.assertCurrent();
		delegated = sourceAudience ? await delegateMemoryAudience(sourceAudience.audience, {
			sessionKey: memorySession.sessionKey,
			storePath: memorySession.sessionTarget.storePath,
			detached: true,
			assertCallerCurrent: params.assertCurrent
		}) : void 0;
		const memoryFlushTools = isToolsMemoryFlushPlan(plan) ? {
			flushId: deriveMemoryFlushId({
				sourceSessionId: sessionEntry.sessionId,
				sourceLifecycleRevision: sessionEntry.lifecycleRevision,
				compactionCount: sessionEntry.compactionCount ?? 0
			}),
			ownerPluginId: resolution.pluginId,
			persistenceToolNames: plan.persistenceToolNames,
			lookupToolNames: plan.lookupToolNames,
			recordPersistenceToolSuccess: params.recordPersistenceToolSuccess
		} : void 0;
		const preparedRunAdmission = prepareSystemAgentRunAdmission(params.cfg, params.flushRunId, followupRun.run.agentId, "auto-reply.memory-flush", void 0, followupRun.operatorAuthority);
		return {
			plan,
			writePath: isToolsMemoryFlushPlan(plan) ? void 0 : plan.relativePath,
			systemPrompt,
			selection,
			preparedRunAdmission,
			memorySession,
			memoryAudience: delegated?.audience,
			memoryFlushTools,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { prepareMemoryFlushAttempt };
