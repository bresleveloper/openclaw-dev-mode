import { loadLanceDbModule } from "./lancedb-runtime.js";
import { MEMORY_TABLE_NAME, hasAgentScopeColumn, legacyMemorySchemaError, memoryAgentPredicate, quoteLanceSqlString } from "./lancedb-schema.js";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { Field, FixedSizeList, Float32, Float64, Schema, Utf8 } from "apache-arrow";
//#region extensions/memory-lancedb/lancedb-store.ts
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TABLE_INITIALIZATION_ATTEMPTS = 3;
const MEMORY_QUERY_COLUMNS = [
	"id",
	"text",
	"importance",
	"category",
	"createdAt"
];
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
async function openOrCreateMemoryTable(db, vectorDim) {
	let lastError;
	for (let attempt = 1; attempt <= TABLE_INITIALIZATION_ATTEMPTS; attempt += 1) {
		let table = null;
		try {
			table = (await db.tableNames()).includes("memories") ? await db.openTable(MEMORY_TABLE_NAME) : await db.createEmptyTable(MEMORY_TABLE_NAME, createMemoryTableSchema(vectorDim), { existOk: true });
			await table.schema();
			return table;
		} catch (error) {
			table?.close();
			lastError = error;
			if (attempt < TABLE_INITIALIZATION_ATTEMPTS) await setTimeout(attempt * 10);
		}
	}
	throw lastError;
}
function formatQueryFilter(filter) {
	if (filter.operator === "LIKE" && typeof filter.value !== "string") throw new Error("LIKE requires a string memory filter value");
	if (typeof filter.value === "number" && !Number.isFinite(filter.value)) throw new Error("Memory filter number must be finite");
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
		const lancedb = await loadLanceDbModule();
		const connectionOptions = this.storageOptions ? { storageOptions: this.storageOptions } : {};
		const db = await lancedb.connect(this.dbPath, connectionOptions);
		let table = null;
		try {
			table = await openOrCreateMemoryTable(db, this.vectorDim);
			if (!hasAgentScopeColumn(await table.schema())) throw legacyMemorySchemaError();
			this.db = db;
			this.table = table;
		} catch (error) {
			table?.close();
			db.close();
			throw error;
		}
	}
	async store(agentId, entry) {
		await this.ensureInitialized();
		const fullEntry = {
			...entry,
			id: randomUUID(),
			createdAt: Date.now()
		};
		const storedEntry = {
			...fullEntry,
			agentId
		};
		await this.table.add([storedEntry]);
		return fullEntry;
	}
	async search(agentId, vector, limit = 5, minScore = .5, executionOptions) {
		await this.ensureInitialized();
		return (await this.table.vectorSearch(vector).where(memoryAgentPredicate(agentId)).limit(limit).toArray(executionOptions)).map((row) => {
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
		await this.ensureInitialized();
		let query = this.table.query().where(memoryAgentPredicate(agentId)).select([
			"id",
			"text",
			"importance",
			"category",
			"createdAt"
		]);
		if (!options.orderByCreatedAt && limit !== void 0) query = query.limit(limit);
		const entries = (await query.toArray()).map((row) => ({
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
		await this.ensureInitialized();
		let query = this.table.query().where(scopedPredicate(agentId, options.filter)).select(options.columns);
		if (options.limit !== void 0) query = query.limit(options.limit);
		return await query.toArray();
	}
	async delete(agentId, id) {
		await this.ensureInitialized();
		if (!UUID_PATTERN.test(id)) throw new Error(`Invalid memory ID format: ${id}`);
		const predicate = scopedPredicate(agentId, {
			column: "id",
			operator: "=",
			value: id
		});
		return (await this.table.delete(predicate)).numDeletedRows > 0;
	}
	async count(agentId) {
		await this.ensureInitialized();
		return await this.table.countRows(memoryAgentPredicate(agentId));
	}
	close() {
		this.table?.close();
		this.db?.close();
		this.table = null;
		this.db = null;
		this.initPromise = null;
	}
};
//#endregion
export { MEMORY_QUERY_COLUMNS, MemoryDB };
