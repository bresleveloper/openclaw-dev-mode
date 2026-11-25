import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{m as t,n}from"./worker-chunk-CHXXUV6W.mjs";import{l as r,u as i}from"./worker-chunk-EAEbv0hu.mjs";import{n as a,t as o}from"./worker-chunk-CG818IAg.mjs";function githubPublicationUnsafeConfigArgs(e){return[`git`,`config`,e,`--includes`,`--get-regexp`,`^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$`]}function parseGitHubPublicationBaseBranch(e,t){let n=e.trim();if(!n||n===`HEAD`||/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(n))return t;for(let e of[`refs/remotes/origin/`,`origin/`,`refs/heads/`])if(n.startsWith(e))return n.slice(e.length);return n}function parseGitHubPublicationBaseRef(e,n){let r=a(e),o=i(r)?t(r.ref):void 0,s=i(r)?t(r.sha):void 0;if(o!==`refs/heads/${n}`||!s||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(s))throw Error(`GitHub publication workspace base branch could not be verified.`);return s}var s,c,l=e((()=>{o(),r(),n(),s=[`git`,`config`,`--local`,`--includes`,`--bool`,`--default=false`,`--get`,`extensions.worktreeConfig`],c={worktreeConfigArgs:s,script:String.raw`
const scopes = ["--local"];
const worktreeConfig = spawnSync("git", ${JSON.stringify(s.slice(1))}, { cwd, env, timeout: 60000, maxBuffer: 128 * 1024 });
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
`}}));export{parseGitHubPublicationBaseRef as a,parseGitHubPublicationBaseBranch as i,githubPublicationUnsafeConfigArgs as n,l as r,c as t};