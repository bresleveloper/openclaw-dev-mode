import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { s as withExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-worker-state-context.ts
function captureSqliteWorkerStateContext(context) {
	return {
		environment: { ...context.environment },
		...context.initializationEnvironment ? { initializationEnvironment: { ...context.initializationEnvironment } } : {},
		...context.initializationAgentPaths ? { initializationAgentPaths: [...context.initializationAgentPaths] } : {},
		existingSchemaPath: context.existingSchemaPath,
		scheduledMaintenanceSuspension: context.scheduledMaintenanceSuspension
	};
}
/** Charge captured initialization facts together with the request bytes retained by admission. */
function sqliteWorkerRequestBytes(input, context, preparation) {
	const agentPathBytes = context?.initializationAgentPaths?.reduce((bytes, agentPath) => bytes + Buffer.byteLength(agentPath, "utf8"), 0) ?? 0;
	return [context?.environment, context?.initializationEnvironment].reduce((bytes, environment) => Object.entries(environment ?? {}).reduce((total, [key, value]) => total + Buffer.byteLength(key, "utf8") + Buffer.byteLength(value ?? "", "utf8"), bytes), input.byteLength + (preparation?.byteLength ?? 0) + agentPathBytes + (context?.scheduledMaintenanceSuspension?.byteLength ?? 0));
}
const stateContexts = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerStateContext"), () => new AsyncLocalStorage());
/** Keep the actor's live maintenance holds after the opening command returns. */
function captureSqliteWorkerWalMaintenanceSuspension() {
	const buffer = stateContexts.getStore()?.scheduledMaintenanceSuspension;
	if (!buffer) return;
	const holds = new Int32Array(buffer);
	return () => Atomics.load(holds, 0) > 0;
}
/** Preserve factory facts across later commands without changing their captured host context. */
function withSqliteWorkerExistingDatabase(databasePath, identity, operation) {
	return stateContexts.run({
		...getSqliteWorkerStateContext(),
		existingDatabase: {
			databasePath,
			identity
		}
	}, operation);
}
/** Only cold writable opens need this factory's prior-existence constraint. */
function getSqliteWorkerExistingDatabaseIdentity(databasePath) {
	const existing = stateContexts.getStore()?.existingDatabase;
	return existing?.databasePath === databasePath ? existing.identity : void 0;
}
function runWithSqliteWorkerStateContext(context, operation) {
	return stateContexts.run(context, () => context.existingSchemaPath === void 0 ? operation() : withExistingOpenClawStateSchema({ path: context.existingSchemaPath }, operation));
}
function getSqliteWorkerStateContext() {
	const context = stateContexts.getStore();
	if (!context) throw new Error("Shared-state SQLite requires captured host context");
	return context;
}
//#endregion
export { runWithSqliteWorkerStateContext as a, getSqliteWorkerStateContext as i, captureSqliteWorkerWalMaintenanceSuspension as n, sqliteWorkerRequestBytes as o, getSqliteWorkerExistingDatabaseIdentity as r, withSqliteWorkerExistingDatabase as s, captureSqliteWorkerStateContext as t };
