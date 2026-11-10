import { l as readDatabaseFileIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./source-limits-BA6q70Ye.mjs";
import { t as clawMonitorCleanupBindingSchema } from "./monitor-cleanup-contract-DMqZagu3.mjs";
//#region src/claws/removal-journal-contract.ts
const text = string().min(1).max(4096);
const digest = string().regex(/^sha256:[a-f0-9]{64}$/u);
const agentId = string().regex(/^[a-z0-9][a-z0-9_-]*$/u).max(128);
const clawRemovalSourceIdentitySchema = object({
	canonicalPath: text,
	key: text,
	birthtime: text
}).strict().refine((value) => {
	try {
		readDatabaseFileIdentity(value);
		return true;
	} catch {
		return false;
	}
}, "Invalid original database identity.");
const clawRemovalLeaseSchema = object({
	scope: literal("core:agent-deletion"),
	key: agentId,
	owner: text
}).strict();
const clawRemovalJournalRequestSchema = object({
	phase: _enum(["begin", "rollback"]),
	agentId,
	operationId: text,
	binding: clawMonitorCleanupBindingSchema,
	sourceIdentity: clawRemovalSourceIdentitySchema,
	lease: clawRemovalLeaseSchema,
	expectedInstallDigest: digest,
	expectedJournalDigest: digest,
	configDigest: digest
}).strict().refine((input) => input.lease.key === input.agentId && Buffer.byteLength(JSON.stringify(input)) <= 1048576, "Claw removal journal request differs from its deletion lease or exceeds the byte limit.");
const journal = object({
	agentId,
	operationId: text,
	agentDir: text,
	workspaceDir: string().max(4096),
	sessionsDir: text,
	databasePaths: array(text),
	cleanupPaths: array(object({
		path: text,
		canonicalPath: text,
		parentPath: text,
		kind: _enum(["target", "symlink"]),
		sourcePaths: array(text),
		dev: union([string().regex(/^-?\d+$/), number()]).nullable(),
		ino: union([string().regex(/^-?\d+$/), number()]).nullable(),
		coversDescendants: boolean(),
		done: boolean(),
		note: string().optional()
	}).strict()),
	createdAt: number().finite(),
	cleanupCompleted: boolean(),
	deleteFiles: boolean()
}).strict();
const clawRemovalJournalResultSchema = discriminatedUnion("ok", [object({
	ok: literal(true),
	journal: journal.nullable()
}).strict(), object({
	ok: literal(false),
	error: string()
}).strict()]);
/** The released Claw transport represents only its existing retirement flow. */
function serializeClawRemovalJournal(entry) {
	if (!entry) return null;
	if (entry.phase !== "retiring") throw new Error(`Agent ${entry.agentId} deletion is still draining.`);
	const { phase: _phase, ...wireJournal } = entry;
	return wireJournal;
}
//#endregion
export { clawRemovalJournalResultSchema as n, serializeClawRemovalJournal as r, clawRemovalJournalRequestSchema as t };
