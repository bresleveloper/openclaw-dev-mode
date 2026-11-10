import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
//#region src/state/claw-adoption.worker.ts
const clawAdoptionOperations = {
	"clawAdoption.mcp": (input, context) => context.write(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_mcp_server_refs").set({
			independent_owner: 1,
			updated_at_ms: input.nowMs
		}).where("name", "=", input.name).where("independent_owner", "!=", 1));
		return Number(result.numAffectedRows);
	}),
	"clawAdoption.package": (input, context) => context.write(({ db }) => {
		const { artifact, nowMs } = input;
		const kysely = getNodeSqliteKysely(db);
		let query = kysely.updateTable("claw_package_refs").set({
			independent_owner: 1,
			updated_at_ms: nowMs
		}).where("package_kind", "=", artifact.kind).where("package_source", "=", artifact.source).where("package_ref", "=", artifact.ref).where("independent_owner", "!=", 1);
		if (artifact.version) query = query.where("package_version", "=", artifact.version);
		if (artifact.kind === "skill") query = query.where("agent_id", "in", kysely.selectFrom("claw_installs").select("agent_id").where("workspace", "=", artifact.workspace ?? ""));
		return Number(executeSqliteQuerySync(db, query).numAffectedRows);
	})
};
//#endregion
export { clawAdoptionOperations };
