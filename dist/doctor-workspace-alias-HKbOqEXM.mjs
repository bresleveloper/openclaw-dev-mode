import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { a as normalizeWorkspaceIdentityPath, i as createWorkspaceStateIdentity, o as resolveCanonicalWorkspacePath, s as resolveWorkspaceStateAliases } from "./workspace-state-identity-CmGr5k4K.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { f as readWorkspaceStateSnapshotFromDatabase, g as retireWorkspaceFileCache, p as registerWorkspaceStateAliasIdentitiesInTransaction } from "./workspace-state-store-DTZ2RTNw.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as listWorkspaceStateDirs } from "./workspace-state-dirs-CH7J4WYg.mjs";
import { r as prepareWorkspaceMigrationReceiptMove, t as applyWorkspaceMigrationReceiptMove } from "./state-migrations.workspace-setup-receipts-AknVdDoS.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import os from "node:os";
//#region src/agents/workspace-alias-rebind.ts
function directoryIdentity(workspacePath) {
	try {
		const stat = fs.statSync(workspacePath, { bigint: true });
		return stat.isDirectory() ? `${stat.dev}:${stat.ino}:${stat.birthtimeNs}` : void 0;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return;
	}
}
function existingWorkspacePathSpellings(storedPath) {
	const root = path.parse(storedPath).root;
	let parents = [root];
	for (const segment of storedPath.slice(root.length).split(path.sep)) parents = parents.flatMap((parent) => {
		try {
			return fs.readdirSync(parent).filter((entry) => normalizeWorkspaceIdentityPath(entry) === segment).toSorted().map((entry) => path.join(parent, entry));
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		}
	});
	return parents;
}
function readWorkspaceMoveState(database, identity) {
	const snapshot = readWorkspaceStateSnapshotFromDatabase({
		database,
		identity
	});
	const kysely = getNodeSqliteKysely(database.db);
	return {
		setup: executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", identity.workspaceKey)),
		hashes: [...snapshot.attestation?.generatedHashes ?? []],
		aliases: executeSqliteQuerySync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("workspace_key", "=", identity.workspaceKey).orderBy("alias_key", "asc")).rows
	};
}
/** Read the old owner without adopting the alias's new target. */
function detectRepointedWorkspaceAlias(workspaceDir, options = {}) {
	const aliases = resolveWorkspaceStateAliases(workspaceDir);
	const lexical = aliases[0];
	const current = aliases.at(-1);
	const currentDirectoryPath = resolveCanonicalWorkspacePath(workspaceDir);
	const targetDirectoryIdentity = directoryIdentity(currentDirectoryPath);
	if (!pathMayExistSync(resolveUserPath(workspaceDir))) return;
	return withExistingOpenClawStateDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = getNodeSqliteKysely(database.db);
		const alias = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", lexical.workspaceKey));
		if (!alias) return;
		const stored = createWorkspaceStateIdentity(alias.workspace_path);
		if (alias.alias_path !== lexical.workspacePath || alias.workspace_key !== stored.workspaceKey) throw new Error("workspace path alias identity is invalid");
		if (stored.workspaceKey === current.workspaceKey) return;
		return {
			aliasPath: lexical.workspacePath,
			storedWorkspacePath: stored.workspacePath,
			currentWorkspacePath: current.workspacePath,
			currentDirectoryPath,
			currentTargetHasOwnState: executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_setup_state").select("workspace_key").where("workspace_key", "=", current.workspaceKey)) !== void 0,
			targetDirectoryIdentity,
			state: readWorkspaceMoveState(database, stored)
		};
	}), options);
}
function inspectWorkspaceAliasMove(workspaceDir, expected, configuredWorkspaceDirs = [workspaceDir]) {
	if (expected.currentTargetHasOwnState) return {
		kind: "blocked",
		outcome: "current-target-owns-state"
	};
	const stored = createWorkspaceStateIdentity(expected.storedWorkspacePath);
	const current = createWorkspaceStateIdentity(expected.currentWorkspacePath);
	if (!expected.targetDirectoryIdentity) return {
		kind: "blocked",
		outcome: "target-directory-missing"
	};
	if (directoryIdentity(expected.currentDirectoryPath) !== expected.targetDirectoryIdentity) return {
		kind: "blocked",
		outcome: "repoint-changed"
	};
	const matchesDestination = (candidate) => resolveWorkspaceStateAliases(candidate).at(-1).workspaceKey === current.workspaceKey && directoryIdentity(resolveCanonicalWorkspacePath(candidate)) === expected.targetDirectoryIdentity;
	if (existingWorkspacePathSpellings(stored.workspacePath).some((candidate) => !matchesDestination(candidate))) return {
		kind: "blocked",
		outcome: "original-workspace-exists"
	};
	const aliases = /* @__PURE__ */ new Map();
	const oldAliasKeys = new Set(expected.state.aliases.map((alias) => alias.alias_key));
	const configuredPaths = new Set(configuredWorkspaceDirs);
	for (const candidate of [
		...expected.state.aliases.flatMap((alias) => [alias.alias_path, ...existingWorkspacePathSpellings(alias.alias_path)]),
		...configuredPaths,
		workspaceDir
	]) {
		const resolved = resolveWorkspaceStateAliases(candidate);
		const lexical = resolved[0];
		const target = resolved.at(-1);
		if (configuredPaths.has(candidate) && target.workspaceKey === stored.workspaceKey) return {
			kind: "blocked",
			outcome: "configured-workspace-conflict"
		};
		if (matchesDestination(candidate)) for (const alias of resolved) aliases.set(alias.workspaceKey, alias);
		else if (oldAliasKeys.has(lexical.workspaceKey) && (pathMayExistSync(resolveUserPath(candidate)) || configuredPaths.has(candidate))) return {
			kind: "blocked",
			outcome: "configured-workspace-conflict"
		};
	}
	if (resolveWorkspaceStateAliases(workspaceDir).at(-1).workspaceKey !== current.workspaceKey) return {
		kind: "blocked",
		outcome: "repoint-changed"
	};
	return {
		kind: "ready",
		aliases: [...aliases.values()]
	};
}
/** Transfer only a confirmed move; source history is never rebuilt from templates. */
async function rebindRepointedWorkspaceAlias(workspaceDir, expected, options = {}, configuredWorkspaceDirs = [workspaceDir], verifyConfiguration) {
	const observed = detectRepointedWorkspaceAlias(workspaceDir, options);
	if (!observed) return "no-repoint";
	if (JSON.stringify(observed) !== JSON.stringify(expected)) return "repoint-changed";
	const initial = inspectWorkspaceAliasMove(workspaceDir, expected, configuredWorkspaceDirs);
	if (initial.kind === "blocked") return initial.outcome;
	const stored = createWorkspaceStateIdentity(expected.storedWorkspacePath);
	const current = createWorkspaceStateIdentity(expected.currentWorkspacePath);
	const database = openOpenClawStateDatabase(options);
	const receipts = await prepareWorkspaceMigrationReceiptMove({
		database: database.db,
		storedIdentity: stored,
		currentIdentity: current,
		currentDirectoryPath: expected.currentDirectoryPath,
		storedSetup: expected.state.setup
	});
	await verifyConfiguration?.();
	const filesystem = inspectWorkspaceAliasMove(workspaceDir, expected, configuredWorkspaceDirs);
	if (filesystem.kind === "blocked") return filesystem.outcome;
	return runOpenClawStateWriteTransaction((writeDatabase) => {
		const state = readWorkspaceMoveState(writeDatabase, stored);
		if (JSON.stringify(state) !== JSON.stringify(expected.state)) return "repoint-changed";
		const kysely = getNodeSqliteKysely(writeDatabase.db);
		if (executeSqliteQueryTakeFirstSync(writeDatabase.db, kysely.selectFrom("workspace_setup_state").select("workspace_key").where("workspace_key", "=", current.workspaceKey))) return "current-target-owns-state";
		applyWorkspaceMigrationReceiptMove(writeDatabase.db, receipts);
		if (state.setup) {
			executeSqliteQuerySync(writeDatabase.db, kysely.insertInto("workspace_setup_state").values({
				...state.setup,
				workspace_key: current.workspaceKey,
				workspace_path: current.workspacePath
			}));
			executeSqliteQuerySync(writeDatabase.db, kysely.updateTable("workspace_generated_bootstrap_hashes").set({ workspace_key: current.workspaceKey }).where("workspace_key", "=", stored.workspaceKey));
			executeSqliteQuerySync(writeDatabase.db, kysely.deleteFrom("workspace_setup_state").where("workspace_key", "=", stored.workspaceKey));
		}
		executeSqliteQuerySync(writeDatabase.db, kysely.deleteFrom("workspace_path_aliases").where("workspace_key", "=", stored.workspaceKey));
		registerWorkspaceStateAliasIdentitiesInTransaction({
			database: writeDatabase,
			aliases: filesystem.aliases,
			identity: current,
			updatedAtMs: Date.now()
		});
		deferSqlitePostCommitPublication(writeDatabase.db, () => {
			retireWorkspaceFileCache(stored.workspacePath);
			retireWorkspaceFileCache(current.workspacePath);
		});
		return "rebound";
	}, options);
}
//#endregion
//#region src/commands/doctor-workspace-alias.ts
async function configuredWorkspaceDirs(cfg) {
	return listWorkspaceStateDirs({
		cfg,
		env: process.env,
		homedir: os.homedir,
		stateDir: resolveStateDir()
	});
}
function describeRepointedWorkspaceAlias(facts) {
	return `Workspace path ${shortenHomePath(facts.aliasPath)} now resolves to ${shortenHomePath(facts.currentWorkspacePath)}, but its saved setup records belong to ${shortenHomePath(facts.storedWorkspacePath)}.`;
}
const WORKSPACE_ALIAS_CHECK_ID = "core/doctor/workspace-alias";
const REPAIR_HINT = "If the same workspace moved, run `openclaw doctor --fix` and confirm the move, or use `openclaw doctor --fix --force`. Otherwise restore the original link or configure the intended workspace directly.";
const REBIND_MESSAGES = {
	"no-repoint": "The alias no longer needs repair.",
	"repoint-changed": "The workspace changed after inspection. Nothing was transferred; rerun doctor to inspect it again.",
	"current-target-owns-state": "The destination already owns workspace records. Nothing was merged or deleted. Restore the original link, or configure that destination directly if you intended to switch workspaces.",
	"original-workspace-exists": "The original workspace still exists. This repair only moves records after the original folder has moved; restore the link if the move was not intended.",
	"target-directory-missing": "The destination is not an existing directory. Restore the moved folder before repairing the link.",
	"configured-workspace-conflict": "Another workspace path still refers to the original location. Update the links for the moved workspace, then rerun doctor; no records were transferred."
};
/** Read-only findings include failed inspection so health cannot report a false success. */
async function collectRepointedWorkspaceAliasFindings(cfg) {
	const workspaceDirs = await configuredWorkspaceDirs(cfg);
	return withSynchronousArtifactPreservingStateSnapshot(() => {
		const findings = [];
		for (const workspaceDir of workspaceDirs) {
			let message;
			try {
				const facts = detectRepointedWorkspaceAlias(workspaceDir);
				if (!facts) continue;
				message = `${describeRepointedWorkspaceAlias(facts)} Incoming messages cannot use this workspace until it is repaired.`;
			} catch (error) {
				message = `Workspace alias inspection failed for ${shortenHomePath(workspaceDir)}: ${formatErrorMessage(error)}`;
			}
			findings.push({
				checkId: WORKSPACE_ALIAS_CHECK_ID,
				severity: "warning",
				message,
				fixHint: REPAIR_HINT
			});
		}
		return findings;
	});
}
async function maybeRepairRepointedWorkspaceAliases(params) {
	if (!params.prompter.shouldRepair) return;
	const workspaceDirs = await configuredWorkspaceDirs(params.cfg);
	const configuration = await readConfigFileSnapshot();
	const verifyConfiguration = async () => {
		const current = await readConfigFileSnapshot();
		if (current.readError || !isDeepStrictEqual(current.sourceConfig, configuration.sourceConfig)) throw new Error("Workspace configuration changed during repair. No records were transferred; rerun doctor to inspect the current workspace owners.");
	};
	for (const workspaceDir of workspaceDirs) try {
		const facts = detectRepointedWorkspaceAlias(workspaceDir);
		if (!facts) continue;
		const description = describeRepointedWorkspaceAlias(facts);
		const inspection = inspectWorkspaceAliasMove(workspaceDir, facts, workspaceDirs);
		if (inspection.kind === "blocked") {
			note(`${description} ${REBIND_MESSAGES[inspection.outcome]}`, "Workspace");
			continue;
		}
		const confirmation = {
			message: `${description} Confirm only if this is the same workspace after a folder move. Transfer its saved setup and file-verification history without changing workspace files?`,
			initialValue: false
		};
		if (!(params.prompter.shouldForce ? await params.prompter.confirmAggressiveAutoFix(confirmation) : await params.prompter.confirmRuntimeRepair({
			...confirmation,
			requiresInteractiveConfirmation: true
		}))) {
			note(`${description} No records were transferred. ${REPAIR_HINT}`, "Workspace");
			continue;
		}
		const outcome = await rebindRepointedWorkspaceAlias(workspaceDir, facts, {}, workspaceDirs, verifyConfiguration);
		note(outcome === "rebound" ? `Rebound workspace state for ${shortenHomePath(facts.aliasPath)} to ${shortenHomePath(facts.currentWorkspacePath)}. Workspace files were not changed.` : `${description} ${REBIND_MESSAGES[outcome]}`, "Workspace");
	} catch (error) {
		note(`Workspace repair was not applied for ${shortenHomePath(workspaceDir)}: ${formatErrorMessage(error)}`, "Workspace");
	}
}
/** Stop migration discovery if its workspace owner still needs an operator decision. */
function createWorkspaceAliasMigrationRepair(prompter, beforePrompt) {
	if (!prompter?.shouldRepair) return;
	return async (cfg) => {
		if ((await collectRepointedWorkspaceAliasFindings(cfg)).length === 0) return;
		beforePrompt();
		await maybeRepairRepointedWorkspaceAliases({
			cfg,
			prompter
		});
		const unresolved = await collectRepointedWorkspaceAliasFindings(cfg);
		if (unresolved.length > 0) throw new Error(unresolved.map((finding) => `${finding.message} ${finding.fixHint}`).join("\n"));
	};
}
//#endregion
export { createWorkspaceAliasMigrationRepair as n, collectRepointedWorkspaceAliasFindings as t };
