import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { Jn as string, Un as record, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { n as safeParseWithSchema, t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-U3x0s0Ho.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-plugin-manifests.ts
const LEGACY_MANIFEST_CONTRACT_KEYS = [
	"speechProviders",
	"mediaUnderstandingProviders",
	"imageGenerationProviders",
	"tools"
];
const LEGACY_PLUGIN_MANIFESTS_CHECK_ID = "core/doctor/legacy-plugin-manifests";
const JsonRecordSchema = record(string(), unknown());
function readManifestJson(manifestPath) {
	try {
		return safeParseJsonWithSchema(JsonRecordSchema, fs.readFileSync(manifestPath, "utf-8"));
	} catch {
		return null;
	}
}
function manifestSeenKey(manifestPath) {
	try {
		return fs.realpathSync.native(manifestPath);
	} catch {
		return path.resolve(manifestPath);
	}
}
function buildLegacyManifestContractMigration(params) {
	const nextRaw = { ...params.raw };
	const parsedContracts = safeParseWithSchema(JsonRecordSchema, params.raw.contracts);
	const nextContracts = parsedContracts ? { ...parsedContracts } : {};
	const changeLines = [];
	for (const key of LEGACY_MANIFEST_CONTRACT_KEYS) {
		if (!(key in params.raw)) continue;
		const legacyValues = normalizeTrimmedStringList(params.raw[key]);
		const contractValues = normalizeTrimmedStringList(nextContracts[key]);
		if (legacyValues.length > 0 && contractValues.length === 0) {
			nextContracts[key] = legacyValues;
			changeLines.push(`- ${shortenHomePath(params.manifestPath)}: moved ${key} to contracts.${key}`);
		} else changeLines.push(`- ${shortenHomePath(params.manifestPath)}: removed legacy ${key} (kept contracts.${key})`);
		delete nextRaw[key];
	}
	if (changeLines.length === 0) return null;
	if (Object.keys(nextContracts).length > 0) nextRaw.contracts = nextContracts;
	else delete nextRaw.contracts;
	const pluginId = normalizeOptionalString(params.raw.id) ?? params.manifestPath;
	return {
		manifestPath: params.manifestPath,
		pluginId,
		nextRaw,
		changeLines
	};
}
function collectLegacyPluginManifestContractMigrations(params) {
	const seen = /* @__PURE__ */ new Set();
	const migrations = [];
	const inspectManifest = (manifestPath) => {
		const seenKey = manifestSeenKey(manifestPath);
		if (seen.has(seenKey)) return;
		seen.add(seenKey);
		const raw = readManifestJson(manifestPath);
		const migration = raw && buildLegacyManifestContractMigration({
			manifestPath,
			raw
		});
		if (migration) migrations.push(migration);
	};
	for (const root of params?.manifestRoots ?? []) {
		if (!fs.existsSync(root)) continue;
		for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			inspectManifest(path.join(root, entry.name, "openclaw.plugin.json"));
		}
	}
	for (const plugin of loadPluginManifestRegistryCore({
		...params?.config ? { config: params.config } : {},
		...params?.env ? { env: params.env } : {},
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}).plugins) inspectManifest(plugin.manifestPath);
	return migrations.toSorted((left, right) => left.manifestPath.localeCompare(right.manifestPath));
}
function legacyPluginManifestContractMigrationToHealthFinding(migration) {
	return {
		checkId: LEGACY_PLUGIN_MANIFESTS_CHECK_ID,
		severity: "warning",
		message: `Plugin manifest ${migration.pluginId} uses legacy top-level capability keys.`,
		path: migration.manifestPath,
		target: migration.pluginId,
		requirement: "contracts-capability-keys",
		fixHint: "Run `openclaw doctor --fix` to rewrite legacy plugin manifest capability keys under contracts.*."
	};
}
async function maybeRepairLegacyPluginManifestContracts(params) {
	const migrations = collectLegacyPluginManifestContractMigrations(params);
	if (migrations.length === 0) return false;
	const emitNote = params.note ?? note;
	emitNote(["Legacy plugin manifest capability keys detected.", ...migrations.flatMap((migration) => migration.changeLines)].join("\n"), "Plugin manifests");
	if (!(params.prompter.shouldRepair || await params.prompter.confirmAutoFix({
		message: "Rewrite legacy plugin manifest capability keys into contracts now?",
		initialValue: true
	}))) return false;
	const applied = [];
	for (const migration of migrations) try {
		fs.writeFileSync(migration.manifestPath, `${JSON.stringify(migration.nextRaw, null, 2)}\n`, "utf-8");
		applied.push(...migration.changeLines);
	} catch (error) {
		params.runtime.error(`Failed to rewrite legacy plugin manifest at ${migration.manifestPath}: ${String(error)}`);
	}
	if (applied.length > 0) emitNote(applied.join("\n"), "Doctor changes");
	return applied.length > 0;
}
//#endregion
export { collectLegacyPluginManifestContractMigrations, legacyPluginManifestContractMigrationToHealthFinding, maybeRepairLegacyPluginManifestContracts };
