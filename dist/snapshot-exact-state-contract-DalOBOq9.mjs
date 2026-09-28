import { Et as _enum, Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
//#region src/agents/worktrees/snapshot-exact-state-contract.ts
const oid = string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);
const exactStateRetirementSchema = object({
	ownerKind: _enum([
		"manual",
		"session",
		"workboard"
	]),
	ownerId: string().optional(),
	createdAt: number().finite(),
	lastActiveAt: number().finite(),
	head: oid,
	branchHead: oid,
	indexSha256: string().regex(/^[a-f0-9]{64}$/u)
}).strict();
//#endregion
export { exactStateRetirementSchema as t };
