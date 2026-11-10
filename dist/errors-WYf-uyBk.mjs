import { a as extractErrorCode, i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
//#region src/agents/worktrees/errors.ts
/** Worker and child-process uncertainty both retain artifacts until native settlement. */
function hasWorktreeUnknownOutcome(error) {
	return hasCommandProcessCleanupError(error) || collectNestedErrorCandidates(error).some((cause) => extractErrorCode(cause) === "outcome-unknown");
}
var WorktreeRepositoryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorktreeRepositoryError";
		this.reason = options?.reason;
	}
};
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message, blockedByRun) {
		super(message);
		this.kind = kind;
		this.blockedByRun = blockedByRun;
		this.name = "WorktreeRemovalContentionError";
	}
};
var WorktreeRemovalLockError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalLockError";
	}
};
var SessionWorktreeSourceChangedError = class extends Error {};
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
var WorktreePendingContentionError = class extends Error {
	constructor(worktreeId) {
		super("Managed worktree creation is pending; waiting for its checkout owner");
		this.worktreeId = worktreeId;
		this.name = "WorktreePendingContentionError";
	}
};
function registryAuthorityChanged(kind) {
	switch (kind) {
		case "publication": return new SessionWorktreeSourceChangedError("GitHub publication worktree authority changed");
		case "snapshot-retirement": return /* @__PURE__ */ new Error("Worktree snapshot retirement identity changed");
		case "exact-snapshot": return /* @__PURE__ */ new Error("Exact-state recovery owner or lifecycle changed; source and snapshot preserved");
		case "exact-owner": return /* @__PURE__ */ new Error("Worktree exact-state owner or lifecycle changed; checkout preserved");
		case "activity": return new WorktreeRemovalLockError("busy", "worktree activity changed during cleanup");
		case "session-owner": return new SessionWorktreeLifecycleError("Session worktree ownership changed; retry cleanup.", "owner-mismatch");
		case "source-record": return new SessionWorktreeSourceChangedError("Accepted managed source changed during preparation");
		case "source-owner": return new SessionWorktreeSourceChangedError("Spawn parent managed worktree changed; retry from its current session");
		case "projection": return /* @__PURE__ */ new Error("Managed projection owner changed during settlement");
		case "record": return /* @__PURE__ */ new Error("Worktree registry changed during recovery; remaining source and original snapshot preserved");
		default: return new WorktreeRemovalContentionError("busy", "Worktree owner or binding changed; checkout preserved");
	}
}
//#endregion
export { WorktreeRemovalLockError as a, registryAuthorityChanged as c, WorktreeRemovalContentionError as i, SessionWorktreeSourceChangedError as n, WorktreeRepositoryError as o, WorktreePendingContentionError as r, hasWorktreeUnknownOutcome as s, SessionWorktreeLifecycleError as t };
