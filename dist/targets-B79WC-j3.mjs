import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/github/src/targets.ts
function isValidOwner(value) {
	return /^(?=.{1,39}$)[a-z\d](?:[a-z\d-]*[a-z\d])?$/iu.test(value);
}
function isValidRepo(value) {
	if (value.length < 1 || value.length > 100) return false;
	const lower = value.toLowerCase();
	if (!/^[a-z\d._-]+$/iu.test(value) || lower === "." || lower === "..") return false;
	return !lower.endsWith(".git") && !lower.endsWith(".atom");
}
function parseGitHubTarget(value) {
	if (!isRecord(value)) return null;
	const kind = value.kind;
	const owner = typeof value.owner === "string" ? value.owner.trim() : "";
	const repo = typeof value.repo === "string" ? value.repo.trim() : "";
	if (!isValidOwner(owner) || !isValidRepo(repo) || value.agentId !== void 0 && (typeof value.agentId !== "string" || !value.agentId.trim())) return null;
	if (kind === "commit") {
		const sha = value.sha;
		return value.number === void 0 && typeof sha === "string" && /^[a-f\d]{7,40}$/iu.test(sha) ? {
			kind,
			owner,
			repo,
			sha: sha.toLowerCase()
		} : null;
	}
	const number = value.number;
	if (kind !== "issue" && kind !== "pull" || value.sha !== void 0 || typeof number !== "number" || !Number.isSafeInteger(number) || number < 1 || number > 9999999999) return null;
	return {
		kind,
		number,
		owner,
		repo
	};
}
function parseGitHubItemTarget(value) {
	const target = parseGitHubTarget(value);
	return target && target.kind !== "commit" ? target : null;
}
const GITHUB_ITEM_PATH_PATTERN = "^/[^/]+/[^/]+/(?:issues/[1-9][0-9]{0,9}|pull/[1-9][0-9]{0,9}(?:/files)?)/?$";
const GITHUB_COMMIT_PATH_PATTERN = "^/[^/]+/[^/]+/commit/[a-fA-F0-9]{7,40}/?$";
const GITHUB_LINK_PATH = /* @__PURE__ */ new RegExp("^/[^/]+/[^/]+/(?:issues/[1-9][0-9]{0,9}|pull/[1-9][0-9]{0,9}(?:/files)?)/?$|^/[^/]+/[^/]+/commit/[a-fA-F0-9]{7,40}/?$", "u");
function parseGitHubLinkParams(value) {
	if (!isRecord(value) || typeof value.url !== "string" || value.url.length > 4096 || value.refresh !== void 0 && typeof value.refresh !== "boolean" || value.agentId !== void 0 && (typeof value.agentId !== "string" || !value.agentId.trim())) return null;
	try {
		const url = new URL(value.url);
		if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || !GITHUB_LINK_PATH.test(url.pathname)) return null;
		const [, owner, repo, surface, id, subpage] = url.pathname.split("/").map(decodeURIComponent);
		const target = parseGitHubTarget({
			owner,
			repo,
			kind: surface === "issues" ? "issue" : surface,
			...surface === "commit" ? { sha: id } : { number: Number(id) }
		});
		return target ? {
			target,
			url: url.href,
			...typeof value.agentId === "string" ? { agentId: value.agentId.trim() } : {},
			refresh: value.refresh === true,
			filesExpanded: subpage === "files"
		} : null;
	} catch {
		return null;
	}
}
function githubTargetUrl(target) {
	const id = target.kind === "commit" ? target.sha : target.number;
	return `https://github.com/${target.owner}/${target.repo}/${target.kind === "issue" ? "issues" : target.kind}/${id}`;
}
//#endregion
export { parseGitHubLinkParams as a, parseGitHubItemTarget as i, GITHUB_ITEM_PATH_PATTERN as n, parseGitHubTarget as o, githubTargetUrl as r, GITHUB_COMMIT_PATH_PATTERN as t };
