import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-BbfxS7ow.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import "./manifest-gUPkNRN0.mjs";
import { r as resolvePackageExtensionEntries } from "./package-manifest-Zddwuhx3.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { f as isOptionalPluginManifestFile } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { i as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-CshXgnB5.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-BZAiJgsR.mjs";
import { a as resolvePluginVersionDriftTargets, i as resolvePluginVersionDriftRegistryLag, o as resolvePluginVersionDriftUpdateCommand, t as detectPluginVersionDrift } from "./plugin-version-drift-CDS-f9Kk.mjs";
import fs from "node:fs";
import crypto from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/commands/doctor-post-upgrade.types.ts
const POST_UPGRADE_PROBE_CODES = [
	"plugin.index_unavailable",
	"plugin.entry_unresolved",
	"plugin.manifest_unavailable",
	"plugin.manifest_drift",
	"plugin.version_drift"
];
//#endregion
//#region src/commands/doctor-post-upgrade.ts
function buildReport(findings) {
	return {
		probesRun: [...POST_UPGRADE_PROBE_CODES],
		findings
	};
}
function isBundledSourceCheckoutPluginRoot(pluginRootDir) {
	let current = path.resolve(pluginRootDir);
	while (true) {
		const extensionsDir = path.dirname(current);
		if (path.basename(extensionsDir) === "extensions") {
			const packageRoot = path.dirname(extensionsDir);
			return [
				".git",
				"pnpm-workspace.yaml",
				"src"
			].every((entry) => fs.existsSync(path.join(packageRoot, entry)));
		}
		if (extensionsDir === current) return false;
		current = extensionsDir;
	}
}
async function runPostUpgradeProbes(params) {
	const findings = [];
	const installs = await readPersistedInstalledPluginIndex(params);
	if (!installs) {
		findings.push({
			level: "error",
			code: "plugin.index_unavailable",
			message: "Installed plugin index is missing, unreadable, or malformed. Run `openclaw plugins registry --refresh` to rebuild it before post-upgrade validation."
		});
		return buildReport(findings);
	}
	const enabledPlugins = installs.plugins.filter((record) => record.enabled);
	const installRecords = Object.fromEntries(Object.entries(installs.installRecords).filter(([id]) => enabledPlugins.some((record) => record.pluginId === id || resolveInstalledPluginIndexInstallOwner(record) === id)));
	const drift = await resolvePluginVersionDriftTargets(detectPluginVersionDrift({
		gatewayVersion: VERSION,
		installRecords,
		config: { update: { channel: params.updateChannel } }
	}));
	for (const entry of drift.drifts) {
		const registryLag = resolvePluginVersionDriftRegistryLag(entry);
		const updateCommand = resolvePluginVersionDriftUpdateCommand(entry);
		const repair = registryLag ? `The registry already serves ${registryLag.registryVersion}; no release reaches ${registryLag.expectedVersion} yet, so no update applies.` : updateCommand ? `Run \`${updateCommand}\`, then restart the Gateway.` : "No confirmed repair target is available; check registry availability and rerun this command.";
		findings.push({
			level: "warn",
			code: "plugin.version_drift",
			plugin: entry.pluginId,
			message: `Plugin ${entry.pluginId} is ${entry.installedVersion}, but OpenClaw is ${VERSION}. ${repair}`
		});
	}
	for (const record of enabledPlugins) {
		const addError = (code, message, entry) => findings.push({
			level: "error",
			code,
			message: `Plugin ${record.pluginId}: ${message}`,
			plugin: record.pluginId,
			...entry ? { entry } : {}
		});
		const pkgRelPath = record.packageJson?.path ?? await fs$1.access(path.join(record.rootDir, "package.json")).then(() => "package.json", () => void 0);
		if (pkgRelPath) {
			let pkg;
			try {
				const parsed = JSON.parse(await fs$1.readFile(path.join(record.rootDir, pkgRelPath), "utf-8"));
				if (!isRecord(parsed)) throw new Error("package.json must contain a JSON object");
				pkg = parsed;
			} catch (err) {
				const reason = err instanceof Error ? err.message : String(err);
				const message = `[doctor-post-upgrade] could not read package.json for ${record.pluginId} at ${record.rootDir}: ${reason}`;
				process.stderr.write(`${formatConsoleDiagnosticLine({
					level: "warn",
					message
				})}\n`);
				addError("plugin.entry_unresolved", `could not read package.json (${pkgRelPath}): ${reason}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`, pkgRelPath);
				continue;
			}
			const resolvedEntries = resolvePackageExtensionEntries(pkg);
			if (resolvedEntries.status === "invalid") addError("plugin.entry_unresolved", `${resolvedEntries.error}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`, pkgRelPath);
			else if (resolvedEntries.status === "ok") {
				const entries = resolvedEntries.entries;
				const validation = await validatePackageExtensionEntriesForInstall({
					packageDir: record.rootDir,
					extensions: [...entries],
					manifest: pkg,
					allowSourceTypeScriptEntries: record.origin === "workspace" || record.origin === "config" || record.origin === "bundled" && isBundledSourceCheckoutPluginRoot(record.rootDir)
				});
				if (!validation.ok) {
					const offendingEntry = entries.find((entry) => validation.error.includes(entry));
					addError("plugin.entry_unresolved", validation.error, offendingEntry);
				}
			}
		}
		if (record.manifestPath) {
			let currentHash;
			try {
				const raw = await fs$1.readFile(record.manifestPath);
				currentHash = crypto.createHash("sha256").update(raw).digest("hex");
			} catch (err) {
				if (hasErrnoCode(err, "ENOENT") && isOptionalPluginManifestFile(record)) continue;
				const reason = err instanceof Error ? err.message : String(err);
				addError("plugin.manifest_unavailable", `could not read indexed manifest (${record.manifestPath}): ${reason}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`);
				continue;
			}
			if (record.manifestHash && currentHash !== record.manifestHash) findings.push({
				level: "warn",
				code: "plugin.manifest_drift",
				message: `Plugin ${record.pluginId} manifest hash drifted from the installed plugin index. Run \`openclaw plugins registry --refresh\` to re-sync.`,
				plugin: record.pluginId
			});
		}
	}
	return buildReport(findings);
}
//#endregion
export { runPostUpgradeProbes };
