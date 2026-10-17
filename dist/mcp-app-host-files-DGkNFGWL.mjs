import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as logDebug } from "./logger-DskmrSVa.mjs";
import { d as retainGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import { i as getMcpAppViewLease } from "./mcp-ui-resource-BFfH0TzA.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import { l as resolveWorkspacePath, m as updateWorkspaceFile, s as readWorkspaceFile } from "./workspace-fs-CdJgcGwn.mjs";
import { l as resolveMcpAppRequesterId, o as requireMcpAppInteraction } from "./mcp-app-operations-Q5Op5uZm.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-NfeOD3At.mjs";
import { t as resolveLocalSessionWorkspaceRoot } from "./sessions-files-C5oArOIC.mjs";
import { stat, unwatchFile, watch, watchFile } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/mcp-app-host-files.ts
const writeAdmissions = /* @__PURE__ */ new WeakSet();
const subscriptions = /* @__PURE__ */ new WeakMap();
const etag = (bytes) => createHash("sha256").update(bytes).digest("hex");
/** Called only by the authenticated file entrypoint owner, never with an App-provided URI. */
async function prepareMcpAppHostFile(options, target) {
	const read = retainSessionScopedRead(options, target.sessionKey, target.agentId, { requireMaterialized: true });
	try {
		const rootDir = resolveLocalSessionWorkspaceRoot(target);
		const loaded = loadGatewaySessionEntryReadOnly(target.sessionKey, { agentId: target.agentId });
		if (!rootDir || !loaded.entry?.sessionId) throw new Error("Local workspace file access is unavailable");
		const requesterId = resolveMcpAppRequesterId(options.client);
		const sessionId = loaded.entry.sessionId;
		const assertCurrent = () => {
			read?.assertCurrent();
			if (options.hasCurrentClientAuthority?.() === false || resolveMcpAppRequesterId(options.client) !== requesterId || loadGatewaySessionEntryReadOnly(target.sessionKey, { agentId: target.agentId }).entry?.sessionId !== sessionId || resolveLocalSessionWorkspaceRoot(target) !== rootDir) throw new Error("App file workspace authority changed");
		};
		const resolved = resolveWorkspacePath(rootDir, target.path);
		if (!resolved) throw new Error("File is outside the session workspace");
		const browserPath = path.relative(rootDir, resolved);
		const result = await readWorkspaceFile(rootDir, browserPath, { assertCurrent });
		assertCurrent();
		if (!result || result === "too-large") throw new Error("File is missing, unsafe, or too large");
		return {
			resourceUri: "openclaw-file://" + randomUUID(),
			name: path.basename(result.canonicalPath),
			rootDir,
			path: result.canonicalPath,
			sessionId,
			requesterId
		};
	} finally {
		read?.release();
	}
}
async function withHostFile(options, view, uri, operation, mutation = false) {
	const file = view.hostFile;
	const sessionKey = view.runtime.sessionKey;
	if (!file || file.resourceUri !== uri || !sessionKey) throw new Error("Resource is not the file opened by this App");
	const read = retainSessionScopedRead(options, sessionKey, view.agentId, { requireMaterialized: true });
	const assertCurrent = () => {
		view.runtime.assertOwnerCurrent?.();
		read?.assertCurrent();
		options.sessionMutationAuthorization?.assertCurrent();
		if (options.signal?.aborted || options.client?.connectionSignal?.aborted || options.hasCurrentClientAuthority?.() === false || getMcpAppViewLease(view.viewId, view.runtime) !== view || view.readOnly || view.allowedAppToolNames === void 0 || resolveMcpAppRequesterId(options.client) !== file.requesterId || loadGatewaySessionEntryReadOnly(sessionKey, { agentId: view.agentId }).entry?.sessionId !== file.sessionId || resolveLocalSessionWorkspaceRoot({
			sessionKey,
			agentId: view.agentId
		}) !== file.rootDir) throw new Error("MCP App file authority expired");
		if (mutation && view.authorizeAppInteraction) {
			const grant = view.authorizeAppInteraction();
			if (grant !== true) {
				if (grant instanceof Promise) grant.catch(() => void 0);
				throw new Error("MCP App file requires current synchronous interaction authority");
			}
		}
	};
	try {
		await requireMcpAppInteraction(view);
		assertCurrent();
		const result = await operation(file, assertCurrent);
		if (!mutation) {
			await requireMcpAppInteraction(view);
			assertCurrent();
		}
		return result;
	} finally {
		read?.release();
	}
}
async function readMcpAppHostFile(options, view, params) {
	return withHostFile(options, view, params.uri, async (file, assertCurrent) => {
		const representation = asOptionalRecord(params._meta?.["openai/resource"])?.representation;
		if (representation !== void 0 && representation !== "text" && representation !== "blob") throw new Error("Invalid resource representation");
		const result = await readWorkspaceFile(file.rootDir, file.path, { assertCurrent });
		assertCurrent();
		if (!result || result === "too-large") throw new Error("File is missing, unsafe, or too large");
		const writable = result.readOnly !== true;
		const content = representation === "text" ? { text: new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(result.buffer) } : { blob: result.buffer.toString("base64") };
		if (writable) writeAdmissions.add(view);
		return { contents: [{
			uri: file.resourceUri,
			...content,
			_meta: { "openai/resource": {
				writable,
				etag: etag(result.buffer)
			} }
		}] };
	});
}
async function writeMcpAppHostFile(options, view, params) {
	if (typeof params.uri !== "string") throw new Error("uri is required");
	if (!view.hostFile || params.uri !== view.hostFile.resourceUri) throw new Error("Resource is not the file opened by this App");
	await requireMcpAppInteraction(view);
	if (typeof params.text === "string" === (typeof params.blob === "string")) throw new Error("Provide exactly one of text or blob");
	if (params.ifMatch !== void 0 && (typeof params.ifMatch !== "string" || !params.ifMatch)) throw new Error("ifMatch must be non-empty");
	if (!writeAdmissions.has(view)) throw new Error("Read this resource with writable:true before writing");
	let bytes;
	if (typeof params.text === "string") {
		if (Buffer.byteLength(params.text, "utf8") > 262144) return {
			outcome: "too-large",
			maxBytes: WORKSPACE_PREVIEW_MAX_BYTES
		};
		bytes = Buffer.from(params.text, "utf8");
	} else if (typeof params.blob === "string") {
		const blob = params.blob;
		if (blob.length > Math.ceil(262144 / 3) * 4) return {
			outcome: "too-large",
			maxBytes: WORKSPACE_PREVIEW_MAX_BYTES
		};
		bytes = Buffer.from(blob, "base64");
		if (bytes.toString("base64") !== blob) throw new Error("Invalid base64 resource content");
	} else throw new Error("Provide exactly one of text or blob");
	if (bytes.length > 262144) return {
		outcome: "too-large",
		maxBytes: WORKSPACE_PREVIEW_MAX_BYTES
	};
	return withHostFile(options, view, params.uri, async (file, assertCurrent) => {
		const result = await updateWorkspaceFile(file.rootDir, file.path, bytes, typeof params.ifMatch === "string" ? params.ifMatch : void 0, assertCurrent);
		if (result.status === "unsafe") throw new Error("File could not be written safely");
		return result.status === "conflict" ? {
			outcome: "conflict",
			etag: result.currentHash
		} : {
			outcome: "saved",
			etag: result.hash
		};
	}, true);
}
async function subscribeMcpAppHostFile(options, view, uri, subscribe) {
	if (!subscribe) {
		const client = options.client;
		if (!client?.connId || view.hostFile?.resourceUri !== uri || view.requesterId !== resolveMcpAppRequesterId(client)) throw new Error("Resource subscription is not owned by this requester");
		subscriptions.get(view)?.get(client.connId)?.();
		return {};
	}
	return withHostFile(options, view, uri, async (file, assertCurrent) => {
		const client = options.client;
		if (!client?.connId) throw new Error("Resource subscriptions require a live client connection");
		const connId = client.connId;
		const sessionKey = view.runtime.sessionKey;
		if (!sessionKey) throw new Error("App session is unavailable");
		const watchers = subscriptions.get(view) ?? /* @__PURE__ */ new Map();
		watchers.get(connId)?.();
		if (watchers.size >= 32) throw new Error("Resource subscription limit reached");
		const result = await readWorkspaceFile(file.rootDir, file.path, { assertCurrent });
		assertCurrent();
		if (!result || result === "too-large") throw new Error("Resource cannot be subscribed");
		let closed = false;
		let notifying = false;
		const isCurrent = () => !closed && !client.connectionSignal?.aborted && options.hasCurrentClientAuthority?.() !== false && getMcpAppViewLease(view.viewId, view.runtime) === view && !view.readOnly && view.allowedAppToolNames !== void 0 && resolveMcpAppRequesterId(client) === file.requesterId && options.context.getRuntimeConfig().mcp?.apps?.enabled === true && loadGatewaySessionEntryReadOnly(sessionKey, { agentId: view.agentId }).entry?.sessionId === file.sessionId && resolveLocalSessionWorkspaceRoot({
			sessionKey,
			agentId: view.agentId
		}) === file.rootDir;
		const notify = async () => {
			if (notifying) return;
			notifying = true;
			try {
				if (!isCurrent()) {
					close("view, session, requester, or connection authority changed");
					return;
				}
				await requireMcpAppInteraction(view);
				if (!isCurrent()) {
					close("authority changed while checking App interaction");
					return;
				}
				options.context.broadcastToConnIds("mcp.app.resourceUpdated", {
					viewId: view.viewId,
					uri
				}, /* @__PURE__ */ new Set([connId]));
			} catch (error) {
				close(error);
			} finally {
				notifying = false;
			}
		};
		const filePath = path.join(file.rootDir, file.path);
		let polling = false;
		const arm = () => watch(filePath, { persistent: false }, (event) => {
			if (event === "rename") {
				watcher.close();
				rearm();
			}
			notify();
		}).on("error", close);
		const rearm = (curr) => {
			if (closed || curr && (!polling || !curr.isFile())) return;
			polling = false;
			unwatchFile(filePath, rearm);
			try {
				watcher = arm();
				if (curr) notify();
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) {
					polling = true;
					watchFile(filePath, {
						persistent: false,
						interval: 250
					}, rearm);
					stat(filePath, (statError, currentStats) => {
						if (!statError) rearm(currentStats);
						else if (!hasErrnoCode(statError, "ENOENT")) close(statError);
					});
				} else close(error);
			}
		};
		const close = (reason = "subscription ended") => {
			if (closed) return;
			closed = true;
			logDebug(`mcp-app: file subscription closed view=${view.viewId}: ${formatErrorMessage(reason)}`);
			releaseAuthority?.();
			watcher.close();
			unwatchFile(filePath, rearm);
			client.connectionSignal?.removeEventListener("abort", onDisconnect);
			if (watchers.get(connId) === close) watchers.delete(connId);
			view.disposeCallbacks?.delete(close);
		};
		const onDisconnect = () => close("connection closed");
		const releaseAuthority = retainGatewayDeviceRevocation(options.hasCurrentClientAuthority);
		let watcher;
		try {
			watcher = arm();
		} catch (error) {
			releaseAuthority?.();
			throw error;
		}
		client.connectionSignal?.addEventListener("abort", onDisconnect, { once: true });
		watchers.set(connId, close);
		subscriptions.set(view, watchers);
		view.disposeCallbacks ??= /* @__PURE__ */ new Set();
		view.disposeCallbacks.add(close);
		if (!isCurrent()) close("authority changed while installing the subscription");
		return {};
	});
}
function canOpenMcpAppFiles(view) {
	const sessionKey = view.runtime.sessionKey;
	if (!sessionKey) return false;
	return Boolean(resolveLocalSessionWorkspaceRoot({
		sessionKey,
		agentId: view.agentId
	}));
}
async function openMcpAppFile(options, view, filePath) {
	if (!path.isAbsolute(filePath)) throw new Error("File opening requires an absolute execution-host path");
	if (!view.runtime.sessionKey) throw new Error("App session is unavailable");
	await requireMcpAppInteraction(view);
	const file = await prepareMcpAppHostFile(options, {
		sessionKey: view.runtime.sessionKey,
		agentId: view.agentId,
		path: filePath
	});
	await requireMcpAppInteraction(view);
	return {
		path: file.path,
		name: file.name
	};
}
//#endregion
export { subscribeMcpAppHostFile as a, readMcpAppHostFile as i, openMcpAppFile as n, writeMcpAppHostFile as o, prepareMcpAppHostFile as r, canOpenMcpAppFiles as t };
