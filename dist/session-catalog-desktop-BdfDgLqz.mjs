import { i as normalizeBoundedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger, v as parseDateFirstTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { t as createDirtyDirectoryWatch } from "./session-catalog-tree-watch-vO2PbKr0.mjs";
import { i as childDirectories, m as setBoundedCache, o as createCatalogJsonReader, s as desktopSessionsDir } from "./session-catalog-scan-CYoFNVJ2.mjs";
import { t as readClaudeDesktopCustomGroups } from "./claude-desktop-groups-2etqzeIE.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-desktop.ts
const MAX_STRING_LENGTH = 4096;
const log = createSubsystemLogger("anthropic-session-catalog");
const MAX_SESSION_PULL_REQUESTS = 20;
const CLAUDE_DESKTOP_SCAN_TTL_MS = 6e4;
function pullRequestState(value) {
	if (typeof value !== "string") return;
	const state = value.trim().toLowerCase();
	return state === "open" || state === "draft" || state === "merged" || state === "closed" ? state : void 0;
}
function desktopPullRequestSummary(metadata) {
	const visibleByNumber = /* @__PURE__ */ new Map();
	const dismissed = /* @__PURE__ */ new Set();
	if (Array.isArray(metadata.prs)) for (const entry of metadata.prs) {
		if (!isRecord(entry)) continue;
		const number = asPositiveSafeInteger(entry.prNumber);
		if (!number) continue;
		if (entry.dismissed === true) {
			dismissed.add(number);
			visibleByNumber.delete(number);
			continue;
		}
		if (!dismissed.has(number) && !visibleByNumber.has(number)) visibleByNumber.set(number, pullRequestState(entry.state));
	}
	const currentNumber = asPositiveSafeInteger(metadata.prNumber);
	let currentState = currentNumber ? visibleByNumber.get(currentNumber) : void 0;
	if (currentNumber && !dismissed.has(currentNumber)) {
		currentState = pullRequestState(metadata.prState) ?? currentState;
		visibleByNumber.delete(currentNumber);
		visibleByNumber.set(currentNumber, currentState);
	}
	const visible = [...visibleByNumber].map(([number, state]) => ({
		number,
		state
	}));
	if (visible.length === 0) return;
	const state = currentState ?? visible.at(-1)?.state;
	if (!state) return;
	return {
		numbers: visible.slice(-20).map((entry) => entry.number),
		state
	};
}
function compactString(value, maxLength) {
	const normalized = normalizeBoundedOptionalString(value, maxLength);
	return normalized === void 0 ? void 0 : Buffer.from(normalized, "utf16le").toString("utf16le");
}
const readDesktopJson = createCatalogJsonReader((raw) => {
	if (!isRecord(raw)) return;
	const cliSessionId = compactString(raw.cliSessionId, 256);
	if (!cliSessionId) return;
	if (raw.isArchived === true) return {
		cliSessionId,
		isArchived: true
	};
	return {
		cliSessionId,
		isArchived: false,
		sessionId: compactString(raw.sessionId, 256),
		title: compactString(raw.title, 500),
		cwd: compactString(raw.cwd, 4096) ?? compactString(raw.originCwd, 4096),
		createdAt: parseDateFirstTimestampMs(raw.createdAt),
		lastActivityAt: parseDateFirstTimestampMs(raw.lastActivityAt),
		customGroup: compactString(raw.customGroup, 500),
		pullRequest: desktopPullRequestSummary(raw)
	};
});
function parsePullRequestSummary(value) {
	if (value === void 0) return;
	if (!isRecord(value) || !Array.isArray(value.numbers)) throw new Error("Claude node returned an invalid pull request summary");
	const numbers = value.numbers.flatMap((candidate) => {
		const number = asPositiveSafeInteger(candidate);
		return number === void 0 ? [] : [number];
	});
	const state = pullRequestState(value.state);
	if (numbers.length === 0 || numbers.length !== value.numbers.length || numbers.length > MAX_SESSION_PULL_REQUESTS || new Set(numbers).size !== numbers.length || !state) throw new Error("Claude node returned an invalid pull request summary");
	return {
		numbers,
		state
	};
}
async function readDesktopMetadata(homeDir, forceRefresh) {
	const active = /* @__PURE__ */ new Map();
	const archived = /* @__PURE__ */ new Set();
	const customGroups = await readClaudeDesktopCustomGroups(homeDir, forceRefresh);
	for (const accountDir of await childDirectories(desktopSessionsDir(homeDir))) for (const workspaceDir of await childDirectories(accountDir)) {
		const entries = await fs.readdir(workspaceDir).catch(() => []);
		for (const name of entries) {
			if (!name.startsWith("local_") || !name.endsWith(".json")) continue;
			const metadata = await readDesktopJson(path.join(workspaceDir, name));
			if (!metadata) continue;
			const { cliSessionId } = metadata;
			if (metadata.isArchived) {
				archived.add(cliSessionId);
				active.delete(cliSessionId);
				continue;
			}
			if (!archived.has(cliSessionId)) {
				const localSessionId = metadata.sessionId;
				const customGroup = localSessionId ? customGroups.get(localSessionId) : void 0;
				active.set(cliSessionId, customGroup ? {
					...metadata,
					customGroup: normalizeBoundedOptionalString(customGroup, 500)
				} : metadata);
			}
		}
	}
	return {
		active,
		archived
	};
}
const desktopOverlays = /* @__PURE__ */ new Map();
const emptyDesktopOverlay = {
	active: /* @__PURE__ */ new Map(),
	archived: /* @__PURE__ */ new Set()
};
async function readDesktopOverlay(homeDir, forceRefresh) {
	const entry = desktopOverlays.get(homeDir);
	if (entry?.refreshing) {
		if (!forceRefresh) return entry.overlay;
		await entry.overlay;
		return readDesktopOverlay(homeDir, forceRefresh);
	}
	const dirty = entry?.watch?.takeDirty();
	if (!forceRefresh && entry && entry.refreshedAt + CLAUDE_DESKTOP_SCAN_TTL_MS > Date.now() && dirty !== "all" && !(dirty instanceof Set && dirty.size > 0)) {
		setBoundedCache(desktopOverlays, homeDir, entry, 8);
		return entry.overlay;
	}
	const watch = entry?.watch ?? createDirtyDirectoryWatch(desktopSessionsDir(homeDir), 3);
	const current = {
		watch,
		refreshedAt: Date.now(),
		refreshing: true,
		overlay: Promise.resolve(emptyDesktopOverlay)
	};
	current.overlay = (async () => {
		if (!(await fs.stat(desktopSessionsDir(homeDir)).catch(() => void 0))?.isDirectory()) {
			await watch.close();
			current.watch = void 0;
			return emptyDesktopOverlay;
		}
		return readDesktopMetadata(homeDir, forceRefresh);
	})().finally(() => {
		current.refreshing = false;
	});
	setBoundedCache(desktopOverlays, homeDir, current, 8, (evicted) => {
		evicted.watch?.close().catch((error) => {
			log.warn(`Claude Desktop catalog watcher cleanup failed: ${String(error)}`);
		});
	});
	return current.overlay;
}
//#endregion
export { readDesktopOverlay as i, emptyDesktopOverlay as n, parsePullRequestSummary as r, MAX_STRING_LENGTH as t };
