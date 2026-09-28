import { r as resolveHookKey } from "./frontmatter-Cb3BnaSU.mjs";
//#region src/hooks/policy.ts
const HOOK_SOURCE_PRECEDENCE = {
	"openclaw-bundled": 10,
	"openclaw-plugin": 20,
	"openclaw-managed": 30,
	"openclaw-workspace": 40
};
/** Resolve explicit per-hook config by hook key. */
function resolveHookConfig(config, hookKey) {
	const hooks = config?.hooks?.internal?.entries;
	if (!hooks || typeof hooks !== "object") return;
	const entry = hooks[hookKey];
	if (!entry || typeof entry !== "object") return;
	return entry;
}
/** Resolve whether a hook is enabled before runtime requirement checks. */
function resolveHookEnableState(params) {
	const { entry, config } = params;
	const hookKey = resolveHookKey(entry.hook.name, entry);
	const hookConfig = params.hookConfig ?? resolveHookConfig(config, hookKey);
	if (entry.hook.source === "openclaw-plugin") return { enabled: true };
	if (hookConfig?.enabled === false) return {
		enabled: false,
		reason: "disabled in config"
	};
	if (entry.hook.source === "openclaw-workspace" && hookConfig?.enabled !== true) return {
		enabled: false,
		reason: "workspace hook (disabled by default)"
	};
	return { enabled: true };
}
/** Merge hook entries by name using source precedence and override policy. */
function resolveHookEntries(entries, opts) {
	const ordered = entries.map((entry, index) => ({
		entry,
		index
	})).toSorted((a, b) => {
		const precedenceDelta = HOOK_SOURCE_PRECEDENCE[a.entry.hook.source] - HOOK_SOURCE_PRECEDENCE[b.entry.hook.source];
		return precedenceDelta !== 0 ? precedenceDelta : a.index - b.index;
	});
	const merged = /* @__PURE__ */ new Map();
	for (const { entry } of ordered) {
		const existing = merged.get(entry.hook.name);
		if (!existing) {
			merged.set(entry.hook.name, entry);
			continue;
		}
		const sameSource = entry.hook.source === existing.hook.source;
		if (entry.hook.source === "openclaw-workspace" ? sameSource : !sameSource || entry.hook.source === "openclaw-managed") {
			merged.set(entry.hook.name, entry);
			continue;
		}
		opts?.onCollisionIgnored?.({
			name: entry.hook.name,
			kept: existing,
			ignored: entry
		});
	}
	return Array.from(merged.values());
}
//#endregion
export { resolveHookEnableState as n, resolveHookEntries as r, resolveHookConfig as t };
