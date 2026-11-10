import { l as normalizeOptionalString, m as readNonBlankString } from "../../string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { c as isVitestRuntimeEnv } from "../../env-DbG527wb.mjs";
import { p as shortenHomePath } from "../../utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "../../state-dir-C8s3cOPX.mjs";
import "../../paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { w as root } from "../../fs-safe-6Z4UiMS4.mjs";
import { i as isIncognitoSessionKey } from "../../incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey } from "../../session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "../../agent-scope-config-fjA2T9Gz.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation } from "../../gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "../../paths-YgcBNLgG.mjs";
import { l as resolveAgentIdByWorkspacePath } from "../../agent-scope-DXrnO3F4.mjs";
import { s as withFileLock } from "../../file-lock-BmWJVvRa.mjs";
import "../../file-lock-BMq7QYoB.mjs";
import { t as resolveHookConfig } from "../../policy-EID_8KAw.mjs";
import { a as resolveUserTimezone } from "../../date-time-B92eHI7U.mjs";
import { h as createMemoryWriteProvenanceObserver } from "../../secrets-tool-vT5mBKZ0.mjs";
import { t as generateSlugViaLLM } from "../../llm-slug-generator-CmSfTc_l.mjs";
import "../../config-DqsKkEU8.mjs";
import { t as captureSessionMemoryTranscript } from "../../capture-DwnvG92B.mjs";
import { r as isSessionAutoResetReason } from "../../session-auto-reset-CqDm4bvb.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/hooks/bundled/session-memory/handler.ts
const log = createSubsystemLogger("hooks/session-memory");
function pickDateTimePart(parts, type) {
	return parts.find((part) => part.type === type)?.value;
}
function formatLocalSessionTimestamp(date, timeZone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const year = pickDateTimePart(parts, "year") ?? String(date.getFullYear()).padStart(4, "0");
	const month = pickDateTimePart(parts, "month") ?? String(date.getMonth() + 1).padStart(2, "0");
	const day = pickDateTimePart(parts, "day") ?? String(date.getDate()).padStart(2, "0");
	const hour = pickDateTimePart(parts, "hour") ?? String(date.getHours()).padStart(2, "0");
	const minute = pickDateTimePart(parts, "minute") ?? String(date.getMinutes()).padStart(2, "0");
	const second = pickDateTimePart(parts, "second") ?? String(date.getSeconds()).padStart(2, "0");
	return {
		date: `${year}-${month}-${day}`,
		time: `${hour}:${minute}:${second}`,
		timeSlug: `${hour}${minute}`
	};
}
async function resolveAvailableMemoryFilename(params) {
	const basename = `${params.dateStr}-${params.slug}`;
	let suffix = 1;
	while (true) {
		const filename = suffix === 1 ? `${basename}.md` : `${basename}-${suffix}.md`;
		try {
			await fs.access(path.join(params.memoryDir, filename));
			suffix += 1;
		} catch (err) {
			if (err.code === "ENOENT") return filename;
			throw err;
		}
	}
}
function resolveDisplaySessionKey(params) {
	if (!params.cfg || !params.workspaceDir) return params.sessionKey;
	const workspaceAgentId = resolveAgentIdByWorkspacePath(params.cfg, params.workspaceDir);
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!workspaceAgentId || !parsed || workspaceAgentId === parsed.agentId) return params.sessionKey;
	return toAgentStoreSessionKey({
		agentId: workspaceAgentId,
		requestKey: parsed.rest
	});
}
const pendingSessionMemoryWrites = /* @__PURE__ */ new Set();
function requireSessionMemoryAgentId(event) {
	const agentId = normalizeOptionalString(event.context?.agentId);
	if (!agentId) throw new Error("Session memory hook contract requires context.agentId");
	return agentId;
}
async function flushSessionMemoryWritesForTest() {
	await Promise.allSettled(pendingSessionMemoryWrites);
}
async function saveSessionMemoryNow(event, agentId, transcript) {
	try {
		log.debug("Session memory hook triggered", {
			action: event.action,
			type: event.type
		});
		const context = event.context || {};
		const cfg = context.cfg;
		const contextWorkspaceDir = readNonBlankString(context.workspaceDir);
		const workspaceDir = contextWorkspaceDir || (cfg ? resolveAgentWorkspaceDir(cfg, agentId) : path.join(resolveStateDir(process.env, os.homedir), "workspace"));
		const displaySessionKey = resolveDisplaySessionKey({
			cfg,
			workspaceDir: contextWorkspaceDir,
			sessionKey: event.sessionKey
		});
		const memoryDir = path.join(workspaceDir, "memory");
		await fs.mkdir(memoryDir, { recursive: true });
		const now = new Date(event.timestamp);
		const userTimezone = resolveUserTimezone(cfg?.agents?.defaults?.userTimezone ?? process.env.TZ);
		const localTimestamp = formatLocalSessionTimestamp(now, userTimezone);
		const dateStr = localTimestamp.date;
		const sessionEntry = event.type === "command" ? context.previousSessionEntry || context.sessionEntry || {} : context.sessionEntry || {};
		const currentSessionId = normalizeOptionalString(sessionEntry.sessionId);
		log.debug("Session context resolved", {
			sessionId: currentSessionId,
			hasCfg: Boolean(cfg)
		});
		const hookConfig = resolveHookConfig(cfg, "session-memory");
		let slug = null;
		if (transcript.status === "unavailable") log.warn("Session transcript unavailable for memory capture", {
			sessionKey: event.sessionKey,
			error: transcript.reason
		});
		if (currentSessionId) {
			const allowLlmSlug = !isVitestRuntimeEnv() && hookConfig?.llmSlug === true;
			if (transcript.status === "available" && transcript.content && cfg && allowLlmSlug) {
				log.debug("Calling generateSlugViaLLM...");
				const slugModel = typeof hookConfig?.model === "string" ? hookConfig.model : void 0;
				slug = await generateSlugViaLLM({
					sessionContent: transcript.content,
					cfg,
					agentId,
					model: slugModel
				});
				log.debug("Generated slug", { slug });
			}
		}
		if (!slug) {
			slug = localTimestamp.timeSlug;
			log.debug("Using fallback timestamp slug", { slug });
		}
		const timeStr = localTimestamp.time;
		const sessionId = sessionEntry.sessionId || "unknown";
		const boundaryDetail = event.type === "session" ? `- **Reason**: ${context.reason || "unknown"}` : `- **Source**: ${context.commandSource || "unknown"}`;
		const entryParts = [
			`# Session: ${dateStr} ${timeStr} ${userTimezone}`,
			"",
			`- **Session Key**: ${displaySessionKey}`,
			`- **Session ID**: ${sessionId}`,
			boundaryDetail,
			""
		];
		if (transcript.status === "available" && transcript.content) entryParts.push("## Conversation Summary", "", transcript.content, "");
		else if (transcript.status === "unavailable") entryParts.push("## Conversation Summary", "", `> Transcript content was unavailable: ${JSON.stringify(transcript.reason)}`, "");
		const entry = entryParts.join("\n");
		const memoryRoot = await root(memoryDir);
		const provenanceObserver = createMemoryWriteProvenanceObserver({
			mutationRoot: workspaceDir,
			workspaceDir,
			resolveOriginClass: () => transcript.status === "available" ? transcript.originClass : "agent",
			sessionId: currentSessionId,
			sessionKey: event.sessionKey,
			now: () => now.getTime()
		});
		const memoryFilePath = await withFileLock(path.join(memoryDir, ".session-memory"), {
			retries: {
				retries: 1200,
				factor: 1,
				minTimeout: 25,
				maxTimeout: 25
			},
			stale: 3e4,
			staleRecovery: "remove-if-definitely-stale"
		}, async () => {
			const filename = await resolveAvailableMemoryFilename({
				memoryDir,
				dateStr,
				slug
			});
			const allocatedPath = path.join(memoryDir, filename);
			await provenanceObserver.write({
				absolutePath: allocatedPath,
				contentBefore: "",
				contentAfter: entry,
				commit: () => memoryRoot.create(filename, entry, {
					encoding: "utf-8",
					atomic: true
				})
			});
			return allocatedPath;
		});
		log.debug("Memory file written successfully");
		const relPath = shortenHomePath(memoryFilePath);
		log.info(`Session context saved to ${relPath}`);
	} catch (err) {
		if (err instanceof Error) log.error("Failed to save session memory", {
			errorName: err.name,
			errorMessage: err.message,
			stack: err.stack
		});
		else log.error("Failed to save session memory", { error: String(err) });
	}
}
const saveSessionToMemory = async (event) => {
	const isResetCommand = event.action === "new" || event.action === "reset";
	const isAutoReset = event.type === "session" && event.action === "auto-reset" && isSessionAutoResetReason(event.context.reason);
	if ((event.type !== "command" || !isResetCommand) && !isAutoReset) return;
	const context = event.context;
	const sessionEntry = event.type === "command" ? context.previousSessionEntry ?? context.sessionEntry : context.sessionEntry;
	if (isIncognitoSessionKey(event.sessionKey) || sessionEntry?.incognito === true) return;
	const agentId = requireSessionMemoryAgentId(event);
	const cfg = context.cfg;
	const captureComplete = createDeferredCore();
	const captureAndSave = async () => {
		const transcript = context.previousSessionMemory ?? (sessionEntry?.sessionId ? await captureSessionMemoryTranscript({
			agentId,
			sessionId: sessionEntry.sessionId,
			sessionKey: event.sessionKey,
			storePath: normalizeOptionalString(context.storePath) ?? resolveSessionStorePathCore(cfg?.session?.store, { agentId })
		}, cfg) : {
			status: "available",
			content: null,
			originClass: "agent"
		});
		captureComplete.resolve();
		await saveSessionMemoryNow(event, agentId, transcript);
	};
	const writePromise = isAutoReset ? captureAndSave() : runWithGatewayIndependentRootWorkContinuation(captureAndSave, "hooks:session-memory");
	pendingSessionMemoryWrites.add(writePromise);
	writePromise.then(() => pendingSessionMemoryWrites.delete(writePromise), (error) => {
		pendingSessionMemoryWrites.delete(writePromise);
		captureComplete.reject(error);
	});
	await captureComplete.promise;
	if (isAutoReset) return writePromise;
};
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };
