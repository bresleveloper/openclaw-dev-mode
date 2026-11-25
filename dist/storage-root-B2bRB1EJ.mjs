import{r as resolveStateDir}from"./state-dir-BwbNjuVe.mjs";import"./paths-DxXULbkO.mjs";import path from"node:path";
//!src/agents/worktrees/storage-root.ts
function resolveManagedWorktreeRoot(e,t){return t??path.join(resolveStateDir(e),`worktrees`)}export{resolveManagedWorktreeRoot as t};