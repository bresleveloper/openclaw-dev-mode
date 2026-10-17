import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { Fn as object, Jn as string, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { r as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-CWlunAqt.mjs";
import { n as finishBackupScratch, t as createBackupScratchDirectory } from "./backup-scratch-CTd0Pvbc.mjs";
import { a as selectBackupRetention, i as resolveBackupNamespace, n as normalizeBackupRetention, r as parseRemoteBackupTimestamp, t as createRemoteBackupKey } from "./backup-retention-D0JLSuDB.mjs";
import { r as openStorageLocation } from "./locations-DP6s8i9T.mjs";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { pipeline } from "node:stream/promises";
//#region src/commands/backup-namespace.ts
const OWNER_KEY = "owner.json";
const ownerSchema = object({
	version: literal(1),
	deviceId: string().min(1),
	hostname: string().min(1),
	claimedAt: number().int().nonnegative()
});
async function readNamespaceOwner(location) {
	const body = await location.getObject(OWNER_KEY);
	if (!body) return;
	const chunks = [];
	let size = 0;
	for await (const chunk of body) {
		size += chunk.byteLength;
		if (size > 4096) throw new Error("Backup namespace owner exceeds 4096 bytes.");
		chunks.push(Buffer.from(chunk));
	}
	try {
		return ownerSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
	} catch {
		throw new Error("Invalid backup namespace owner.json.");
	}
}
function assertOwner(location, namespace, deviceId, owner) {
	const name = location.describe().name;
	if (!owner) throw new Error(`Backup namespace "${namespace}" in ${name} lost its ownership claim. Retry the backup.`);
	if (owner.deviceId !== deviceId) throw new Error(`Backup namespace "${namespace}" in ${name} belongs to another OpenClaw installation (${owner.hostname}, device ${owner.deviceId.slice(0, 12)}). Pass --namespace <name> to use a separate namespace, or --claim-namespace to take it over deliberately (for example after moving to new hardware).`);
}
async function claimBackupNamespace(location, namespace, deviceId, takeover) {
	if (takeover) await location.delete(OWNER_KEY);
	let owner = await readNamespaceOwner(location);
	if (!owner) {
		const bytes = Buffer.from(JSON.stringify({
			version: 1,
			deviceId,
			hostname: os.hostname(),
			claimedAt: Date.now()
		}));
		try {
			await location.putObject(OWNER_KEY, (async function* () {
				yield bytes;
			})(), { sizeBytes: bytes.length });
		} catch (error) {
			owner = await readNamespaceOwner(location);
			if (!owner) throw error;
		}
		owner ??= await readNamespaceOwner(location);
	}
	assertOwner(location, namespace, deviceId, owner);
}
async function assertBackupNamespaceOwner(location, namespace, deviceId) {
	assertOwner(location, namespace, deviceId, await readNamespaceOwner(location));
}
/** Discovery is read-only and incomplete claim metadata must never prevent recovery. */
async function listBackupNamespaces(backups) {
	const namespaces = /* @__PURE__ */ new Set();
	for await (const object of backups.list(void 0, { acceptKey: (key) => {
		const [namespace, file, extra] = key.split("/");
		if (!namespace || !file || extra !== void 0 || file !== OWNER_KEY && parseRemoteBackupTimestamp(file) === void 0) return false;
		try {
			resolveBackupNamespace(namespace);
		} catch {
			return false;
		}
		namespaces.add(namespace);
		return file !== OWNER_KEY;
	} })) namespaces.add(object.key.slice(0, object.key.indexOf("/")));
	const result = [];
	for (const namespace of [...namespaces].toSorted()) {
		const owner = await readNamespaceOwner(backups.scope(namespace)).catch(() => void 0);
		result.push({
			namespace,
			...owner ? { hostname: owner.hostname } : {}
		});
	}
	return result;
}
//#endregion
//#region src/commands/backup-remote.ts
async function openBackupLocation(name, namespace) {
	const location = await openStorageLocation({
		name,
		config: getRuntimeConfig()
	});
	try {
		const probe = await location.probe();
		if (probe.state !== "ok") throw new Error(probe.message ?? `Storage location ${name}: ${probe.state}. Run \`openclaw storage test ${name}\`.`);
		return location.scope(namespace === void 0 ? "backups" : `backups/${namespace}`);
	} catch (error) {
		await location.close();
		throw error;
	}
}
async function listBackupObjects(location) {
	const objects = [];
	for await (const object of location.list(void 0, { acceptKey: (key) => parseRemoteBackupTimestamp(key) !== void 0 })) objects.push(object);
	return objects.toSorted((a, b) => b.key.localeCompare(a.key));
}
async function createOffsiteBackupArchive(opts) {
	const namespace = resolveBackupNamespace(opts.namespace);
	const retention = normalizeBackupRetention(opts);
	const location = await openBackupLocation(opts.to, namespace);
	let scratch;
	let output;
	try {
		const { createBackupArchive } = await import("./backup-create-Bj7XL5w0.mjs");
		if (opts.dryRun) return await createBackupArchive(opts);
		const { deviceId } = await loadOrCreateProcessDeviceIdentityAsync();
		await claimBackupNamespace(location, namespace, deviceId, opts.claimNamespace === true);
		if (!opts.output) scratch = await createBackupScratchDirectory(os.tmpdir());
		const result = await createBackupArchive({
			...opts,
			output: scratch ? path.join(scratch.directory, "archive.tar.gz") : opts.output
		});
		const { verifyBackupArchive } = await import("./backup-verify-CkQonlxk.mjs");
		await verifyBackupArchive(result.archivePath);
		result.verified = true;
		const plaintextBytes = (await fs$1.stat(result.archivePath)).size;
		const key = createRemoteBackupKey(Date.parse(result.createdAt));
		await assertBackupNamespaceOwner(location, namespace, deviceId);
		const uploaded = await location.putObject(key, createReadStream(result.archivePath), {
			sizeBytes: plaintextBytes,
			precondition: () => assertBackupNamespaceOwner(location, namespace, deviceId)
		});
		const stored = await location.stat(key);
		if (!stored || stored.sizeBytes !== plaintextBytes || stored.storedBytes !== uploaded.storedBytes) throw new Error(`Stored backup size could not be confirmed for ${opts.to}/${namespace}/${key}. Run \`openclaw storage test ${opts.to}\`.`);
		const description = location.describe();
		output = {
			...result,
			archivePath: opts.output ? result.archivePath : `storage://${opts.to}/backups/${namespace}/${key}`,
			localArchiveRetained: Boolean(opts.output),
			location: {
				name: description.name,
				provider: description.provider,
				locationId: description.locationId,
				key,
				namespace,
				plaintextBytes,
				storedBytes: stored.storedBytes
			}
		};
		if (Object.values(retention).some((value) => value !== void 0)) {
			const selected = selectBackupRetention((await listBackupObjects(location)).map((object) => object.key), retention);
			for (const expired of selected.deleted) {
				await assertBackupNamespaceOwner(location, namespace, deviceId);
				await location.delete(expired, { precondition: () => assertBackupNamespaceOwner(location, namespace, deviceId) });
			}
			output.retention = {
				kept: selected.kept.length,
				deleted: selected.deleted.length
			};
		}
		return output;
	} finally {
		try {
			if (scratch) {
				const warning = await finishBackupScratch(scratch, opts.log);
				if (warning && output) output.warnings = [...output.warnings ?? [], warning];
			}
		} finally {
			await location.close();
		}
	}
}
async function backupListCommand(runtime, opts) {
	const namespace = resolveBackupNamespace(opts.namespace);
	const backupsLocation = await openBackupLocation(opts.from);
	const location = backupsLocation.scope(namespace);
	try {
		const namespaces = opts.namespace === void 0 ? await listBackupNamespaces(backupsLocation) : void 0;
		const backups = (await listBackupObjects(location)).map((object) => ({
			key: object.key,
			sizeBytes: object.sizeBytes,
			storedBytes: object.storedBytes,
			createdAt: new Date(parseRemoteBackupTimestamp(object.key)).toISOString()
		}));
		const result = {
			location: location.describe(),
			namespace,
			backups,
			...namespaces ? { namespaces } : {}
		};
		if (opts.json) writeRuntimeJson(runtime, result);
		else {
			if (namespaces) runtime.log(namespaces.length ? `Available namespaces in ${opts.from}:\n${namespaces.map((entry) => `${entry.namespace}${entry.hostname ? ` (${entry.hostname})` : ""}`).join("\n")}` : `No backup namespaces in ${opts.from}.`);
			runtime.log(backups.length ? backups.map((backup) => `${backup.key}  ${backup.sizeBytes} bytes (${backup.storedBytes} stored)`).join("\n") : `No backups in ${opts.from}/${namespace}.`);
		}
		return result;
	} finally {
		await location.close();
	}
}
async function withDownloadedBackup(runtime, opts, consume) {
	const namespace = resolveBackupNamespace(opts.namespace);
	if (opts.archive !== "latest" && parseRemoteBackupTimestamp(opts.archive) === void 0) throw new Error("Expected a backup key from `openclaw backup list --from <location>` or latest.");
	const location = await openBackupLocation(opts.from, namespace);
	let scratch;
	try {
		const key = opts.archive === "latest" ? (await listBackupObjects(location))[0]?.key : opts.archive;
		if (!key) throw new Error(`No backups in ${opts.from}/${namespace}.`);
		const body = await location.getObject(key);
		if (!body) throw new Error(`Backup ${key} was not found in ${opts.from}/${namespace}.`);
		scratch = await createBackupScratchDirectory(os.tmpdir());
		const archive = path.join(scratch.directory, "archive.tar.gz");
		await pipeline(body, createWriteStream(archive, {
			flags: "wx",
			mode: 384
		}));
		return await consume(archive);
	} finally {
		try {
			if (scratch) await finishBackupScratch(scratch, (message) => runtime.error(message));
		} finally {
			await location.close();
		}
	}
}
async function backupRemoteVerifyCommand(runtime, opts) {
	return await withDownloadedBackup(runtime, opts, async (archive) => {
		const { backupVerifyCommand } = await import("./backup-verify-CkQonlxk.mjs");
		return await backupVerifyCommand(runtime, {
			archive,
			json: opts.json
		});
	});
}
async function backupRemoteRestoreCommand(runtime, opts) {
	return await withDownloadedBackup(runtime, opts, async (archive) => {
		const { backupRestoreCommand } = await import("./backup-restore-omseVLcn.mjs");
		return await backupRestoreCommand(runtime, {
			archive,
			target: opts.target,
			json: opts.json
		});
	});
}
//#endregion
export { backupListCommand, backupRemoteRestoreCommand, backupRemoteVerifyCommand, createOffsiteBackupArchive };
