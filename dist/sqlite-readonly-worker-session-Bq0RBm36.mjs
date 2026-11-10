import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { l as readDatabaseFileIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getSqliteDatabaseAdmissionIdentityForPath, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { _ as schemaAdmission } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { t as BrokerChild } from "./child-DRcH2L5b.mjs";
import { d as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { r as recordChildProcessSpawn } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { i as createSqliteWorkerTransferReceiver } from "./sqlite-worker-transfer-BHUd6Qxu.mjs";
import { n as markPrivateDirectoryCreationRefused } from "./private-directory-creation-DNydTBRE.mjs";
import path from "node:path";
import { toUSVString } from "node:util";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { serialize } from "node:v8";
//#region src/infra/sqlite-readonly-auth-schema.ts
/** Project live owner facts; never retain a closed database's schema in the child. */
function captureSqliteAuthSchema(pathname, expectedIdentity) {
	if (getSqliteDatabaseAdmissionIdentityForPath(pathname)?.key !== expectedIdentity) return;
	const schema = getOrLoadSqliteDatabaseAdmissionForPath(pathname, schemaAdmission, () => void 0);
	if (!schema) return;
	const kind = (name) => schema.tables.has(name) ? "table" : schema.views.has(name) || schema.indexes.has(name) || schema.triggers.has(name) ? "other" : "missing";
	return {
		userVersion: schema.userVersion,
		store: kind("auth_profile_store"),
		state: kind("auth_profile_state")
	};
}
//#endregion
//#region src/infra/json-field-transfer.ts
const JSON_FIELD_TRANSFER_BYTES = 65536;
const STRING_CHARS = 8192;
function* jsonFieldBatches(value) {
	let batch = [];
	let bytes = 16;
	for (const field of fields(value)) {
		const size = serialize(field).byteLength + 16;
		if (bytes + size > 65536) {
			yield batch;
			batch = [];
			bytes = 16;
		}
		batch.push(field);
		bytes += size;
	}
	if (batch.length) yield batch;
}
function* textFields(kind, value) {
	yield {
		kind,
		value: value.slice(0, STRING_CHARS)
	};
	for (let offset = STRING_CHARS; offset < value.length; offset += STRING_CHARS) yield {
		kind,
		value: value.slice(offset, offset + STRING_CHARS),
		append: true
	};
}
function* fields(value) {
	if (value === void 0) return;
	if (typeof value === "string") yield* textFields("value", value);
	else if (value === null || typeof value === "boolean" || typeof value === "number") yield {
		kind: "value",
		value: typeof value === "number" && !Number.isFinite(value) ? null : value
	};
	else if (typeof value === "object") {
		yield { kind: Array.isArray(value) ? "array" : "object" };
		for (const [key, child] of Object.entries(value)) if (child !== void 0) {
			yield* textFields("key", key);
			yield* fields(child);
		}
		yield { kind: "end" };
	} else throw new TypeError(`JSON document contains non-JSON value: ${typeof value}`);
}
function isJsonTransferField(field) {
	if (!isRecord(field)) return false;
	if (field.kind === "object" || field.kind === "array" || field.kind === "end") return true;
	return (field.kind === "key" || field.kind === "value") && (field.append === void 0 || field.append === true && typeof field.value === "string") && (typeof field.value === "string" || field.kind === "value" && (field.value === null || typeof field.value === "boolean" || typeof field.value === "number"));
}
function createJsonFieldReceiver() {
	let root;
	let hasRoot = false;
	const stack = [];
	let pending;
	const write = (value) => {
		const parent = stack.at(-1);
		if (parent) {
			if (parent.key === void 0) throw new Error("JSON field has no property key");
			Object.defineProperty(parent.container, parent.key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
			parent.key = void 0;
		} else {
			if (hasRoot) throw new Error("JSON transfer has more than one root");
			root = value;
			hasRoot = true;
		}
	};
	const flush = () => {
		if (!pending) return;
		const value = pending.chunks.join("");
		if (pending.kind === "key") {
			const parent = stack.at(-1);
			if (!parent || parent.key !== void 0) throw new Error("JSON property key has no value or container");
			parent.key = value;
		} else write(value);
		pending = void 0;
	};
	return {
		accept(field) {
			if (!isJsonTransferField(field)) throw new Error("Invalid JSON transfer field");
			if (field.kind === "key" || field.kind === "value") {
				if (field.append) {
					if (!pending || pending.kind !== field.kind || typeof field.value !== "string") throw new Error("Invalid JSON string continuation");
					pending.chunks.push(field.value);
					return;
				}
				flush();
				if (typeof field.value === "string") pending = {
					kind: field.kind,
					chunks: [field.value]
				};
				else write(field.value);
			} else {
				flush();
				if (field.kind === "end") {
					const parent = stack.pop();
					if (!parent || parent.key !== void 0) throw new Error("JSON container ended with an incomplete field");
				} else {
					const container = field.kind === "array" ? [] : {};
					write(container);
					stack.push({ container });
				}
			}
		},
		finish() {
			flush();
			if (stack.length) throw new Error("JSON transfer ended with an incomplete container");
			return root;
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
function decodeFrame(value, label) {
	if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence)) throw new Error(`Invalid ${label} transfer frame`);
	const { id, sequence } = value;
	if (value.done === true && Array.isArray(value.counts)) {
		const counts = [];
		for (const entry of value.counts) {
			if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "number" || !Number.isSafeInteger(entry[1]) || entry[1] < 0) throw new Error(`Invalid ${label} transfer counts`);
			counts.push([entry[0], entry[1]]);
		}
		return {
			id,
			sequence,
			done: true,
			counts
		};
	}
	if (value.done !== false || typeof value.kind !== "string" || typeof value.recordBytes !== "number" || typeof value.offset !== "number" || typeof value.recordDone !== "boolean" || typeof value.bytes !== "string" || value.bytes.length > 4 * Math.ceil(8388608 / 3)) throw new Error(`Invalid ${label} transfer bytes`);
	const bytes = Buffer.from(value.bytes, "base64");
	if (bytes.toString("base64") !== value.bytes) throw new Error(`Invalid ${label} transfer encoding`);
	return {
		id,
		sequence,
		done: false,
		kind: value.kind,
		recordBytes: value.recordBytes,
		offset: value.offset,
		recordDone: value.recordDone,
		bytes
	};
}
function createSqliteReadOnlyTransferReceiver(options) {
	let receiver;
	let transferId;
	let ending = false;
	let completed = false;
	return { accept(value) {
		if (!isRecord(value) || completed) throw new Error(`Invalid ${options.label} transfer response`);
		if (value.type === "start" && !receiver) {
			const handle = value.handle;
			if (!isRecord(handle) || typeof handle.id !== "number" || !Number.isSafeInteger(handle.id) || handle.id < 1 || !Array.isArray(handle.kinds) || handle.kinds.length !== options.kinds.length || handle.kinds.some((kind, index) => kind !== options.kinds[index])) throw new Error(`Invalid ${options.label} transfer handle`);
			transferId = handle.id;
			receiver = createSqliteWorkerTransferReceiver({
				id: transferId,
				kinds: options.kinds
			}, ({ kind, value: record }) => options.acceptRecord(kind, record));
			return { request: {
				type: "next",
				transferId
			} };
		}
		if (!receiver || transferId === void 0) throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer has not started`);
		if (value.type === "frame" && !ending) {
			const frame = decodeFrame(value.frame, options.label);
			if (!frame.done && options.maxRecordBytes && frame.recordBytes > options.maxRecordBytes) throw new Error(`${options.label} transfer record exceeds its bound`);
			const counts = receiver.accept(frame);
			if (counts) {
				if (counts.length !== options.kinds.length || counts.some(([, count]) => count < 1)) throw new Error(`Incomplete ${options.label} transfer result`);
				ending = true;
			}
			return { request: {
				type: ending ? "end" : "next",
				transferId
			} };
		}
		if (value.type === "complete" && ending) {
			completed = true;
			return { value: options.readResult() };
		}
		throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer response is out of order`);
	} };
}
function createSqliteAuthTransferReceiver() {
	const receiver = createJsonFieldReceiver();
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["fields"],
		label: "auth profile",
		maxRecordBytes: JSON_FIELD_TRANSFER_BYTES,
		acceptRecord(_kind, batch) {
			if (!Array.isArray(batch)) throw new Error("Invalid auth profile field batch");
			for (const field of batch) receiver.accept(field);
		},
		readResult() {
			const rows = receiver.finish();
			if (!isRecord(rows) || !("store" in rows) || !("state" in rows) || typeof rows.cacheable !== "boolean") throw new Error("Invalid auth profile transfer rows");
			return {
				store: rows.store,
				state: rows.state,
				cacheable: rows.cacheable
			};
		}
	});
}
function createSqliteOperationTransferReceiver(operation) {
	let result;
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["result"],
		label: "SQLite operation",
		acceptRecord(_kind, record) {
			if (result || !isRecord(record) || record.operation !== operation || !("value" in record)) throw new Error("SQLite read-only worker returned a different or duplicate operation");
			result = {
				operation,
				value: record.value
			};
		},
		readResult() {
			if (!result) throw new Error("SQLite read-only worker returned no operation");
			return result;
		}
	});
}
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	const args = [options.mode, path.resolve(pathname)];
	const stagingRoot = options.stagingRoot && path.resolve(options.stagingRoot);
	const expected = options.mode === "auth-profile-rows" || options.mode === "operation" ? void 0 : options.expectedSourceIdentity;
	if (expected !== void 0) {
		if (options.mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		args.push(stagingRoot ?? "", JSON.stringify(readDatabaseFileIdentity(expected)));
	} else if (stagingRoot) args.push(stagingRoot);
	return args;
}
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "contentVersion" in value && typeof value.contentVersion === "string" && /^(?:[a-f0-9]{64})?$/.test(value.contentVersion) || value.ok === true && "generation" in value && typeof value.generation === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr, options) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`, options);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	if (params.kind === "launch-failed") throw params.error;
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr, { cause: params.cause });
		throw error;
	}
	if (params.status !== 0 || params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const message = !result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? `exited with code ${params.status}`;
		const allocationRefused = params.failure === void 0 && !result.ok && (mode === "staging-create" || mode === "staging-create-legacy") && message.startsWith("SQLite snapshot directory creation refused: ");
		const error = createSqliteReadOnlyWorkerError(allocationRefused ? message.slice(44) : message, params.stderr, { cause: params.cause });
		if (contention) {
			const failure = new SqliteReadOnlyInspectionContentionError(error.message);
			throw allocationRefused ? markPrivateDirectoryCreationRefused(failure) : failure;
		}
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "content-version" && "contentVersion" in result) return result.contentVersion;
	if ((mode === "file-generation" || mode === "update-generation") && "generation" in result) return result.generation;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-worker-session.ts
function isSameSqliteReadOnlyWorkerLaunch(captured, requested) {
	const keys = Object.keys(requested.env);
	return captured.runtimeGeneration === requested.runtimeGeneration && captured.transport.kind === requested.transport.kind && (captured.transport.kind === "native" || requested.transport.kind === "broker" && captured.transport.owner === requested.transport.owner) && requested.cwd === captured.cwd && keys.length === Object.keys(captured.env).length && keys.every((key) => requested.env[key] === captured.env[key]);
}
function createSqliteReadOnlyWorkerSession(host) {
	const env = { ...host.env };
	const cwd = host.cwd;
	const executable = process.execPath;
	const transport = host.transport.kind === "broker" ? {
		kind: "broker",
		owner: host.transport.owner
	} : { kind: "native" };
	const capturedLaunch = {
		env,
		cwd,
		transport,
		runtimeGeneration: host.runtimeGeneration
	};
	const argv = [...host.argv];
	const spawnOptions = {
		env,
		...transport.kind === "native" && cwd === tryProcessCwd() ? {} : { cwd },
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		],
		windowsHide: true
	};
	const child = transport.kind === "broker" ? transport.owner.spawn(executable, argv, spawnOptions) : spawn(executable, argv, spawnOptions);
	recordChildProcessSpawn(executable, child, host.pooledRead ? `sqlite.scoped-read.${transport.kind}` : `sqlite.session.${transport.kind}`);
	const setIdle = (idle) => {
		if (transport.kind !== "native") return;
		const method = idle ? "unref" : "ref";
		child[method]();
		child.channel?.[method]?.();
		for (const stream of [child.stdout, child.stderr]) if (stream instanceof Socket) stream[method]();
	};
	let retired = false;
	let sequence = 0;
	let pendingOperation;
	let stderr = "";
	let outputBytes = 0;
	let pending;
	const { promise: closeSignal, resolve: resolveClosed } = createDeferredCore();
	const authReaderResources = /* @__PURE__ */ new Map();
	const closed = closeSignal.then(async () => {
		if (transport.kind === "broker" && child instanceof BrokerChild && !child.notStarted && child.exitCode === null && child.signalCode === null) await transport.owner.waitForCleanup();
		for (const unregister of authReaderResources.values()) unregister();
		authReaderResources.clear();
	});
	const retire = (error) => {
		setIdle(false);
		retired = true;
		if (pending && error !== void 0) pending.failure ??= error;
		child.kill("SIGKILL");
	};
	const sendMessage = (message) => child.send(message, (error) => {
		if (error) retire(error);
	});
	const releasePending = (request) => {
		pending = void 0;
		pendingOperation = void 0;
		request.cleanup();
		if (host.pooledRead) {
			for (const unregister of authReaderResources.values()) unregister();
			authReaderResources.clear();
		}
		return request;
	};
	if (host.retainLifetime !== false) retainSnapshotWork(closed, () => retire(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
	let spawned = false;
	let nativeClosed = false;
	child.once("spawn", () => {
		spawned = true;
	});
	child.on("error", (error) => retire(spawned ? error : Object.assign(new Error([[
		"EACCES",
		"ENOENT",
		"EPERM"
	].includes(error.code ?? "") ? `SQLite read-only worker runtime binary not executable: ${executable} (${error.code}, cwd ${cwd}). Check runtime execute permissions and access to the working directory` : `SQLite read-only worker failed to start (executable ${executable}, cwd ${cwd})`, error.message].join(": "), { cause: error }), { code: error.code })));
	child.once("close", (code, signal) => {
		nativeClosed = true;
		retired = true;
		if (pending) {
			const request = releasePending(pending);
			request.reject(request.failure ?? createSqliteReadOnlyWorkerError(`exited with ${signal ? `signal ${signal}` : `code ${code}`}`, stderr));
		}
		resolveClosed();
	});
	const captureOutput = (data, isStderr) => {
		outputBytes += data.length;
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -4e3);
		if (outputBytes > 1048576) retire(createSqliteReadOnlyWorkerError("exceeded its output buffer", stderr));
	};
	const attachOutput = () => {
		child.stdout?.on("data", (data) => captureOutput(data, false));
		child.stderr?.on("data", (data) => captureOutput(data, true));
	};
	const ready = child instanceof BrokerChild ? child.ready().then(attachOutput).catch(retire) : void 0;
	if (!ready) attachOutput();
	child.on("message", (message) => {
		if (retired) return;
		if (!pending || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || message.id !== pending.id || !("result" in message)) {
			retire(createSqliteReadOnlyWorkerError("returned an unexpected response", stderr));
			return;
		}
		try {
			let value;
			if (pending.transfer && !(typeof message.result === "object" && message.result !== null && "ok" in message.result && message.result.ok === false)) {
				const reply = pending.transfer.accept(message.result);
				if ("request" in reply) {
					sendMessage({
						id: pending.id,
						transfer: reply.request
					});
					return;
				}
				value = reply.value;
			} else value = readSqliteReadOnlyWorkerValue({
				kind: "launched",
				stdout: JSON.stringify(message.result),
				stderr,
				status: 0
			}, pending.mode);
			releasePending(pending).resolve(value);
		} catch (error) {
			if (pending && host.retainOnOperationError && isSqliteSnapshotStagingMode(pending.mode) && isSqliteReadOnlyWorkerResult(message.result) && !message.result.ok) {
				releasePending(pending).reject(error);
				return;
			}
			retire(error);
		}
	});
	const session = {
		closed,
		isRetired() {
			return retired;
		},
		get notStarted() {
			return child instanceof BrokerChild ? child.notStarted : nativeClosed && !spawned;
		},
		createNativeReplacement() {
			return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
				...host,
				env,
				cwd,
				argv,
				transport: { kind: "native" }
			}));
		},
		compatible(launch) {
			return !retired && isSameSqliteReadOnlyWorkerLaunch(capturedLaunch, launch);
		},
		run(pathname, options) {
			if (retired) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker is closed"));
			if (options.mode === "auth-profile-rows" && options.source === "canonical" && !options.artifactPreserving) {
				const databasePath = path.resolve(pathname);
				if (!authReaderResources.has(databasePath)) authReaderResources.set(databasePath, registerOpenClawAgentDatabaseReadCandidateResource({
					path: databasePath,
					revoke: () => retire(/* @__PURE__ */ new Error("Auth profile reader owner was revoked")),
					close: () => session.close()
				}));
			}
			return pendingOperation = new Promise((resolve, reject) => {
				const { timeoutMs, size } = host.readBudget(pathname);
				stderr = "";
				outputBytes = 0;
				const abort = () => retire(options.signal?.reason);
				const timer = host.deadlineOwnedByCaller() ? void 0 : setTimeout(() => retire(host.timeoutError(pathname, timeoutMs, size)), timeoutMs);
				const id = ++sequence;
				pending = {
					id,
					mode: options.mode,
					...options.mode === "auth-profile-rows" ? { transfer: createSqliteAuthTransferReceiver() } : options.mode === "operation" ? { transfer: createSqliteOperationTransferReceiver(options.command.type) } : {},
					resolve,
					reject,
					cleanup: () => {
						clearTimeout(timer);
						options.signal?.removeEventListener("abort", abort);
					}
				};
				options.signal?.addEventListener("abort", abort, { once: true });
				if (options.signal?.aborted) {
					abort();
					return;
				}
				const send = () => {
					if (retired) return;
					try {
						const request = {
							id,
							args: host.requestArgs(pathname, options),
							...options.mode === "auth-profile-rows" || options.mode === "operation" ? { [options.mode === "operation" ? "operation" : "auth"]: {
								expectedIdentity: options.expectedIdentity,
								artifactPreserving: options.artifactPreserving,
								...options.mode === "operation" ? { command: serialize(options.command).toString("base64") } : {
									retainReader: !host.pooledRead && options.source === "canonical" && !options.artifactPreserving,
									schema: options.source === "canonical" && !options.artifactPreserving ? captureSqliteAuthSchema(pathname, options.expectedIdentity) : void 0
								}
							} } : {}
						};
						if (options.mode === "operation" && Buffer.byteLength(JSON.stringify(request)) > 1048576) throw new Error("SQLite read-only operation exceeded its request buffer");
						sendMessage(request);
					} catch (error) {
						retire(error);
					}
				};
				if (ready) ready.then(send);
				else send();
			});
		},
		setIdle,
		async close() {
			session.setIdle(false);
			if (retired) {
				await closed;
				return;
			}
			retired = true;
			const timer = setTimeout(() => retire(), host.closeTimeoutMs);
			try {
				sendMessage("close");
			} catch (error) {
				retire(error);
			}
			try {
				await closed;
			} finally {
				clearTimeout(timer);
			}
		}
	};
	host.runtimeGeneration?.retain(session, async () => {
		await pendingOperation?.catch(() => void 0);
		return () => session.close();
	});
	return session;
}
//#endregion
export { createSqliteReadOnlyWorkerError as a, createJsonFieldReceiver as c, SqliteReadOnlyInspectionContentionError as i, jsonFieldBatches as l, isSameSqliteReadOnlyWorkerLaunch as n, readSqliteReadOnlyWorkerValue as o, SQLITE_READONLY_WORKER_MAX_BUFFER as r, sqliteReadOnlyWorkerRequestArgs as s, createSqliteReadOnlyWorkerSession as t };
