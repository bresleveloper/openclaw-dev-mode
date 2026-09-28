import { t as ensureSqliteLibrarySelected } from "../../bun-sqlite-library-GOquVAYK.mjs";
import { c as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "../../node-sqlite-BO6jRFcG.mjs";
import { t as loadSqliteVecExtension } from "../../sqlite-vec-BskpG3v_.mjs";
import "../../memory-core-host-engine-knn-Dps9fjJT.mjs";
import { n as runVectorKnnQuery, r as validateVectorKnnRequest } from "../../manager-search-knn-JQGcRJWQ.mjs";
//#region extensions/memory-core/src/memory/manager-search-knn.child.ts
const MAX_STDIN_BYTES = 1048576;
const MAX_STDOUT_BYTES = 2097152;
function isChildInput(value) {
	if (!value || typeof value !== "object") return false;
	const input = value;
	return Number.isSafeInteger(input.id) && typeof input.databasePath === "string" && input.databasePath.length > 0 && (input.sqliteLibraryPath === void 0 || typeof input.sqliteLibraryPath === "string" && input.sqliteLibraryPath.trim().length > 0) && Boolean(input.request) && typeof input.request === "object";
}
async function run(input) {
	validateVectorKnnRequest(input.request);
	ensureSqliteLibrarySelected({ explicitPath: input.sqliteLibraryPath });
	const extensionLoadingSupported = supportsNodeSqliteExtensionLoading();
	const db = openNodeSqliteDatabase(input.databasePath, {
		allowExtension: extensionLoadingSupported,
		readOnly: true
	});
	try {
		db.exec("PRAGMA query_only = ON; PRAGMA busy_timeout = 5000");
		if (!extensionLoadingSupported) return {
			status: "ok",
			value: {
				rows: [],
				fallbackScanRequired: true
			}
		};
		if (!(await loadSqliteVecExtension({
			db,
			extensionPath: input.extensionPath
		})).ok) return {
			status: "ok",
			value: {
				rows: [],
				fallbackScanRequired: true
			}
		};
		return {
			status: "ok",
			value: runVectorKnnQuery(db, input.request)
		};
	} catch (error) {
		return {
			status: "failed",
			error: error instanceof Error ? error.message : String(error)
		};
	} finally {
		db.close();
	}
}
function writeResult(id, result) {
	let payload = Buffer.from(JSON.stringify({
		...result,
		id
	}), "utf8");
	if (payload.byteLength > MAX_STDOUT_BYTES) payload = Buffer.from(JSON.stringify({
		id,
		status: "failed",
		error: "memory vector KNN child result is too large"
	}), "utf8");
	process.stdout.write(Buffer.concat([payload, Buffer.from("\n")]));
}
const chunks = [];
let inputBytes = 0;
for await (const chunk of process.stdin) {
	inputBytes += chunk.byteLength;
	const newline = chunk.indexOf(10);
	if (inputBytes > MAX_STDIN_BYTES + (newline >= 0 ? 1 : 0)) throw new Error("memory vector KNN child input is too large");
	chunks.push(chunk);
	if (newline < 0) continue;
	if (newline !== chunk.length - 1) throw new Error("invalid memory vector KNN child framing");
	const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	chunks.length = 0;
	inputBytes = 0;
	if (!isChildInput(input)) throw new Error("invalid memory vector KNN child input");
	try {
		writeResult(input.id, await run(input));
	} catch (error) {
		writeResult(input.id, {
			status: "failed",
			error: error instanceof Error ? error.message : String(error)
		});
	}
}
//#endregion
export {};
