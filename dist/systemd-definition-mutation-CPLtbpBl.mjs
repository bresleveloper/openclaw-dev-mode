import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { a as canonicalPathFromExistingAncestor, s as findExistingAncestor } from "./fs-safe-6Z4UiMS4.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { t as assertServiceDefinitionWritable } from "./service-types-CPk6CBn6.mjs";
import { c as withGatewayServiceInstallationRecovery, f as withServiceInspectionBudget, i as assertGatewayServiceUpdateCurrent, n as GatewayServiceAuthorityError } from "./service-update-authority-Ddw1lcTH.mjs";
import { I as execSystemctlUser, K as readSystemctlDetail, b as splitSystemdLogicalLines, l as resolveSystemdUnitPath, r as readSystemdServiceExecStart, s as resolveSystemdEnvironmentFilePath, t as isNodeSystemdEnvironment } from "./systemd-service-files-C3V-PDoO.mjs";
import { a as readServiceFileState } from "./service-stage-DFb_R12g.mjs";
import { d as isSystemSystemdOwnershipError, n as assertNoSystemGatewayOwnership, u as assertNoSystemSystemdOwnership } from "./systemd-scope-CccFXVqT.mjs";
import { constants, promises } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/daemon/systemd-definition-mutation.ts
const identity = (stat, contents) => [
	stat.dev,
	stat.ino,
	stat.uid,
	stat.gid,
	stat.mode,
	contents && sha256Hex(contents)
].join(":");
function resolveMutationTargets(env, environment, target) {
	return {
		unit: target?.unitPath ?? resolveSystemdUnitPath(env),
		generated: resolveSystemdEnvironmentFilePath({
			stateDir: resolveStateDir({
				...env,
				...environment
			}),
			environment
		})
	};
}
async function readStableFile(file, stat, requireReplacement) {
	const handle = await promises.open(file, constants.O_RDONLY | constants.O_NOFOLLOW | (constants.O_NONBLOCK ?? 0));
	try {
		const opened = await handle.stat({ bigint: true });
		if (!opened.isFile() || identity(opened) !== identity(stat)) throw new Error("changed artifact");
		if (requireReplacement && process.platform === "linux") {
			const fdinfo = await promises.readFile(`/proc/self/fdinfo/${handle.fd}`, "utf8");
			const mountId = /^mnt_id:\s+(\d+)$/m.exec(fdinfo)?.[1];
			const mount = (await promises.readFile("/proc/self/mountinfo", "utf8")).split("\n").find((line) => mountId && line.startsWith(`${mountId} `))?.split(" ");
			if (!mount?.[4] || !mount[5]) throw new Error("Cannot inspect the service artifact mount.");
			if (mount[5].split(",").includes("ro") || decodeMountInfoPath(mount[4]) === await promises.realpath(file)) return { sealed: true };
		}
		return { contents: await handle.readFile() };
	} finally {
		await handle.close();
	}
}
async function inspect$1(env, environment, options) {
	const { unit, generated } = resolveMutationTargets(env, environment, options?.systemdReadTarget);
	const snapshots = /* @__PURE__ */ new Map();
	const fingerprint = /* @__PURE__ */ new Map();
	let shared = /* @__PURE__ */ new Set();
	let sourcePath;
	let artifactPath;
	let repairStateDirectory = false;
	const result = (capability) => ({
		capability: capability.kind !== "writable" && capability.artifact === "service-file" && artifactPath ? {
			...capability,
			path: artifactPath
		} : capability,
		snapshots,
		fingerprint,
		shared,
		sourcePath,
		repairStateDirectory
	});
	let artifact;
	try {
		const command = await readSystemdServiceExecStart(env, {
			...options,
			requireEffective: true
		});
		sourcePath = command?.sourcePath;
		const targets = /* @__PURE__ */ new Set([
			unit,
			generated,
			`${unit}.bak`
		]);
		const definitions = new Set(command?.definitionPaths ?? []);
		shared = new Set([...definitions].filter((file) => file !== command?.sourcePath && !targets.has(file) && path.basename(path.dirname(file)) === "service.d"));
		const definitionParents = new Set([...definitions].filter((file) => !shared.has(file)).map(path.dirname));
		const parents = /* @__PURE__ */ new Set([
			path.dirname(unit),
			path.dirname(generated),
			...definitionParents
		]);
		const artifacts = /* @__PURE__ */ new Set([
			...parents,
			...targets,
			...definitions
		]);
		for (const file of artifacts) {
			const directory = parents.has(file) && !definitions.has(file);
			const required = definitions.has(file) || definitionParents.has(file);
			artifact = !directory ? "service-file" : file === path.dirname(unit) ? "service-directory" : file === path.dirname(generated) ? "state-directory" : "definition-directory";
			const inspected = directory && !required ? await findExistingAncestor(file) ?? file : file;
			artifactPath = inspected;
			const stat = await promises.lstat(inspected, { bigint: true }).catch((error) => {
				if (required || !hasErrnoCode(error, "ENOENT")) throw error;
			});
			if (!stat) {
				fingerprint.set(file, "missing");
				continue;
			}
			if (!directory && stat.isSymbolicLink()) return result({
				kind: "unknown",
				reason: "symlink",
				artifact
			});
			const actual = directory && stat.isSymbolicLink() ? await promises.stat(inspected, { bigint: true }) : stat;
			if (!shared.has(file) && actual.uid !== BigInt(process.geteuid?.() ?? -1)) return result({
				kind: "sealed",
				reason: "foreign-owner",
				artifact
			});
			if (directory && !actual.isDirectory()) return result({
				kind: "unknown",
				reason: "invalid-artifact",
				artifact
			});
			const repairableGeneratedFile = actual.isFile() && (file === unit || file === `${unit}.bak`);
			const repairableStateDirectory = directory && file === path.dirname(generated) && inspected === file && !stat.isSymbolicLink();
			const requiresRegeneration = Boolean(actual.mode & 18n);
			if (requiresRegeneration && !repairableGeneratedFile && !repairableStateDirectory) return result({
				kind: "unknown",
				reason: "unsafe-permissions",
				artifact
			});
			repairStateDirectory ||= requiresRegeneration && repairableStateDirectory;
			if (directory) {
				await promises.access(inspected, constants.W_OK | constants.X_OK);
				fingerprint.set(file, `${inspected}:${identity(stat)}:${identity(actual)}`);
				continue;
			}
			const snapshot = await readStableFile(file, stat, !shared.has(file));
			if ("sealed" in snapshot) return result({
				kind: "sealed",
				reason: "sealed-mount",
				artifact
			});
			const { contents } = snapshot;
			fingerprint.set(file, identity(stat, contents));
			if (targets.has(file)) snapshots.set(file, {
				contents,
				mode: Number(stat.mode & 511n),
				...requiresRegeneration ? { requiresRegeneration: true } : {}
			});
		}
		return result({ kind: "writable" });
	} catch (error) {
		if (error instanceof GatewayServiceAuthorityError || hasCommandProcessCleanupError(error)) throw error;
		return result({
			kind: "unknown",
			reason: "inspection-failed",
			artifact
		});
	}
}
async function readSystemdDefinitionMutationCapability(env, options) {
	return await withServiceInspectionBudget(async (inspectionBudget) => {
		if (options?.systemdReadTarget?.scope === "system") return {
			kind: "sealed",
			reason: "system-owned"
		};
		const selected = options?.systemdReadTarget?.unitName ?? path.basename(resolveSystemdUnitPath(env));
		const { environment = env, ...readOptions } = options ?? {};
		const names = selected === "openclaw-gateway.service" ? [selected, "openclaw.service"] : [selected];
		const budget = options?.timeoutMs && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : options?.requireLoaded ? 5e3 : void 0;
		const deadlineAt = budget === void 0 ? void 0 : inspectionBudget.now() + budget;
		const remaining = () => {
			if (deadlineAt === void 0) return;
			const value = deadlineAt - inspectionBudget.now();
			if (value <= 0) throw new Error("Definition inspection deadline expired.");
			return value;
		};
		for (const name of names) try {
			await assertNoSystemSystemdOwnership(name, remaining(), ...options?.requireLoaded ? [{ requireLoaded: true }] : []);
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (isSystemSystemdOwnershipError(error) && error.ownership.status !== "unverifiable") return {
				kind: "sealed",
				reason: "system-owned"
			};
			const unverified = {
				kind: "unknown",
				reason: "system-ownership-unverified"
			};
			if (!options?.requireLoaded || !isSystemSystemdOwnershipError(error)) return unverified;
			const loaded = await inspect$1(env, environment, {
				...readOptions,
				timeoutMs: remaining(),
				requireLoaded: true
			}).then((inspection) => inspection.capability, (inspectionError) => {
				if (hasCommandProcessCleanupError(inspectionError)) throw inspectionError;
			});
			return loaded?.kind === "writable" ? loaded : unverified;
		}
		try {
			return (await inspect$1(env, environment, {
				...readOptions,
				timeoutMs: remaining()
			})).capability;
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			return {
				kind: "unknown",
				reason: "inspection-failed"
			};
		}
	});
}
async function withSystemdDefinitionMutation(env, environment, run, options) {
	const deadlineAt = options?.timeoutMs && options.timeoutMs > 0 ? performance.now() + options.timeoutMs : void 0;
	const remainingTimeoutMs = () => deadlineAt === void 0 ? void 0 : Math.max(1, deadlineAt - performance.now());
	const { unit, generated } = resolveMutationTargets(env, environment);
	const canonicalTargets = () => Promise.all([unit, generated].map(canonicalPathFromExistingAncestor));
	const preparation = await withGatewayServiceInstallationRecovery(async () => {
		const initial = await inspect$1(env, environment, { timeoutMs: remainingTimeoutMs() });
		assertServiceDefinitionWritable(initial.capability);
		assertGatewayServiceUpdateCurrent();
		await promises.mkdir(path.dirname(unit), {
			recursive: true,
			mode: 493
		});
		assertGatewayServiceUpdateCurrent();
		await promises.mkdir(path.dirname(generated), {
			recursive: true,
			mode: 448
		});
		if (initial.repairStateDirectory) {
			const directory = await promises.open(path.dirname(generated), constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
			try {
				if ((await directory.stat()).uid !== process.geteuid?.()) throw new Error("Cannot repair a foreign-owned service state directory.");
				assertGatewayServiceUpdateCurrent();
				await directory.chmod(448);
			} finally {
				await directory.close();
			}
		}
		return {
			initial,
			lockedTargets: await canonicalTargets()
		};
	}, async () => false);
	let initial = preparation.initial;
	const { lockedTargets } = preparation;
	const targets = lockedTargets.map((target) => path.join(path.dirname(target), `.openclaw-${sha256Hex(target)}`)).toSorted();
	const execute = async () => {
		const refresh = async (unchanged = false, firstUnitPublication = false) => {
			const current = await inspect$1(env, environment, { timeoutMs: remainingTimeoutMs() });
			assertServiceDefinitionWritable(current.capability);
			const expected = new Map(initial.fingerprint);
			if (firstUnitPublication && !initial.sourcePath && current.sourcePath === unit) {
				for (const [file, fingerprint] of current.fingerprint) if (current.shared.has(file) && !expected.has(file)) expected.set(file, fingerprint);
			}
			if (unchanged && !isDeepStrictEqual(current.fingerprint, expected)) throw new Error("Managed service artifacts changed during publication.");
			initial = current;
		};
		await withGatewayServiceInstallationRecovery(async () => {
			await refresh();
			if (!isDeepStrictEqual(await canonicalTargets(), lockedTargets)) throw new Error("Managed service lock targets changed during acquisition.");
		}, async () => false);
		const allowed = /* @__PURE__ */ new Set([
			unit,
			generated,
			`${unit}.bak`
		]);
		const snapshots = initial.snapshots;
		const publications = /* @__PURE__ */ new Map();
		let reloadPending = false;
		const reloadRestoredDefinition = async () => {
			if (!reloadPending) return;
			try {
				await assertNoSystemGatewayOwnership(env, remainingTimeoutMs());
				assertGatewayServiceUpdateCurrent();
				const result = await execSystemctlUser(env, ["daemon-reload"], remainingTimeoutMs(), assertGatewayServiceUpdateCurrent);
				assertGatewayServiceUpdateCurrent();
				if (result.code !== 0 || result.termination !== "exit") throw new Error(`systemctl rollback daemon-reload failed: ${readSystemctlDetail(result)}`);
				reloadPending = false;
			} catch (error) {
				const message = `Systemd rollback reload was not confirmed; service inputs including ${generated} were retained. Retry service installation from the same profile after the user manager is available.`;
				options?.warn?.(message);
				throw new Error(message, { cause: error });
			}
		};
		const publish = async (file, contents, mode, rollback = true) => {
			if (!allowed.has(file)) throw new Error("Not a managed service publication target.");
			await options?.definitionTransaction?.beforeWrite();
			await refresh(true);
			const previous = initial.snapshots.get(file) ?? null;
			await readServiceFileState(file);
			await refresh(true);
			const directory = await promises.realpath(path.dirname(file));
			const temporary = path.join(directory, `${path.basename(file)}.${randomUUID()}.tmp`);
			try {
				assertGatewayServiceUpdateCurrent();
				await promises.writeFile(temporary, contents, {
					flag: "wx",
					mode: mode | 128
				});
				const temporaryHandle = await promises.open(temporary, constants.O_WRONLY | constants.O_NOFOLLOW);
				try {
					await temporaryHandle.chmod(mode);
				} finally {
					await temporaryHandle.close();
				}
				const written = await promises.lstat(temporary, { bigint: true });
				if (file === unit || file === generated) await options?.definitionTransaction?.filePrepared(file, temporary);
				await refresh(true);
				assertGatewayServiceUpdateCurrent();
				options?.definitionTransaction?.assertCurrent();
				await promises.rename(temporary, file);
				reloadPending ||= file === unit;
				const published = identity(written, Buffer.from(contents));
				initial.fingerprint.set(file, published);
				publications.set(file, published);
				const recordPublication = async () => {
					await refresh(true, file === unit && previous === null);
					const after = await readServiceFileState(file);
					if (!after || after.dev !== written.dev.toString() || after.ino !== written.ino.toString() || after.sha256 !== sha256Hex(Buffer.from(contents)) || after.mode !== mode) throw new Error("Managed service artifact changed after publication.");
					await refresh(true);
					if (file === unit || file === generated) await options?.definitionTransaction?.fileWritten(file, contents);
				};
				if (options?.definitionTransaction) await recordPublication();
				else await withGatewayServiceInstallationRecovery(recordPublication, async () => rollback ? restore(file, previous) : false);
			} finally {
				await promises.unlink(temporary).catch(() => void 0);
			}
		};
		const remove = async (file) => {
			if (file !== generated) throw new Error("Only a generated environment file can be retired during restoration.");
			await options?.definitionTransaction?.beforeWrite();
			await refresh(true);
			await options?.definitionTransaction?.filePrepared(file, null);
			assertGatewayServiceUpdateCurrent();
			options?.definitionTransaction?.assertCurrent();
			await promises.unlink(file);
			initial.fingerprint.set(file, "missing");
			await options?.definitionTransaction?.fileWritten(file, null);
			await refresh(true);
		};
		const restore = async (file, snapshot) => {
			if (!allowed.has(file) && snapshot) throw new Error("Not a managed service publication target.");
			const published = publications.get(file);
			if (published === void 0) return false;
			const current = await inspect$1(env, environment, { timeoutMs: remainingTimeoutMs() });
			if (current.capability.kind !== "writable" || current.fingerprint.get(file) !== published) return false;
			const currentUnit = current.snapshots.get(unit);
			const originalUnit = snapshots.get(unit);
			if (file === generated && snapshot === null && currentUnit && (!originalUnit || !currentUnit.contents.equals(originalUnit.contents)) && splitSystemdLogicalLines(currentUnit.contents.toString("utf8")).some((line) => /^\s*EnvironmentFile\s*=\s*\S/u.test(line))) throw new Error(`Managed service unit changed during publication and may still reference ${file}; retained for inspection.`);
			initial = current;
			if (snapshot) await publish(file, snapshot.contents, snapshot.mode, false);
			else if (file === generated) {
				await reloadRestoredDefinition();
				await remove(file);
			} else {
				await refresh(true);
				assertGatewayServiceUpdateCurrent();
				await promises.unlink(file);
				initial.fingerprint.set(file, "missing");
				await refresh(true);
			}
			publications.delete(file);
			return true;
		};
		return await run({
			snapshots,
			publish,
			restore,
			restoreAll: async () => {
				let restored = false;
				let failure;
				const files = [
					unit,
					`${unit}.bak`,
					...isNodeSystemdEnvironment(env) ? [] : [generated]
				];
				const order = files.toSorted((a, b) => (a === unit ? 1 : snapshots.has(a) ? 0 : 2) - (b === unit ? 1 : snapshots.has(b) ? 0 : 2));
				for (const file of order) try {
					restored = await restore(file, snapshots.get(file) ?? null) || restored;
					if (file === unit) await reloadRestoredDefinition();
				} catch (error) {
					if (file === unit || file === generated && snapshots.has(generated)) throw error;
					failure ??= toErrorObject(error, "Systemd rollback failed.");
				}
				if (failure) throw failure;
				if (files.some((file) => publications.has(file))) throw new Error("Managed service artifacts changed during publication; recovery remains pending.");
				return restored;
			},
			remove
		});
	};
	const lockOptions = () => {
		const timeoutMs = remainingTimeoutMs();
		return {
			stale: 6e4,
			retries: {
				retries: timeoutMs === void 0 ? 100 : Math.max(0, Math.ceil(timeoutMs / 50) - 1),
				factor: 1,
				minTimeout: 50,
				maxTimeout: 100
			}
		};
	};
	const acquire = async (index) => index === targets.length ? execute() : withFileLock(targets[index], lockOptions(), () => acquire(index + 1));
	return await acquire(0);
}
//#endregion
export { withSystemdDefinitionMutation as n, readSystemdDefinitionMutationCapability as t };
