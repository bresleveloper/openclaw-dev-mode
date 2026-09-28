import { i as extractErrorCode } from "../../error-coercion-C787aVxk.mjs";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { g as readStringValue } from "../../string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "../../home-dir-BKwhAL2c.mjs";
import { t as asBoolean } from "../../boolean-C30ltbL7.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../text-utility-runtime-D7I29NA0.mjs";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-CaI6yWBc.mjs";
import "../../state-paths-Bk2vDLZh.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region extensions/canvas/src/config-migration.ts
/** Canvas config migration to the single surviving route-enable switch. */
const RETIRED_HOST_KEYS = [
	"root",
	"port",
	"liveReload"
];
function readLegacyCanvasRoot(config) {
	const legacyHost = asOptionalRecord(asOptionalRecord(config)?.canvasHost);
	const pluginHost = asOptionalRecord(resolvePluginConfigObject(config, "canvas")?.host);
	return {
		...legacyHost,
		...pluginHost
	}.root;
}
function resolveLegacyCanvasDocumentsDir(params) {
	const configuredRoot = readStringValue(readLegacyCanvasRoot(params.config))?.trim();
	if (!configuredRoot) return null;
	const legacyDir = path.join(path.resolve(resolveUserPath(configuredRoot, params.env)), "documents");
	const coreDir = path.resolve(params.stateDir, "canvas", "documents");
	if (legacyDir === coreDir) return null;
	try {
		if (fs.realpathSync(legacyDir) === fs.realpathSync(coreDir)) return null;
	} catch {}
	return legacyDir;
}
function listLegacyCanvasDocumentIds(documentsDir) {
	try {
		return fs.readdirSync(documentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted();
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return [];
		throw new Error(`Cannot read Canvas documents at ${documentsDir}: ${String(error)}. Keep plugins.entries.canvas.config.host.root, fix access, then rerun "openclaw doctor --fix".`, { cause: error });
	}
}
/** Removes retired file-host settings while preserving the route enablement choice. */
function migrateCanvasHostConfig(config) {
	const legacyHost = asOptionalRecord(config.canvasHost);
	const canvasConfig = resolvePluginConfigObject(config, "canvas");
	const existingHost = asOptionalRecord(canvasConfig?.host);
	const configuredRoot = readLegacyCanvasRoot(config);
	let retainRoot = readStringValue(configuredRoot)?.includes("${") === true;
	if (!retainRoot) try {
		const legacyDir = resolveLegacyCanvasDocumentsDir({
			config,
			env: process.env,
			stateDir: resolveStateDir()
		});
		retainRoot = legacyDir !== null && listLegacyCanvasDocumentIds(legacyDir).length > 0;
	} catch {
		retainRoot = true;
	}
	const retiredKeys = RETIRED_HOST_KEYS.filter((key) => Object.hasOwn(existingHost ?? {}, key) && !(key === "root" && retainRoot));
	if (!legacyHost && retiredKeys.length === 0) return null;
	const next = structuredClone(config);
	delete next.canvasHost;
	const enabled = asBoolean(existingHost?.enabled) ?? asBoolean(legacyHost?.enabled);
	const nextPlugins = asOptionalRecord(next.plugins) ?? {};
	const nextEntries = asOptionalRecord(nextPlugins.entries) ?? {};
	const nextEntry = asOptionalRecord(nextEntries.canvas) ?? {};
	const nextPluginConfig = asOptionalRecord(nextEntry.config) ?? {};
	if (existingHost || enabled !== void 0 || retainRoot) {
		if (enabled === void 0 && !retainRoot) delete nextPluginConfig.host;
		else nextPluginConfig.host = {
			...enabled !== void 0 ? { enabled } : {},
			...retainRoot ? { root: configuredRoot } : {}
		};
		nextEntry.config = nextPluginConfig;
		nextEntries.canvas = nextEntry;
		nextPlugins.entries = nextEntries;
		next.plugins = nextPlugins;
	}
	const changes = [];
	if (legacyHost) changes.push(retainRoot ? "Migrated canvasHost to plugins.entries.canvas.config.host; retained root for document migration retry." : enabled === void 0 ? "Removed retired canvasHost configuration." : "Migrated canvasHost.enabled to plugins.entries.canvas.config.host.enabled.");
	if (retiredKeys.length > 0) changes.push(`Removed retired Canvas host config: ${retiredKeys.map((key) => `plugins.entries.canvas.config.host.${key}`).join(", ")}.`);
	return {
		config: next,
		changes
	};
}
//#endregion
//#region extensions/canvas/doctor-contract-api.ts
const RETIRED_CANVAS_HOST_CONFIG_PATH = [
	"plugins",
	"entries",
	"canvas",
	"config",
	"host"
];
/** Retired Canvas file-host settings detected before strict plugin validation. */
const legacyConfigRules = [{
	path: ["canvasHost"],
	message: "canvasHost is retired; only plugins.entries.canvas.config.host.enabled remains. Run \"openclaw doctor --fix\"."
}, ...[
	"root",
	"port",
	"liveReload"
].map((key) => ({
	path: [...RETIRED_CANVAS_HOST_CONFIG_PATH, key],
	message: `${[...RETIRED_CANVAS_HOST_CONFIG_PATH, key].join(".")} is retired. Run "openclaw doctor --fix".`
}))];
/** Removes retired file-host config while preserving the surviving enablement switch. */
function normalizeCompatibilityConfig({ cfg }) {
	return migrateCanvasHostConfig(cfg) ?? {
		config: cfg,
		changes: []
	};
}
const stateMigrations = [{
	id: "canvas-custom-root-documents-to-core",
	label: "Canvas documents in a custom host root",
	async detectLegacyState(params) {
		const legacyDir = resolveLegacyCanvasDocumentsDir(params);
		if (!legacyDir) return null;
		const documentIds = listLegacyCanvasDocumentIds(legacyDir);
		if (documentIds.length === 0) return null;
		return { preview: [`- Canvas documents: ${legacyDir} -> ${path.resolve(params.stateDir, "canvas", "documents")} (${documentIds.length} document(s))`] };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const legacyDir = resolveLegacyCanvasDocumentsDir(params);
		if (!legacyDir) return {
			changes,
			warnings
		};
		const documentIds = listLegacyCanvasDocumentIds(legacyDir);
		if (documentIds.length === 0) return {
			changes,
			warnings
		};
		const { pathExists } = await import("../../plugin-sdk/text-utility-runtime.js");
		const coreDir = path.resolve(params.stateDir, "canvas", "documents");
		await fs$1.mkdir(coreDir, { recursive: true });
		let migrated = 0;
		for (const documentId of documentIds) {
			const sourceDir = path.join(legacyDir, documentId);
			const targetDir = path.join(coreDir, documentId);
			let tempParent;
			try {
				if (await pathExists(targetDir)) throw new Error("core target already exists");
				tempParent = await fs$1.mkdtemp(path.join(coreDir, ".canvas-migrate-"));
				const tempDocumentDir = path.join(tempParent, documentId);
				await fs$1.cp(sourceDir, tempDocumentDir, {
					recursive: true,
					errorOnExist: true,
					force: false
				});
				if (await pathExists(targetDir)) throw new Error("core target was created during migration");
				await fs$1.rename(tempDocumentDir, targetDir);
				await fs$1.rm(sourceDir, {
					recursive: true,
					force: true
				});
				migrated += 1;
			} catch (error) {
				warnings.push(`Skipped Canvas document ${documentId}; core target may already exist: ${String(error)}. Keep plugins.entries.canvas.config.host.root, resolve the copy or target conflict, then rerun "openclaw doctor --fix".`);
			} finally {
				if (tempParent) await fs$1.rm(tempParent, {
					recursive: true,
					force: true
				}).catch(() => void 0);
			}
		}
		if (migrated > 0) changes.push(`Migrated ${migrated} Canvas document(s) into core storage`);
		try {
			if ((await fs$1.readdir(legacyDir)).length === 0) await fs$1.rmdir(legacyDir);
		} catch {}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
