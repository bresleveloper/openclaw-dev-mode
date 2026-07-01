import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/phone-control/doctor-contract-api.ts
const ARM_STATE_NAMESPACE = "armed";
const ARM_STATE_KEY = "current";
function resolveArmStatePath(stateDir) {
	return path.join(stateDir, "plugins", "phone-control", "armed.json");
}
async function fileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function parseArmState(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const parsed = value;
	if (parsed.version !== 1 && parsed.version !== 2) return null;
	if (typeof parsed.armedAtMs !== "number") return null;
	if (!(parsed.expiresAtMs === null || typeof parsed.expiresAtMs === "number")) return null;
	if (parsed.version === 1) {
		if (!isStringArray(parsed.removedFromDeny)) return null;
		return {
			version: 1,
			armedAtMs: parsed.armedAtMs,
			expiresAtMs: parsed.expiresAtMs,
			removedFromDeny: parsed.removedFromDeny
		};
	}
	const group = typeof parsed.group === "string" ? parsed.group : "";
	if (group !== "camera" && group !== "screen" && group !== "writes" && group !== "all") return null;
	if (!isStringArray(parsed.armedCommands) || !isStringArray(parsed.addedToAllow) || !isStringArray(parsed.removedFromDeny)) return null;
	return {
		version: 2,
		armedAtMs: parsed.armedAtMs,
		expiresAtMs: parsed.expiresAtMs,
		group,
		armedCommands: parsed.armedCommands,
		addedToAllow: parsed.addedToAllow,
		removedFromDeny: parsed.removedFromDeny
	};
}
async function readLegacyArmState(filePath) {
	try {
		return parseArmState(JSON.parse(await fs.readFile(filePath, "utf8")));
	} catch {
		return null;
	}
}
async function archiveLegacySource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	if (await fileExists(archivedPath)) {
		params.warnings.push(`Left migrated Phone Control armed-state source in place because ${archivedPath} already exists`);
		return;
	}
	try {
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived Phone Control armed-state legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving Phone Control armed-state legacy source: ${String(err)}`);
	}
}
const stateMigrations = [{
	id: "phone-control-armed-json-to-plugin-state",
	label: "Phone Control armed state",
	async detectLegacyState(params) {
		const filePath = resolveArmStatePath(params.stateDir);
		if (!await readLegacyArmState(filePath)) return null;
		return { preview: [`- Phone Control armed state: ${filePath} -> plugin state (${ARM_STATE_NAMESPACE})`] };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const filePath = resolveArmStatePath(params.stateDir);
		const state = await readLegacyArmState(filePath);
		if (!state) return {
			changes,
			warnings
		};
		const store = params.context.openPluginStateKeyedStore({
			namespace: ARM_STATE_NAMESPACE,
			maxEntries: 1
		});
		if (await store.lookup(ARM_STATE_KEY)) {
			warnings.push("Left Phone Control armed-state source in place because plugin state exists");
			return {
				changes,
				warnings
			};
		}
		await store.register(ARM_STATE_KEY, state);
		changes.push("Migrated Phone Control armed state -> plugin state");
		await archiveLegacySource({
			filePath,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
