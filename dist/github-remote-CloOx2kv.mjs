//#region src/gateway/github-remote.ts
/** Parse a GitHub remote in HTTPS, SSH URL, or scp-like form. */
function parseGitHubRemoteUrl(raw) {
	const trimmed = raw.trim();
	let path;
	const scpMatch = /^git@github\.com:(.+)$/i.exec(trimmed);
	if (scpMatch) path = scpMatch[1];
	else try {
		const url = new URL(trimmed);
		if (!(url.protocol === "https:" || url.protocol === "http:" || url.protocol === "ssh:") || url.hostname.toLowerCase() !== "github.com") return null;
		path = url.pathname;
	} catch {
		return null;
	}
	const segments = (path ?? "").split("/").filter(Boolean);
	const owner = segments[0];
	const repo = segments[1]?.replace(/\.git$/i, "");
	if (segments.length !== 2 || !owner || !repo) return null;
	return {
		owner,
		repo
	};
}
//#endregion
export { parseGitHubRemoteUrl as t };
