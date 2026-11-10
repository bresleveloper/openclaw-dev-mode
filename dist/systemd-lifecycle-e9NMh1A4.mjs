import { o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES } from "./constants-BLghGsId.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatLine } from "./output-CvqJn7xh.mjs";
import { F as execSystemctl, I as execSystemctlUser, J as systemdInspectionError, M as disableSystemdUserUnitForRemoval, R as isRunningAsRoot, c as resolveSystemdServiceName, j as assertSystemdAvailable, l as resolveSystemdUnitPath, q as reloadSystemdUserManager, u as resolveSystemdUnitPathForName, x as activateSystemdServiceIdentity, z as isSystemctlAvailable } from "./systemd-service-files-C3V-PDoO.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { i as findInstalledSystemdGatewayScope, r as assertNoSystemGatewayOwnershipForActivation } from "./systemd-scope-CccFXVqT.mjs";
import fs from "node:fs/promises";
//#region src/daemon/systemd-lifecycle.ts
/** systemd start, stop, restart, and obsolete-unit removal. */
async function runSystemdServiceAction(params, action) {
	const env = params.env ?? process.env;
	const label = {
		start: "Started",
		stop: "Stopped",
		restart: "Restarted"
	}[action];
	const reportMutation = createGatewayLifecycleMutationReporter(params.onMutation);
	const report = (unitName) => {
		reportMutation(`systemctl-${action}`);
		params.stdout.write(`${formatLine(`${label} systemd service`, unitName)}\n`);
	};
	const warn = params.warn ?? ((message) => params.stdout.write(`${formatLine("Warning", message)}\n`));
	const installed = params.systemdIdentity ?? await findInstalledSystemdGatewayScope(env);
	const unitName = installed?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	if (installed?.scope === "system") {
		if (!isRunningAsRoot()) throw new Error(`${unitName} is a system-scope unit (${installed.unitPath}); run \`sudo systemctl ${action} ${unitName}\` to ${action} it`);
	} else if (action !== "stop") {
		if (!params.systemdIdentity) await assertSystemdAvailable(env);
		await assertNoSystemGatewayOwnershipForActivation({
			...env,
			OPENCLAW_SYSTEMD_UNIT: unitName
		});
	}
	if (params.systemdIdentity) {
		await activateSystemdServiceIdentity({
			identity: params.systemdIdentity,
			action,
			assertCurrent: params.assertCurrent,
			beforeMutation: params.beforeMutation,
			beforeEffect: params.beforeEffect,
			prepareEffect: params.prepareEffect,
			warn
		});
		report(params.systemdIdentity.unitName);
		return;
	}
	let runSystemctl;
	if (installed?.scope === "system") runSystemctl = (args) => {
		params.assertCurrent?.();
		return execSystemctl(args, env, void 0, params.beforeEffect);
	};
	else runSystemctl = (args) => execSystemctlUser(env, args, void 0, params.assertCurrent, action === "stop" ? { warn } : void 0, params.beforeEffect);
	if (action !== "stop") {
		params.assertCurrent?.();
		await runSystemctl(["reset-failed", unitName]);
		params.assertCurrent?.();
	}
	if (action === "restart") params.onRestartAttempted?.();
	const res = await runSystemctl([action, unitName]);
	if (res.code !== 0) throw systemdInspectionError(res, `systemctl ${action} failed: ${res.stderr || res.stdout}`.trim(), installed?.scope);
	report(unitName);
}
async function startSystemdService(args) {
	await runSystemdServiceAction(args, "start");
}
async function stopSystemdService(args) {
	await runSystemdServiceAction(args, "stop");
}
async function restartSystemdService(args) {
	await runSystemdServiceAction(args, "restart");
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
		const exists = await fs.access(unitPath).then(() => true, () => false);
		const backupExists = await fs.access(`${unitPath}.bak`).then(() => true, () => false);
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
*
* Pass the inspected user unit as `target` after confirmation. A later lookup
* must not fall back to a leftover legacy unit if that confirmed file vanished.
*/
async function uninstallUserSystemdGatewayUnit({ env, stdout, target }) {
	const installed = await findInstalledSystemdGatewayScope(env);
	if (target) {
		if (target.scope !== "user") throw new Error(`Confirmed systemd unit ${target.unitName} is ${target.scope}-scope; refusing user-scope cleanup`);
		if (installed?.scope === "user" && (installed.unitName !== target.unitName || installed.unitPath !== target.unitPath)) throw new Error(`Confirmed user systemd unit ${target.unitName} changed to ${installed.unitName}; refusing cleanup`);
	}
	const userUnit = target ?? (installed?.scope === "user" ? installed : void 0);
	const unitName = userUnit?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	const unitPath = userUnit?.unitPath ?? resolveSystemdUnitPath(env);
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
export { uninstallUserSystemdGatewayUnit as a, uninstallLegacySystemdUnits as i, startSystemdService as n, stopSystemdService as r, restartSystemdService as t };
