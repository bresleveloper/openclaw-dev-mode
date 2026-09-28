import { t as containsAsciiControlCharacter } from "./string-normalization-_gRhJUDw.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Pn as number, or as union, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
//#region src/boards/github-actions-capability.ts
const GITHUB_ACTIONS_BINDING_ID = "github.actions.runs";
const GITHUB_ACTIONS_GRANT_PREFIX = `${GITHUB_ACTIONS_BINDING_ID}:`;
const GITHUB_ACTIONS_AUTHOR_GUIDANCE = "With a usable connected agent GitHub identity: await openclaw.data.read(\"github.actions.runs\",{repository:\"owner/repo\",perPage:20}); grant capabilities.tools:[\"github.actions.runs:owner/repo\"]. Uses the agent GitHub identity and cached server reads; direct fetch(api.github.com) is anonymous and rate limited. Identity is checked before save; reconnect in Settings if unavailable. Optional workflow (ID/filename), branch, status, created (ISO day/comparison/range), excludePullRequests=true (omits PR objects); perPage 1..30. Shares private Actions metadata with the widget/session audience; never preview or My GitHub auth. No netOrigins needed.";
const repositorySchema = string().regex(/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]{1,100}$/u).refine((value) => ![".", ".."].includes(value.split("/")[1])).transform((value) => value.toLowerCase());
const day = "\\d{4}-\\d{2}-\\d{2}";
const createdSchema = string().regex(new RegExp(`^(?:[<>]=?)?${day}$|^${day}\\.\\.${day}$`, "u")).refine((value) => (value.match(/\d{4}-\d{2}-\d{2}/gu) ?? []).every((date) => {
	const parsed = /* @__PURE__ */ new Date(`${date}T00:00:00Z`);
	return Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(date);
}));
const paramsSchema = strictObject({
	repository: repositorySchema,
	workflow: union([number().int().positive().max(Number.MAX_SAFE_INTEGER), string().max(255).regex(/^(?:[1-9]\d*|[A-Za-z0-9_.-]+\.ya?ml)$/u).refine((value) => !/^\d+$/u.test(value) || Number.isSafeInteger(Number(value)))]).optional(),
	perPage: number().int().min(1).max(30).default(20),
	branch: string().min(1).max(255).refine((value) => !containsAsciiControlCharacter(value)).optional(),
	status: _enum([
		"completed",
		"action_required",
		"cancelled",
		"failure",
		"neutral",
		"skipped",
		"stale",
		"success",
		"timed_out",
		"in_progress",
		"queued",
		"requested",
		"waiting",
		"pending"
	]).optional(),
	created: createdSchema.optional(),
	excludePullRequests: boolean().default(true)
});
function normalizeGitHubActionsGrant(tool) {
	if (!tool.startsWith(GITHUB_ACTIONS_GRANT_PREFIX)) return tool;
	const parsed = repositorySchema.safeParse(tool.slice(GITHUB_ACTIONS_GRANT_PREFIX.length));
	if (!parsed.success) throw new BoardValidationError("invalid_operation", "GitHub Actions grant requires owner/repo");
	return `${GITHUB_ACTIONS_GRANT_PREFIX}${parsed.data}`;
}
/** The same closed contract owns URL construction and the exact repository grant. */
function resolveGitHubActionsRequest(params) {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) throw new BoardValidationError("invalid_operation", "Invalid GitHub Actions parameters: use repository (owner/repo), workflow, perPage (1..30), branch, status, created, or excludePullRequests only");
	const input = parsed.data;
	const repositoryPath = input.repository.split("/").map(encodeURIComponent).join("/");
	const operation = input.workflow === void 0 ? "runs" : `workflows/${encodeURIComponent(String(input.workflow))}/runs`;
	const url = new URL(`https://api.github.com/repos/${repositoryPath}/actions/${operation}`);
	url.searchParams.set("per_page", String(input.perPage));
	url.searchParams.set("exclude_pull_requests", String(input.excludePullRequests));
	for (const field of [
		"branch",
		"status",
		"created"
	]) if (input[field] !== void 0) url.searchParams.set(field, input[field]);
	return {
		...input,
		url: url.href,
		capability: `${GITHUB_ACTIONS_GRANT_PREFIX}${input.repository}`
	};
}
//#endregion
export { resolveGitHubActionsRequest as a, normalizeGitHubActionsGrant as i, GITHUB_ACTIONS_BINDING_ID as n, GITHUB_ACTIONS_GRANT_PREFIX as r, GITHUB_ACTIONS_AUTHOR_GUIDANCE as t };
