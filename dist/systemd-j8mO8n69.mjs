import { C as parseStrictNonNegativeInteger, S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { f as resolveGatewayServiceDescription, o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES } from "./constants-CJCmIHb-.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as findServiceOwnershipRefusal, i as ServiceOwnershipRefusalError, l as sanitizeServiceInspectionError, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { A as isUnresolvedShellReference, C as isSystemdUserScopeUnavailable, D as systemdInspectionError, E as reloadSystemdUserManager, S as isSystemdUnitNotEnabled, T as readSystemctlDetail, a as resolveLegacyNodeSystemdEnvironmentFilePath, b as isSystemdUnitActive, c as resolveSystemdUnitPath, d as assertSystemdAvailable, f as disableSystemdUserUnitForRemoval, g as execSystemctlUser, h as execSystemctl, i as readSystemdServiceExecStart, j as readStateDirDotEnvFromStateDir, l as resolveSystemdUnitPathForName, m as execBusctlUser, n as isNodeSystemdEnvironment, o as resolveSystemdEnvironmentFilePath, p as execBusctlSystem, r as readSystemdEnvironmentFile, s as resolveSystemdServiceName, t as assertSystemdServiceAccount, u as serializeSystemdEnvironmentFile, v as isSystemctlAvailable, x as isSystemdUnitMissingDetail, y as isSystemctlMissing } from "./systemd-service-files-tGuARbbA.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { t as execFileUtf8 } from "./exec-file-DUc4AFoc.mjs";
import { r as writeFormattedLines, t as formatLine } from "./output-EUQq_O0z.mjs";
import { n as publishServiceFile } from "./service-stage-CuqWOVHS.mjs";
import { a as resolveManagedGatewayServiceCommand, i as hasGatewayServiceLauncherOverride } from "./service-types-d44oynyj.mjs";
import { a as hasEnvironmentFileSource, c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment, l as normalizeServiceEnvKeys, o as hasInlineEnvironmentSource, s as isEnvironmentFileOnlySource, u as readEnvironmentValueSource } from "./service-managed-env-BpvQFzJj.mjs";
import { a as resolveSystemdUserTransport, o as openSystemdBroker, r as readSystemdUserTransport, s as openSystemdMachineBroker } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { a as preserveSystemdUnitPolicy, n as buildSystemdUnit, r as parseSystemdEnvAssignments, s as renderSystemdEnvAssignment, u as splitSystemdLogicalLines } from "./systemd-unit-CKIkv32Z.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-jD-7AuMj.mjs";
import { t as SYSTEMD_DEFAULT_STOP_TIMEOUT_MS } from "./systemd-time-span-CGH0scKq.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-BuDPZetd.mjs";
import { n as assertNoSystemGatewayOwnership, r as findInstalledSystemdGatewayScope, t as admitUserUnitActivationPastUnverifiableOwnership } from "./systemd-scope-ChBpir81.mjs";
import { n as withSystemdDefinitionMutation } from "./systemd-definition-mutation-Dj7IBhv4.mjs";
import { isDeepStrictEqual } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/daemon/systemd-install-recovery.ts
/** Capture native policy while the definition writer holds the original artifacts. */
async function captureSystemdInstallRecovery(env, installed) {
	const unit = `${resolveSystemdServiceName(env)}.service`;
	let enabled = "disabled";
	let running = false;
	if (installed) {
		const enablement = await execSystemctlUser(env, ["is-enabled", unit]);
		enabled = enablement.stdout.trim();
		if (enablement.termination !== "exit" || ![
			"enabled",
			"enabled-runtime",
			"disabled",
			"static",
			"indirect"
		].includes(enabled)) throw new Error(`Cannot preserve the existing systemd enablement policy before replacing its definition; no service files were changed: ${readSystemctlDetail(enablement)}`);
		const active = await isSystemdUnitActive(env, unit);
		if (!active.ok) throw new Error(`Cannot preserve the existing systemd running state before replacing its definition; no service files were changed: ${active.error}`);
		running = active.value;
	}
	let activationAttempted = false;
	let restartAttempted = false;
	return {
		beforeAction: (action) => {
			activationAttempted = true;
			restartAttempted ||= action === "restart";
		},
		async restore() {
			if (!activationAttempted) return;
			const run = async (args) => {
				await assertNoSystemGatewayOwnership(env);
				const result = await execSystemctlUser(env, args);
				if (result.code !== 0) throw new Error(`systemctl rollback ${args[0]} failed: ${readSystemctlDetail(result)}`);
			};
			if (enabled !== "enabled") {
				await run(["disable", unit]);
				if (enabled === "enabled-runtime") await run([
					"enable",
					"--runtime",
					unit
				]);
			}
			if (restartAttempted) await run([running ? "restart" : "stop", unit]);
		}
	};
}
//#endregion
//#region src/daemon/systemd-install.ts
/** systemd unit publication, installation, staging, and uninstall. */
const SYSTEMD_GATEWAY_CREDENTIAL_KEYS = /* @__PURE__ */ new Set(["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"]);
function restrictSystemdArtifactMode(mode) {
	return (mode ?? 384) & 448 || 384;
}
function collectSystemdInlineManagedKeys(params) {
	const keys = readManagedServiceEnvKeysFromEnvironment(params.environment);
	for (const key of collectSystemdFileManagedKeys(params.environmentValueSources)) keys.delete(key);
	for (const [rawKey, value] of Object.entries(params.environment ?? {})) {
		if (typeof value !== "string" || !value.trim() && rawKey !== "NODE_OPTIONS") continue;
		const key = normalizeServiceEnvKey(rawKey);
		if (!key) continue;
		const source = readEnvironmentValueSource(params.environmentValueSources, rawKey);
		if (hasInlineEnvironmentSource(source) && !hasEnvironmentFileSource(source)) keys.add(key);
	}
	return keys;
}
function collectSystemdFileManagedKeys(environmentValueSources) {
	return normalizeServiceEnvKeys(Object.entries(environmentValueSources ?? {}).filter(([, source]) => isEnvironmentFileOnlySource(source)).map(([key]) => key));
}
function collectSystemdFileBackedEnvironment(params) {
	const environment = {};
	for (const [rawKey, rawValue] of Object.entries(params.environment ?? {})) {
		if (typeof rawValue !== "string" || !rawValue.trim()) continue;
		const key = normalizeServiceEnvKey(rawKey);
		if (key && params.fileManagedKeys.has(key) && !isUnresolvedShellReference(rawValue)) environment[rawKey] = rawValue;
	}
	return environment;
}
function removeSystemdInlineEnvironmentKeys(content, keys) {
	const sanitizedLines = [];
	for (const rawLine of splitSystemdLogicalLines(content)) {
		const line = rawLine.trim();
		const separator = line.indexOf("=");
		if (separator < 0 || line.slice(0, separator).trim() !== "Environment") {
			sanitizedLines.push(rawLine);
			continue;
		}
		const assignments = parseSystemdEnvAssignments(line.slice(separator + 1).trim());
		const keptAssignments = assignments.filter(({ key }) => {
			const normalizedKey = normalizeServiceEnvKey(key);
			return !normalizedKey || !keys.has(normalizedKey);
		});
		if (keptAssignments.length === assignments.length) {
			sanitizedLines.push(rawLine);
			continue;
		}
		if (keptAssignments.length === 0) continue;
		const leadingWhitespace = rawLine.match(/^\s*/)?.[0] ?? "";
		sanitizedLines.push(`${leadingWhitespace}Environment=${keptAssignments.map(({ key, value }) => renderSystemdEnvAssignment(key, value)).join(" ")}`);
	}
	return sanitizedLines.join("\n");
}
function sanitizeSystemdUnitBackupContent(params) {
	return removeSystemdInlineEnvironmentKeys(params.content, /* @__PURE__ */ new Set([...params.fileManagedKeys, ...SYSTEMD_GATEWAY_CREDENTIAL_KEYS]));
}
function removeLegacyGatewayVersionMetadata(content) {
	const description = /^Description=OpenClaw Gateway \((?:(profile: [^,)\r\n]+), )?v([^)\r\n]+)\)$/mu.exec(content);
	if (!description) return content;
	const inlineEnvironment = /* @__PURE__ */ new Map();
	let inServiceSection = false;
	for (const rawLine of splitSystemdLogicalLines(content)) {
		const line = rawLine.trim();
		if (/^\[[^\]]+\]$/u.test(line)) {
			inServiceSection = line === "[Service]";
			continue;
		}
		if (!inServiceSection || !line.startsWith("Environment=")) continue;
		const rawAssignments = line.slice(12).trim();
		if (!rawAssignments) {
			inlineEnvironment.clear();
			continue;
		}
		for (const assignment of parseSystemdEnvAssignments(rawAssignments)) inlineEnvironment.set(assignment.key, assignment.value);
	}
	if (inlineEnvironment.get("OPENCLAW_SERVICE_MARKER") !== "openclaw" || inlineEnvironment.get("OPENCLAW_SERVICE_KIND") !== "gateway" || inlineEnvironment.get("OPENCLAW_SERVICE_VERSION") !== description[2]) return content;
	const replacement = description[1] ? `Description=OpenClaw Gateway (${description[1]})` : "Description=OpenClaw Gateway";
	return removeSystemdInlineEnvironmentKeys(content.slice(0, description.index) + replacement + content.slice(description.index + description[0].length), /* @__PURE__ */ new Set(["OPENCLAW_SERVICE_VERSION"]));
}
/** Removes obsolete install-time version stamps without restarting the service. */
async function refreshLegacySystemdServiceMetadata(env, timeoutMs) {
	const deadlineAt = performance.now() + Math.max(1, timeoutMs);
	const remainingTimeoutMs = () => Math.max(1, deadlineAt - performance.now());
	const unitPath = resolveSystemdUnitPath(env);
	const current = await fs.readFile(unitPath, "utf8").catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	});
	if (current === null || removeLegacyGatewayVersionMetadata(current) === current) return false;
	await assertNoSystemGatewayOwnership(env, remainingTimeoutMs());
	return await withSystemdDefinitionMutation(env, env, async (mutation) => {
		const snapshot = mutation.snapshots.get(unitPath) ?? null;
		if (!snapshot) return false;
		const previous = snapshot.contents.toString("utf8");
		const refreshed = removeLegacyGatewayVersionMetadata(previous);
		if (refreshed === previous) return false;
		await assertNoSystemGatewayOwnership(env, remainingTimeoutMs());
		await mutation.publish(unitPath, refreshed, snapshot.mode || 420);
		try {
			await assertNoSystemGatewayOwnership(env, remainingTimeoutMs());
			await reloadSystemdUserManager(env, remainingTimeoutMs());
		} catch (error) {
			await mutation.restore(unitPath, snapshot);
			throw error;
		}
		return true;
	}, { timeoutMs: remainingTimeoutMs() });
}
async function writeSystemdUnit({ env, programArguments, workingDirectory, environment, environmentValueSources, description, definitionTransaction, warn }, load) {
	await withGatewayServiceInstallationRecovery(async () => {
		await assertSystemdAvailable(env);
		await assertNoSystemGatewayOwnership(env);
	}, async () => false);
	const unitPath = resolveSystemdUnitPath(env);
	return await withSystemdDefinitionMutation(env, environment ?? env, async (mutation) => {
		const stateDir = resolveStateDir({
			...env,
			...environment
		});
		const environmentFilePath = resolveSystemdEnvironmentFilePath({
			stateDir,
			environment
		});
		const existingUnit = mutation.snapshots.get(unitPath) ?? null;
		const backupPath = `${unitPath}.bak`;
		const existingBackup = mutation.snapshots.get(backupPath) ?? null;
		const recovery = load && !definitionTransaction ? await withGatewayServiceInstallationRecovery(() => captureSystemdInstallRecovery(env, existingUnit !== null), async () => false) : null;
		const restore = async () => {
			const restored = await mutation.restoreAll();
			await recovery?.restore();
			return restored;
		};
		const publish = async () => {
			const priorManagedKeys = readManagedServiceEnvKeysFromEnvironment(resolveManagedGatewayServiceCommand(await readSystemdServiceExecStart(env))?.environment);
			const { entries: stateDirDotEnvEntries, skippedShellReferenceKeys } = readStateDirDotEnvFromStateDir(stateDir);
			const stateDirDotEnvVars = new Map(Object.entries(stateDirDotEnvEntries).filter(([key, value]) => {
				const inlineValue = environment?.[key];
				return typeof inlineValue !== "string" || inlineValue.trim() === value.trim();
			}));
			const inlineManagedKeys = collectSystemdInlineManagedKeys({
				environment,
				environmentValueSources
			});
			const fileManagedKeys = collectSystemdFileManagedKeys(environmentValueSources);
			const existingEnvironment = await readSystemdGatewayEnvironmentFiles(stateDir, environment);
			const backupSource = existingUnit ?? existingBackup;
			if (backupSource) await mutation.publish(backupPath, sanitizeSystemdUnitBackupContent({
				content: backupSource.contents.toString("utf8"),
				fileManagedKeys
			}), restrictSystemdArtifactMode(backupSource.mode));
			const incoming = collectSystemdFileBackedEnvironment({
				environment,
				fileManagedKeys
			});
			for (const [key, value] of Object.entries(incoming)) if (/[\r\n]/.test(value)) throw new Error(`state-dir .env contains a multiline value for ${key}; systemd EnvironmentFile values must be single-line`);
			const managedKeysToDrop = normalizeServiceEnvKeys([
				...inlineManagedKeys,
				...fileManagedKeys,
				...priorManagedKeys,
				...stateDirDotEnvVars.keys(),
				...skippedShellReferenceKeys
			]);
			const { existing, literalShellReferenceKeys } = existingEnvironment;
			const merged = {
				...Object.fromEntries(Object.entries(existing).filter(([key, value]) => {
					const normalized = normalizeServiceEnvKey(key);
					if (normalized && managedKeysToDrop.has(normalized)) return false;
					return literalShellReferenceKeys.has(key) || !isUnresolvedShellReference(value);
				})),
				...incoming
			};
			const hasGeneratedValues = Object.keys(merged).length > 0;
			const environmentKeys = normalizeServiceEnvKeys(Object.keys(merged));
			if (hasGeneratedValues || mutation.snapshots.has(environmentFilePath)) {
				const content = hasGeneratedValues ? `${serializeSystemdEnvironmentFile(merged)}\n` : "";
				await mutation.publish(environmentFilePath, content, 384);
			}
			const environmentSansDotEnvEntries = Object.fromEntries(Object.entries(environment ?? {}).filter(([key, value]) => {
				if (typeof value !== "string") return false;
				const source = readEnvironmentValueSource(environmentValueSources, key);
				const normalized = normalizeServiceEnvKey(key);
				const generated = normalized && environmentKeys.has(normalized) && !inlineManagedKeys.has(normalized);
				return !(hasEnvironmentFileSource(source) && isUnresolvedShellReference(value)) && !generated && value.trim() !== stateDirDotEnvVars.get(key)?.trim();
			}));
			const unit = preserveSystemdUnitPolicy(buildSystemdUnit({
				description: resolveGatewayServiceDescription({
					env,
					description
				}),
				programArguments,
				workingDirectory,
				environment: environmentSansDotEnvEntries,
				environmentFiles: hasGeneratedValues ? [environmentFilePath] : []
			}), existingUnit?.contents.toString("utf8") ?? "", definitionTransaction?.preservePolicy);
			await assertNoSystemGatewayOwnership(env);
			await mutation.publish(unitPath, unit, restrictSystemdArtifactMode(existingUnit?.mode));
			await assertNoSystemGatewayOwnership(env);
		};
		if (definitionTransaction) await publish();
		else await withGatewayServiceInstallationRecovery(publish, restore);
		if (load) {
			if (recovery) await withGatewayServiceInstallationRecovery(() => load(recovery.beforeAction), restore);
			else await load();
		}
		return {
			unitPath,
			backedUp: existingUnit !== null
		};
	}, {
		definitionTransaction,
		warn
	});
}
async function readSystemdGatewayEnvironmentFiles(stateDir, environment) {
	const existing = {};
	const literalShellReferenceKeys = /* @__PURE__ */ new Set();
	for (const sourcePath of [resolveLegacyNodeSystemdEnvironmentFilePath({
		stateDir,
		environment
	}), resolveSystemdEnvironmentFilePath({
		stateDir,
		environment
	})]) {
		if (!sourcePath) continue;
		try {
			const fromFile = await readSystemdEnvironmentFile(sourcePath);
			for (const [key, value] of Object.entries(fromFile.environment)) {
				existing[key] = value;
				literalShellReferenceKeys.delete(key);
				if (fromFile.literalShellReferenceKeys.has(key)) literalShellReferenceKeys.add(key);
			}
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	}
	return {
		existing,
		literalShellReferenceKeys
	};
}
async function removeNodeSystemdManagedEnvironmentKeys(env) {
	if (!isNodeSystemdEnvironment(env)) return;
	const stateDir = resolveStateDir(env);
	const envFilePath = resolveSystemdEnvironmentFilePath({
		stateDir,
		environment: env
	});
	let existingFile;
	try {
		existingFile = await readSystemdEnvironmentFile(envFilePath);
	} catch {
		return;
	}
	const managedKeys = /* @__PURE__ */ new Set(["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"]);
	const remaining = Object.fromEntries(Object.entries(existingFile.environment).filter(([key, value]) => {
		const normalized = normalizeServiceEnvKey(key);
		if (normalized && managedKeys.has(normalized)) return false;
		return existingFile.literalShellReferenceKeys.has(key) || !isUnresolvedShellReference(value);
	}));
	if (Object.keys(remaining).length === 0) {
		await fs.rm(envFilePath, { force: true });
		return;
	}
	const content = serializeSystemdEnvironmentFile(remaining);
	await publishServiceFile({
		filePath: envFilePath,
		contents: `${content}\n`,
		mode: 384
	});
}
function reportSystemdServicePublication(stdout, label, unitPath, backedUp) {
	const lines = [{
		label,
		value: unitPath
	}];
	if (backedUp) lines.push({
		label: "Previous unit backed up to",
		value: `${unitPath}.bak`
	});
	writeFormattedLines(stdout, lines, { leadingBlankLine: true });
}
async function stageSystemdService({ stdout, ...args }) {
	const { unitPath, backedUp } = await writeSystemdUnit(args);
	reportSystemdServicePublication(stdout, "Staged systemd service", unitPath, backedUp);
	return { unitPath };
}
async function activateSystemdService(params) {
	const unitName = `${resolveSystemdServiceName(params.env)}.service`;
	await assertNoSystemGatewayOwnership(params.env);
	const runActivation = async (action, retryMissing = true) => {
		const args = action === "daemon-reload" ? [action] : [action, unitName];
		params.beforeAction?.(action);
		const result = await execSystemctlUser(params.env, args);
		if (result.code === 0) return;
		const detail = readSystemctlDetail(result);
		if (action !== "daemon-reload" && retryMissing && result.termination === "exit" && isSystemdUnitMissingDetail(detail)) {
			await runActivation("daemon-reload");
			return await runActivation(action, false);
		}
		if (isSystemdUserScopeUnavailable(detail)) throw new Error(`systemctl --user unavailable: ${detail || "unknown error"}`.trim());
		throw new Error(`systemctl ${action} failed: ${detail || "unknown error"}`.trim());
	};
	for (const action of [
		"daemon-reload",
		"enable",
		"restart"
	]) {
		if (action === "enable" && params.preserveAutoStart) continue;
		await runActivation(action);
	}
}
async function installSystemdService(args) {
	const load = (beforeAction) => activateSystemdService({
		env: args.env,
		beforeAction,
		preserveAutoStart: args.preserveAutoStart
	});
	const { unitPath, backedUp } = await writeSystemdUnit(args, load);
	if (args.warn && hasGatewayServiceLauncherOverride(await readSystemdServiceExecStart(args.env).catch(() => null))) args.warn("Systemd drop-in overrides the managed service command or working directory; inspect, update, or remove the drop-in because reinstalling the base unit does not change the effective launcher.");
	reportSystemdServicePublication(args.stdout, "Installed systemd service", unitPath, backedUp);
	return { unitPath };
}
async function uninstallSystemdService({ env, stdout }) {
	await assertSystemdAvailable(env);
	const unitName = `${resolveSystemdServiceName(env)}.service`;
	await disableSystemdUserUnitForRemoval(env, unitName);
	const unitPath = resolveSystemdUnitPath(env);
	let removed = false;
	try {
		await fs.unlink(unitPath);
		removed = true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await fs.unlink(`${unitPath}.bak`).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	await removeNodeSystemdManagedEnvironmentKeys(env);
	if (removed) stdout.write(`${formatLine("Removed systemd service", unitPath)}\n`);
	else stdout.write(`Systemd service not found at ${unitPath}\n`);
}
//#endregion
//#region src/daemon/systemd-service-identity.ts
/** Capture and revalidate the native owner across a stopped-service repair. */
const MANAGER$1 = "org.freedesktop.systemd1";
const MANAGER_PATH = "/org/freedesktop/systemd1";
const BUS$1 = "org.freedesktop.DBus";
const unavailable = () => /* @__PURE__ */ new Error("The systemd service activation identity could not be inspected.");
function openBroker(bus, deadline) {
	return "address" in bus ? openSystemdBroker(bus.address, deadline) : openSystemdMachineBroker(bus.machine, deadline);
}
async function inspectIdentity(broker, target, bus, deadline, expected) {
	const call = async (method, args, signature) => {
		const value = (await broker.query([
			"call",
			BUS$1,
			"/org/freedesktop/DBus",
			BUS$1,
			method,
			...args
		], [signature], deadline))?.[0];
		if (!Array.isArray(value) || value.length !== 1) throw unavailable();
		return value[0];
	};
	const busId = await call("GetId", [], "s");
	const managerOwner = await call("GetNameOwner", ["s", MANAGER$1], "s");
	if (typeof busId !== "string" || !/^[a-f0-9]{32}$/i.test(busId) || typeof managerOwner !== "string" || !/^:[0-9]+\.[0-9]+$/.test(managerOwner)) throw unavailable();
	const managerUid = await call("GetConnectionUnixUser", ["s", managerOwner], "u");
	if (typeof managerUid !== "number" || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) throw unavailable();
	if (target.scope === "system" && managerUid !== 0 || expected && (busId !== expected.busId || managerOwner !== expected.managerOwner || managerUid !== expected.managerUid)) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	const unitPath = (await broker.query([
		"call",
		managerOwner,
		MANAGER_PATH,
		`${MANAGER$1}.Manager`,
		expected ? "LoadUnit" : "GetUnit",
		"s",
		target.unitName
	], ["o"], deadline))?.[0];
	if (!Array.isArray(unitPath) || unitPath.length !== 1 || typeof unitPath[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(unitPath[0])) throw unavailable();
	const definition = await broker.query([
		"get-property",
		managerOwner,
		unitPath[0],
		`${MANAGER$1}.Unit`,
		"Id",
		"FragmentPath"
	], ["s", "s"], deadline);
	if (typeof definition?.[0] !== "string" || typeof definition?.[1] !== "string") throw unavailable();
	if (definition?.[0] !== target.unitName || definition?.[1] !== target.unitPath) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
	const serviceUser = (await broker.query([
		"get-property",
		managerOwner,
		unitPath[0],
		`${MANAGER$1}.Service`,
		"User"
	], ["s"], deadline))?.[0];
	if (typeof serviceUser !== "string") throw unavailable();
	if (target.scope === "system") {
		assertSystemdServiceAccount(serviceUser);
		if (expected) assertSystemdServiceAccount(expected.serviceUser);
	} else if (expected && serviceUser !== expected.serviceUser) throw new ServiceOwnershipRefusalError("systemd-account-refused");
	if (managerOwner !== await call("GetNameOwner", ["s", MANAGER$1], "s")) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
	return {
		...target,
		bus,
		busId,
		managerOwner,
		managerUid,
		serviceUser
	};
}
async function captureSystemdServiceIdentity(params) {
	const deadline = performance.now() + (params.timeoutMs ?? 9e4);
	const transport = params.target.scope === "user" ? await resolveSystemdUserTransport(params.env, deadline, void 0, "admission") : void 0;
	if (params.target.scope === "user" && (!transport || transport.kind === "private")) throw new ServiceInspectionError("systemd-user-bus-unavailable");
	const bus = transport?.kind === "machine" ? { machine: `${transport.user}@` } : { address: transport?.address ?? process.env.DBUS_SYSTEM_BUS_ADDRESS ?? "unix:path=/run/dbus/system_bus_socket" };
	const broker = await openBroker(bus, deadline);
	try {
		const identity = await inspectIdentity(broker, params.target, bus, deadline);
		if (params.managerUid !== void 0 && identity.managerUid !== params.managerUid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		return identity;
	} finally {
		await broker.close();
	}
}
async function activateSystemdServiceIdentity(params) {
	let authorityFailure;
	const assertCurrent = () => {
		try {
			assertGatewayServiceUpdateCurrent();
			params.assertCurrent?.();
		} catch (error) {
			authorityFailure = { error };
			throw error;
		}
	};
	assertCurrent();
	const { identity } = params;
	const deadline = performance.now() + SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;
	const broker = await openBroker(identity.bus, deadline);
	try {
		for (const method of ["ResetFailedUnit", params.action === "start" ? "StartUnit" : "RestartUnit"]) {
			await inspectIdentity(broker, identity, identity.bus, deadline, identity);
			assertCurrent();
			const reset = method === "ResetFailedUnit";
			try {
				await broker.query([
					"call",
					identity.managerOwner,
					MANAGER_PATH,
					`${MANAGER$1}.Manager`,
					method,
					reset ? "s" : "ss",
					identity.unitName,
					...reset ? [] : ["replace"]
				], reset ? [] : ["o"], deadline, assertCurrent);
			} catch (error) {
				if (authorityFailure) throw authorityFailure.error;
				assertCurrent();
				const refusal = findServiceOwnershipRefusal(error);
				if (refusal || !reset) throw refusal ?? error;
				params.warn("systemd reset-failed did not complete; revalidating ownership and continuing with activation.");
			}
		}
	} finally {
		await broker.close();
	}
}
//#endregion
//#region src/daemon/systemd-lifecycle.ts
/** systemd start, stop, restart, and obsolete-unit removal. */
function isRunningAsRoot() {
	if (typeof process.geteuid === "function") try {
		return process.geteuid() === 0;
	} catch {
		return false;
	}
	return false;
}
async function runSystemdServiceAction(params) {
	const env = params.env ?? process.env;
	if (params.systemdIdentity && params.action !== "stop") {
		if (params.systemdIdentity.scope === "user") {
			const scopedEnv = {
				...env,
				OPENCLAW_SYSTEMD_UNIT: params.systemdIdentity.unitName
			};
			try {
				await assertNoSystemGatewayOwnership(scopedEnv);
			} catch (error) {
				await admitUserUnitActivationPastUnverifiableOwnership(scopedEnv, error);
			}
		}
		if (params.systemdIdentity.scope === "system" && !isRunningAsRoot()) throw new Error(`${params.systemdIdentity.unitName} is a system-scope unit (${params.systemdIdentity.unitPath}); run \`sudo systemctl ${params.action} ${params.systemdIdentity.unitName}\` to ${params.action} it`);
		await activateSystemdServiceIdentity({
			identity: params.systemdIdentity,
			action: params.action,
			assertCurrent: params.assertCurrent,
			warn: params.warn ?? ((message) => {
				params.stdout.write(`${formatLine("Warning", message)}\n`);
			})
		});
		params.onMutation?.();
		params.stdout.write(`${formatLine(params.label, params.systemdIdentity.unitName)}\n`);
		return;
	}
	const installed = await findInstalledSystemdGatewayScope(env);
	const unitName = installed?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	let runSystemctl;
	if (installed?.scope === "system") {
		if (!isRunningAsRoot()) throw new Error(`${unitName} is a system-scope unit (${installed.unitPath}); run \`sudo systemctl ${params.action} ${unitName}\` to ${params.action} it`);
		runSystemctl = (args) => {
			params.assertCurrent?.();
			return execSystemctl(args, env);
		};
	} else {
		await assertSystemdAvailable(env);
		if (params.action !== "stop") try {
			await assertNoSystemGatewayOwnership(env);
		} catch (error) {
			await admitUserUnitActivationPastUnverifiableOwnership(env, error);
		}
		runSystemctl = (args) => execSystemctlUser(env, args, void 0, params.assertCurrent);
	}
	if (params.action !== "stop") {
		params.assertCurrent?.();
		await runSystemctl(["reset-failed", unitName]);
	}
	params.assertCurrent?.();
	const res = await runSystemctl([params.action, unitName]);
	if (res.code !== 0) throw new Error(`systemctl ${params.action} failed: ${res.stderr || res.stdout}`.trim());
	params.onMutation?.();
	params.stdout.write(`${formatLine(params.label, unitName)}\n`);
}
async function startSystemdService({ stdout, env, onMutation, assertCurrent, systemdIdentity, warn }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "start",
		assertCurrent,
		systemdIdentity,
		warn,
		label: "Started systemd service",
		onMutation: () => reportMutation("systemctl-start")
	});
}
async function stopSystemdService({ stdout, env, onMutation, assertCurrent }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "stop",
		assertCurrent,
		label: "Stopped systemd service",
		onMutation: () => reportMutation("systemctl-stop")
	});
}
async function restartSystemdService({ stdout, env, onMutation, assertCurrent, systemdIdentity, warn }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "restart",
		assertCurrent,
		systemdIdentity,
		warn,
		label: "Restarted systemd service",
		onMutation: () => reportMutation("systemctl-restart")
	});
	return { outcome: "completed" };
}
async function removeSystemdUnitBackup(unitPath) {
	try {
		await fs.unlink(`${unitPath}.bak`);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
}
async function findLegacySystemdUnits(env) {
	const results = [];
	const systemctlAvailable = await isSystemctlAvailable(env);
	for (const name of LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES) {
		const unitPath = resolveSystemdUnitPathForName(env, name);
		let exists = false;
		try {
			await fs.access(unitPath);
			exists = true;
		} catch {}
		let backupExists = false;
		try {
			await fs.access(`${unitPath}.bak`);
			backupExists = true;
		} catch {}
		let enabled = false;
		if (systemctlAvailable) enabled = (await execSystemctlUser(env, ["is-enabled", `${name}.service`])).code === 0;
		if (exists || backupExists || enabled) results.push({
			name,
			unitPath,
			enabled,
			exists
		});
	}
	return results;
}
async function uninstallLegacySystemdUnits({ env, stdout }) {
	const units = await findLegacySystemdUnits(env);
	if (units.length === 0) return units;
	const systemctlAvailable = await isSystemctlAvailable(env);
	let removedAny = false;
	for (const unit of units) {
		if (systemctlAvailable) await disableSystemdUserUnitForRemoval(env, `${unit.name}.service`);
		else stdout.write(`systemctl unavailable; removed legacy unit file only: ${unit.name}.service\n`);
		try {
			await fs.unlink(unit.unitPath);
			removedAny = true;
			stdout.write(`${formatLine("Removed legacy systemd service", unit.unitPath)}\n`);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			stdout.write(`Legacy systemd unit not found at ${unit.unitPath}\n`);
		}
		await removeSystemdUnitBackup(unit.unitPath);
	}
	if (systemctlAvailable && removedAny) await reloadSystemdUserManager(env);
	return units;
}
/**
* Removes the canonical *user-scope* gateway unit, leaving any system-scope
* unit untouched. Used by doctor to resolve a `dueling` installation by
* dropping the redundant user-scope leftover (issue #79375). Removing a unit
* under `$HOME` needs no root, unlike the system-scope unit.
*/
async function uninstallUserSystemdGatewayUnit({ env, stdout }) {
	const unitName = `${resolveSystemdServiceName(env)}.service`;
	const unitPath = resolveSystemdUnitPath(env);
	let disabled = false;
	if (await isSystemctlAvailable(env)) {
		await disableSystemdUserUnitForRemoval(env, unitName);
		disabled = true;
	} else stdout.write(`systemctl unavailable; removing unit file only: ${unitName}. A loaded unit keeps running until systemd reloads.\n`);
	let removed = false;
	try {
		await fs.unlink(unitPath);
		removed = true;
		stdout.write(`${formatLine("Removed user-scope systemd service", unitPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		stdout.write(`User-scope systemd unit not found at ${unitPath}\n`);
	}
	await removeSystemdUnitBackup(unitPath);
	if (removed && disabled) await reloadSystemdUserManager(env);
	return {
		unitName,
		unitPath,
		removed,
		disabled
	};
}
//#endregion
//#region src/daemon/systemd-linger.ts
/** Reads and enables systemd user linger for headless daemon sessions. */
function resolveLoginctlUser(env) {
	const fromEnv = normalizeOptionalString(env.USER) || normalizeOptionalString(env.LOGNAME);
	if (fromEnv) return fromEnv;
	try {
		return os.userInfo().username;
	} catch {
		return null;
	}
}
/** Reads systemd user linger status through loginctl when available. */
async function readSystemdUserLingerStatus(params) {
	const user = params.user ?? resolveLoginctlUser(params.env);
	if (!user) return null;
	const { stdout, code } = await execFileUtf8("loginctl", [
		"show-user",
		user,
		"-p",
		"Linger"
	], { timeout: 5e3 });
	const line = stdout.split("\n").find((entry) => entry.trim().startsWith("Linger="));
	const value = normalizeOptionalLowercaseString(line?.split("=")[1]);
	return code === 0 && (value === "yes" || value === "no") ? {
		user,
		linger: value
	} : null;
}
/** Enables systemd user linger through loginctl, with optional sudo mode. */
async function enableSystemdUserLinger(params) {
	const user = params.user ?? resolveLoginctlUser(params.env);
	if (!user) return {
		ok: false,
		stdout: "",
		stderr: "Missing user",
		code: 1
	};
	const [command, ...args] = [
		...(typeof process.getuid === "function" ? process.getuid() !== 0 : true) && params.sudoMode !== void 0 ? ["sudo", ...params.sudoMode === "non-interactive" ? ["-n"] : []] : [],
		"loginctl",
		"enable-linger",
		user
	];
	const { stdout, stderr, code } = await execFileUtf8(command, args, { timeout: 3e4 });
	return {
		ok: code === 0,
		stdout,
		stderr,
		code
	};
}
//#endregion
//#region src/daemon/systemd-loaded-runtime.ts
const MANAGER = "org.freedesktop.systemd1";
const BUS = "org.freedesktop.DBus";
const isUint32 = (value) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 4294967295;
const isInt32 = (value) => typeof value === "number" && Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
const optionalCounter = (value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
/** The selected manager must retain the same loaded unit throughout inspection. */
async function readLoadedSystemdServiceRuntime(env, timeoutMs, inspection, binding, target) {
	const unitName = target?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	const scope = target?.scope ?? "user";
	const budget = timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 5e3;
	const deadline = performance.now() + budget;
	let remainingQueries = 7;
	const unavailable = () => /* @__PURE__ */ new Error("Loaded systemd runtime could not be inspected without activation.");
	const query = async (args, signatures) => {
		const assertCurrent = args[0] === "call" && args[4] === "LoadUnit" ? inspection?.assertCurrent : inspection?.assertReadCurrent ?? inspection?.assertCurrent;
		assertCurrent?.();
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		if (remainingQueries <= 0) throw unavailable();
		if (binding) {
			if (scope === "system" || binding.unit !== unitName) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			remainingQueries--;
			const values = await binding.query(args, signatures, deadline, inspection);
			if (!values) throw unavailable();
			assertCurrent?.();
			if (performance.now() >= deadline) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			return values;
		}
		const queryArgs = [
			"--auto-start=no",
			"--json=short",
			...args
		];
		const callTimeout = Math.max(1, Math.floor(remaining / remainingQueries--));
		const result = scope === "system" ? await execBusctlSystem(queryArgs, callTimeout) : await execBusctlUser(env, queryArgs, callTimeout, assertCurrent);
		assertCurrent?.();
		if (performance.now() >= deadline) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		if (result.code !== 0 || result.termination !== "exit") throw systemdInspectionError(result, unavailable().message, scope);
		const values = result.stdout.trim().split(/\r?\n/).map((line) => asOptionalRecord(JSON.parse(line)));
		if (values.length !== signatures.length || values.some((value, index) => value?.type !== signatures[index])) throw unavailable();
		return values.map((value) => value?.data);
	};
	const readOwner = async () => {
		if (binding) {
			binding.verify();
			return binding.destination;
		}
		const [value] = await query([
			"call",
			BUS,
			"/org/freedesktop/DBus",
			BUS,
			"GetNameOwner",
			"s",
			MANAGER
		], ["s"]);
		if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^:[0-9]+\.[0-9]+$/.test(value[0])) throw unavailable();
		return value[0];
	};
	try {
		const owner = await readOwner();
		const [credentials] = binding ? [[binding.managerUid]] : await query([
			"call",
			BUS,
			"/org/freedesktop/DBus",
			BUS,
			"GetConnectionUnixUser",
			"s",
			owner
		], ["u"]);
		if (!Array.isArray(credentials) || credentials.length !== 1 || !isUint32(credentials[0]) || credentials[0] === 4294967295) throw unavailable();
		const managerUid = credentials[0];
		if (scope === "system" && managerUid !== 0 || inspection && managerUid !== inspection.managerUid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		const [unit] = await query([
			"call",
			owner,
			"/org/freedesktop/systemd1",
			`${MANAGER}.Manager`,
			inspection ? "LoadUnit" : "GetUnit",
			"s",
			unitName
		], ["o"]);
		if (!Array.isArray(unit) || unit.length !== 1 || typeof unit[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(unit[0])) throw unavailable();
		const unitPath = unit[0];
		const readUnit = () => query([
			"get-property",
			owner,
			unitPath,
			`${MANAGER}.Unit`,
			"Id",
			"LoadState",
			"ActiveState",
			"SubState",
			"StartLimitBurst",
			"ActiveEnterTimestampMonotonic",
			"InactiveEnterTimestampMonotonic"
		], [
			"s",
			"s",
			"s",
			"s",
			"u",
			"t",
			"t"
		]);
		const before = await readUnit();
		const [id, load, active, sub, burst, entered, left] = before;
		const [result, restarts, pid, exitStatus, exitCode, killMode, tasks, memory] = await query([
			"get-property",
			owner,
			unitPath,
			`${MANAGER}.Service`,
			"Result",
			"NRestarts",
			"MainPID",
			"ExecMainStatus",
			"ExecMainCode",
			"KillMode",
			"TasksCurrent",
			"MemoryCurrent"
		], [
			"s",
			"u",
			"u",
			"i",
			"i",
			"s",
			"t",
			"t"
		]);
		let drained = optionalCounter(tasks) === 0;
		if ((active === "inactive" || active === "failed") && pid === 0 && optionalCounter(tasks) === void 0) {
			remainingQueries++;
			const [processes] = await query(inspection ? [
				"call",
				owner,
				unitPath,
				`${MANAGER}.Service`,
				"GetProcesses"
			] : [
				"call",
				owner,
				"/org/freedesktop/systemd1",
				`${MANAGER}.Manager`,
				"GetUnitProcesses",
				"s",
				unitName
			], ["a(sus)"]);
			drained = Array.isArray(processes) && processes.length === 1 && Array.isArray(processes[0]) && processes[0].length === 0;
		}
		const after = await readUnit();
		if (owner !== await readOwner()) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		if (!isDeepStrictEqual(before, after) || optionalCounter(entered) === void 0 || optionalCounter(left) === void 0 || id !== unitName || load !== "loaded" || typeof active !== "string" || typeof sub !== "string" || !isUint32(burst) || typeof result !== "string" || !isUint32(restarts) || !isUint32(pid) || !isInt32(exitStatus) || !isInt32(exitCode) || typeof killMode !== "string") throw unavailable();
		return {
			status: active === "active" ? "running" : (active === "inactive" || active === "failed") && pid === 0 && drained ? "stopped" : "unknown",
			state: active,
			subState: sub,
			pid: pid > 0 ? pid : void 0,
			lastExitStatus: exitStatus,
			lastExitReason: [
				void 0,
				"exited",
				"killed",
				"dumped",
				"trapped",
				"stopped",
				"continued"
			][exitCode],
			systemd: {
				scope,
				...scope === "user" ? { transport: await readSystemdUserTransport(env) } : {},
				unit: id,
				managerUid,
				result,
				nRestarts: restarts,
				startLimitBurst: burst,
				killMode,
				tasksCurrent: optionalCounter(tasks),
				memoryCurrent: optionalCounter(memory)
			}
		};
	} catch (error) {
		return createServiceRuntimeInspectionFailure(error);
	}
}
//#endregion
//#region src/daemon/systemd-runtime.ts
/** systemd service enabled-state and runtime inspection. */
function parseSystemdShow(output) {
	const entries = parseKeyValueOutput(output, "=");
	const info = {};
	const loadState = entries.loadstate;
	if (loadState) info.loadState = loadState;
	const activeState = entries.activestate;
	if (activeState) info.activeState = activeState;
	const subState = entries.substate;
	if (subState) info.subState = subState;
	const mainPidValue = entries.mainpid;
	if (mainPidValue) {
		const pid = parseStrictPositiveInteger(mainPidValue);
		if (pid !== void 0) info.mainPid = pid;
	}
	const execMainStatusValue = entries.execmainstatus;
	if (execMainStatusValue) {
		const status = parseStrictInteger(execMainStatusValue);
		if (status !== void 0) info.execMainStatus = status;
	}
	const execMainCode = entries.execmaincode;
	if (execMainCode) info.execMainCode = execMainCode;
	const result = entries.result;
	if (result) info.result = result;
	const nRestartsValue = entries.nrestarts;
	if (nRestartsValue) {
		const nRestarts = parseStrictInteger(nRestartsValue);
		if (nRestarts !== void 0) info.nRestarts = nRestarts;
	}
	const startLimitBurstValue = entries.startlimitburst;
	if (startLimitBurstValue) {
		const startLimitBurst = parseStrictInteger(startLimitBurstValue);
		if (startLimitBurst !== void 0) info.startLimitBurst = startLimitBurst;
	}
	const unit = entries.id;
	if (unit) info.unit = unit;
	const killMode = entries.killmode;
	if (killMode) info.killMode = killMode;
	const tasksCurrentValue = entries.taskscurrent;
	if (tasksCurrentValue) {
		const tasksCurrent = parseStrictNonNegativeInteger(tasksCurrentValue);
		if (tasksCurrent !== void 0) info.tasksCurrent = tasksCurrent;
	}
	const memoryCurrentValue = entries.memorycurrent;
	if (memoryCurrentValue) {
		const memoryCurrent = parseStrictNonNegativeInteger(memoryCurrentValue);
		if (memoryCurrent !== void 0) info.memoryCurrent = memoryCurrent;
	}
	return info;
}
async function isSystemdServiceEnabled(args) {
	const env = args.env ?? process.env;
	const installed = await findInstalledSystemdGatewayScope(env);
	if (!installed) return false;
	const res = installed.scope === "system" ? await execSystemctl(["is-enabled", installed.unitName], env, args.timeoutMs) : await execSystemctlUser(env, ["is-enabled", installed.unitName], args.timeoutMs);
	if (res.code === 0) return true;
	const detail = readSystemctlDetail(res);
	if (res.termination === "exit" && !isSystemctlMissing(res) && isSystemdUnitNotEnabled(detail)) return false;
	throw systemdInspectionError(res, `systemctl is-enabled unavailable: ${detail || "unknown error"}`.trim(), installed.scope);
}
async function readSystemdServiceRuntime(env = process.env, opts) {
	const installed = opts?.systemdReadTarget ?? await findInstalledSystemdGatewayScope(env);
	if (opts?.requireLoaded) return await readLoadedSystemdServiceRuntime(env, opts.timeoutMs, opts.loadForInspection, opts.systemdReadBinding, installed ?? void 0);
	const timeoutMs = opts?.timeoutMs;
	let commandInspectionFailure = opts?.commandInspection?.kind === "unavailable" ? createServiceRuntimeInspectionFailure(sanitizeServiceInspectionError(opts.commandInspection.error)) : void 0;
	if (installed?.scope !== "system") {
		try {
			await assertSystemdAvailable(env, timeoutMs);
		} catch (err) {
			return {
				...commandInspectionFailure,
				status: "unknown",
				detail: formatErrorMessage(err),
				...err instanceof ServiceInspectionError ? { inspectionReason: err.reason } : {}
			};
		}
		const inspection = opts?.commandInspection ?? (installed ? { kind: "present" } : await readSystemdServiceExecStart(env, {
			...opts,
			requireEffective: true
		}).then((command) => ({ kind: command ? "present" : "absent" }), (error) => ({
			kind: "unavailable",
			error
		})));
		if (inspection.kind === "unavailable") {
			commandInspectionFailure = createServiceRuntimeInspectionFailure(sanitizeServiceInspectionError(inspection.error));
			if (!installed) return commandInspectionFailure;
		}
		if (!installed && inspection.kind === "absent") {
			const transport = await readSystemdUserTransport(env);
			return {
				status: "stopped",
				missingUnit: true,
				...transport ? { systemd: { transport } } : {}
			};
		}
	}
	const unitName = installed?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	const showArgs = [
		"show",
		unitName,
		"--no-page",
		"--property",
		"Id,LoadState,ActiveState,SubState,Result,NRestarts,StartLimitBurst,MainPID,ExecMainStatus,ExecMainCode,KillMode,TasksCurrent,MemoryCurrent"
	];
	const res = installed?.scope === "system" ? await execSystemctl(showArgs, env, timeoutMs) : await execSystemctlUser(env, showArgs, timeoutMs);
	if (res.code !== 0) {
		const detail = (res.stderr || res.stdout).trim();
		const error = systemdInspectionError(res, detail, installed?.scope);
		return {
			...commandInspectionFailure,
			status: "unknown",
			...detail ? { detail } : {},
			missingUnit: false,
			...error instanceof ServiceInspectionError ? { inspectionReason: error.reason } : {}
		};
	}
	const parsed = parseSystemdShow(res.stdout || "");
	const loadState = normalizeLowercaseStringOrEmpty(parsed.loadState);
	const activeState = normalizeLowercaseStringOrEmpty(parsed.activeState);
	if (loadState !== "loaded") return {
		status: "unknown",
		missingUnit: false,
		detail: loadState === "not-found" ? `Unit ${unitName} is not visible in the ${installed?.scope ?? "user"} systemd manager.` : `Unit ${unitName} has an unverified systemd load state.`
	};
	const status = activeState === "active" ? "running" : activeState === "inactive" || activeState === "failed" ? "stopped" : "unknown";
	return {
		...commandInspectionFailure,
		status,
		state: parsed.activeState,
		subState: parsed.subState,
		pid: parsed.mainPid,
		lastExitStatus: parsed.execMainStatus,
		lastExitReason: parsed.execMainCode,
		systemd: {
			scope: installed?.scope ?? "user",
			transport: installed?.scope === "system" ? void 0 : await readSystemdUserTransport(env),
			unit: parsed.unit ?? unitName,
			killMode: parsed.killMode,
			tasksCurrent: parsed.tasksCurrent,
			memoryCurrent: parsed.memoryCurrent,
			result: parsed.result,
			nRestarts: parsed.nRestarts,
			startLimitBurst: parsed.startLimitBurst
		}
	};
}
//#endregion
export { restartSystemdService as a, uninstallLegacySystemdUnits as c, installSystemdService as d, refreshLegacySystemdServiceMetadata as f, readSystemdUserLingerStatus as i, uninstallUserSystemdGatewayUnit as l, uninstallSystemdService as m, readSystemdServiceRuntime as n, startSystemdService as o, stageSystemdService as p, enableSystemdUserLinger as r, stopSystemdService as s, isSystemdServiceEnabled as t, captureSystemdServiceIdentity as u };
