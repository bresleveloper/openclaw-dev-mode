import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import { a as openRootFile } from "./boundary-file-read-D-Aa04On.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { c as registerInternalHook, d as unregisterInternalHook, l as setInternalHooksEnabled } from "./internal-hooks-B-eMkNRp.mjs";
import { n as isHookNameSelected, r as resolveInternalHookSelection, t as isHookLoadable } from "./configured--rVR1Sbb.mjs";
import { n as prepareWorkspaceHookEntries } from "./workspace-B2MW5yrb.mjs";
import { n as resolveFunctionModuleExport } from "./module-loader-BF97Ap2W.mjs";
import { t as isKnownInternalHookEventKey } from "./internal-hook-types-Deg4lhm7.mjs";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
//#region src/hooks/import-url.ts
/**
* Build an import URL for a hook handler module.
*
* Bundled hooks (shipped in dist/) are immutable between installs, so they
* can be imported without a cache-busting suffix — letting V8 reuse its
* module cache across gateway restarts.
*
* Workspace, managed, and plugin hooks may be edited by the user between
* restarts. For those we append `?t=<mtime>&c=<ctime>&s=<size>` so the module key
* reflects on-disk changes while staying stable for unchanged files.
*/
/**
* Sources whose handler files never change between `npm install` runs.
* Imports from these sources skip cache busting entirely.
*/
const IMMUTABLE_SOURCES = /* @__PURE__ */ new Set(["openclaw-bundled"]);
function buildImportUrl(handlerPath, source) {
	const base = pathToFileURL(handlerPath).href;
	if (IMMUTABLE_SOURCES.has(source)) return base;
	try {
		const { ctimeMs, mtimeMs, size } = fs.statSync(handlerPath);
		return `${base}?t=${mtimeMs}&c=${ctimeMs}&s=${size}`;
	} catch {
		return `${base}?t=${Date.now()}`;
	}
}
//#endregion
//#region src/hooks/loader.ts
const log = createSubsystemLogger("hooks:loader");
const hookOwner = resolveGlobalSingleton(Symbol.for("openclaw.loadedInternalHookRegistrations"), () => ({ generation: { registrations: [] } }), () => resetLoadedInternalHooks());
function resetLoadedInternalHooks() {
	for (const { event, handler } of hookOwner.generation.registrations) unregisterInternalHook(event, handler);
	hookOwner.generation = { registrations: [] };
}
/** Imports candidate handlers without publishing registrations or changing the dispatch gate. */
async function prepareInternalHooks(cfg, workspaceDir, opts) {
	const enabled = cfg.hooks?.internal?.enabled !== false;
	const previousGeneration = hookOwner.generation;
	const registrations = [];
	let loadedCount = 0;
	const selection = resolveInternalHookSelection(cfg);
	const shouldLoadHook = (entry) => isHookLoadable({
		entry,
		config: cfg,
		names: selection.names
	});
	const discovery = selection.configured ? prepareWorkspaceHookEntries(workspaceDir, {
		config: cfg,
		managedHooksDir: opts?.managedHooksDir,
		bundledHooksDir: opts?.bundledHooksDir,
		...opts?.failureMode !== "best-effort" ? {
			requireValidHook: shouldLoadHook,
			previousSources: previousGeneration.discovery?.sources.filter((entry) => !isHookNameSelected(previousGeneration.discovery?.declaredNames, entry) || isHookNameSelected(selection.declaredNames, entry))
		} : {}
	}) : {
		entries: [],
		sources: []
	};
	for (const entry of discovery.entries) {
		if (!shouldLoadHook(entry)) continue;
		try {
			const hookBaseDir = safeRealpathSync(entry.hook.baseDir);
			if (!hookBaseDir) throw new Error(`Hook base directory is no longer readable: ${entry.hook.baseDir}`);
			const opened = await openRootFile({
				absolutePath: entry.hook.handlerPath,
				rootPath: hookBaseDir,
				boundaryLabel: "hook directory"
			});
			if (!opened.ok) throw new Error(`Handler path fails boundary checks: ${entry.hook.handlerPath}`);
			const safeHandlerPath = opened.path;
			fs.closeSync(opened.fd);
			if (entry.hook.source === "openclaw-workspace" || entry.hook.source === "openclaw-managed") log.warn(`Loading ${entry.hook.source.slice(9)} hook code into the gateway process. Hooks are trusted local code.`);
			const mod = await import(buildImportUrl(safeHandlerPath, entry.hook.source));
			const exportName = entry.metadata?.export ?? "default";
			const handler = resolveFunctionModuleExport({
				mod,
				exportName
			});
			if (!handler) throw new Error(`Handler '${exportName}' is not a function`);
			const events = entry.metadata?.events ?? [];
			if (events.length === 0) throw new Error("Hook has no events defined in metadata");
			const unknownEvents = events.filter((event) => !isKnownInternalHookEventKey(event));
			if (unknownEvents.length > 0) log.warn(`Hook '${sanitizeForLog(entry.hook.name)}' subscribes to event${unknownEvents.length === 1 ? "" : "s"} ${unknownEvents.map((event) => sanitizeForLog(event)).join(", ")} not emitted by OpenClaw core — likely a typo; unless a plugin emits it, the hook never fires. Known events: https://docs.openclaw.ai/automation/hooks`);
			registrations.push(...events.map((event) => ({
				event,
				handler
			})));
			loadedCount++;
			log.debug(`Prepared hook: ${sanitizeForLog(entry.hook.name)} -> ${events.map((event) => sanitizeForLog(event)).join(", ")}${exportName !== "default" ? ` (export: ${sanitizeForLog(exportName)})` : ""}`);
		} catch (error) {
			const message = `Failed to load hook ${sanitizeForLog(entry.hook.name)}: ${sanitizeForLog(formatErrorMessage(error))}`;
			if (opts?.failureMode !== "best-effort") throw new Error(message, { cause: error });
			log.error(message);
		}
	}
	return {
		loadedCount,
		commit({ initial = false } = {}) {
			if (initial && (previousGeneration !== hookOwner.generation || previousGeneration.committed)) return false;
			resetLoadedInternalHooks();
			for (const { event, handler } of registrations) registerInternalHook(event, handler);
			hookOwner.generation = {
				registrations,
				discovery: {
					sources: discovery.sources,
					declaredNames: selection.declaredNames
				},
				committed: true
			};
			setInternalHooksEnabled(enabled);
			return true;
		}
	};
}
//#endregion
export { prepareInternalHooks };
