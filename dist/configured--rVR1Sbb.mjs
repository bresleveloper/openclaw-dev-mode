import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as resolveHookKey } from "./frontmatter-Cb3BnaSU.mjs";
import { r as shouldIncludeHook } from "./config-VEO9vtlh.mjs";
//#region src/hooks/configured.ts
/** Capture discovery and explicit selection from one config/install snapshot. */
function resolveInternalHookSelection(config) {
	const internal = config.hooks?.internal;
	const installs = readConfigMachineState("hooks.internal.installs");
	const names = /* @__PURE__ */ new Set();
	const declaredNames = /* @__PURE__ */ new Set();
	let open = (internal?.load?.extraDirs ?? []).some((dir) => dir.trim().length > 0);
	for (const [name, entry] of Object.entries(internal?.entries ?? {})) {
		const trimmed = name.trim();
		if (trimmed) {
			declaredNames.add(trimmed);
			if (entry?.enabled !== false) names.add(trimmed);
		}
	}
	for (const [installId, install] of Object.entries(installs ?? {})) {
		const hookNames = install.hooks ?? [];
		open ||= hookNames.length === 0 && Boolean(installId.trim());
		for (const name of hookNames) {
			const trimmed = name.trim();
			if (trimmed) {
				declaredNames.add(trimmed);
				names.add(trimmed);
			}
		}
	}
	return {
		configured: internal?.enabled !== false && (internal?.enabled === true || Object.values(internal?.entries ?? {}).some((entry) => entry?.enabled !== false) || open || Object.keys(installs ?? {}).length > 0),
		names: internal?.enabled === false ? /* @__PURE__ */ new Set() : open || declaredNames.size === 0 && internal?.enabled === true ? null : names,
		declaredNames
	};
}
/** True when an explicit selection names this entry, by hook name or resolved hook key. */
function isHookNameSelected(names, entry) {
	return Boolean(names?.has(entry.hook.name) || names?.has(resolveHookKey(entry.hook.name, entry)));
}
/** Shared selection and eligibility gate; importing handlers remains the loader's job. */
function isHookLoadable(params) {
	return (!params.names || isHookNameSelected(params.names, params.entry)) && shouldIncludeHook({
		entry: params.entry,
		config: params.config
	});
}
//#endregion
export { isHookNameSelected as n, resolveInternalHookSelection as r, isHookLoadable as t };
