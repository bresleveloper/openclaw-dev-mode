import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./identity-DdUdpaIE.mjs";
import { o as resolveToolDisplay, s as TOOL_DISPLAY_CONFIG } from "./tool-display-DjrvDE8J.mjs";
import { i as shouldAckReaction } from "./ack-reactions-BCgn-tQT.mjs";
import "./logging-skHYNt5A.mjs";
//#region src/channels/status-reactions.ts
/** Default emoji set used by status reaction controllers. */
const DEFAULT_EMOJIS = {
	queued: "👀",
	thinking: "🧠",
	tool: "🛠️",
	coding: "💻",
	web: "🌐",
	deploy: "🛫",
	build: "🏗️",
	concierge: "💁",
	done: "✅",
	error: "❌",
	stallSoft: "⏳",
	stallHard: "⚠️",
	compacting: "🗜️"
};
/** Default debounce, stall, and terminal hold timings for status reactions. */
const DEFAULT_TIMING = {
	debounceMs: 700,
	stallSoftMs: 1e4,
	stallHardMs: 3e4,
	doneHoldMs: 1500,
	errorHoldMs: 2500
};
/** Tool-name tokens mapped to the coding status reaction. */
const CODING_TOOL_TOKENS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"session_status",
	"bash"
];
/** Tool-name tokens mapped to the web status reaction. */
const WEB_TOOL_TOKENS = [
	"web_search",
	"web-search",
	"web_fetch",
	"web-fetch",
	"browser"
];
/** Tool-name tokens mapped to the deploy status reaction. */
const DEPLOY_TOOL_TOKENS = [
	"fastlane",
	"deploy",
	"upload",
	"testflight",
	"ship",
	"release",
	"publish",
	"distribute"
];
/** Tool-name tokens mapped to the build status reaction. */
const BUILD_TOOL_TOKENS = [
	"build",
	"compile",
	"xcode",
	"swift",
	"gradle",
	"cargo",
	"make",
	"cmake",
	"webpack",
	"vite",
	"tsc",
	"lint"
];
/** Tool-name tokens mapped to the concierge/browser-control status reaction. */
const CONCIERGE_TOOL_TOKENS = [
	"navigate",
	"click",
	"fill",
	"screenshot",
	"scroll",
	"page",
	"form",
	"puppeteer",
	"playwright",
	"selenium",
	"chromedp"
];
/** Resolves the appropriate emoji for a tool invocation. */
function resolveToolEmoji(toolName, emojis, emojiOverrides) {
	const normalized = normalizeOptionalLowercaseString(toolName) ?? "";
	if (!normalized) return emojis.tool;
	const category = DEPLOY_TOOL_TOKENS.some((token) => normalized.includes(token)) ? "deploy" : BUILD_TOOL_TOKENS.some((token) => normalized.includes(token)) ? "build" : CONCIERGE_TOOL_TOKENS.some((token) => normalized.includes(token)) ? "concierge" : WEB_TOOL_TOKENS.some((token) => normalized.includes(token)) ? "web" : CODING_TOOL_TOKENS.some((token) => normalized.includes(token)) ? "coding" : "tool";
	if (emojiOverrides?.[category] !== void 0) return emojis[category];
	if (Object.hasOwn(TOOL_DISPLAY_CONFIG.tools, normalized)) return resolveToolDisplay({ name: toolName }).emoji;
	return emojis[category];
}
/**
* Create a status reaction controller.
*
* Features:
* - Promise chain serialization (prevents concurrent API calls)
* - Debouncing (intermediate states debounce, terminal states are immediate)
* - Stall timers (soft/hard warnings on inactivity)
* - Terminal state protection (done/error mark finished, subsequent updates ignored)
* - Defers reaction removals until final cleanup to avoid visible flicker on
*   platforms without atomic reaction replacement
*/
function createStatusReactionController(params) {
	const { enabled, adapter, initialEmoji, onError } = params;
	const showActivity = params.presentation !== "acknowledgement";
	const emojis = {
		...DEFAULT_EMOJIS,
		queued: params.emojis?.queued ?? initialEmoji,
		...params.emojis
	};
	const timing = {
		...DEFAULT_TIMING,
		...params.timing
	};
	let currentEmoji = "";
	let pendingEmoji = "";
	let debounceTimer = null;
	let stallSoftTimer = null;
	let stallHardTimer = null;
	let terminalHold = null;
	let terminalHoldGeneration = 0;
	let finished = false;
	let chainPromise = Promise.resolve();
	const activeEmojis = /* @__PURE__ */ new Set();
	function enqueue(fn) {
		chainPromise = chainPromise.then(fn, fn);
		return chainPromise;
	}
	function clearActivityTimers() {
		clearDebounceTimer();
		if (stallSoftTimer) {
			clearTimeout(stallSoftTimer);
			stallSoftTimer = null;
		}
		if (stallHardTimer) {
			clearTimeout(stallHardTimer);
			stallHardTimer = null;
		}
	}
	function cancelTerminalHold() {
		terminalHoldGeneration += 1;
		const hold = terminalHold;
		if (!hold) return;
		terminalHold = null;
		clearTimeout(hold.timer);
		hold.resolve();
	}
	function waitForTerminalHold(holdMs, generation) {
		if (holdMs <= 0 || generation !== terminalHoldGeneration) return Promise.resolve();
		return new Promise((resolve) => {
			terminalHold = {
				timer: setTimeout(() => {
					terminalHold = null;
					resolve();
				}, holdMs),
				resolve
			};
		});
	}
	function clearDebounceTimer() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
	}
	function resetStallTimers() {
		if (!showActivity) return;
		if (stallSoftTimer) clearTimeout(stallSoftTimer);
		if (stallHardTimer) clearTimeout(stallHardTimer);
		stallSoftTimer = setTimeout(() => {
			scheduleEmoji(emojis.stallSoft, {
				immediate: true,
				skipStallReset: true
			});
		}, timing.stallSoftMs);
		stallHardTimer = setTimeout(() => {
			scheduleEmoji(emojis.stallHard, {
				immediate: true,
				skipStallReset: true
			});
		}, timing.stallHardMs);
	}
	async function removeActiveEmojis(options = {}) {
		if (!adapter.removeReaction) return;
		for (const emoji of Array.from(activeEmojis)) {
			if (emoji === options.keepEmoji) continue;
			try {
				await adapter.removeReaction(emoji);
			} catch (err) {
				if (onError) onError(err);
			} finally {
				activeEmojis.delete(emoji);
			}
		}
	}
	async function applyEmoji(newEmoji) {
		if (!enabled) return;
		try {
			if (!adapter.removeReaction || !activeEmojis.has(newEmoji)) await adapter.setReaction(newEmoji);
			activeEmojis.add(newEmoji);
			currentEmoji = newEmoji;
		} catch (err) {
			if (onError) onError(err);
		}
	}
	function scheduleEmoji(requestedEmoji, options = {}) {
		if (!enabled || finished) return;
		const emoji = showActivity ? requestedEmoji : initialEmoji;
		if (emoji === currentEmoji || emoji === pendingEmoji) {
			if (!options.skipStallReset) resetStallTimers();
			return;
		}
		pendingEmoji = emoji;
		clearDebounceTimer();
		if (options.immediate) enqueue(async () => {
			await applyEmoji(emoji);
			pendingEmoji = "";
		});
		else debounceTimer = setTimeout(() => {
			debounceTimer = null;
			enqueue(async () => {
				await applyEmoji(emoji);
				pendingEmoji = "";
			});
		}, timing.debounceMs);
		if (!options.skipStallReset) resetStallTimers();
	}
	function setQueued() {
		scheduleEmoji(emojis.queued, { immediate: true });
	}
	function setThinking() {
		scheduleEmoji(emojis.thinking);
	}
	function setTool(toolName) {
		scheduleEmoji(resolveToolEmoji(toolName, emojis, params.emojis));
	}
	function setCompacting() {
		scheduleEmoji(emojis.compacting);
	}
	function cancelPending() {
		clearDebounceTimer();
		pendingEmoji = "";
	}
	function finishWithEmoji(emoji, holdMs) {
		if (!enabled) return Promise.resolve();
		finished = true;
		clearActivityTimers();
		const holdGeneration = terminalHoldGeneration;
		return enqueue(async () => {
			await applyEmoji(emoji);
			await removeActiveEmojis({ keepEmoji: emoji });
			pendingEmoji = "";
			await waitForTerminalHold(holdMs, holdGeneration);
		});
	}
	function setDone() {
		return showActivity ? finishWithEmoji(emojis.done, timing.doneHoldMs) : finishWithEmoji(initialEmoji, 0);
	}
	function setError() {
		return finishWithEmoji(emojis.error, timing.errorHoldMs);
	}
	async function clear() {
		if (!enabled) return;
		clearActivityTimers();
		cancelTerminalHold();
		finished = true;
		await enqueue(async () => {
			if (adapter.clearReaction) try {
				await adapter.clearReaction();
			} catch (err) {
				if (onError) onError(err);
			} finally {
				activeEmojis.clear();
			}
			else if (adapter.removeReaction) await removeActiveEmojis();
			currentEmoji = "";
			pendingEmoji = "";
		});
	}
	async function restoreInitial() {
		if (!enabled) return;
		const alreadyInitial = currentEmoji === initialEmoji;
		const pendingBeforeClear = pendingEmoji;
		const hadDebouncedPending = debounceTimer !== null;
		const hasExtraActiveEmoji = Array.from(activeEmojis).some((emoji) => emoji !== initialEmoji);
		clearActivityTimers();
		if (!finished && alreadyInitial && (!pendingBeforeClear || hadDebouncedPending) && !hasExtraActiveEmoji) {
			pendingEmoji = "";
			return;
		}
		if (!finished && pendingBeforeClear === initialEmoji && !hadDebouncedPending) {
			await chainPromise;
			return;
		}
		await enqueue(async () => {
			await applyEmoji(initialEmoji);
			await removeActiveEmojis({ keepEmoji: initialEmoji });
			pendingEmoji = "";
		});
	}
	return {
		setQueued,
		setThinking,
		setTool,
		setCompacting,
		cancelPending,
		setDone,
		setError,
		clear,
		restoreInitial
	};
}
//#endregion
//#region src/plugin-sdk/channel-feedback.ts
/**
* Public SDK subpath for channel feedback reactions, status reactions, and logging helpers.
*/
/**
* @deprecated Load-only bridge: the published WhatsApp channel package
* (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
* it makes the installed plugin fail to load after a core upgrade. Behavior
* preserved verbatim from the pre-#121257 owner. Remove once managed releases
* have replaced the old npm latest/extended-stable packages and their upgrade
* window has closed.
*/
function shouldAckReactionForWhatsApp(params) {
	if (!params.emoji) return false;
	if (params.isDirect) return params.directEnabled;
	if (!params.isGroup || params.groupMode === "never") return false;
	if (params.groupMode === "always") return true;
	return shouldAckReaction({
		scope: "group-mentions",
		isDirect: false,
		isGroup: true,
		isMentionableGroup: true,
		canDetectMention: true,
		effectiveWasMentioned: params.wasMentioned,
		shouldBypassMention: params.groupActivated
	});
}
//#endregion
export { DEFAULT_EMOJIS as a, WEB_TOOL_TOKENS as c, CONCIERGE_TOOL_TOKENS as i, createStatusReactionController as l, BUILD_TOOL_TOKENS as n, DEFAULT_TIMING as o, CODING_TOOL_TOKENS as r, DEPLOY_TOOL_TOKENS as s, shouldAckReactionForWhatsApp as t, resolveToolEmoji as u };
