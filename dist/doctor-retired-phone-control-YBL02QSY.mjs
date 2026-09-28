import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./errors-DnjwnOju.mjs";
import { r as createPluginStateKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import { t as archiveLegacyStateSource } from "./doctor-state-migration-fs-CfVap4xL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-retired-phone-control.ts
const PHONE_CONTROL_PLUGIN_ID = "phone-control";
const ARM_STATE_NAMESPACE = "armed";
const RETIRED_ARM_GROUPS = /* @__PURE__ */ new Set([
	"camera",
	"screen",
	"computer",
	"mobile-ui",
	"writes",
	"all"
]);
const RETIRED_PHONE_CONTROL_SEEDED_DENY_COMMANDS = [
	"camera.snap",
	"camera.clip",
	"screen.record",
	"computer.act",
	"mobile.ui.observe",
	"mobile.ui.act",
	"contacts.add",
	"calendar.add",
	"reminders.add",
	"sms.send",
	"sms.search",
	"health.summary"
];
function resolveLegacyArmStatePath(env) {
	return path.join(resolveStateDir(env), "plugins", PHONE_CONTROL_PLUGIN_ID, "armed.json");
}
function resolveStateDatabasePath(env) {
	return path.join(resolveStateDir(env), "state", "openclaw.sqlite");
}
async function inspectStatePath(filePath, label) {
	try {
		return (await fs.stat(filePath)).isFile() ? { status: "file" } : {
			status: "unsafe",
			warning: `${label} at ${filePath} is not a regular file.`
		};
	} catch (error) {
		if (isMissingPathError(error)) return { status: "missing" };
		return {
			status: "unsafe",
			warning: `Could not inspect ${label} at ${filePath}: ${String(error)}`
		};
	}
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string" && entry.trim() !== "");
}
function isTimestamp(value) {
	return Number.isSafeInteger(value) && Number(value) >= 0;
}
function isRetiredArmState(value) {
	if (!isRecord(value) || !isTimestamp(value.armedAtMs)) return false;
	if (value.expiresAtMs !== null && !isTimestamp(value.expiresAtMs)) return false;
	if (value.version === 1) return isStringArray(value.removedFromDeny);
	if (value.version !== 2 && value.version !== 3) return false;
	if (typeof value.group !== "string" || !RETIRED_ARM_GROUPS.has(value.group) || !isStringArray(value.armedCommands) || !isStringArray(value.addedToAllow) || !isStringArray(value.removedFromDeny)) return false;
	if (value.version === 2) return true;
	return typeof value.generation === "string" && value.generation.trim() !== "" && (value.phase === "preparing" || value.phase === "active") && isStringArray(value.persistentAllows);
}
function readStringArrayField(value, field) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return [];
	const entries = value[field];
	return Array.isArray(entries) ? entries.filter((entry) => typeof entry === "string" && entry.trim() !== "") : [];
}
function openRetiredArmStateStore(env) {
	return createPluginStateKeyedStore(PHONE_CONTROL_PLUGIN_ID, {
		namespace: ARM_STATE_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new",
		env
	});
}
async function readRetiredArmStates(env) {
	const legacyPath = resolveLegacyArmStatePath(env);
	const databasePath = resolveStateDatabasePath(env);
	const [legacyInspection, databaseInspection] = await Promise.all([inspectStatePath(legacyPath, "retired Phone Control lease state"), inspectStatePath(databasePath, "OpenClaw state database")]);
	const warnings = [];
	const inspectionUnsafe = legacyInspection.status === "unsafe" || databaseInspection.status === "unsafe";
	if (legacyInspection.status === "unsafe") warnings.push(legacyInspection.warning);
	if (databaseInspection.status === "unsafe") warnings.push(databaseInspection.warning);
	let legacyState;
	let legacyStateValid = false;
	if (legacyInspection.status === "file") try {
		legacyState = JSON.parse(await fs.readFile(legacyPath, "utf8"));
		legacyStateValid = isRetiredArmState(legacyState);
		if (!legacyStateValid) warnings.push(`Retired Phone Control lease state at ${legacyPath} is malformed.`);
	} catch (error) {
		warnings.push(`Could not read retired Phone Control lease state at ${legacyPath}: ${String(error)}`);
	}
	let sqliteReadFailed = false;
	let sqliteEntries = [];
	if (databaseInspection.status === "file") try {
		sqliteEntries = await openRetiredArmStateStore(env).entries();
		if (sqliteEntries.length > 1) {
			sqliteReadFailed = true;
			warnings.push("Retired Phone Control lease journal contains multiple records.");
		} else if (sqliteEntries.length === 1 && !isRetiredArmState(sqliteEntries[0]?.value)) {
			sqliteReadFailed = true;
			warnings.push("Retired Phone Control lease journal contains a malformed record.");
		}
	} catch (error) {
		sqliteReadFailed = true;
		warnings.push(`Could not read retired Phone Control lease journal: ${String(error)}`);
	}
	const hasCanonicalState = sqliteEntries.length === 1 && !sqliteReadFailed;
	const cleanupSafe = !inspectionUnsafe && !sqliteReadFailed && (hasCanonicalState || legacyInspection.status !== "file" || legacyStateValid);
	return {
		states: cleanupSafe ? hasCanonicalState ? sqliteEntries.map((entry) => entry.value) : legacyStateValid ? [legacyState] : [] : [],
		cleanupPending: inspectionUnsafe || legacyInspection.status !== "missing" || sqliteEntries.length > 0 || sqliteReadFailed,
		cleanupSafe,
		warnings
	};
}
function isExactSeededDenyList(values) {
	const normalized = [...values].toSorted();
	const expected = [...RETIRED_PHONE_CONTROL_SEEDED_DENY_COMMANDS].toSorted();
	return normalized.length === expected.length && normalized.every((value, index) => value === expected[index]);
}
function withCommandLists(cfg, params) {
	const commands = { ...cfg.gateway?.nodes?.commands };
	if (params.allow === void 0 || params.allow.length === 0) delete commands.allow;
	else commands.allow = params.allow;
	if (params.deny === void 0 || params.deny.length === 0) delete commands.deny;
	else commands.deny = params.deny;
	const nodes = { ...cfg.gateway?.nodes };
	delete nodes.commands;
	return {
		...cfg,
		gateway: {
			...cfg.gateway,
			nodes: {
				...nodes,
				...Object.keys(commands).length > 0 ? { commands } : {}
			}
		}
	};
}
/** Plans canonical config cleanup while retaining the journal until the config write succeeds. */
async function prepareRetiredPhoneControlCleanup(params) {
	const residue = await readRetiredArmStates(params.env ?? process.env);
	if (!residue.cleanupSafe) return {
		config: params.cfg,
		configChanges: [],
		cleanupPending: residue.cleanupPending,
		cleanupSafe: false,
		warnings: residue.warnings
	};
	const leaseAddedAllows = new Set(residue.states.flatMap((state) => readStringArrayField(state, "addedToAllow")));
	const leaseRemovedDenies = residue.states.flatMap((state) => readStringArrayField(state, "removedFromDeny"));
	const currentAllow = params.cfg.gateway?.nodes?.commands?.allow;
	const currentDeny = params.cfg.gateway?.nodes?.commands?.deny;
	const reconstructedDeny = [...currentDeny ?? []];
	const reconstructedDenySet = new Set(reconstructedDeny);
	for (const command of leaseRemovedDenies) if (!reconstructedDenySet.has(command)) {
		reconstructedDeny.push(command);
		reconstructedDenySet.add(command);
	}
	const removeSeededDeny = currentDeny !== void 0 && isExactSeededDenyList(reconstructedDeny);
	const leaseShadowedAllows = removeSeededDeny ? new Set(leaseRemovedDenies) : void 0;
	const nextAllow = currentAllow?.filter((command) => !leaseAddedAllows.has(command.trim()) && !leaseShadowedAllows?.has(command.trim()));
	const nextDeny = removeSeededDeny ? reconstructedDeny.filter((command) => nextAllow?.includes(command)) : reconstructedDeny;
	const allowChanged = Boolean(currentAllow && nextAllow?.length !== currentAllow.length);
	const denyChanged = reconstructedDeny.length !== (currentDeny?.length ?? 0);
	if (!allowChanged && !denyChanged && !removeSeededDeny) return {
		config: params.cfg,
		configChanges: [],
		cleanupPending: residue.cleanupPending,
		cleanupSafe: residue.cleanupSafe,
		warnings: residue.warnings
	};
	const configChanges = [];
	if (allowChanged) configChanges.push("Removed stale Phone Control lease-only command allow entries.");
	if (denyChanged && !removeSeededDeny) configChanges.push("Restored command deny entries removed by Phone Control leases.");
	if (removeSeededDeny) configChanges.push("Removed the retired Phone Control setup deny seed.");
	return {
		config: withCommandLists(params.cfg, {
			allow: nextAllow,
			deny: nextDeny
		}),
		configChanges,
		cleanupPending: residue.cleanupPending,
		cleanupSafe: residue.cleanupSafe,
		warnings: residue.warnings
	};
}
/** Drops SQLite journal rows and archives the legacy file after config persistence. */
async function finalizeRetiredPhoneControlCleanup(params) {
	const env = params.env ?? process.env;
	const changes = [];
	const warnings = [];
	const legacyPath = resolveLegacyArmStatePath(env);
	const legacyInspection = await inspectStatePath(legacyPath, "retired Phone Control lease state");
	if (legacyInspection.status === "unsafe") {
		warnings.push(legacyInspection.warning);
		return {
			changes,
			warnings
		};
	}
	if (legacyInspection.status === "file") {
		await archiveLegacyStateSource({
			filePath: legacyPath,
			label: "retired Phone Control lease state",
			changes,
			warnings
		});
		const postArchiveInspection = await inspectStatePath(legacyPath, "retired Phone Control lease state");
		if (postArchiveInspection.status === "unsafe") warnings.push(postArchiveInspection.warning);
		if (postArchiveInspection.status !== "missing") return {
			changes,
			warnings
		};
	}
	const databaseInspection = await inspectStatePath(resolveStateDatabasePath(env), "OpenClaw state database");
	if (databaseInspection.status === "unsafe") {
		warnings.push(databaseInspection.warning);
		return {
			changes,
			warnings
		};
	}
	if (databaseInspection.status === "file") try {
		const store = openRetiredArmStateStore(env);
		if ((await store.entries()).length > 0) {
			await store.clear();
			changes.push("Dropped the retired Phone Control lease journal.");
		}
	} catch (error) {
		warnings.push(`Failed to drop the retired Phone Control lease journal: ${String(error)}`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { finalizeRetiredPhoneControlCleanup, prepareRetiredPhoneControlCleanup };
