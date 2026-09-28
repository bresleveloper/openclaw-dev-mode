import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as createDirtyDirectoryWatch } from "./session-catalog-tree-watch-C_yiNljq.mjs";
import { i as childDirectories, o as desktopSessionsDir, p as setBoundedCache, u as readJsonFile } from "./session-catalog-scan-CiBc8XV5.mjs";
import { t as readClaudeDesktopCustomGroups } from "./claude-desktop-groups-pxqpJWOU.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-desktop.ts
const MAX_STRING_LENGTH = 4096;
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
	if (Array.isArray(metadata.prs)) for (const value of metadata.prs) {
		if (!isRecord(value)) continue;
		const entry = value;
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
		let entries;
		try {
			entries = await fs.readdir(workspaceDir);
		} catch {
			continue;
		}
		for (const name of entries) {
			if (!name.startsWith("local_") || !name.endsWith(".json")) continue;
			const raw = await readJsonFile(path.join(workspaceDir, name));
			if (!isRecord(raw)) continue;
			const metadata = raw;
			const cliSessionId = normalizeBoundedOptionalString(metadata.cliSessionId, 256);
			if (!cliSessionId) continue;
			if (metadata.isArchived === true) {
				archived.add(cliSessionId);
				active.delete(cliSessionId);
				continue;
			}
			if (!archived.has(cliSessionId)) {
				const localSessionId = normalizeBoundedOptionalString(metadata.sessionId, 256);
				const customGroup = localSessionId ? customGroups.get(localSessionId) : void 0;
				active.set(cliSessionId, customGroup ? {
					...metadata,
					customGroup
				} : metadata);
			}
		}
	}
	return {
		available: true,
		active,
		archived,
		customGroups
	};
}
const desktopOverlays = /* @__PURE__ */ new Map();
const emptyDesktopOverlay = {
	available: false,
	active: /* @__PURE__ */ new Map(),
	archived: /* @__PURE__ */ new Set(),
	customGroups: /* @__PURE__ */ new Map()
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
		setBoundedCache(desktopOverlays, homeDir, entry, 8, (evicted) => evicted.watch?.close());
		return entry.overlay;
	}
	const watch = entry?.watch ?? createDirtyDirectoryWatch(desktopSessionsDir(homeDir));
	const current = {
		watch,
		refreshedAt: Date.now(),
		refreshing: true,
		overlay: Promise.resolve(emptyDesktopOverlay)
	};
	current.overlay = (async () => {
		if (!(await fs.stat(desktopSessionsDir(homeDir)).catch(() => void 0))?.isDirectory()) {
			watch.close();
			current.watch = void 0;
			return emptyDesktopOverlay;
		}
		return readDesktopMetadata(homeDir, forceRefresh);
	})().finally(() => {
		current.refreshing = false;
	});
	setBoundedCache(desktopOverlays, homeDir, current, 8, (evicted) => evicted.watch?.close());
	return current.overlay;
}
//#endregion
export { readDesktopOverlay as a, parsePullRequestSummary as i, desktopPullRequestSummary as n, emptyDesktopOverlay as r, MAX_STRING_LENGTH as t };
