import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as isSqliteLockError, c as markSqliteNativeOpenFailure, o as isSqliteNativeOpenFailure } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { i as SqliteCoordinatorError, n as OpenClawStateOwnershipError, r as OpenClawStateOwnershipMetadataError, t as OpenClawStateExternalOwnershipError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { i as isStartupMaintenanceKind, n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-rkhEAmAi.mjs";
import { t as SqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-DmHycK5o.mjs";
import { n as OpenClawQuarantineReadCleanupError } from "./openclaw-quarantine-error-CU2L6W3q.mjs";
import { n as markOpenClawStateDatabaseFailure, r as readOpenClawStateDatabaseFailurePath } from "./openclaw-state-db-failure-3stJt7Pa.mjs";
import { n as WorkspaceAliasRepointedError } from "./workspace-state-identity-EPAs22n_.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { n as SecretStoreValidationError, r as isSecretStoreValidationCode } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as OpenClawAgentDatabaseMediaMigrationRequiredError } from "./openclaw-agent-db-migration-required-0XUxEh33.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError } from "./openclaw-state-db-schema-migration-required-BpllCelk.mjs";
import { n as OpenClawStateLeaseError, o as isOpenClawStateLeaseErrorCode } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { threadId } from "node:worker_threads";
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
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
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
export { PluginStateStoreError as a, WorkerSessionAlreadyAttachedError as c, McpOAuthStoreCorruptionError as d, DuplicateAgentError as f, SkillUploadRequestError as i, SqliteSessionMutationConflictError as l, hydrateOpenClawStateWorkerError as n, capturePluginStateErrorCause as o, retainOpenClawStateWorkerErrorPayload as r, PluginBlobStoreError as s, encodeOpenClawStateWorkerError as t, SessionGoalOperationError as u };
