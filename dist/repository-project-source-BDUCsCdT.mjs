import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { t as MANAGED_GITHUB_PROFILE_ID_PATTERN } from "./github-identity-profile-id-BJzGq1wi.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D7qGDgRK.mjs";
//#region src/gateway/worker-environments/repository-project-source.schema.ts
const AgentId = string().min(1).max(64).refine((value) => {
	const normalized = normalizeAgentIdStrict(value);
	return normalized.ok && normalized.value === value;
});
const AccountId = number().int().positive().max(Number.MAX_SAFE_INTEGER);
const Identity = discriminatedUnion("source", [
	object({ source: literal("anonymous") }).strict(),
	object({
		source: literal("system-detected"),
		accountId: AccountId
	}).strict(),
	object({
		source: _enum(["system-configured", "agent-override"]),
		profileId: string().regex(MANAGED_GITHUB_PROFILE_ID_PATTERN),
		accountId: AccountId
	}).strict()
]);
const Agent = object({
	agentId: AgentId,
	provenance: object({
		agentId: AgentId,
		createdVia: _enum([
			"operator",
			"agent",
			"claw"
		]),
		creatorAgentId: AgentId.nullable(),
		createdAtMs: number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
	}).strict().nullable()
}).strict().refine((value) => value.provenance === null || value.provenance.agentId === value.agentId);
const RepositoryWorkerProjectSchema = object({
	key: string().regex(/^[a-f0-9]{64}$/u),
	baseCommit: string().regex(/^[a-f0-9]{40}$/u),
	source: object({
		kind: literal("repository"),
		url: string().max(2048),
		repositoryId: string().min(1).max(256).regex(/^[A-Za-z0-9_+/=-]+$/u),
		owner: object({
			agent: Agent,
			identity: Identity
		}).strict()
	}).strict()
});
//#endregion
//#region src/gateway/worker-environments/repository-project-source.ts
/** Repository facts persist; current visibility and access remain admission checks. */
function readRepositoryWorkerProjectSnapshot(value) {
	if (!isRecord(value) || value.source === void 0) return;
	const parsed = RepositoryWorkerProjectSchema.safeParse(value);
	const source = parsed.success ? parsed.data.source : void 0;
	const githubHost = source && URL.canParse(source.url) ? new URL(source.url).hostname.toLowerCase() : void 0;
	if (Object.keys(value).some((key) => ![
		"key",
		"baseCommit",
		"source",
		"preparation"
	].includes(key)) || !parsed.success || !githubHost || parseProjectGitUrl(parsed.data.source.url, githubHost)?.url !== parsed.data.source.url) throw new Error("Worker environment has an invalid repository preparation snapshot");
	return parsed.data;
}
//#endregion
export { readRepositoryWorkerProjectSnapshot as t };
