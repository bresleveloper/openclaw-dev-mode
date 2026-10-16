import { D as isRecord, S as resolveGlobalSingleton } from "./number-coercion-CmpLVzZ6.mjs";
import { R as isSqliteLockError, V as markSqliteNativeOpenFailure, a as StartupMaintenanceRequiredError, h as VERSION, o as isStartupMaintenanceKind, t as SqliteSchemaVersionError, z as isSqliteNativeOpenFailure } from "./sqlite-user-version-C7PVO8Wf.mjs";
import "./utils-BfTq4rUg.mjs";
import { t as OpenClawStateDatabaseSchemaMigrationRequiredError } from "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import { S as readOpenClawStateDatabaseFailurePath, T as GatewayStateOwnerContentionError, it as SqliteCoordinatorError, nt as OpenClawStateOwnershipError, rt as OpenClawStateOwnershipMetadataError, st as throwSqliteLifecycleErrors, tt as OpenClawStateExternalOwnershipError, w as OpenClawQuarantineReadCleanupError, x as markOpenClawStateDatabaseFailure } from "./sqlite-readonly-location-cleanup-CmRNKiuM.mjs";
import { deserialize, serialize } from "node:v8";
import "node:fs";
import path from "node:path";
import "node:os";
import "node:crypto";
import { isMainThread, threadId, workerData } from "node:worker_threads";
import fs from "node:fs/promises";
//#region src/state/session-metadata-unavailable-error.ts
var SessionMetadataUnavailableError = class extends Error {
	constructor(reason, options, missingTables = []) {
		super(`Session metadata unavailable (${[reason, ...missingTables].join(": ")}); retry after the agent store is ready.`, options);
		this.reason = reason;
		this.missingTables = missingTables;
		this.name = "SessionMetadataUnavailableError";
	}
};
//#endregion
//#region src/agents/agent-create-error.ts
var DuplicateAgentError = class extends Error {};
//#endregion
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
//#endregion
//#region src/agents/workspace-state-identity.ts
const WORKSPACE_ALIAS_REPOINTED_ERROR_CODE = "WORKSPACE_ALIAS_REPOINTED";
var WorkspaceAliasRepointedError = class extends Error {
	constructor(params) {
		super(`workspace path alias points to a different current target: ${params.aliasPath} now resolves to ${params.currentWorkspacePath}, but its stored workspace state belongs to ${params.storedWorkspacePath}. Run \`openclaw doctor --fix\` and confirm the move, or use \`openclaw doctor --fix --force\`.`);
		this.code = WORKSPACE_ALIAS_REPOINTED_ERROR_CODE;
		this.name = "WorkspaceAliasRepointedError";
		this.aliasPath = params.aliasPath;
		this.storedWorkspacePath = params.storedWorkspacePath;
		this.currentWorkspacePath = params.currentWorkspacePath;
	}
};
//#endregion
//#region src/config/sessions/goals-operations.types.ts
const SESSION_GOAL_OPERATION_ERROR_CODES = [
	"expired",
	"operation-conflict",
	"session-rebound",
	"goal-rebound",
	"capacity",
	"receipt-invalid",
	"invalid"
];
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
//#endregion
//#region src/config/sessions/session-mutation-conflict-error.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.operationLabel = operationLabel;
		this.name = "SqliteSessionMutationConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
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
//#region src/plugin-state/plugin-state-error-cause.ts
function capturePluginStateErrorCause(value, encodeCanonical, seen = /* @__PURE__ */ new Set()) {
	if (value === void 0) return;
	const canonical = encodeCanonical?.(value);
	if (canonical) return { canonical };
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return {
		name: "Error",
		message: String(value)
	};
	if (typeof value !== "object") return {
		name: "Error",
		message: "Unknown SQLite error cause"
	};
	if (seen.has(value) || seen.size >= 8) return {
		name: "Error",
		message: "Additional SQLite error cause omitted"
	};
	seen.add(value);
	const name = "name" in value && typeof value.name === "string" ? value.name : "Error";
	const message = "message" in value && typeof value.message === "string" ? value.message : name;
	const code = "code" in value ? value.code : void 0;
	const errcode = "errcode" in value ? value.errcode : void 0;
	const errno = "errno" in value ? value.errno : void 0;
	return {
		name,
		message,
		...typeof code === "string" || typeof code === "number" ? { errorCode: code } : {},
		...typeof errcode === "number" ? { errcode } : {},
		...typeof errno === "number" ? { errno } : {},
		..."cause" in value ? { cause: capturePluginStateErrorCause(value.cause, encodeCanonical, seen) } : {},
		...value instanceof AggregateError ? { errors: value.errors.slice(0, 8).map((error) => capturePluginStateErrorCause(error, encodeCanonical, seen)) } : {}
	};
}
//#endregion
//#region src/plugin-state/plugin-state-error.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		this.owner = options.owner ?? {
			pid: process.pid,
			threadId,
			version: VERSION
		};
		if (options.path) this.path = options.path;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			operation: this.operation,
			path: this.path,
			owner: this.owner,
			cause: capturePluginStateErrorCause(this.cause)
		};
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
function isSecretStoreValidationCode(value) {
	return value === "SECRET_STORE_INVALID_NAME" || value === "SECRET_STORE_INVALID_ALLOWED_HOST" || value === "SECRET_STORE_VALUE_TOO_LARGE" || value === "SECRET_STORE_VALUE_IN_ARGV" || value === "SECRET_STORE_VALUE_REDACTED" || value === "SECRET_STORE_VALUE_CHANGED" || value === "SECRET_STORE_VALUE_EMPTY";
}
//#endregion
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/skills/skill-library-error.ts
var SkillLibraryError = class extends Error {
	constructor(code, message, currentRevision, options) {
		super(message, options);
		this.code = code;
		this.currentRevision = currentRevision;
		this.name = "SkillLibraryError";
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
//#region src/state/openclaw-state-lease-error.ts
const leaseErrorCodes = [
	"OPENCLAW_STATE_LEASE_INVALID_INPUT",
	"OPENCLAW_STATE_LEASE_HELD",
	"OPENCLAW_STATE_LEASE_ABORTED",
	"OPENCLAW_STATE_LEASE_LOST",
	"OPENCLAW_STATE_LEASE_STORAGE_FAILED"
];
function isOpenClawStateLeaseErrorCode(value) {
	return leaseErrorCodes.some((code) => code === value);
}
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
const MESSAGE_ONLY_ERRORS = {
	"duplicate-agent": DuplicateAgentError,
	"session-pending-input-custody": SessionPendingInputCustodyError,
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
	if (error instanceof PluginStateStoreError) return {
		type: "plugin-state",
		stateCode: error.code,
		operation: error.operation,
		path: error.path,
		owner: error.owner
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
	if (error instanceof SqliteSessionMutationConflictError) return {
		type: "session-mutation-conflict",
		operationLabel: error.operationLabel
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
function isBlobCode(value) {
	return value === "PLUGIN_BLOB_OPEN_FAILED" || value === "PLUGIN_BLOB_WRITE_FAILED" || value === "PLUGIN_BLOB_READ_FAILED" || value === "PLUGIN_BLOB_CORRUPT" || value === "PLUGIN_BLOB_LIMIT_EXCEEDED" || value === "PLUGIN_BLOB_INVALID_INPUT";
}
function isBlobOperation(value) {
	return value === "open" || value === "register" || value === "lookup" || value === "delete" || value === "entries" || value === "clear" || value === "sweep";
}
function isSkillLibraryCode(value) {
	return value === "IDENTITY_REQUIRED" || value === "FORBIDDEN" || value === "NOT_FOUND" || value === "CONFLICT" || value === "NAME_CONFLICT" || value === "INVALID_BUNDLE" || value === "POLICY_BLOCKED" || value === "AUTHORITY_EXPIRED" || value === "LIMIT";
}
function parseIdentity(node) {
	if (isMessageOnlyErrorIdentity(node)) return { type: node.type };
	switch (node.type) {
		case "plugin-state": {
			const codes = [
				"PLUGIN_STATE_SQLITE_UNAVAILABLE",
				"PLUGIN_STATE_OPEN_FAILED",
				"PLUGIN_STATE_WRITE_FAILED",
				"PLUGIN_STATE_READ_FAILED",
				"PLUGIN_STATE_CORRUPT",
				"PLUGIN_STATE_LIMIT_EXCEEDED",
				"PLUGIN_STATE_INVALID_INPUT"
			];
			const operations = [
				"load-sqlite",
				"open",
				"ensure-schema",
				"register",
				"lookup",
				"consume",
				"delete",
				"entries",
				"count",
				"clear",
				"sweep",
				"probe",
				"close"
			];
			const stateCode = codes.find((code) => code === node.stateCode && code === node.code);
			const operation = operations.find((candidate) => candidate === node.operation);
			const owner = node.owner;
			return stateCode && operation && isRecord(owner) && typeof owner.pid === "number" && typeof owner.threadId === "number" && typeof owner.version === "string" && (node.path === void 0 || typeof node.path === "string") ? {
				type: node.type,
				stateCode,
				operation,
				owner: {
					pid: owner.pid,
					threadId: owner.threadId,
					version: owner.version
				},
				...typeof node.path === "string" ? { path: node.path } : {}
			} : void 0;
		}
		case "skill-library": return isSkillLibraryCode(node.libraryCode) && node.code === node.libraryCode && (node.currentRevision === void 0 || typeof node.currentRevision === "string") ? {
			type: node.type,
			libraryCode: node.libraryCode,
			...typeof node.currentRevision === "string" ? { currentRevision: node.currentRevision } : {}
		} : void 0;
		case "secret-store-validation": return isSecretStoreValidationCode(node.secretCode) && node.code === node.secretCode ? {
			type: node.type,
			secretCode: node.secretCode
		} : void 0;
		case "worker-session-already-attached": return typeof node.sessionId === "string" && typeof node.environmentId === "string" ? {
			type: node.type,
			sessionId: node.sessionId,
			environmentId: node.environmentId
		} : void 0;
		case "workspace-alias-repointed": return typeof node.aliasPath === "string" && typeof node.storedWorkspacePath === "string" && typeof node.currentWorkspacePath === "string" ? {
			type: node.type,
			aliasPath: node.aliasPath,
			storedWorkspacePath: node.storedWorkspacePath,
			currentWorkspacePath: node.currentWorkspacePath
		} : void 0;
		case "error":
		case "aggregate":
		case "mcp-oauth-corruption": return { type: node.type };
		case "session-goal-operation": {
			const goalCode = SESSION_GOAL_OPERATION_ERROR_CODES.find((code) => code === node.goalCode);
			return goalCode && node.code === goalCode ? {
				type: node.type,
				goalCode
			} : void 0;
		}
		case "session-mutation-conflict": return typeof node.operationLabel === "string" ? {
			type: node.type,
			operationLabel: node.operationLabel
		} : void 0;
		case "session-metadata": return (node.reason === "schema-missing" || node.reason === "table-missing") && Array.isArray(node.missingTables) && node.missingTables.every((table) => typeof table === "string") ? {
			type: node.type,
			reason: node.reason,
			missingTables: [...node.missingTables]
		} : void 0;
		case "state-owner-contention":
		case "ownership-metadata": return typeof node.databasePath === "string" ? {
			type: node.type,
			databasePath: node.databasePath
		} : void 0;
		case "external-ownership": return typeof node.databasePath === "string" && typeof node.managerId === "string" ? {
			type: node.type,
			databasePath: node.databasePath,
			managerId: node.managerId
		} : void 0;
		case "plugin-blob": return isBlobCode(node.blobCode) && node.code === node.blobCode && isBlobOperation(node.operation) && (node.path === void 0 || typeof node.path === "string") ? {
			type: node.type,
			blobCode: node.blobCode,
			operation: node.operation,
			...typeof node.path === "string" ? { path: node.path } : {}
		} : void 0;
		case "state-lease": return isOpenClawStateLeaseErrorCode(node.leaseCode) && node.code === node.leaseCode ? {
			type: node.type,
			leaseCode: node.leaseCode
		} : void 0;
		case "maintenance": return isStartupMaintenanceKind(node.kind) ? {
			type: node.type,
			kind: node.kind
		} : void 0;
		case "state-migration": return (node.kind === "audit-events-v2" || node.kind === "legacy-cron-run-logs" || node.kind === "legacy-workshop-review-index") && typeof node.pathname === "string" ? {
			type: node.type,
			kind: node.kind,
			pathname: node.pathname
		} : void 0;
		case "agent-media-migration": return typeof node.pathname === "string" && typeof node.schemaVersion === "number" && Number.isSafeInteger(node.schemaVersion) && node.schemaVersion >= 0 ? {
			type: node.type,
			pathname: node.pathname,
			schemaVersion: node.schemaVersion
		} : void 0;
		default: return;
	}
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
		case "session-mutation-conflict": return new SqliteSessionMutationConflictError(node.operationLabel);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
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
			const identity = identifyError(current);
			const nativeOpen = isSqliteNativeOpenFailure(current);
			const stateDatabasePath = readOpenClawStateDatabaseFailurePath(current);
			canonical ||= stateDatabasePath !== void 0 || nativeOpen || isSqliteLockError(current) || current instanceof OpenClawQuarantineReadCleanupError || identity.type !== "error" && identity.type !== "aggregate";
			const code = "code" in current ? current.code : void 0;
			const errcode = "errcode" in current ? current.errcode : void 0;
			const errno = "errno" in current ? current.errno : void 0;
			nodes.push({
				...identity,
				name: current.name,
				message: current.message,
				...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {},
				...isNativeErrorCode(errcode) ? { errcode } : {},
				...typeof errno === "number" && Number.isInteger(errno) ? { errno } : {},
				...nativeOpen ? { nativeOpen: true } : {},
				...stateDatabasePath === void 0 ? {} : { stateDatabasePath },
				..."cause" in current ? { cause: encodeValue(current.cause) } : {},
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
function isErrorValue(value, count) {
	if (!isRecord(value) || Object.keys(value).length !== 1) return false;
	if ("ref" in value) return typeof value.ref === "number" && Number.isSafeInteger(value.ref) && value.ref >= 0 && value.ref < count;
	return "value" in value ? isScalar(value.value) : value.undefined === true;
}
function parseNode(value, count) {
	if (!isRecord(value) || typeof value.name !== "string" || typeof value.message !== "string") return;
	const identity = parseIdentity(value);
	if (!identity) return;
	const allowed = /* @__PURE__ */ new Set([
		...Object.keys(identity),
		"name",
		"message",
		"code",
		"errcode",
		"errno",
		"nativeOpen",
		"stateDatabasePath",
		"cause"
	]);
	const errors = [];
	if (identity.type === "aggregate") {
		allowed.add("errors");
		if (!Array.isArray(value.errors)) return;
		for (const entry of value.errors) {
			if (!isErrorValue(entry, count)) return;
			errors.push(entry);
		}
	}
	if (Object.keys(value).some((key) => !allowed.has(key)) || "code" in value && typeof value.code !== "string" && !(typeof value.code === "number" && Number.isFinite(value.code)) || "errcode" in value && !isNativeErrorCode(value.errcode) || "errno" in value && (typeof value.errno !== "number" || !Number.isInteger(value.errno)) || "nativeOpen" in value && value.nativeOpen !== true || "stateDatabasePath" in value && typeof value.stateDatabasePath !== "string" || "cause" in value && !isErrorValue(value.cause, count)) return;
	return {
		...identity,
		name: value.name,
		message: value.message,
		...typeof value.code === "string" || typeof value.code === "number" ? { code: value.code } : {},
		...isNativeErrorCode(value.errcode) ? { errcode: value.errcode } : {},
		...typeof value.errno === "number" ? { errno: value.errno } : {},
		...value.nativeOpen === true ? { nativeOpen: true } : {},
		...typeof value.stateDatabasePath === "string" ? { stateDatabasePath: value.stateDatabasePath } : {},
		...isErrorValue(value.cause, count) ? { cause: value.cause } : {},
		...identity.type === "aggregate" ? { errors } : {}
	};
}
function decodeErrorGraph(value, options) {
	try {
		if (!isRecord(value) || Object.keys(value).some((key) => ![
			"version",
			"root",
			"nodes"
		].includes(key)) || value.version !== 1 || !Array.isArray(value.nodes) || typeof value.root !== "number" || !Number.isSafeInteger(value.root) || value.root < 0 || value.root >= value.nodes.length) return;
		const nodes = [];
		for (const valueNode of value.nodes) {
			const node = parseNode(valueNode, value.nodes.length);
			if (!node) return;
			nodes.push(node);
		}
		const visited = /* @__PURE__ */ new Set();
		const pending = [value.root];
		let canonical = false;
		for (const ref of pending) {
			if (visited.has(ref)) continue;
			visited.add(ref);
			const node = nodes[ref];
			canonical ||= node.stateDatabasePath !== void 0 || node.nativeOpen === true || isSqliteLockError(node) || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate";
			for (const edge of [...node.cause ? [node.cause] : [], ...node.errors ?? []]) if ("ref" in edge) pending.push(edge.ref);
		}
		if (!canonical && options.includeOrdinary !== true || visited.size !== nodes.length) return;
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
		const group = Object.freeze({});
		for (const [index, error] of errors.entries()) retainPayload(error, value, index, true, group);
		return {
			errors,
			nodes,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloadKey = Symbol.for("openclaw.sharedStateWorkerErrorPayload");
function retainPayload(error, payload, node, materialized, group) {
	Object.defineProperty(error, retainedPayloadKey, { value: Object.freeze({
		payload,
		node,
		materialized,
		group
	}) });
}
/** Keep the closed wire graph without binding it to a process-global broker's classes. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	retainPayload(error, payload, 0, false, Object.freeze({}));
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const groups = /* @__PURE__ */ new Map();
	const nodes = /* @__PURE__ */ new Map();
	const queue = [];
	const add = (error) => {
		const previous = nodes.get(error);
		if (previous) return previous;
		const node = {
			source: error,
			replacement: error,
			parents: /* @__PURE__ */ new Set(),
			changed: false,
			opaque: false
		};
		nodes.set(error, node);
		queue.push(node);
		const retained = Object.getOwnPropertyDescriptor(error, retainedPayloadKey)?.value;
		if (isRecord(retained) && typeof retained.node === "number" && Number.isSafeInteger(retained.node) && retained.node >= 0 && typeof retained.materialized === "boolean" && isRecord(retained.group)) {
			if (!groups.has(retained.group)) groups.set(retained.group, decodeErrorGraph(retained.payload, options));
			const graph = groups.get(retained.group);
			const index = retained.materialized ? retained.node : graph?.root;
			const replacement = index === void 0 ? void 0 : graph?.errors[index];
			const identity = index === void 0 ? void 0 : graph?.nodes[index];
			if (replacement && identity) {
				node.replacement = replacement;
				node.opaque = !retained.materialized;
				node.changed = node.opaque || identifyError(error).type !== identity.type;
			}
		}
		return node;
	};
	const root = add(value);
	for (const node of queue) {
		if (node.opaque) continue;
		const edge = (child) => {
			if (child instanceof Error) add(child).parents.add(node);
		};
		if ("cause" in node.source) {
			node.cause = { value: node.source.cause };
			edge(node.cause.value);
		}
		if (node.source instanceof AggregateError) {
			node.errors = [...node.source.errors];
			node.errors.forEach(edge);
		}
	}
	const affected = queue.filter((node) => node.changed);
	for (const node of affected) for (const parent of node.parents) if (!parent.changed) {
		parent.changed = true;
		affected.push(parent);
	}
	if (!root.changed) return value;
	for (const node of affected) if (node.replacement === node.source) {
		node.replacement = node.source instanceof AggregateError ? new AggregateError([], node.source.message) : new Error(node.source.message);
		Object.setPrototypeOf(node.replacement, Object.getPrototypeOf(node.source));
	}
	const replace = (child) => {
		const node = child instanceof Error ? nodes.get(child) : void 0;
		return node?.changed ? node.replacement : child;
	};
	for (const node of affected) {
		if (node.opaque) continue;
		const descriptors = Object.getOwnPropertyDescriptors(node.source);
		Reflect.deleteProperty(descriptors, retainedPayloadKey);
		if (node.cause) descriptors.cause = {
			configurable: descriptors.cause?.configurable ?? true,
			enumerable: descriptors.cause?.enumerable ?? false,
			writable: descriptors.cause?.writable ?? true,
			value: replace(node.cause.value)
		};
		if (node.errors) descriptors.errors = {
			configurable: descriptors.errors?.configurable ?? true,
			enumerable: descriptors.errors?.enumerable ?? false,
			writable: descriptors.errors?.writable ?? true,
			value: node.errors.map(replace)
		};
		Object.defineProperties(node.replacement, descriptors);
	}
	return root.replacement;
}
//#endregion
//#region node-compile-cache.mjs
const MAX_BYTES = 536870912;
const MAX_AGE_MS = 6048e5;
const MAINTENANCE_INTERVAL_MS = 36e5;
const BUILD_MARKER_RE = /^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/;
const sanitize = (value) => {
	const segment = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return segment && segment !== "." && segment !== ".." ? segment : "unknown";
};
function resolveSafeNodeCompileCacheDirectory(directory) {
	if (process.platform === "win32" && path.resolve(directory).length > 200) {
		process.stderr.write("[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.\n");
		return;
	}
	return directory;
}
async function maintain(directory) {
	const root = path.dirname(path.dirname(directory));
	const version = path.basename(path.dirname(directory));
	if (path.basename(root) !== "openclaw" || sanitize(version) !== version || !BUILD_MARKER_RE.test(path.basename(directory))) return;
	const now = Date.now();
	const previous = await fs.lstat(root).catch(() => void 0);
	for (const target of [
		root,
		path.dirname(directory),
		directory
	]) {
		const stat = target === root ? previous : await fs.lstat(target).catch(() => void 0);
		if (stat && !stat.isDirectory()) return;
	}
	await fs.mkdir(directory, { recursive: true });
	let retired = false;
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const versionRoot = path.join(root, entry.name);
		for (const build of await fs.readdir(versionRoot, { withFileTypes: true })) {
			const candidate = path.join(versionRoot, build.name);
			if (build.isDirectory() && candidate !== directory) {
				await fs.rm(candidate, {
					recursive: true,
					force: true
				});
				retired = true;
			}
		}
		if (versionRoot !== path.dirname(directory)) await fs.rmdir(versionRoot).catch(() => {});
	}
	if (!retired && previous && now - previous.mtimeMs < MAINTENANCE_INTERVAL_MS) return;
	await fs.utimes(root, new Date(now), new Date(now));
	const files = [];
	let bytes = 0;
	async function visit(dir) {
		for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
			const file = path.join(dir, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isFile()) {
				const stat = await fs.lstat(file);
				bytes += stat.size;
				files.push({
					file,
					size: stat.size,
					mtimeMs: stat.mtimeMs
				});
			}
		}
	}
	await visit(directory);
	files.sort((left, right) => left.mtimeMs - right.mtimeMs);
	for (const file of files) if (bytes > MAX_BYTES || now - file.mtimeMs > MAX_AGE_MS) {
		await fs.unlink(file.file);
		bytes -= file.size;
	}
}
if (!isMainThread && typeof workerData?.openclawCompileCacheDirectory === "string") maintain(workerData.openclawCompileCacheDirectory).catch(() => {});
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = env.NODE_COMPILE_CACHE ?? compileCacheOwner().baseDirectory;
	if (directory && !resolveSafeNodeCompileCacheDirectory(directory)) {
		const disabled = {
			...env,
			NODE_DISABLE_COMPILE_CACHE: "1"
		};
		delete disabled.NODE_COMPILE_CACHE;
		return disabled;
	}
	if (env.NODE_COMPILE_CACHE !== void 0) return env;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
//#region src/infra/sqlite-worker-transfer.ts
const SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
/** One owned result cursor; callers supply records and any associated cleanup. */
function createSqliteWorkerTransferOwner() {
	let nextId = 0;
	let current;
	const cleanup = (transfer) => {
		const errors = [];
		if (!transfer.iteratorClosed) try {
			transfer.iterator.return?.();
			transfer.iteratorClosed = true;
		} catch (error) {
			errors.push(error);
		}
		if (!transfer.cleaned) try {
			transfer.cleanup?.();
			transfer.cleaned = true;
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "SQLite read transfer cleanup failed");
	};
	const cancel = () => {
		if (current) {
			cleanup(current);
			current = void 0;
		}
	};
	const requireTransfer = (id) => {
		if (!current || current.id !== id) throw new Error("SQLite read transfer is no longer active");
		return current;
	};
	return {
		start(iterator, options) {
			if (current) throw new Error("The preceding SQLite read transfer was not released");
			current = {
				id: ++nextId,
				iterator,
				cleanup: options.cleanup,
				iteratorClosed: false,
				cleaned: false,
				counts: new Map(options.kinds.map((kind) => [kind, 0])),
				sequence: 0,
				finished: false
			};
			return {
				id: current.id,
				kinds: [...current.counts.keys()]
			};
		},
		next(id) {
			const transfer = requireTransfer(id);
			if (transfer.finished) throw new Error("SQLite read transfer has already reached its end");
			if (transfer.record && transfer.record.offset === transfer.record.bytes.byteLength) transfer.record = void 0;
			if (!transfer.record) {
				const next = transfer.iterator.next();
				if (next.done) {
					cleanup(transfer);
					transfer.finished = true;
					return {
						id,
						sequence: transfer.sequence++,
						done: true,
						counts: [...transfer.counts]
					};
				}
				const { kind } = next.value;
				const count = transfer.counts.get(kind);
				if (count === void 0) throw new Error("SQLite read transfer returned an unexpected record kind");
				transfer.record = {
					kind,
					bytes: "serialized" in next.value ? next.value.serialized : serialize(next.value.value),
					offset: 0
				};
				transfer.counts.set(kind, count + 1);
			}
			const record = transfer.record;
			const offset = record.offset;
			const end = Math.min(record.bytes.byteLength, offset + SQLITE_WORKER_TRANSFER_FRAME_BYTES);
			record.offset = end;
			return {
				id,
				sequence: transfer.sequence++,
				done: false,
				kind: record.kind,
				recordBytes: record.bytes.byteLength,
				offset,
				recordDone: end === record.bytes.byteLength,
				bytes: new Uint8Array(record.bytes.subarray(offset, end))
			};
		},
		end(id) {
			if (!requireTransfer(id).finished) throw new Error("SQLite read transfer ended before its complete result");
			cancel();
		},
		cancel,
		close: cancel
	};
}
/** Reassembles one transfer; its caller owns transport completion and cancellation. */
function createSqliteWorkerTransferReceiver(handle, consume) {
	const counts = new Map(handle.kinds.map((kind) => [kind, 0]));
	let sequence = 0;
	let finished = false;
	let record;
	return { accept(frame) {
		try {
			if (finished || frame.id !== handle.id || frame.sequence !== sequence++) throw new Error("SQLite read transfer frame is out of order");
			if (frame.done) {
				if (record || frame.counts.length !== counts.size || frame.counts.some(([kind, count]) => counts.get(kind) !== count) || new Set(frame.counts.map(([kind]) => kind)).size !== counts.size) throw new Error("SQLite read transfer ended with an incomplete result");
				finished = true;
				return frame.counts;
			}
			const count = counts.get(frame.kind);
			if (count === void 0 || !Number.isSafeInteger(frame.recordBytes) || frame.recordBytes < 1 || !Number.isSafeInteger(frame.offset) || frame.offset < 0 || frame.bytes.byteLength < 1 || frame.bytes.byteLength > 8388608) throw new Error("SQLite read transfer returned an invalid frame");
			if (!record) {
				if (frame.offset !== 0) throw new Error("SQLite read transfer omitted the start of a record");
				record = {
					kind: frame.kind,
					bytes: new Uint8Array(frame.recordBytes),
					offset: 0
				};
			}
			const end = frame.offset + frame.bytes.byteLength;
			if (record.kind !== frame.kind || record.bytes.byteLength !== frame.recordBytes || record.offset !== frame.offset || end > frame.recordBytes || frame.recordDone !== (end === frame.recordBytes)) throw new Error("SQLite read transfer returned a discontinuous record");
			record.bytes.set(frame.bytes, frame.offset);
			record.offset = end;
			if (frame.recordDone) {
				const value = deserialize(record.bytes);
				const kind = record.kind;
				record = void 0;
				consume({
					kind,
					value
				});
				counts.set(kind, count + 1);
			}
			return;
		} catch (error) {
			record = void 0;
			finished = true;
			throw error;
		}
	} };
}
//#endregion
export { hydrateOpenClawStateWorkerError as a, SecretStoreValidationError as c, encodeOpenClawStateWorkerError as i, createSqliteWorkerTransferReceiver as n, retainOpenClawStateWorkerErrorPayload as o, resolveNodeCompileCacheEnv as r, SECRET_STORE_VALUE_MAX_BYTES as s, createSqliteWorkerTransferOwner as t };
