//#region src/agents/worktrees/name.ts
const WORKTREE_NAME_MAX_LENGTH = 64;
/** Converts a short human-readable title into a valid managed-worktree name. */
function slugifyWorktreeTitle(title) {
	const slug = title.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	if (slug.length <= WORKTREE_NAME_MAX_LENGTH) return slug || void 0;
	const truncated = slug.slice(0, WORKTREE_NAME_MAX_LENGTH);
	const wordBoundary = truncated.lastIndexOf("-");
	return wordBoundary > 0 ? truncated.slice(0, wordBoundary) : truncated;
}
//#endregion
export { slugifyWorktreeTitle as t };
