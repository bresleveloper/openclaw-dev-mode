import { n as withExclusiveMemoryTable, t as acquireMemoryTableUsage } from "./lancedb-custody-BXEYogVG.mjs";
import { t as loadLanceDbModule } from "./lancedb-runtime-DsU7C05g.mjs";
import { a as legacyMemorySchemaError, i as hasAgentScopeColumn, n as MEMORY_QUERY_COLUMNS, o as memoryAgentPredicate, r as MEMORY_TABLE_NAME, s as quoteLanceSqlString } from "./lancedb-schema-Cn7oifJZ.mjs";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
// extensions/memory-lancedb/lancedb-store.ts
const { Field, FixedSizeList, Float32, Float64, Schema, Utf8 } = createRequire(import.meta.url)("apache-arrow");
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function createMemoryTableSchema(vectorDim) {
	return new Schema([
		new Field("id", new Utf8(), true),
		new Field("text", new Utf8(), true),
		new Field("vector", new FixedSizeList(vectorDim, new Field("item", new Float32(), true)), true),
		new Field("importance", new Float64(), true),
		new Field("category", new Utf8(), true),
		new Field("createdAt", new Float64(), true),
		new Field("agentId", new Utf8(), true)
	]);
}
function formatQueryFilter(filter) {
	const value = typeof filter.value === "string" ? quoteLanceSqlString(filter.value) : String(filter.value);
	return `${filter.column} ${filter.operator} ${value}`;
}
function scopedPredicate(agentId, filter) {
	const scope = memoryAgentPredicate(agentId);
	return filter ? `(${scope}) AND (${formatQueryFilter(filter)})` : scope;
}
var MemoryDB = class {
	constructor(dbPath, vectorDim, storageOptions) {
		this.dbPath = dbPath;
		this.vectorDim = vectorDim;
		this.storageOptions = storageOptions;
		this.db = null;
		this.table = null;
		this.initPromise = null;
		this.usage = null;
		this.closing = null;
		this.closed = false;
		this.pending = /* @__PURE__ */ new Set();
	}
	start() {
		if (this.closing) throw new Error("Memory database is still closing");
		this.closed = false;
	}
	async runOperation(run) {
		if (this.closed) throw new Error("Memory database is closed; restart the memory service before using it.");
		const operation = run();
		this.pending.add(operation);
		try {
			return await operation;
		} finally {
			this.pending.delete(operation);
		}
	}
	useTable(run) {
		return this.runOperation(async () => {
			await this.ensureInitialized();
			return await run(this.table);
		});
	}
	async ensureInitialized() {
		if (this.table) {
			await this.table.checkoutLatest();
			return;
		}
		if (this.initPromise) return await this.initPromise;
		this.initPromise = this.doInitialize().catch((error) => {
			this.initPromise = null;
			throw error;
		});
		return await this.initPromise;
	}
	async doInitialize() {
		const usage = await acquireMemoryTableUsage(this.dbPath);
		let db = null;
		let table = null;
		try {
			db = await (await loadLanceDbModule()).connect(this.dbPath, { storageOptions: this.storageOptions });
			table = (await db.tableNames()).includes("memories") ? await db.openTable(MEMORY_TABLE_NAME) : await db.createEmptyTable(MEMORY_TABLE_NAME, createMemoryTableSchema(this.vectorDim), { existOk: true });
			if (!hasAgentScopeColumn(await table.schema())) throw legacyMemorySchemaError();
			this.db = db;
			this.table = table;
			this.usage = usage;
		} catch (error) {
			table?.close();
			db?.close();
			await usage?.release();
			throw error;
		}
	}
	async store(agentId, entry) {
		return await this.useTable(async (table) => {
			const fullEntry = {
				...entry,
				id: randomUUID(),
				createdAt: Date.now()
			};
			const storedEntry = {
				...fullEntry,
				agentId
			};
			await table.add([storedEntry]);
			return fullEntry;
		});
	}
	async search(agentId, vector, limit = 5, minScore = .5, options) {
		return (await this.useTable((table) => {
			options?.beforeRead?.();
			return table.vectorSearch(vector).where(memoryAgentPredicate(agentId)).limit(limit).toArray(options?.timeoutMs === void 0 ? void 0 : { timeoutMs: options.timeoutMs });
		})).map((row) => {
			const score = 1 / (1 + (row["_distance"] ?? 0));
			return {
				entry: {
					id: row.id,
					text: row.text,
					vector: row.vector,
					importance: row.importance,
					category: row.category,
					createdAt: row.createdAt
				},
				score
			};
		}).filter((result) => result.score >= minScore);
	}
	async list(agentId, limit, options = {}) {
		const entries = (await this.query(agentId, {
			columns: [...MEMORY_QUERY_COLUMNS],
			limit: options.orderByCreatedAt ? void 0 : limit
		})).map((row) => ({
			id: row.id,
			text: row.text,
			importance: row.importance,
			category: row.category,
			createdAt: row.createdAt
		}));
		if (options.orderByCreatedAt) entries.sort((a, b) => b.createdAt - a.createdAt);
		return limit === void 0 ? entries : entries.slice(0, limit);
	}
	async query(agentId, options) {
		return await this.useTable(async (table) => {
			options.beforeRead?.();
			let query = table.query().where(scopedPredicate(agentId, options.filter)).select(options.columns);
			if (options.limit !== void 0) query = query.limit(options.limit);
			return await query.toArray();
		});
	}
	async delete(agentId, id) {
		if (!UUID_PATTERN.test(id)) throw new Error(`Invalid memory ID format: ${id}`);
		const predicate = scopedPredicate(agentId, {
			column: "id",
			operator: "=",
			value: id
		});
		return (await this.useTable((table) => table.delete(predicate))).numDeletedRows > 0;
	}
	async optimize(assertCurrent = () => {}) {
		return await this.runOperation(() => withExclusiveMemoryTable(this.dbPath, async () => {
			const connection = await (await loadLanceDbModule()).connect(this.dbPath, { storageOptions: this.storageOptions });
			let table = null;
			try {
				assertCurrent();
				if (!(await connection.tableNames()).includes("memories")) return {
					before: {
						rows: 0,
						fragments: 0
					},
					after: {
						rows: 0,
						fragments: 0
					}
				};
				table = await connection.openTable(MEMORY_TABLE_NAME);
				const before = await table.stats();
				assertCurrent();
				await table.optimize({
					cleanupOlderThan: /* @__PURE__ */ new Date(0),
					deleteUnverified: false
				});
				const after = await table.stats();
				if (after.numRows !== before.numRows) throw new Error(`Memory row count changed during optimization: ${before.numRows} -> ${after.numRows}`);
				return {
					before: {
						rows: before.numRows,
						fragments: before.fragmentStats.numFragments
					},
					after: {
						rows: after.numRows,
						fragments: after.fragmentStats.numFragments
					}
				};
			} finally {
				table?.close();
				connection.close();
			}
		}));
	}
	close() {
		this.closed = true;
		this.closing ??= (async () => {
			await Promise.allSettled(this.pending);
			this.table?.close();
			this.db?.close();
			this.table = null;
			this.db = null;
			this.initPromise = null;
			await this.usage?.release();
			this.usage = null;
		})().finally(() => {
			this.closing = null;
		});
		return this.closing;
	}
};
export { MemoryDB as t };
