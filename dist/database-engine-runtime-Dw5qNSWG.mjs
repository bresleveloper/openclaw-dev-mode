import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { s as observeDatabaseRequest } from "./open-L_IbZFu2.mjs";
import { a as isSqliteWorkerStoreAvailable, c as openSqliteWorkerStore, d as runSqliteWorkerStoreOperation, f as runSqliteWorkerStoreWrite } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import "./config-Df1l-yPz.mjs";
import { deserialize, serialize } from "node:v8";
//#region src/infra/database-engine/worker-store.ts
function observeScope(scope, input) {
	return { execute: (command, options) => observeDatabaseRequest(input ? "postgres" : "sqlite", () => scope.execute(command, options)) };
}
var EngineWorkerStore = class {
	constructor(options, input, store) {
		this.options = options;
		this.input = input;
		this.store = store;
		this.closed = false;
	}
	async current() {
		if (this.closed) throw new SqliteWorkerError("Database engine store is closed", "closed");
		if (!isSqliteWorkerStoreAvailable(this.store)) {
			this.reopening ??= (async () => {
				await this.store.close();
				this.store = await observeDatabaseRequest(this.input ? "postgres" : "sqlite", () => openSqliteWorkerStore(this.options));
			})().finally(() => {
				this.reopening = void 0;
			});
			await this.reopening;
			if (this.closed) throw new SqliteWorkerError("Database engine store is closed", "closed");
		}
		return this.store;
	}
	async execute(command, options) {
		if (!this.closed && isSqliteWorkerStoreAvailable(this.store)) return observeScope(this.store, this.input).execute(command, options);
		const payload = serialize(command);
		const store = await this.current();
		const captured = deserialize(payload);
		return observeScope(store, this.input).execute(captured, options);
	}
	close() {
		this.closed = true;
		this.closing ??= (async () => {
			await this.reopening?.catch(() => void 0);
			await observeDatabaseRequest(this.input ? "postgres" : "sqlite", () => this.store.close());
		})().catch((error) => {
			this.closing = void 0;
			throw error;
		});
		return this.closing;
	}
};
async function openEngineWorkerStore(options, input) {
	const captured = {
		...options,
		moduleUrl: new URL(options.moduleUrl),
		input: deserialize(serialize(options.input))
	};
	return new EngineWorkerStore(captured, input, await observeDatabaseRequest(input ? "postgres" : "sqlite", () => openSqliteWorkerStore(captured)));
}
/** The selected adapter owns the host admission envelope, not a store facade. */
async function runEngineStoreOperation(store, input, writes, operation, assertCurrent, databasePath) {
	const current = store instanceof EngineWorkerStore ? await store.current() : store;
	const observed = (scope) => operation(observeScope(scope, input));
	if (input && writes) return runSqliteWorkerStoreWrite(current, observed, assertCurrent ?? (() => {}), [databasePath]);
	return assertCurrent ? runSqliteWorkerStoreOperation(current, observed, void 0, assertCurrent) : observed(current);
}
//#endregion
export { runEngineStoreOperation as n, openEngineWorkerStore as t };
