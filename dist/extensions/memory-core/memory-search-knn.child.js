import { a as ensureSqliteLibrarySelected } from "../../bun-sqlite-library-CYR1RYZS.mjs";
import { l as supportsNodeSqliteExtensionLoading, r as openNodeSqliteDatabase } from "../../node-sqlite-CYaq-2Hb.mjs";
import { t as loadSqliteVecExtension } from "../../sqlite-vec-DjjFDiM4.mjs";
import "../../memory-core-host-engine-knn--De7HW1q.mjs";
import { n as runVectorKnnQuery } from "../../manager-search-knn-BcL6ZfNx.mjs";
//#region extensions/memory-core/src/memory/manager-search-knn.child.ts
const MAX_STDIN_BYTES = 1048576;
const MAX_STDOUT_BYTES = 2097152;
function isChildInput(value) {
	if (!value || typeof value !== "object") return false;
	const input = value;
	return typeof input.databasePath === "string" && input.databasePath.length > 0 && (input.sqliteLibraryPath === void 0 || typeof input.sqliteLibraryPath === "string" && input.sqliteLibraryPath.trim().length > 0) && Boolean(input.request) && typeof input.request === "object";
}
async function run(input) {
	ensureSqliteLibrarySelected({ explicitPath: input.sqliteLibraryPath });
	const extensionLoadingSupported = supportsNodeSqliteExtensionLoading();
	const db = openNodeSqliteDatabase(input.databasePath, {
		allowExtension: extensionLoadingSupported,
		readOnly: true
	});
	try {
		db.exec("PRAGMA query_only = ON; PRAGMA busy_timeout = 5000");
		if (extensionLoadingSupported) {
			if ((await loadSqliteVecExtension({
				db,
				extensionPath: input.extensionPath
			})).ok) return runVectorKnnQuery(db, input.request);
		}
		return {
			rows: [],
			fallbackScanRequired: true
		};
	} finally {
		db.close();
	}
}
function writeResult(result) {
	let payload = Buffer.from(JSON.stringify(result), "utf8");
	if (payload.byteLength > MAX_STDOUT_BYTES) payload = Buffer.from(JSON.stringify({
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
		writeResult({
			status: "ok",
			value: await run(input)
		});
	} catch (error) {
		writeResult({
			status: "failed",
			error: error instanceof Error ? error.message : String(error)
		});
	}
}
//#endregion
export {};
