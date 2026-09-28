import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as markSqliteNativeOpenFailure, o as isSqliteNativeOpenFailure } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { t as SqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { T as StateDatabaseCoordinatorContentionError } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { n as OpenClawQuarantineReadCleanupError } from "./openclaw-quarantine-error-C9XbnAvW.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError } from "./openclaw-state-db-schema-migration-required-x5nU_jtc.mjs";
import { n as OpenClawStateOwnershipError, r as OpenClawStateOwnershipMetadataError, t as OpenClawStateExternalOwnershipError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { n as WorkspaceAliasRepointedError } from "./workspace-state-identity-CmGr5k4K.mjs";
import { t as OpenClawAgentDatabaseMediaMigrationRequiredError } from "./openclaw-agent-db-migration-required-Bp9xKbe6.mjs";
import { a as isOpenClawStateLeaseErrorCode, n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
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
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
function identifyError(error) {
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
	if (error instanceof SessionMetadataUnavailableError) return {
		type: "session-metadata",
		reason: error.reason,
		missingTables: [...error.missingTables]
	};
	if (error instanceof SkillUploadRequestError) return { type: "skill-upload-request" };
	if (error instanceof StateDatabaseCoordinatorContentionError) return {
		type: "coordinator-contention",
		family: error.family
	};
	if (error instanceof SqliteCoordinatorError) return { type: "coordinator" };
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
	if (error instanceof OpenClawStateOwnershipError) return { type: "ownership" };
	if (error instanceof SqliteSchemaVersionError) return { type: "newer-schema" };
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
	if (error instanceof StartupMaintenanceRequiredError) return {
		type: "maintenance",
		kind: error.kind
	};
	if (error instanceof RangeError) return { type: "range-error" };
	if (error instanceof SyntaxError) return { type: "syntax-error" };
	if (error instanceof TypeError) return { type: "type-error" };
	return { type: error instanceof AggregateError ? "aggregate" : "error" };
}
function isMaintenanceKind(kind) {
	return kind === "newer-schema" || kind === "agent-media" || kind === "agent-databases-composite-primary-key" || kind === "audit-events-v2" || kind === "legacy-cron-run-logs" || kind === "legacy-workshop-review-index" || kind === "legacy-workspace" || kind === "legacy-session-store";
}
function isBlobCode(value) {
	return value === "PLUGIN_BLOB_OPEN_FAILED" || value === "PLUGIN_BLOB_WRITE_FAILED" || value === "PLUGIN_BLOB_READ_FAILED" || value === "PLUGIN_BLOB_CORRUPT" || value === "PLUGIN_BLOB_LIMIT_EXCEEDED" || value === "PLUGIN_BLOB_INVALID_INPUT";
}
function isBlobOperation(value) {
	return value === "open" || value === "register" || value === "lookup" || value === "delete" || value === "entries" || value === "clear" || value === "sweep";
}
function parseIdentity(node) {
	switch (node.type) {
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
		case "ownership":
		case "newer-schema":
		case "coordinator":
		case "range-error":
		case "syntax-error":
		case "type-error":
		case "skill-upload-request":
		case "mcp-oauth-corruption": return { type: node.type };
		case "session-metadata": return (node.reason === "schema-missing" || node.reason === "table-missing") && Array.isArray(node.missingTables) && node.missingTables.every((table) => typeof table === "string") ? {
			type: node.type,
			reason: node.reason,
			missingTables: [...node.missingTables]
		} : void 0;
		case "coordinator-contention": return node.family === "gateway-lifecycle" || node.family === "state-lifecycle" || node.family === "state-handles" ? {
			type: node.type,
			family: node.family
		} : void 0;
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
		case "maintenance": return isMaintenanceKind(node.kind) ? {
			type: node.type,
			kind: node.kind
		} : void 0;
		case "state-migration": return (node.kind === "agent-databases-composite-primary-key" || node.kind === "audit-events-v2" || node.kind === "legacy-cron-run-logs" || node.kind === "legacy-workshop-review-index") && typeof node.pathname === "string" ? {
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
	switch (node.type) {
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "range-error": return new RangeError(node.message);
		case "syntax-error": return new SyntaxError(node.message);
		case "type-error": return new TypeError(node.message);
		case "skill-upload-request": return new SkillUploadRequestError(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "coordinator": return new SqliteCoordinatorError(node.message);
		case "coordinator-contention": return new StateDatabaseCoordinatorContentionError(node.family);
		case "ownership": return new OpenClawStateOwnershipError(node.message);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "newer-schema": return new SqliteSchemaVersionError(node.message);
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
			canonical ||= nativeOpen || current instanceof OpenClawQuarantineReadCleanupError || identity.type !== "error" && identity.type !== "aggregate";
			const code = "code" in current ? current.code : void 0;
			const errcode = "errcode" in current ? current.errcode : void 0;
			nodes.push({
				...identity,
				name: current.name,
				message: current.message,
				...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {},
				...isNativeErrorCode(errcode) ? { errcode } : {},
				...nativeOpen ? { nativeOpen: true } : {},
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
		"nativeOpen",
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
	if (Object.keys(value).some((key) => !allowed.has(key)) || "code" in value && typeof value.code !== "string" && !(typeof value.code === "number" && Number.isFinite(value.code)) || "errcode" in value && !isNativeErrorCode(value.errcode) || "nativeOpen" in value && value.nativeOpen !== true || "cause" in value && !isErrorValue(value.cause, count)) return;
	return {
		...identity,
		name: value.name,
		message: value.message,
		...typeof value.code === "string" || typeof value.code === "number" ? { code: value.code } : {},
		...isNativeErrorCode(value.errcode) ? { errcode: value.errcode } : {},
		...value.nativeOpen === true ? { nativeOpen: true } : {},
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
			canonical ||= node.nativeOpen === true || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate";
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
			if (node.code !== void 0) Object.defineProperty(error, "code", {
				value: node.code,
				configurable: true,
				writable: true
			});
			if (node.errcode !== void 0) Object.defineProperty(error, "errcode", {
				value: node.errcode,
				configurable: true,
				writable: true
			});
			if (node.cause) Object.defineProperty(error, "cause", {
				value: decodeValue(node.cause),
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
export { PluginBlobStoreError as a, SkillUploadRequestError as i, hydrateOpenClawStateWorkerError as n, WorkerSessionAlreadyAttachedError as o, retainOpenClawStateWorkerErrorPayload as r, McpOAuthStoreCorruptionError as s, encodeOpenClawStateWorkerError as t };
