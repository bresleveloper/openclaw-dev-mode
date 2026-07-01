import { n as defaultRuntime, r as writeRuntimeJson } from "./runtime-B4lgFmsS.js";
import { r as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-AuIWsoCO.js";
import { r as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-xmLokiA3.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/commands/doctor-post-upgrade.types.ts
/** Probe codes emitted by post-upgrade validation. */
const POST_UPGRADE_PROBE_CODES = [
	"plugin.index_unavailable",
	"plugin.entry_unresolved",
	"plugin.manifest_drift"
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
function isInstallsJson(value) {
	return typeof value === "object" && value !== null && Array.isArray(value.plugins) && value.plugins.every(isInstalledPluginRecord);
}
function isOptionalString(value) {
	return value === void 0 || typeof value === "string";
}
function isPackageJsonRef(value) {
	return value === void 0 || typeof value === "object" && value !== null && typeof value.path === "string";
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
function isInstalledPluginRecord(value) {
	if (typeof value !== "object" || value === null) return false;
	const record = value;
	return typeof record.pluginId === "string" && typeof record.rootDir === "string" && typeof record.enabled === "boolean" && isOptionalString(record.origin) && isPackageJsonRef(record.packageJson) && isOptionalString(record.manifestPath) && isOptionalString(record.manifestHash);
}
async function readInstallsJson(installsPath) {
	try {
		const installsRaw = await fs$1.readFile(installsPath, "utf-8");
		const installs = JSON.parse(installsRaw);
		return isInstallsJson(installs) ? installs : null;
	} catch {
		return null;
	}
}
async function readInstalledPluginIndex(params) {
	if (params.installsPath) return await readInstallsJson(params.installsPath);
	const index = await readPersistedInstalledPluginIndex(params.stateDir ? { stateDir: params.stateDir } : {});
	return index && isInstallsJson(index) ? { plugins: [...index.plugins] } : null;
}
async function readInstalledPackageJson(rootDir, packageJsonRelPath) {
	const absPath = path.join(rootDir, packageJsonRelPath);
	const raw = await fs$1.readFile(absPath, "utf-8");
	return JSON.parse(raw);
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
async function sha256OfFile(absPath) {
	try {
		const raw = await fs$1.readFile(absPath);
		return crypto.createHash("sha256").update(raw).digest("hex");
	} catch {
		return null;
	}
}
/** Runs post-upgrade plugin probes and returns structured findings for the caller to render. */
async function runPostUpgradeProbes(params) {
	const findings = [];
	const installs = await readInstalledPluginIndex(params);
	if (!installs) {
		findings.push({
			level: "error",
			code: "plugin.index_unavailable",
			message: "Installed plugin index is missing, unreadable, or malformed. Run `openclaw plugins registry --refresh` to rebuild it before post-upgrade validation."
		});
		return buildReport(findings);
	}
	for (const record of installs.plugins) {
		if (!record.enabled) continue;
		const pkgRelPath = await resolvePackageJsonRelPath(record);
		if (pkgRelPath) {
			let pkg;
			try {
				pkg = await readInstalledPackageJson(record.rootDir, pkgRelPath);
			} catch (err) {
				process.stderr.write(`[doctor-post-upgrade] could not read package.json for ${record.pluginId} at ${record.rootDir}: ${err instanceof Error ? err.message : String(err)}\n`);
				continue;
			}
			const entries = pkg.openclaw?.extensions ?? [];
			if (entries.length > 0) {
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
		if (record.manifestPath && record.manifestHash) {
			const currentHash = await sha256OfFile(record.manifestPath);
			if (currentHash && currentHash !== record.manifestHash) findings.push({
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
//#region src/commands/doctor.ts
/** Top-level doctor command wrapper, including post-upgrade probe mode. */
/** Runs doctor or the post-upgrade probe submode using the provided runtime. */
async function doctorCommand(runtime, options) {
	if (options?.postUpgrade) {
		const outputRuntime = runtime ?? defaultRuntime;
		const report = await runPostUpgradeProbes({});
		if (options.json) writeRuntimeJson(outputRuntime, report);
		else {
			for (const f of report.findings) outputRuntime.log(`[${f.level}] ${f.code}: ${f.message}`);
			if (report.findings.length === 0) outputRuntime.log("post-upgrade: no findings");
		}
		const hasError = report.findings.some((f) => f.level === "error");
		outputRuntime.exit(hasError ? 1 : 0);
		return;
	}
	await (await import("./doctor-health-DnNDWrUJ.js")).doctorCommand(runtime, options);
}
//#endregion
export { doctorCommand as t };
