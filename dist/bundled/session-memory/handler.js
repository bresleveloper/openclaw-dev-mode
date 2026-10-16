import { l as normalizeOptionalString, m as readNonBlankString } from "../../string-coerce-1VuiLaaR.mjs";
import { n as isVitestRuntimeEnv } from "../../test-runtime-env-mVzBKwSd.mjs";
import "../../env-BBJTTIuE.mjs";
import { w as root } from "../../fs-safe-BUXBSN-4.mjs";
import { p as shortenHomePath } from "../../utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "../../state-dir-BHJORNly.mjs";
import "../../paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "../../subsystem-I-uqdx4f.mjs";
import { d as resolveAgentWorkspaceDir } from "../../agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "../../session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey } from "../../session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "../../paths-dpReqUI8.mjs";
import { l as resolveAgentIdByWorkspacePath } from "../../agent-scope-CG17uXFn.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "../../gateway-work-admission-rc4ZgKq_.mjs";
import { t as resolveHookConfig } from "../../policy-DntIYegk.mjs";
import { o as resolveUserTimezone } from "../../date-time-DNFKWNdt.mjs";
import { p as createMemoryWriteProvenanceObserver } from "../../agent-tools.read-Bs0hsNfa.mjs";
import { t as generateSlugViaLLM } from "../../llm-slug-generator-BuqNb6rP.mjs";
import "../../config-DGzoNfBQ.mjs";
import { t as captureSessionMemoryTranscript } from "../../capture-DeMPjstq.mjs";
import { r as isSessionAutoResetReason } from "../../session-auto-reset-BGSoK2RG.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
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
		const filename = await resolveAvailableMemoryFilename({
			memoryDir,
			dateStr,
			slug
		});
		const memoryFilePath = path.join(memoryDir, filename);
		log.debug("Memory file path resolved", {
			filename,
			path: shortenHomePath(memoryFilePath)
		});
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
		const commit = () => memoryRoot.write(filename, entry, { encoding: "utf-8" });
		await provenanceObserver.write({
			absolutePath: memoryFilePath,
			contentBefore: "",
			contentAfter: entry,
			commit
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
const saveSessionToMemory = (event) => {
	const isResetCommand = event.action === "new" || event.action === "reset";
	const isAutoReset = event.type === "session" && event.action === "auto-reset" && isSessionAutoResetReason(event.context.reason);
	if ((event.type !== "command" || !isResetCommand) && !isAutoReset) return;
	const context = event.context;
	const sessionEntry = event.type === "command" ? context.previousSessionEntry ?? context.sessionEntry : context.sessionEntry;
	if (isIncognitoSessionKey(event.sessionKey) || sessionEntry?.incognito === true) return;
	const agentId = requireSessionMemoryAgentId(event);
	const cfg = context.cfg;
	const transcript = context.previousSessionMemory ?? (sessionEntry?.sessionId ? captureSessionMemoryTranscript({
		agentId,
		sessionId: sessionEntry.sessionId,
		sessionKey: event.sessionKey,
		storePath: normalizeOptionalString(context.storePath) ?? resolveSessionStorePathCore(cfg?.session?.store, { agentId })
	}, cfg) : {
		status: "available",
		content: null,
		originClass: "agent"
	});
	const writePromise = isAutoReset ? saveSessionMemoryNow(event, agentId, transcript) : runWithGatewayIndependentRootWorkContinuation(() => saveSessionMemoryNow(event, agentId, transcript), "hooks:session-memory");
	pendingSessionMemoryWrites.add(writePromise);
	writePromise.finally(() => {
		pendingSessionMemoryWrites.delete(writePromise);
	});
	if (isAutoReset) return writePromise;
};
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };
