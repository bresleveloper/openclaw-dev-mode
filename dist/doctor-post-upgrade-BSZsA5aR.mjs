import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-BEWeG-Rv.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { u as isOptionalPluginManifestFile } from "./installed-plugin-index-D0kh4WcK.mjs";
import "./manifest-DHkEL08H.mjs";
import { i as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-D32N9wpN.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { a as resolvePluginVersionDriftTargets, i as resolvePluginVersionDriftRegistryLag, o as resolvePluginVersionDriftUpdateCommand, t as detectPluginVersionDrift } from "./plugin-version-drift-CKIIcvZc.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/commands/doctor-post-upgrade.types.ts
/** Probe codes emitted by post-upgrade validation. */
const POST_UPGRADE_PROBE_CODES = [
	"plugin.index_unavailable",
	"plugin.entry_unresolved",
	"plugin.manifest_unavailable",
	"plugin.manifest_drift",
	"plugin.version_drift"
];
//#endregion
//#region src/commands/doctor-post-upgrade.ts
/** Post-upgrade validation probes for persisted plugin index and package extension entries. */
function buildReport(findings) {
	return {
		probesRun: [...POST_UPGRADE_PROBE_CODES],
		findings
	};
}
function isSourceCheckoutPluginRecord(record) {
	if (record.origin === "workspace" || record.origin === "config") return true;
	return record.origin === "bundled" && isBundledSourceCheckoutPluginRoot(record.rootDir);
}
function isBundledSourceCheckoutPluginRoot(pluginRootDir) {
	let current = path.resolve(pluginRootDir);
	while (true) {
		const extensionsDir = path.dirname(current);
		if (path.basename(extensionsDir) === "extensions") {
			const packageRoot = path.dirname(extensionsDir);
			return fs.existsSync(path.join(packageRoot, ".git")) && fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && fs.existsSync(path.join(packageRoot, "src"));
		}
		const next = path.dirname(current);
		if (next === current) return false;
		current = next;
	}
}
async function readInstalledPackageJson(rootDir, packageJsonRelPath) {
	const absPath = path.join(rootDir, packageJsonRelPath);
	const raw = await fs$1.readFile(absPath, "utf-8");
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed)) throw new Error("package.json must contain a JSON object");
	return parsed;
}
async function resolvePackageJsonRelPath(record) {
	if (record.packageJson) return record.packageJson.path;
	try {
		await fs$1.access(path.join(record.rootDir, "package.json"));
		return "package.json";
	} catch {
		return;
	}
}
/** Runs post-upgrade plugin probes and returns structured findings for the caller to render. */
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
		const pkgRelPath = await resolvePackageJsonRelPath(record);
		if (pkgRelPath) {
			let pkg;
			try {
				pkg = await readInstalledPackageJson(record.rootDir, pkgRelPath);
			} catch (err) {
				const reason = err instanceof Error ? err.message : String(err);
				const message = `[doctor-post-upgrade] could not read package.json for ${record.pluginId} at ${record.rootDir}: ${reason}`;
				process.stderr.write(`${formatConsoleDiagnosticLine({
					level: "warn",
					message
				})}\n`);
				findings.push({
					level: "error",
					code: "plugin.entry_unresolved",
					message: `Plugin ${record.pluginId}: could not read package.json (${pkgRelPath}): ${reason}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`,
					plugin: record.pluginId,
					entry: pkgRelPath
				});
				continue;
			}
			const resolvedEntries = resolvePackageExtensionEntries(pkg);
			if (resolvedEntries.status === "invalid") findings.push({
				level: "error",
				code: "plugin.entry_unresolved",
				message: `Plugin ${record.pluginId}: ${resolvedEntries.error}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`,
				plugin: record.pluginId,
				entry: pkgRelPath
			});
			else if (resolvedEntries.status === "ok") {
				const entries = resolvedEntries.entries;
				const validation = await validatePackageExtensionEntriesForInstall({
					packageDir: record.rootDir,
					extensions: [...entries],
					manifest: pkg,
					allowSourceTypeScriptEntries: isSourceCheckoutPluginRecord(record)
				});
				if (!validation.ok) {
					const offendingEntry = entries.find((entry) => validation.error.includes(entry));
					findings.push({
						level: "error",
						code: "plugin.entry_unresolved",
						message: `Plugin ${record.pluginId}: ${validation.error}`,
						plugin: record.pluginId,
						...offendingEntry ? { entry: offendingEntry } : {}
					});
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
				findings.push({
					level: "error",
					code: "plugin.manifest_unavailable",
					message: `Plugin ${record.pluginId}: could not read indexed manifest (${record.manifestPath}): ${reason}. Reinstall the plugin or run \`openclaw plugins registry --refresh\`.`,
					plugin: record.pluginId
				});
				continue;
			}
			if (record.manifestHash && currentHash !== record.manifestHash) findings.push({
				level: "warn",
				code: "plugin.manifest_drift",
				message: `Plugin ${record.pluginId} manifest hash drifted from installs.json snapshot. Run \`openclaw plugins registry --refresh\` to re-sync.`,
				plugin: record.pluginId
			});
		}
	}
	return buildReport(findings);
}
//#endregion
export { runPostUpgradeProbes };
