import{m as readNonBlankString}from"./string-coerce-CpTFcSwY.mjs";import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{t as safeParseJson}from"./json-coercion-DNNwq4_v.mjs";
//!src/gateway/github-publication-base.ts
const worktreeConfigArgs=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`];function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}const GITHUB_PUBLICATION_CONFIG_GUARD={worktreeConfigArgs,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(worktreeConfigArgs.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
if (worktreeConfig.error || worktreeConfig.status !== 0) {
  throw new Error("Publication workspace has unsupported Git transport configuration");
}
// Git rejects --worktree on linked checkouts unless the separate config is enabled.
if (worktreeConfig.stdout.toString("utf8").trim() === "true") scopes.push("--worktree");
for (const scope of scopes) {
  const result = spawnSync("git", ["config", scope, "--includes", "--get-regexp",
    ${JSON.stringify(githubPublicationUnsafeConfigArgs(`--local`).at(-1))}], {
    cwd, env, timeout: 60000, maxBuffer: 128 * 1024,
  });
  if (result.error || result.status !== 1 || result.stdout.length) {
    throw new Error("Publication workspace has unsupported Git transport configuration");
  }
}
`};function parseGitHubPublicationBaseBranch(e,t){const n=e.trim();if(!n||n===`HEAD`||/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(n))return t;for(const e of[`refs/remotes/origin/`,`origin/`,`refs/heads/`])if(n.startsWith(e))return n.slice(e.length);return n}function parseGitHubPublicationBaseRef(e,t){const n=safeParseJson(e);const r=isRecord(n)?readNonBlankString(n.ref):void 0;const i=isRecord(n)?readNonBlankString(n.sha):void 0;if(r!==`refs/heads/${t}`||!i||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(i))throw new Error(`GitHub publication workspace base branch could not be verified.`);return i}export{parseGitHubPublicationBaseRef as i,githubPublicationUnsafeConfigArgs as n,parseGitHubPublicationBaseBranch as r,GITHUB_PUBLICATION_CONFIG_GUARD as t};