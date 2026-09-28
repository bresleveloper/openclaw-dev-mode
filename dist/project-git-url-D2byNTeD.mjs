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
function parseProjectGitUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed || trimmed.startsWith("-") || trimmed.includes("\0") || /[\r\n\t ]/u.test(trimmed)) return null;
	const scp = /^git@github\.com:(.+)$/iu.exec(trimmed);
	let parts;
	if (scp) parts = githubPathParts(scp[1] ?? "");
	else try {
		const url = new URL(trimmed);
		const isHttps = url.protocol === "https:";
		const isDefaultSsh = url.protocol === "ssh:" && url.username === "git" && (!url.port || url.port === "22");
		if (!isHttps && !isDefaultSsh || url.hostname.toLowerCase() !== "github.com" || url.password || isHttps && url.username || url.search || url.hash) return null;
		parts = githubPathParts(url.pathname);
	} catch {
		return null;
	}
	if (!parts) return null;
	return {
		url: `https://github.com/${parts.owner.toLowerCase()}/${parts.repo.toLowerCase()}.git`,
		name: parts.repo
	};
}
//#endregion
export { parseProjectGitUrl as t };
