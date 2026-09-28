import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { E as reloadSystemdUserManager, c as resolveSystemdUnitPath, o as resolveSystemdEnvironmentFilePath } from "./systemd-service-files-tGuARbbA.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { a as resolveLaunchAgentEnvFilePath, c as resolveLaunchAgentPlistPath, o as resolveLaunchAgentEnvWrapperPath, p as assertNoSystemLaunchDaemonOwnership } from "./launchd-service-files-Cv2FPjBf.mjs";
import { n as publishServiceFile, r as readServiceFileState, t as GatewayServiceDefinitionBackupReceiptSchema } from "./service-stage-CuqWOVHS.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { d as resolveTaskScriptPath, l as resolveTaskLauncherScriptPath } from "./schtasks-layout-ZxN1sGLi.mjs";
import { t as auditScheduledTaskDefinition } from "./service-audit-schtasks-j_r_zl_d.mjs";
import { m as resolveLaunchAgentGuiDomain, u as probeLaunchAgentState } from "./launchd-runtime-D_XruxpZ.mjs";
import { u as stopLaunchAgent } from "./launchd-BkUcMuKY.mjs";
import { c as setScheduledTaskXmlEnabled, i as readScheduledTaskDefinition, o as restoreScheduledTaskDefinition } from "./schtasks-Vbf2pigp.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
import { n as assertNoSystemGatewayOwnership } from "./systemd-scope-ChBpir81.mjs";
import { n as withSystemdDefinitionMutation } from "./systemd-definition-mutation-Dj7IBhv4.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { Writable } from "node:stream";
import { randomUUID } from "node:crypto";
//#region src/daemon/service-definition-backup.ts
const backupPath = (file, id) => `${file}.reconcile-${id}.bak`;
const taskBytes = (xml) => Buffer.concat([Buffer.from([255, 254]), Buffer.from(xml, "utf16le")]);
const taskPolicy = (xml) => sha256Hex(setScheduledTaskXmlEnabled(xml, false));
const receiptPath = (receipt) => `${receipt.files[0].sourcePath}.reconcile-${receipt.id}.receipt.bak`;
function matchesPreparedPublication(current, prepared) {
	return current === null ? prepared === null : prepared !== null && [
		"dev",
		"ino",
		"sha256",
		"mode",
		"size",
		"mtimeMs"
	].every((key) => current[key] === prepared[key]);
}
async function checkpointReceipt(params, receipt) {
	await publishServiceFile({
		filePath: receiptPath(receipt),
		contents: JSON.stringify(receipt),
		mode: 384,
		assertCurrent: params.assertCurrent
	});
}
function definitionFiles({ env, command }) {
	const environment = resolveManagedGatewayServiceCommand(command)?.environment;
	if (process.platform === "linux") return [resolveSystemdUnitPath(env), resolveSystemdEnvironmentFilePath({
		stateDir: resolveStateDir({
			...env,
			...environment
		}),
		environment
	})];
	if (process.platform === "darwin") {
		const label = resolveLaunchAgentLabel(env);
		return [
			resolveLaunchAgentPlistPath(env),
			resolveLaunchAgentEnvFilePath(env, label),
			resolveLaunchAgentEnvWrapperPath(env, label)
		];
	}
	if (process.platform === "win32") {
		const script = resolveTaskScriptPath({
			...env,
			...environment
		});
		return [.../* @__PURE__ */ new Set([script, resolveTaskLauncherScriptPath({
			...env,
			OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1"
		}, script)])];
	}
	throw new Error("Managed service definition backup is unavailable on this platform.");
}
function assertInventory(params, receipt) {
	const files = definitionFiles(params);
	const observed = [...new Set(params.command.definitionPaths ?? [])].filter((file) => !files.includes(file));
	if (!isDeepStrictEqual(files, receipt.files.map((file) => file.sourcePath)) || !isDeepStrictEqual(observed.toSorted(), receipt.guards.map((file) => file.sourcePath).toSorted()) || Boolean(receipt.task) !== (process.platform === "win32") || params.command.sourcePath && path.resolve(params.command.sourcePath) !== path.resolve(files[0])) throw new Error("SERVICE_DEFINITION_UNKNOWN: Service backup selects different managed artifacts.");
}
function mutationHooks(params, receipt) {
	const assertCurrent = () => {
		params.assertCurrent();
		assertGatewayServiceUpdateCurrent();
	};
	const taskWritten = async (expectedXml) => {
		if (!receipt.task || receipt.task.preparedXml !== expectedXml) throw new Error("Scheduled Task publication was not admitted.");
		const findings = [];
		const xml = await auditScheduledTaskDefinition(params.env, findings, void 0, void 0, expectedXml);
		assertCurrent();
		if (findings.length) throw new Error(`SERVICE_DEFINITION_UNKNOWN: Scheduled Task changed: publication differs: ${findings.map((finding) => finding.key).join(", ")}`);
		receipt.task.afterPolicySha256 = taskPolicy(xml);
		delete receipt.task.preparedXml;
		await checkpointReceipt(params, receipt);
	};
	const beforeWrite = async (settlePrepared = true) => {
		assertCurrent();
		const command = await resolveGatewayService().readCommand(params.env, { requireEffective: true });
		if (!command) throw new Error("SERVICE_DEFINITION_UNKNOWN: Service definition disappeared.");
		assertInventory({
			...params,
			command
		}, receipt);
		for (const file of receipt.files) if (settlePrepared && file.prepared !== void 0) {
			const current = await readServiceFileState(file.sourcePath);
			if (matchesPreparedPublication(current, file.prepared)) {
				file.after = current;
				delete file.prepared;
			} else if (isDeepStrictEqual(current, file.after)) delete file.prepared;
		}
		for (const { sourcePath, after } of [...receipt.files, ...receipt.guards]) if (!isDeepStrictEqual(after, await readServiceFileState(sourcePath))) throw new Error(`SERVICE_DEFINITION_UNKNOWN: Service definition changed: ${sourcePath}`);
		if (receipt.task) {
			const current = taskPolicy(await readScheduledTaskDefinition(params.env));
			if (settlePrepared && receipt.task.preparedXml) {
				const previous = current === receipt.task.afterPolicySha256;
				receipt.task.recoveredPolicy = previous ? "previous" : "prepared";
				if (previous) {
					delete receipt.task.preparedXml;
					await checkpointReceipt(params, receipt);
				} else await taskWritten(receipt.task.preparedXml);
				return beforeWrite(false);
			}
			if (current !== receipt.task.afterPolicySha256) throw new Error("SERVICE_DEFINITION_UNKNOWN: Scheduled Task changed.");
		}
		assertCurrent();
	};
	return {
		assertCurrent,
		beforeWrite,
		filePrepared: async (sourcePath, temporaryPath) => {
			const file = receipt.files.find((entry) => entry.sourcePath === sourcePath);
			const prepared = temporaryPath === null ? null : await readServiceFileState(temporaryPath);
			assertCurrent();
			if (!file || temporaryPath !== null && (!prepared || await fs.realpath(path.dirname(temporaryPath)) !== await fs.realpath(path.dirname(sourcePath)))) throw new Error("Service publication was not staged beside its managed target.");
			file.prepared = prepared;
			await checkpointReceipt(params, receipt);
			await beforeWrite(false);
		},
		fileWritten: async (sourcePath, contents) => {
			const file = receipt.files.find((entry) => entry.sourcePath === sourcePath);
			const after = await readServiceFileState(sourcePath);
			assertCurrent();
			if (!file || file.prepared === void 0 || !matchesPreparedPublication(after, file.prepared) || (contents === null ? after !== null : after?.sha256 !== sha256Hex(contents))) throw new Error(`SERVICE_DEFINITION_UNKNOWN: Could not verify service publication: ${sourcePath}`);
			file.after = after;
			delete file.prepared;
			await checkpointReceipt(params, receipt);
		},
		taskWritten,
		taskPrepared: async (expectedXml) => {
			await beforeWrite();
			if (!receipt.task) throw new Error("Scheduled Task publication was not admitted.");
			receipt.task.preparedXml = expectedXml;
			await checkpointReceipt(params, receipt);
			await beforeWrite(false);
		}
	};
}
/** Capture and use the hooks while holding the native operation lock. */
async function captureGatewayServiceDefinitionBackup(params) {
	params.assertCurrent();
	const paths = definitionFiles(params);
	const receipt = {
		id: randomUUID(),
		files: await Promise.all(paths.map(async (sourcePath) => {
			const before = await readServiceFileState(sourcePath);
			return {
				sourcePath,
				before,
				after: before
			};
		})),
		guards: await Promise.all([...new Set(params.command.definitionPaths ?? [])].filter((file) => !paths.includes(file)).map(async (sourcePath) => ({
			sourcePath,
			after: await readServiceFileState(sourcePath)
		})))
	};
	if (!receipt.files[0]?.before) throw new Error("Installed service definition is unavailable for backup.");
	const originals = await Promise.all(receipt.files.filter((file) => file.before).map(async (file) => {
		const contents = await fs.readFile(file.sourcePath);
		if (sha256Hex(contents) !== file.before.sha256) throw new Error("Service changed during backup.");
		return {
			sourcePath: file.sourcePath,
			contents
		};
	}));
	if (process.platform === "win32") {
		const originalXml = await readScheduledTaskDefinition(params.env);
		const contents = taskBytes(originalXml);
		originals.push({
			sourcePath: `${paths[0]}.task.xml`,
			contents
		});
		receipt.task = {
			beforeSha256: sha256Hex(contents),
			afterPolicySha256: taskPolicy(originalXml)
		};
	}
	const hooks = mutationHooks(params, receipt);
	await params.inspect?.();
	await hooks.beforeWrite();
	const backupPaths = await Promise.all(originals.map(async ({ sourcePath, contents }) => {
		const file = backupPath(sourcePath, receipt.id);
		hooks.assertCurrent();
		await fs.writeFile(file, contents, {
			flag: "wx",
			mode: 384,
			flush: true
		});
		return file;
	}));
	await checkpointReceipt(params, receipt);
	backupPaths.push(receiptPath(receipt));
	await hooks.beforeWrite();
	return {
		backupPaths,
		hooks,
		finish: async () => {
			await hooks.beforeWrite();
			return structuredClone(receipt);
		},
		compensate: async () => {
			const prepared = await prepareGatewayServiceDefinitionRestore({
				...params,
				receipt
			});
			if (!(prepared.receipt.files.some((file) => !isDeepStrictEqual(file.before, file.after)) || prepared.task !== null && prepared.receipt.task?.afterPolicySha256 !== taskPolicy(prepared.task.subarray(2).toString("utf16le")))) return false;
			await restorePreparedGatewayServiceDefinitionBackup(params, prepared);
			return true;
		}
	};
}
async function prepareGatewayServiceDefinitionRestore(params) {
	const receipt = GatewayServiceDefinitionBackupReceiptSchema.parse(params.receipt);
	assertInventory(params, receipt);
	const hooks = mutationHooks(params, receipt);
	await hooks.beforeWrite();
	if (process.platform === "linux") await assertNoSystemGatewayOwnership(params.env);
	if (process.platform === "darwin") await assertNoSystemLaunchDaemonOwnership(resolveLaunchAgentLabel(params.env));
	const readBackup = async (file, hash) => {
		const target = backupPath(file, receipt.id);
		await readServiceFileState(target);
		const contents = await fs.readFile(target);
		if (sha256Hex(contents) !== hash) throw new Error(`Service backup changed: ${target}`);
		return contents;
	};
	const contents = await Promise.all(receipt.files.map(async (file) => file.before ? await readBackup(file.sourcePath, file.before.sha256) : null));
	const task = receipt.task ? await readBackup(`${receipt.files[0].sourcePath}.task.xml`, receipt.task.beforeSha256) : null;
	await hooks.beforeWrite();
	return {
		receipt,
		hooks,
		contents,
		task
	};
}
/** Reconcile retained publication facts before stopping the candidate. */
async function verifyGatewayServiceDefinitionBackup(params) {
	await prepareGatewayServiceDefinitionRestore(params);
}
/** Replay only the captured bytes; the caller owns the native operation lock and restart. */
async function restoreGatewayServiceDefinitionBackup(params) {
	await restorePreparedGatewayServiceDefinitionBackup(params, await prepareGatewayServiceDefinitionRestore(params));
}
async function restorePreparedGatewayServiceDefinitionBackup(params, { receipt, hooks, contents, task }) {
	const primary = receipt.files[0];
	if (process.platform === "darwin" && primary.before?.sha256 !== primary.after?.sha256) {
		const label = resolveLaunchAgentLabel(params.env);
		await assertNoSystemLaunchDaemonOwnership(label);
		const cached = await probeLaunchAgentState(`${resolveLaunchAgentGuiDomain()}/${label}`);
		if (cached.state === "unknown") throw new Error("Cached LaunchAgent definition could not be inspected for restoration.");
		await hooks.beforeWrite();
		if (cached.state !== "not-loaded") {
			await stopLaunchAgent({
				env: params.env,
				stdout: new Writable({ write(_chunk, _encoding, done) {
					done();
				} }),
				assertCurrent: hooks.assertCurrent
			});
			await hooks.beforeWrite();
		}
	}
	const taskXml = task?.subarray(2).toString("utf16le");
	const restoreFiles = async (native) => {
		const order = receipt.files.toSorted((a, b) => (a === primary ? 1 : a.before ? 0 : 2) - (b === primary ? 1 : b.before ? 0 : 2));
		for (const file of order) {
			const unchanged = file.before?.sha256 === file.after?.sha256 && file.before?.mode === file.after?.mode;
			if (unchanged && !(file === primary && (native || task))) continue;
			const content = contents[receipt.files.indexOf(file)];
			await hooks.beforeWrite();
			if (!unchanged) {
				if (native) await (content ? native.publish(file.sourcePath, content, file.before.mode) : native.remove(file.sourcePath));
				else if (content) await publishServiceFile({
					filePath: file.sourcePath,
					contents: content,
					mode: file.before.mode,
					definitionTransaction: hooks
				});
				else {
					await hooks.filePrepared(file.sourcePath, null);
					hooks.assertCurrent();
					await fs.unlink(file.sourcePath);
					await hooks.fileWritten(file.sourcePath, null);
				}
			}
			if (file === primary && native) {
				await hooks.beforeWrite();
				await assertNoSystemGatewayOwnership(params.env);
				await reloadSystemdUserManager(params.env, void 0, hooks.assertCurrent);
				await hooks.beforeWrite();
			}
			if (file === primary && taskXml && receipt.task.afterPolicySha256 !== taskPolicy(taskXml)) try {
				await restoreScheduledTaskDefinition({
					env: params.env,
					xml: taskXml,
					beforeWrite: () => hooks.taskPrepared(taskXml),
					assertCurrent: hooks.assertCurrent
				});
				await hooks.taskWritten(taskXml);
			} catch (error) {
				const retained = receipt.files.filter((entry) => !entry.before && entry.after).map((entry) => entry.sourcePath);
				throw new Error(`${String(error)} Kept new service files: ${retained.join(", ") || "none"}. Restore and verify the backed-up Scheduled Task XML at ${backupPath(`${primary.sourcePath}.task.xml`, receipt.id)} before removing them.`, { cause: error });
			}
		}
	};
	if (process.platform === "linux") await withSystemdDefinitionMutation(params.env, resolveManagedGatewayServiceCommand(params.command)?.environment ?? params.env, restoreFiles, { definitionTransaction: hooks });
	else await restoreFiles();
	await hooks.beforeWrite();
}
//#endregion
export { restoreGatewayServiceDefinitionBackup as n, verifyGatewayServiceDefinitionBackup as r, captureGatewayServiceDefinitionBackup as t };
