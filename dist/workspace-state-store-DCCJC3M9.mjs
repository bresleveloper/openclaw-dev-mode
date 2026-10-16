import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { c as resolveWorkspaceStateIdentity, i as createWorkspaceStateIdentity, n as WorkspaceAliasRepointedError, o as resolveCanonicalWorkspacePath, s as resolveWorkspaceStateAliases } from "./workspace-state-identity-EPAs22n_.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { l as WORKSPACE_BOOTSTRAP_FILENAMES } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { n as retireWorkspaceFileCache } from "./workspace-file-cache-Cja0k55j.mjs";
import { a as assertCanonicalTimestamp, g as workspacePathEntryExists, h as resolveWorkspaceIdentityFromDatabase, i as assertCanonicalIntegerTimestamp, o as deleteWorkspaceStateRowsInDatabase, u as readWorkspaceStateSnapshotFromDatabase } from "./workspace-state-store.kernel-0RlWLaF0.mjs";
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
			createAdmission: (operation) => {
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
					if (typeof expiryResult === "string" && accepted.committed?.facts === expiryResult) retireWorkspaceFileCache(expiryResult);
				});
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}
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
	return runWorkspaceStateOperation({
		type: "workspace.snapshotAndRegister",
		input: { workspaceDir: capturedWorkspaceDir }
	}, options);
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
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Workspace attestation requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				grant();
			})
		})
	});
}
function deleteWorkspaceRows(database, identity) {
	deleteWorkspaceStateRowsInDatabase(database, identity);
	deferSqlitePostCommitPublication(database.db, () => retireWorkspaceFileCache(identity.workspacePath));
}
/** The migration owner has verified the same workspace and every relocated byte before this commit. */
function retireWorkspaceRelocationAttestation(params) {
	const snapshot = readWorkspaceStateSnapshotFromDatabase(params);
	if (snapshot.setupExists || snapshot.attestation?.attestedAtMs !== params.attestedAtMs || snapshot.attestation.generatedHashes.size > 0) return false;
	executeSqliteQuerySync(params.database.db, getNodeSqliteKysely(params.database.db).updateTable("workspace_setup_state").set({
		attested_at_ms: null,
		attestation_updated_at_ms: null
	}).where("workspace_key", "=", params.identity.workspaceKey));
	return true;
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
	if (!existsSync(resolveOpenClawStateSqlitePath())) {
		options.assertCurrent?.();
		retireWorkspaceFileCache(plan.cacheRoot);
		return;
	}
	runOpenClawStateWriteTransaction((database) => {
		options.assertCurrent?.();
		const { lexicalAlias, currentCanonicalIdentity } = plan;
		const kysely = getNodeSqliteKysely(database.db);
		const storedAlias = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", lexicalAlias.workspaceKey));
		if (storedAlias && storedAlias.alias_path !== lexicalAlias.workspacePath) throw new Error("workspace path alias key collision");
		const storedIdentity = storedAlias ? createWorkspaceStateIdentity(storedAlias.workspace_path) : void 0;
		if (storedIdentity && storedIdentity.workspaceKey !== storedAlias?.workspace_key) throw new Error("workspace path alias target is invalid");
		if (storedIdentity && plan.pathEntryExisted && storedIdentity.workspaceKey !== currentCanonicalIdentity.workspaceKey) {
			executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("alias_key", "=", lexicalAlias.workspaceKey));
			return deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
				workspaceDir: currentCanonicalIdentity.workspacePath,
				database
			}).identity);
		}
		if (storedIdentity) return deleteWorkspaceRows(database, storedIdentity);
		return deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
			workspaceDir: currentCanonicalIdentity.workspacePath,
			database
		}).identity);
	});
}
//#endregion
export { readWorkspaceStateSnapshot as a, captureWorkspaceStateFilesystemGuard as c, prepareWorkspaceStateDeletion as i, deleteWorkspaceState as n, replaceWorkspaceAttestation as o, mergeWorkspaceSetupState as r, retireWorkspaceRelocationAttestation as s, clearExpiredWorkspaceStateForVanishedWorkspace as t };
