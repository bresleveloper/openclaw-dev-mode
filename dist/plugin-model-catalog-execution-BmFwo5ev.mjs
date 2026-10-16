import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { d as runSqliteReadOnlyOperation } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { s as withFileLock } from "./file-lock-CkzOvhYo.mjs";
import "./file-lock-Cl3feKST.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { g as resolveAuthProfileDatabasePath, h as resolveAuthProfileDatabaseOwnerId } from "./sqlite-CW8wNN4G.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
//#region src/agents/plugin-model-catalog-execution.ts
/** A clean read must follow publication settlement, including another process's uncommitted row. */
async function withPluginModelCatalogPublicationLocks(databasePaths, operation) {
	const paths = [...new Set(databasePaths.map(resolvePathViaExistingAncestorSync))].toSorted();
	const enter = async (index) => {
		const databasePath = paths[index];
		return databasePath ? await withFileLock(`${databasePath}.plugin-model-catalog`, {
			retries: {
				retries: 20,
				factor: 2,
				minTimeout: 100,
				maxTimeout: 1e4,
				randomize: true
			},
			stale: 18e4,
			staleRecovery: "remove-if-definitely-stale"
		}, () => enter(index + 1)) : await operation();
	};
	return await enter(0);
}
/** The canonical executor owns preparation, publication, and custody settlement. */
async function withPluginModelCatalogWorker(options, prepare, operation) {
	const execution = captureOpenClawAgentDatabaseExecution(options);
	let worker;
	try {
		if (prepare) await runOpenClawAgentWorkerWrite(options, () => execution.prepare({
			assertCurrent: () => execution.assertCurrent(),
			createAdmission(binding) {
				return () => ({
					nativeLocations: binding.nativeLocations,
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						binding.authorize(request);
						execution.assertCurrent();
						if (!grant()) throw new Error("Catalog database preparation authority expired");
					}, binding.attachment)
				});
			}
		}));
		worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
			moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.pluginModelCatalogCredentials),
			input: void 0
		});
		return await worker.run(operation, () => execution.assertCurrent());
	} finally {
		try {
			await worker?.close();
		} finally {
			await execution.release();
		}
	}
}
/** Preparation retains read authority through worker settlement, without admitting a writer. */
async function loadPersistedPluginModelCatalogs(agentDir, pluginIds, environment = process.env) {
	if (pluginIds?.length === 0) return [];
	const env = cloneEnvWithPlatformSemantics(environment);
	const options = {
		agentId: resolveAuthProfileDatabaseOwnerId(agentDir),
		path: resolveAuthProfileDatabasePath(agentDir),
		env
	};
	const identity = readDatabasePathIdentitySync(options.path);
	if (!identity.key.startsWith("file:")) return [];
	const root = captureOpenClawStateReadContext(resolveOpenClawStateSqlitePath(env));
	const controller = new AbortController();
	let reading;
	const revoke = () => controller.abort(/* @__PURE__ */ new Error("Plugin catalog read owner was revoked"));
	const close = async () => {
		revoke();
		await reading?.catch(() => void 0);
	};
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		root.admission.assertCurrent();
		root.maintenanceScope?.assertAdmission();
		assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
	};
	assertCurrent();
	const unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
		...options,
		revoke,
		close
	});
	let unregisterRoot;
	try {
		unregisterRoot = registerOpenClawStateDatabaseAsyncResource({ close: async (closedIdentity) => {
			if (!closedIdentity || closedIdentity.key === root.admission.identity.key) await close();
		} });
		reading = runSqliteReadOnlyOperation(options.path, {
			type: "pluginCatalog.read",
			input: {
				agentId: options.agentId,
				pluginIds
			}
		}, {
			source: "canonical",
			expectedIdentity: identity.key,
			env,
			signal: controller.signal
		});
		const catalogs = await reading;
		assertCurrent();
		return catalogs;
	} finally {
		unregisterRoot?.();
		unregisterAgent();
	}
}
//#endregion
export { withPluginModelCatalogPublicationLocks as n, withPluginModelCatalogWorker as r, loadPersistedPluginModelCatalogs as t };
