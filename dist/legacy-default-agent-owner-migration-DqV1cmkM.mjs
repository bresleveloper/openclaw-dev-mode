import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./errors-DnjwnOju.mjs";
import { v as writeTextAtomic } from "./json-files-C0HSMh2Z.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { s as materializeCronRowAgentOwners } from "./row-codec-mXerryYi.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cron/legacy-default-agent-owner-migration.ts
async function materializeLegacyJsonOwners(storePath, agentId) {
	let raw;
	try {
		raw = await fs.readFile(storePath, "utf8");
	} catch (error) {
		if (isMissingPathError(error)) return 0;
		throw error;
	}
	const parsed = parseJsonWithJson5Fallback(raw);
	const jobs = Array.isArray(parsed) ? parsed : isRecord(parsed) && Array.isArray(parsed.jobs) ? parsed.jobs : [];
	let rewritten = 0;
	for (const job of jobs) {
		if (!isRecord(job) || normalizeOptionalString(job.agentId) || parseAgentSessionKey(normalizeOptionalString(job.sessionKey))?.agentId) continue;
		job.agentId = agentId;
		rewritten += 1;
	}
	if (rewritten === 0) return 0;
	await writeTextAtomic(storePath, JSON.stringify(parsed, null, 2), {
		mode: 384,
		tempPrefix: path.basename(storePath),
		trailingNewline: true,
		beforeRename: async () => {
			if (await fs.readFile(storePath, "utf8") !== raw) throw new Error("legacy cron source changed while assigning its retained owner");
		}
	});
	return rewritten;
}
async function materializeLegacyDefaultCronJobOwners(params) {
	const agentId = normalizeAgentId(params.legacyDefaultAgentId);
	const storePath = path.resolve(params.storePath);
	return runOpenClawStateWriteTransaction(({ db }) => materializeCronRowAgentOwners(db, cronStoreKey(storePath), agentId), { env: params.env }, { operationLabel: "cron.legacy-default-owner" }) + await materializeLegacyJsonOwners(storePath, agentId);
}
//#endregion
export { materializeLegacyDefaultCronJobOwners as t };
