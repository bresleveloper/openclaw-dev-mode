import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { c as resolveWorkspaceStateIdentity, n as WorkspaceAliasRepointedError, o as resolveCanonicalWorkspacePath, s as resolveWorkspaceStateAliases } from "./workspace-state-identity-hZ7UINpz.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { l as WORKSPACE_BOOTSTRAP_FILENAMES } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { n as retireWorkspaceFileCache } from "./workspace-file-cache-BXNEApSi.mjs";
import { _ as withWorkspaceStatePublication, b as workspaceStateReceiptResult, h as workspacePathEntryExists, i as assertCanonicalTimestamp, r as assertCanonicalIntegerTimestamp, y as workspaceStatePublication } from "./workspace-state-store.kernel-BcjpAYye.mjs";
import fs, { existsSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/workspace-state-guard.ts
function statFact(file, follow, content) {
	const stat = follow ? fs.statSync(file, {
		bigint: true,
		throwIfNoEntry: false
	}) : fs.lstatSync(file, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!stat) return;
	return content ? `${stat.dev}:${stat.ino}:${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}` : `${stat.dev}:${stat.ino}:${stat.mode}`;
}
/** Request-local filesystem evidence; stored NFC keys never select filesystem paths. */
function captureWorkspaceStateFilesystemGuard(workspaceDir, content = true) {
	const dir = path.resolve(resolveUserPath(workspaceDir));
	const canonical = resolveCanonicalWorkspacePath(dir);
	const root = [statFact(dir, false, false), statFact(dir, true, false)];
	const entries = (directory) => {
		try {
			return fs.readdirSync(directory, { withFileTypes: true });
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
			return [];
		}
	};
	const observe = () => {
		const paths = [];
		if (content) {
			paths.push(...[
				...WORKSPACE_BOOTSTRAP_FILENAMES,
				"memory",
				".git",
				"skills"
			].map((name) => path.join(dir, name)));
			for (const entry of entries(path.join(dir, "skills"))) if (entry.isDirectory()) paths.push(path.join(dir, "skills", entry.name), path.join(dir, "skills", entry.name, "SKILL.md"));
		}
		return {
			names: content ? entries(dir).map((entry) => entry.name).toSorted() : [],
			files: paths.toSorted().map((file) => [
				file,
				statFact(file, false, content),
				statFact(file, true, content)
			])
		};
	};
	const initial = observe();
	return () => {
		const current = resolveCanonicalWorkspacePath(dir);
		if (current !== canonical) throw new WorkspaceAliasRepointedError({
			aliasPath: dir,
			storedWorkspacePath: canonical,
			currentWorkspacePath: current
		});
		const currentRoot = [statFact(dir, false, false), statFact(dir, true, false)];
		if (root.some((fact, index) => fact !== void 0 && fact !== currentRoot[index]) || root[1] === void 0 && currentRoot[1] !== void 0 && !fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory() || !isDeepStrictEqual(observe(), initial)) throw new Error(`Workspace filesystem changed while preparing state for ${dir}; retry workspace setup.`);
		for (let index = 0; index < root.length; index++) root[index] ??= currentRoot[index];
	};
}
//#endregion
//#region src/agents/workspace-state-cache.ts
const stores = resolveGlobalMap(Symbol.for("openclaw.workspaceStateSnapshots"), "close-and-restart");
workspaceStatePublication.subscribeFacts((change) => {
	if (change.kind !== "unknown" && change.kind !== "committed") return;
	if (change.kind === "committed" && change.receipt.facts.size === 0) return;
	const identity = change.kind === "unknown" ? change.identity : change.receipt.source.identity;
	for (const [key, store] of stores) if (store.identity === identity) stores.delete(key);
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		for (const [key, store] of stores) if (store.path === (event.identity?.canonicalPath ?? event.path)) stores.delete(key);
	}
});
/** A workspace write invalidates the whole small projection, including alias resolution. */
async function readCachedWorkspaceStateSnapshot(context, aliasKey, read) {
	context.admission.assertCurrent();
	const key = context.admission.coordinationKey;
	let store = stores.get(key);
	if (store && store.identity !== context.admission.identity.key) {
		stores.delete(key);
		store = void 0;
	}
	if (!store) {
		store = {
			identity: context.admission.identity.key,
			path: context.admission.identity.canonicalPath,
			snapshots: /* @__PURE__ */ new Map()
		};
		stores.set(key, store);
	}
	const cached = store.snapshots.get(aliasKey);
	if (cached) return structuredClone(cached);
	const snapshot = await read();
	context.admission.assertCurrent();
	if (stores.get(key) === store) {
		if (store.identity !== context.admission.identity.key) stores.delete(key);
		else {
			if (store.snapshots.size >= 128) store.snapshots.delete(store.snapshots.keys().next().value);
			store.snapshots.set(aliasKey, structuredClone(snapshot));
		}
	}
	return snapshot;
}
//#endregion
//#region src/agents/workspace-state-store.ts
async function runWorkspaceStateOperation(command, options) {
	const capturedCommand = {
		...command,
		input: {
			...command.input,
			recoveryHoldPredicate: structuredClone(options.recoveryHoldPredicate)
		}
	};
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const assertFilesystem = captureWorkspaceStateFilesystemGuard(command.input.workspaceDir, command.type !== "workspace.snapshotAndRegister");
	const assertCurrent = () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
		assertFilesystem();
	};
	let expiryResult;
	let publication;
	try {
		const result = await runOpenClawStateWorkerOperation(context, async (scope) => {
			try {
				options.beforeLegacyApply?.();
				return await scope.execute(capturedCommand);
			} finally {
				await publication;
			}
		}, {
			assertCurrent,
			createAdmission: withWorkspaceStatePublication(context, (operation) => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Workspace state requires transaction admission");
					assertCurrent();
					if (command.type === "workspace.expire" && request.stage === "commit") {
						if (typeof request.facts !== "string" && request.facts !== false) throw new Error("Workspace expiry has no admitted result");
						expiryResult = request.facts;
					}
					grant();
				});
				const accepted = admission;
				publication = operation.settled.then(() => {
					if (typeof expiryResult === "string" && accepted.committed && workspaceStateReceiptResult(accepted.committed.facts) === expiryResult) retireWorkspaceFileCache(expiryResult);
				});
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			})
		});
		assertCurrent();
		return result;
	} finally {
		await publication;
	}
}
async function readWorkspaceStateSnapshot(workspaceDir, options = {}) {
	const capturedWorkspaceDir = path.resolve(resolveUserPath(workspaceDir));
	if (options.readOnly) {
		const assertFilesystem = captureWorkspaceStateFilesystemGuard(capturedWorkspaceDir, false);
		const reply = await executeExistingOpenClawStateRead(options, {
			type: "workspace.snapshot",
			workspaceDir: capturedWorkspaceDir
		});
		options.assertCurrent?.();
		assertFilesystem();
		if (reply && (!reply.ok || reply.type !== "workspace.snapshot")) throw new Error("Unexpected workspace state snapshot result");
		return reply?.snapshot ?? {
			identity: resolveWorkspaceStateIdentity(capturedWorkspaceDir),
			setupExists: false,
			setup: { version: 1 }
		};
	}
	const read = () => runWorkspaceStateOperation({
		type: "workspace.snapshotAndRegister",
		input: { workspaceDir: capturedWorkspaceDir }
	}, options);
	if (options.recoveryHoldPredicate || options.beforeLegacyApply) return read();
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const assertFilesystem = captureWorkspaceStateFilesystemGuard(capturedWorkspaceDir, false);
	const snapshot = await readCachedWorkspaceStateSnapshot(context, JSON.stringify(resolveWorkspaceStateAliases(capturedWorkspaceDir)), read);
	options.assertCurrent?.();
	assertFilesystem();
	return snapshot;
}
async function mergeWorkspaceSetupState(workspaceDir, next, nowMs = Date.now(), options = {}) {
	assertCanonicalIntegerTimestamp(nowMs, "setup update");
	if (next.bootstrapSeededAt) assertCanonicalTimestamp(next.bootstrapSeededAt, "bootstrap seeded");
	if (next.setupCompletedAt) assertCanonicalTimestamp(next.setupCompletedAt, "setup completed");
	return runWorkspaceStateOperation({
		type: "workspace.mergeSetup",
		input: {
			workspaceDir: path.resolve(resolveUserPath(workspaceDir)),
			next: { ...next },
			nowMs
		}
	}, options);
}
async function replaceWorkspaceAttestation(params) {
	const context = captureOpenClawStateWorkerContext();
	const { assertCurrent } = params;
	const input = {
		workspaceDir: path.resolve(resolveUserPath(params.workspaceDir)),
		attestedAtMs: params.attestedAtMs,
		generatedHashes: new Map(params.generatedHashes),
		nowMs: params.nowMs,
		recoveryHoldPredicate: structuredClone(params.recoveryHoldPredicate)
	};
	return runOpenClawStateWorkerOperation(context, (scope) => {
		params.beforeLegacyApply?.();
		return scope.execute({
			type: "workspace.replaceAttestation",
			input
		});
	}, {
		assertCurrent,
		createAdmission: withWorkspaceStatePublication(context, () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Workspace attestation requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				grant();
			})
		}))
	});
}
/** Clear expired state only when no concurrent writer refreshed the vanished workspace. */
async function clearExpiredWorkspaceStateForVanishedWorkspace(workspaceDir, nowMs = Date.now(), options = {}) {
	assertCanonicalIntegerTimestamp(nowMs, "workspace expiry check");
	return await runWorkspaceStateOperation({
		type: "workspace.expire",
		input: {
			workspaceDir: path.resolve(resolveUserPath(workspaceDir)),
			nowMs
		}
	}, options) !== false;
}
/** Capture workspace identity before the filesystem entry is removed. */
function prepareWorkspaceStateDeletion(workspaceDir) {
	const aliases = resolveWorkspaceStateAliases(workspaceDir);
	return {
		cacheRoot: resolveCanonicalWorkspacePath(workspaceDir),
		lexicalAlias: aliases[0],
		currentCanonicalIdentity: aliases.at(-1),
		pathEntryExisted: workspacePathEntryExists(workspaceDir)
	};
}
async function deleteWorkspaceState(plan, options = {}) {
	const capturedPlan = structuredClone(plan);
	const publish = (facts) => {
		const result = workspaceStateReceiptResult(facts);
		if (!isRecord(result) || result.kind !== "workspace-deleted" || typeof result.workspacePath !== "string") throw new Error("Workspace deletion has no committed result");
		retireWorkspaceFileCache(result.workspacePath);
	};
	const deletionOwner = options.deletion;
	if (deletionOwner) {
		let publication;
		try {
			await deletionOwner.runWithWorker((scope, deletion) => scope.execute({
				type: "workspace.delete",
				input: {
					plan: capturedPlan,
					deletion
				}
			}), {
				onAdmission: (_request, identity) => {
					publication ??= workspaceStatePublication.begin({
						identity,
						assertCurrent: deletionOwner.assertCurrentHost
					});
				},
				onCommitted: (facts) => {
					if (isRecord(facts)) publication?.committed(facts.receipt);
					publish(facts);
				}
			});
			publication?.finish(true);
		} finally {
			publication?.finish(false);
		}
		deletionOwner.assertCurrentHost();
		return;
	}
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const assertHost = options.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertHost?.();
	};
	assertCurrent();
	if (!existsSync(context.admission.databasePath)) {
		retireWorkspaceFileCache(capturedPlan.cacheRoot);
		return;
	}
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "workspace.delete",
		input: { plan: capturedPlan }
	}), {
		existingOnly: true,
		assertCurrent,
		createAdmission: withWorkspaceStatePublication(context, () => {
			return {
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Workspace deletion requires transaction admission");
					assertCurrent();
					grant();
				}),
				nativeLocations: [context.admission.databasePath]
			};
		}, publish)
	});
	assertCurrent();
	if (result === void 0) retireWorkspaceFileCache(capturedPlan.cacheRoot);
}
//#endregion
export { readWorkspaceStateSnapshot as a, prepareWorkspaceStateDeletion as i, deleteWorkspaceState as n, replaceWorkspaceAttestation as o, mergeWorkspaceSetupState as r, captureWorkspaceStateFilesystemGuard as s, clearExpiredWorkspaceStateForVanishedWorkspace as t };
