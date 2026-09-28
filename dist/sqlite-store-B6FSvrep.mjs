import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { c as openSqliteWorkerStore, d as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-H5HXDD9v.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import { n as unwrapWorkboardSqliteResult } from "./sqlite-store-errors-fETz-1pd.mjs";
import { t as resolveWorkboardSqlitePath } from "./sqlite-store-paths-DMRV7j8G.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/workboard/src/sqlite-store.ts
function createWorkboardSqliteStores(options) {
	const databasePath = path.resolve(options.dbPath ?? resolveWorkboardSqlitePath(options.env));
	const worker = openSqliteWorkerStore({
		moduleUrl: options.workerModuleUrl,
		databasePath,
		input: void 0
	});
	let ownedConnection;
	let brokerClosed = false;
	let brokerCleanup = false;
	let sealed = false;
	let openingFailure;
	let closing;
	const operations = /* @__PURE__ */ new Set();
	const writeAuthority = new AsyncLocalStorage();
	async function cleanup() {
		const store = await worker.catch(() => void 0);
		if (!store) return;
		if (ownedConnection !== void 0 && !brokerCleanup) {
			const result = await store.execute({
				type: "connection.close",
				input: { connection: ownedConnection }
			}).catch((error) => {
				const code = extractErrorCode(error);
				if (code === "closed" || code === "unavailable" || code === "outcome-unknown") {
					brokerCleanup = true;
					return;
				}
				throw error;
			});
			if (result !== void 0) {
				unwrapWorkboardSqliteResult(result);
				ownedConnection = void 0;
			}
		}
		if (!brokerClosed) {
			await store.close();
			brokerClosed = true;
			ownedConnection = void 0;
		}
	}
	const opened = worker.then(async (store) => {
		const result = await store.execute({
			type: "connection.open",
			input: void 0
		});
		if (result.ok) {
			ownedConnection = result.value.connection;
			return result.value;
		}
		ownedConnection = result.failure.cleanupConnection;
		return unwrapWorkboardSqliteResult(result);
	}).catch(async (error) => {
		openingFailure = { error };
		sealed = true;
		if (ownedConnection === void 0) try {
			await cleanup();
		} catch {}
		throw error;
	});
	const ready = opened.then((value) => value.dataVersion);
	ready.catch(() => {});
	async function execute(type, input, writes = false) {
		const authority = writes ? writeAuthority.getStore() : void 0;
		const store = await worker;
		if (!authority) return unwrapWorkboardSqliteResult(await store.execute({
			type,
			input
		}));
		const result = unwrapWorkboardSqliteResult(await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type,
			input
		}), void 0, () => {
			if (!authority.active) throw new Error("Workboard mutation authority has settled.");
			authority.assertCurrent?.();
		}));
		if (result !== false && result !== "conflict" && result !== "owner_busy") authority.assertCurrent = void 0;
		return result;
	}
	async function run(args, operation) {
		if (openingFailure) throw openingFailure.error;
		if (sealed) throw new Error("Workboard SQLite connection is closed.");
		const captured = structuredClone(args);
		const pending = opened.then(({ connection }) => operation(connection, captured));
		operations.add(pending);
		try {
			return await pending;
		} finally {
			operations.delete(pending);
		}
	}
	return {
		async runWithWriteAuthority(assertCurrent, operation) {
			const authority = {
				active: true,
				assertCurrent
			};
			try {
				return await writeAuthority.run(authority, operation);
			} finally {
				authority.active = false;
			}
		},
		ready,
		dataVersion: () => run(void 0, (connection) => execute("dataVersion", { connection })),
		cards: {
			register: (...args) => run(args, (connection, captured) => execute("cards.register", {
				connection,
				args: captured
			}, true)),
			registerIfAbsent: (...args) => run(args, (connection, captured) => execute("cards.registerIfAbsent", {
				connection,
				args: captured
			}, true)),
			registerIfUpdatedAt: (...args) => run(args, (connection, captured) => execute("cards.registerIfUpdatedAt", {
				connection,
				args: captured
			}, true)),
			claimIfOwnerAvailable: (...args) => run(args, (connection, captured) => execute("cards.claimIfOwnerAvailable", {
				connection,
				args: captured
			}, true)),
			deleteIfUpdatedAt: (...args) => run(args, (connection, captured) => execute("cards.deleteIfUpdatedAt", {
				connection,
				args: captured
			}, true)),
			lookup: (...args) => run(args, (connection, captured) => execute("cards.lookup", {
				connection,
				args: captured
			})),
			delete: (...args) => run(args, (connection, captured) => execute("cards.delete", {
				connection,
				args: captured
			}, true)),
			entries: (...args) => run(args, (connection, captured) => execute("cards.entries", {
				connection,
				args: captured
			})),
			listCardStatuses: (...args) => run(args, (connection, captured) => execute("cards.listCardStatuses", {
				connection,
				args: captured
			})),
			listBoardAggregates: (...args) => run(args, (connection, captured) => execute("cards.listBoardAggregates", {
				connection,
				args: captured
			})),
			listStatsAggregates: (...args) => run(args, (connection, captured) => execute("cards.listStatsAggregates", {
				connection,
				args: captured
			})),
			hasCards: (...args) => run(args, (connection, captured) => execute("cards.hasCards", {
				connection,
				args: captured
			}))
		},
		boards: {
			register: (...args) => run(args, (connection, captured) => execute("boards.register", {
				connection,
				args: captured
			}, true)),
			lookup: (...args) => run(args, (connection, captured) => execute("boards.lookup", {
				connection,
				args: captured
			})),
			delete: (...args) => run(args, (connection, captured) => execute("boards.delete", {
				connection,
				args: captured
			}, true)),
			entries: (...args) => run(args, (connection, captured) => execute("boards.entries", {
				connection,
				args: captured
			}))
		},
		subscriptions: {
			register: (...args) => run(args, (connection, captured) => execute("subscriptions.register", {
				connection,
				args: captured
			}, true)),
			lookup: (...args) => run(args, (connection, captured) => execute("subscriptions.lookup", {
				connection,
				args: captured
			})),
			delete: (...args) => run(args, (connection, captured) => execute("subscriptions.delete", {
				connection,
				args: captured
			}, true)),
			entries: (...args) => run(args, (connection, captured) => execute("subscriptions.entries", {
				connection,
				args: captured
			}))
		},
		attachments: {
			register: (...args) => run(args, (connection, captured) => execute("attachments.register", {
				connection,
				args: captured
			}, true)),
			lookup: (...args) => run(args, (connection, captured) => execute("attachments.lookup", {
				connection,
				args: captured
			})),
			delete: (...args) => run(args, (connection, captured) => execute("attachments.delete", {
				connection,
				args: captured
			}, true)),
			entries: (...args) => run(args, (connection, captured) => execute("attachments.entries", {
				connection,
				args: captured
			}))
		},
		close() {
			sealed = true;
			closing ??= Promise.resolve().then(async () => {
				while (operations.size) await Promise.allSettled(operations);
				await opened.catch(() => void 0);
				await cleanup();
			}).catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
}
//#endregion
export { createWorkboardSqliteStores as t };
