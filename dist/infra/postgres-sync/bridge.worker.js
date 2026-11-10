import { parentPort, workerData } from "node:worker_threads";
import pg from "pg";
//#region src/infra/postgres-sync/bridge.worker.ts
const { port, signal, url, schema, connectTimeoutMs, lockTimeoutMs, statementTimeoutMs } = workerData;
const control = new Int32Array(signal);
const client = new pg.Client({
	connectionString: url,
	connectionTimeoutMillis: connectTimeoutMs,
	types: { getTypeParser: (oid, format) => (oid === pg.types.builtins.JSON || oid === pg.types.builtins.JSONB) && format !== "binary" ? (value) => value : pg.types.getTypeParser(oid, format) }
});
let connectionError;
client.on("error", (error) => {
	connectionError = error;
});
process.once("exit", () => {
	Atomics.store(control, 1, 1);
	Atomics.notify(control, 1);
});
async function handleRequest(request) {
	let reply;
	try {
		if (request.operation === "connect") {
			await client.connect();
			await client.query("SET synchronous_commit = off");
			await client.query("SELECT set_config('lock_timeout', $1, false), set_config('statement_timeout', $2, false)", [`${lockTimeoutMs}ms`, `${statementTimeoutMs}ms`]);
			await client.query(`SET search_path TO "${schema.replaceAll("\"", "\"\"")}"`);
			reply = {
				id: request.id,
				result: {
					rows: [],
					rowCount: 0,
					fields: []
				}
			};
		} else if (request.operation === "close") {
			await client.end();
			reply = {
				id: request.id,
				result: {
					rows: [],
					rowCount: 0,
					fields: []
				}
			};
		} else {
			if (connectionError) throw connectionError;
			const values = request.parameters.map((value) => ArrayBuffer.isView(value) ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : value);
			const results = await client.query(request.sql, values);
			const result = Array.isArray(results) ? results.at(-1) : results;
			if (!result) throw new Error("PostgreSQL returned no query result");
			reply = {
				id: request.id,
				result: {
					command: result.command,
					rows: result.rows,
					rowCount: result.rowCount ?? 0,
					fields: result.fields.map(({ name, dataTypeID }) => ({
						name,
						dataTypeID
					}))
				}
			};
		}
	} catch (error) {
		const failure = error instanceof Error ? error : new Error(String(error));
		const details = {
			name: failure.name,
			message: failure.message,
			stack: failure.stack
		};
		if (request.operation === "connect" && "code" in failure && typeof failure.code === "string") details.code = failure.code;
		if (error instanceof pg.DatabaseError) Object.assign(details, {
			code: error.code,
			detail: error.detail,
			constraint: error.constraint,
			column: error.column
		});
		reply = {
			id: request.id,
			error: details
		};
	}
	port.postMessage(reply);
	Atomics.store(control, 0, request.id);
	Atomics.notify(control, 0);
	if (request.operation === "close" || request.operation === "connect" && "error" in reply) {
		port.close();
		parentPort?.close();
	}
}
port.on("message", (request) => {
	handleRequest(request);
});
//#endregion
export {};
