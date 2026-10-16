import { i as resolveConfiguredGitHubHost } from "./github-host-CaivEi-a.mjs";
//#region src/projects/project-git-url.ts
const GITHUB_PATH_SEGMENT = /^[A-Za-z0-9_.-]+$/u;
function githubPathParts(pathname) {
	const segments = pathname.split("/").filter(Boolean);
	const owner = segments[0];
	const repo = segments[1]?.replace(/\.git$/iu, "");
	if (segments.length !== 2 || !owner || !repo || !GITHUB_PATH_SEGMENT.test(owner) || !GITHUB_PATH_SEGMENT.test(repo) || owner === "." || owner === ".." || repo === "." || repo === "..") return null;
	return {
		owner,
		repo
	};
}
/** Canonicalizes the GitHub clone forms accepted by projects.add. */
function parseProjectGitUrl(raw, githubHost = resolveConfiguredGitHubHost()) {
	const trimmed = raw.trim();
	if (!trimmed || trimmed.startsWith("-") || trimmed.includes("\0") || /[\r\n\t ]/u.test(trimmed)) return null;
	const scpPrefix = `git@${githubHost}:`;
	const scpPath = trimmed.toLowerCase().startsWith(scpPrefix) ? trimmed.slice(scpPrefix.length) : void 0;
	let parts;
	if (scpPath !== void 0) parts = githubPathParts(scpPath);
	else try {
		const url = new URL(trimmed);
		const isHttps = url.protocol === "https:";
		const isDefaultSsh = url.protocol === "ssh:" && url.username === "git" && (!url.port || url.port === "22");
		if (!isHttps && !isDefaultSsh || url.hostname.toLowerCase() !== githubHost || url.password || isHttps && url.username || url.search || url.hash) return null;
		parts = githubPathParts(url.pathname);
	} catch {
		return null;
	}
	if (!parts) return null;
	return {
		url: `https://${githubHost}/${parts.owner.toLowerCase()}/${parts.repo.toLowerCase()}.git`,
		name: parts.repo
	};
}
//#endregion
export { parseProjectGitUrl as t };
