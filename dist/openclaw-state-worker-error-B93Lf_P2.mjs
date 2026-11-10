import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { i as SqliteCoordinatorError, n as OpenClawStateOwnershipError, r as OpenClawStateOwnershipMetadataError, t as OpenClawStateExternalOwnershipError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import { a as isSqliteLockError, c as markSqliteNativeOpenFailure, o as isSqliteNativeOpenFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { t as SqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as WorkspaceAliasRepointedError } from "./workspace-state-identity-hZ7UINpz.mjs";
import { a as WorktreeRemovalLockError, i as WorktreeRemovalContentionError, n as SessionWorktreeSourceChangedError, t as SessionWorktreeLifecycleError } from "./errors-WYf-uyBk.mjs";
import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { t as SessionCanonicalKeyMigrationRequiredError } from "./session-canonical-key-error-YHax-6is.mjs";
import { n as SqliteSessionMutationConflictError, r as SqliteTranscriptMutationConflictError, t as SessionEntryLifecycleUpsertConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { n as parseTranscriptAppendRefusal, t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as PluginStateStoreError } from "./plugin-state-error-Wxkh7e3f.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
//#region src/state/openclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "OpenClawQuarantineReadCleanupError";
const OpenClawQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("openclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "OpenClaw quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/openclaw-state-db-failure.ts
const failurePaths = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseFailurePaths"), () => /* @__PURE__ */ new WeakMap());
/** Preserve the terminal admission owner's path through worker error transport. */
function markOpenClawStateDatabaseFailure(error, pathname) {
	failurePaths.set(error, pathname);
}
function readOpenClawStateDatabaseFailurePath(error) {
	return failurePaths.get(error);
}
/** Cleanup aggregates must retain the original refusal without attributing unrelated errors. */
function findOpenClawStateDatabaseFailure(error, pathname) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const current of pending) {
		if (!(current instanceof Error) || seen.has(current)) continue;
		seen.add(current);
		if (failurePaths.get(current) === pathname) return current;
		pending.push(current.cause);
		if (current instanceof AggregateError) pending.push(...current.errors);
	}
}
//#endregion
//#region src/agents/agent-create-error.ts
var DuplicateAgentError = class extends Error {};
//#endregion
//#region src/agents/auth-profiles/store-unreadable-error.ts
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(databasePath) {
		super(`Auth profile store ${shortenHomePath(databasePath)} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.databasePath = databasePath;
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
//#endregion
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
//#endregion
//#region src/gateway/model-account-connect-errors.ts
var ModelAccountConnectAuthorityError = class extends Error {
	constructor() {
		super("This account action requires a current authorized connection; reconnect and try again.");
	}
};
var ModelAccountConnectInputError = class extends Error {};
//#endregion
//#region src/gateway/worker-environments/session-attachment.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
	constructor(sessionId, environmentId) {
		super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
		this.sessionId = sessionId;
		this.environmentId = environmentId;
	}
};
//#endregion
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 65536;
//#endregion
//#region src/sessions/model-selection-error.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
/** Retains the caller-visible refusal across the database worker boundary. */
var ModelSelectionLockedError = class extends Error {
	constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
		super(message);
		this.name = "ModelSelectionLockedError";
	}
};
//#endregion
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/state/openclaw-agent-db-migration-required.ts
var OpenClawAgentDatabaseMediaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(pathname, schemaVersion) {
		super("agent-media", `OpenClaw agent database ${pathname} uses schema version ${schemaVersion}; run openclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.name = "OpenClawAgentDatabaseMediaMigrationRequiredError";
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
const MESSAGE_ONLY_ERRORS = {
	"worktree-source-changed": SessionWorktreeSourceChangedError,
	"model-account-authority": ModelAccountConnectAuthorityError,
	"duplicate-agent": DuplicateAgentError,
	"model-selection-locked": ModelSelectionLockedError,
	"session-canonical-key-migration": SessionCanonicalKeyMigrationRequiredError,
	"session-pending-input-custody": SessionPendingInputCustodyError,
	"session-transcript-read-fence": SessionTranscriptReadFenceError,
	"skill-upload-request": SkillUploadRequestError,
	coordinator: SqliteCoordinatorError,
	ownership: OpenClawStateOwnershipError,
	"newer-schema": SqliteSchemaVersionError,
	"range-error": RangeError,
	"syntax-error": SyntaxError,
	"type-error": TypeError
};
function isMessageOnlyErrorIdentity(node) {
	return typeof node.type === "string" && Object.hasOwn(MESSAGE_ONLY_ERRORS, node.type);
}
function identifyError(error) {
	if (error instanceof AuthProfileStoreUnreadableError) return {
		type: "auth-profile-store-unreadable",
		databasePath: error.databasePath
	};
	if (error instanceof SessionWorktreeLifecycleError && error.reason === "owner-mismatch") return { type: "session-worktree-owner-mismatch" };
	if (error instanceof WorktreeRemovalContentionError) return {
		type: "worktree-removal-contention",
		kind: error.kind,
		...error.blockedByRun ? { blockedByRun: {
			worktreeId: error.blockedByRun.worktreeId,
			pid: error.blockedByRun.pid
		} } : {}
	};
	if (error instanceof WorktreeRemovalLockError) return {
		type: "worktree-removal-lock",
		kind: error.kind
	};
	if (error instanceof PluginStateStoreError) return {
		type: "plugin-state",
		stateCode: error.code,
		operation: error.operation,
		path: error.path,
		owner: {
			pid: error.owner.pid,
			threadId: error.owner.threadId,
			version: error.owner.version
		}
	};
	if (error instanceof SkillLibraryError) return {
		type: "skill-library",
		libraryCode: error.code,
		...error.currentRevision === void 0 ? {} : { currentRevision: error.currentRevision }
	};
	if (error instanceof SecretStoreValidationError) return {
		type: "secret-store-validation",
		secretCode: error.code
	};
	if (error instanceof WorkerSessionAlreadyAttachedError) return {
		type: "worker-session-already-attached",
		sessionId: error.sessionId,
		environmentId: error.environmentId
	};
	if (error instanceof PluginBlobStoreError) return {
		type: "plugin-blob",
		blobCode: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path }
	};
	if (error instanceof WorkspaceAliasRepointedError) return {
		type: "workspace-alias-repointed",
		aliasPath: error.aliasPath,
		storedWorkspacePath: error.storedWorkspacePath,
		currentWorkspacePath: error.currentWorkspacePath
	};
	if (error instanceof McpOAuthStoreCorruptionError) return { type: "mcp-oauth-corruption" };
	if (error instanceof SessionGoalOperationError) return {
		type: "session-goal-operation",
		goalCode: error.code
	};
	if (error instanceof SessionEntryLifecycleUpsertConflictError) return {
		type: "session-lifecycle-upsert-conflict",
		sessionKey: error.sessionKey
	};
	if (error instanceof SessionTranscriptWriterClaimReboundError) {
		const refusal = parseTranscriptAppendRefusal(error.cause);
		return {
			type: "session-transcript-writer-claim-rebound",
			...refusal ? { refusal } : {}
		};
	}
	if (error instanceof SqliteSessionMutationConflictError) return {
		type: "session-mutation-conflict",
		operationLabel: error.operationLabel
	};
	if (error instanceof SqliteTranscriptMutationConflictError) return {
		type: "session-transcript-mutation-conflict",
		sessionId: error.sessionId
	};
	if (error instanceof SessionMetadataUnavailableError) return {
		type: "session-metadata",
		reason: error.reason,
		missingTables: [...error.missingTables]
	};
	if (error instanceof GatewayStateOwnerContentionError) return {
		type: "state-owner-contention",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateLeaseError) return {
		type: "state-lease",
		leaseCode: error.code
	};
	if (error instanceof OpenClawStateOwnershipMetadataError) return {
		type: "ownership-metadata",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateExternalOwnershipError) return {
		type: "external-ownership",
		databasePath: error.databasePath,
		managerId: error.managerId
	};
	if (error instanceof OpenClawStateDatabaseSchemaMigrationRequiredError) return {
		type: "state-migration",
		kind: error.kind,
		pathname: error.pathname
	};
	if (error instanceof OpenClawAgentDatabaseMediaMigrationRequiredError) return {
		type: "agent-media-migration",
		pathname: error.pathname,
		schemaVersion: error.schemaVersion
	};
	for (const [type, ErrorType] of Object.entries(MESSAGE_ONLY_ERRORS)) if (error instanceof ErrorType) return { type };
	if (error instanceof StartupMaintenanceRequiredError) return {
		type: "maintenance",
		kind: error.kind
	};
	return { type: error instanceof AggregateError ? "aggregate" : "error" };
}
function unreachableErrorNode(node) {
	throw new Error(`Unexpected shared-state worker error node: ${String(node)}`);
}
function createError(node) {
	if (isMessageOnlyErrorIdentity(node)) {
		const ErrorType = MESSAGE_ONLY_ERRORS[node.type];
		return new ErrorType(node.message);
	}
	switch (node.type) {
		case "session-worktree-owner-mismatch": return new SessionWorktreeLifecycleError(node.message, "owner-mismatch");
		case "worktree-removal-contention": return new WorktreeRemovalContentionError(node.kind, node.message, node.blockedByRun);
		case "worktree-removal-lock": return new WorktreeRemovalLockError(node.kind, node.message);
		case "plugin-state": return new PluginStateStoreError(node.message, {
			code: node.stateCode,
			operation: node.operation,
			path: node.path,
			owner: node.owner
		});
		case "skill-library": return new SkillLibraryError(node.libraryCode, node.message, node.currentRevision);
		case "secret-store-validation": return new SecretStoreValidationError(node.secretCode, node.message);
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-goal-operation": return new SessionGoalOperationError(node.goalCode, node.message);
		case "session-lifecycle-upsert-conflict": return new SessionEntryLifecycleUpsertConflictError(node.sessionKey);
		case "session-mutation-conflict": return new SqliteSessionMutationConflictError(node.operationLabel);
		case "session-transcript-mutation-conflict": return new SqliteTranscriptMutationConflictError(node.sessionId);
		case "session-transcript-writer-claim-rebound": return new SessionTranscriptWriterClaimReboundError(node.refusal);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "auth-profile-store-unreadable": return new AuthProfileStoreUnreadableError(node.databasePath);
		case "state-owner-contention": return new GatewayStateOwnerContentionError(node.databasePath);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "plugin-blob": return new PluginBlobStoreError(node.message, {
			code: node.blobCode,
			operation: node.operation,
			...node.path === void 0 ? {} : { path: node.path }
		});
		case "state-lease": return new OpenClawStateLeaseError(node.message, { code: node.leaseCode });
		case "maintenance": return new StartupMaintenanceRequiredError(node.kind, node.message);
		case "state-migration": return new OpenClawStateDatabaseSchemaMigrationRequiredError(node.kind, node.pathname);
		case "agent-media-migration": return new OpenClawAgentDatabaseMediaMigrationRequiredError(node.pathname, node.schemaVersion);
	}
	return unreachableErrorNode(node);
}
//#endregion
//#region src/state/openclaw-state-worker-error.ts
function isScalar(value) {
	return value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isNativeErrorCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
}
function encodeOpenClawStateWorkerError(error, options = {}) {
	if (!(error instanceof Error)) return;
	const nodes = [];
	const errors = [];
	const references = /* @__PURE__ */ new Map();
	let canonical = false;
	const encodeValue = (value) => {
		if (!(value instanceof Error)) return isScalar(value) ? { value } : { undefined: true };
		const known = references.get(value);
		if (known !== void 0) return { ref: known };
		const ref = errors.length;
		references.set(value, ref);
		errors.push(value);
		return { ref };
	};
	try {
		encodeValue(error);
		for (const current of errors) {
			const { name, message } = current;
			if (typeof name !== "string" || typeof message !== "string") return;
			const identity = identifyError(current);
			if (Object.entries(identity).some(([key, value]) => {
				return (key === "owner" || key === "blockedByRun" || key === "refusal" ? Object.values(value) : key === "missingTables" && Array.isArray(value) ? value : [value]).some((field) => field !== void 0 && !isScalar(field));
			})) return;
			const nativeOpen = isSqliteNativeOpenFailure(current);
			const stateDatabasePath = readOpenClawStateDatabaseFailurePath(current);
			const errcode = "errcode" in current ? current.errcode : void 0;
			canonical ||= stateDatabasePath !== void 0 || nativeOpen || isNativeErrorCode(errcode) || isSqliteLockError(current) || current instanceof OpenClawQuarantineReadCleanupError || identity.type !== "error" && identity.type !== "aggregate";
			const code = "code" in current ? current.code : void 0;
			const errno = "errno" in current ? current.errno : void 0;
			nodes.push({
				...identity,
				name,
				message,
				...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {},
				...isNativeErrorCode(errcode) ? { errcode } : {},
				...typeof errno === "number" && Number.isInteger(errno) ? { errno } : {},
				...nativeOpen ? { nativeOpen: true } : {},
				...stateDatabasePath === void 0 ? {} : { stateDatabasePath },
				..."cause" in current && !(identity.type === "session-transcript-writer-claim-rebound" && identity.refusal) ? { cause: encodeValue(current.cause) } : {},
				...current instanceof AggregateError ? { errors: current.errors.map(encodeValue) } : {}
			});
		}
		return canonical || options.includeOrdinary === true ? {
			version: 1,
			root: 0,
			nodes
		} : void 0;
	} catch {
		return;
	}
}
function decodeErrorGraph(value, options) {
	try {
		if (value.version !== 1) return;
		const nodes = value.nodes;
		if (options.includeOrdinary !== true && !nodes.some((node) => node.stateDatabasePath !== void 0 || node.nativeOpen === true || isNativeErrorCode(node.errcode) || isSqliteLockError(node) || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate")) return;
		const errors = nodes.map(createError);
		const decodeValue = (entry) => "ref" in entry ? errors[entry.ref] : "value" in entry ? entry.value : void 0;
		for (const [index, node] of nodes.entries()) {
			const error = errors[index];
			error.name = node.name;
			error.message = node.message;
			if (node.nativeOpen) markSqliteNativeOpenFailure(error);
			if (node.stateDatabasePath !== void 0) markOpenClawStateDatabaseFailure(error, node.stateDatabasePath);
			for (const [key, propertyValue] of Object.entries({
				...node.code !== void 0 ? { code: node.code } : {},
				...node.errcode !== void 0 ? { errcode: node.errcode } : {},
				...node.errno !== void 0 ? { errno: node.errno } : {},
				...node.cause ? { cause: decodeValue(node.cause) } : {}
			})) Object.defineProperty(error, key, {
				value: propertyValue,
				configurable: true,
				writable: true
			});
			if (error instanceof AggregateError) error.errors = (node.errors ?? []).map(decodeValue);
		}
		return {
			errors,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloads = resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerErrorPayloads"), () => /* @__PURE__ */ new WeakMap());
/** Keep the closed wire graph until the receiving caller hydrates it. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	if (payload) retainedPayloads.set(error, payload);
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const replacements = /* @__PURE__ */ new Map();
	const pending = [{
		error: value,
		finish: false
	}];
	const replace = (child) => child instanceof Error ? replacements.get(child) ?? child : child;
	while (pending.length > 0) {
		const entry = pending.pop();
		const { error } = entry;
		if (!entry.finish) {
			if (replacements.has(error)) continue;
			replacements.set(error, error);
			const payload = retainedPayloads.get(error);
			const graph = payload === void 0 ? void 0 : decodeErrorGraph(payload, options);
			if (graph) {
				replacements.set(error, graph.errors[graph.root]);
				continue;
			}
			pending.push({
				error,
				finish: true
			});
			if (error.cause instanceof Error) pending.push({
				error: error.cause,
				finish: false
			});
			if (error instanceof AggregateError) {
				for (const child of error.errors) if (child instanceof Error) pending.push({
					error: child,
					finish: false
				});
			}
			continue;
		}
		const cause = replace(error.cause);
		const originalErrors = error instanceof AggregateError ? error.errors : void 0;
		const errors = originalErrors?.map(replace);
		if (cause === error.cause && (!errors || errors.every((child, index) => child === originalErrors?.[index]))) continue;
		const replacement = error instanceof AggregateError ? new AggregateError([], error.message) : new Error(error.message);
		Object.setPrototypeOf(replacement, Object.getPrototypeOf(error));
		const descriptors = Object.getOwnPropertyDescriptors(error);
		if ("cause" in error) descriptors.cause = {
			configurable: true,
			writable: true,
			...descriptors.cause,
			value: cause
		};
		if (errors) descriptors.errors = {
			configurable: true,
			writable: true,
			...descriptors.errors,
			value: errors
		};
		Object.defineProperties(replacement, descriptors);
		replacements.set(error, replacement);
	}
	return replacements.get(value);
}
//#endregion
export { AuthProfileStoreUnreadableError as _, SkillUploadRequestError as a, markOpenClawStateDatabaseFailure as b, SECRET_STORE_VALUE_MAX_BYTES as c, WorkerSessionAlreadyAttachedError as d, ModelAccountConnectAuthorityError as f, AUTH_PROFILE_MIGRATION_COMMAND as g, McpOAuthStoreCorruptionError as h, OpenClawAgentDatabaseMediaMigrationRequiredError as i, SecretStoreValidationError as l, SessionPendingInputCustodyError as m, hydrateOpenClawStateWorkerError as n, MODEL_SELECTION_LOCKED_MESSAGE as o, ModelAccountConnectInputError as p, retainOpenClawStateWorkerErrorPayload as r, ModelSelectionLockedError as s, encodeOpenClawStateWorkerError as t, PluginBlobStoreError as u, DuplicateAgentError as v, OpenClawQuarantineReadCleanupError as x, findOpenClawStateDatabaseFailure as y };
