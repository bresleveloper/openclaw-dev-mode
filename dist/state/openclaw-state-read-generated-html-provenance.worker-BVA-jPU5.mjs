import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-chunk-items-2QWieLm-.mjs";
//#region src/media/generated-html-provenance.worker.ts
const generatedHtmlProvenanceReadOperations = {
	"generatedHtmlProvenance.read": (realpath, db) => {
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("outbound_media_provenance").select([
			"kind",
			"version",
			"sha256",
			"size_bytes"
		]).where("realpath", "=", realpath));
		return {
			type: "generatedHtmlProvenance.read",
			marker: row?.kind === "trusted-generated-html" && row.version === 1 ? {
				sha256: row.sha256,
				size: row.size_bytes
			} : void 0
		};
	},
	"generatedHtmlProvenance.list": (_input, db) => ({
		type: "generatedHtmlProvenance.list",
		rows: executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("outbound_media_provenance").selectAll()).rows
	})
};
//#endregion
export { generatedHtmlProvenanceReadOperations };
