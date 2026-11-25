import{t as nativeWorktreeFilesystem}from"./filesystem-native-BN27mgsm.mjs";
//!src/agents/worktrees/filesystem-apfs.native.ts
const apfsFilesystem={async readDirectoryAcl(e,t){const n=await nativeWorktreeFilesystem.readAcl(e,t);return n.kind===`unknown`?void 0:n.kind===`none`?`none`:n.inheritsToFiles||n.inheritsToDirectories?`inheritable`:`non-inheritable`}};export{apfsFilesystem};