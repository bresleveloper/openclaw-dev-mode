import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { t as SESSION_MCP_RUNTIME_MANAGER_KEY } from "./agent-bundle-mcp-runtime-shared-BFBNCZj0.mjs";
import { s as escapeInternalRuntimeContextDelimiters } from "./internal-runtime-context-CAWYwg4i.mjs";
import { randomUUID } from "node:crypto";
import { ContentBlockSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/agent-bundle-mcp-manager-cleanup.ts
/** Cleanup consumes the existing manager without loading its construction graph. */
function peekSessionMcpRuntimeManager() {
	const globalStore = globalThis;
	if (!Object.hasOwn(globalStore, SESSION_MCP_RUNTIME_MANAGER_KEY)) return;
	return globalStore[SESSION_MCP_RUNTIME_MANAGER_KEY];
}
/** Releases an acquisition after its consumer has taken ownership, or after failure. */
async function releaseSessionMcpRuntime(lease, retainedServerNames) {
	lease.releaseLease?.();
	try {
		if (retainedServerNames) await lease.retireUnusedServers?.(retainedServerNames);
	} catch (error) {
		logWarn(`bundle-mcp: unused server cleanup failed: ${String(error)}`);
	} finally {
		await completeDeferredSessionMcpRuntimeRetirement(lease.runtime).catch((error) => {
			logWarn(`bundle-mcp: deferred runtime cleanup failed: ${String(error)}`);
		});
	}
}
/** Completes deferred retirement after its final run, view, or request lease releases. */
async function completeDeferredSessionMcpRuntimeRetirement(runtime) {
	return await (peekSessionMcpRuntimeManager()?.completeDeferredRetirement(runtime.sessionId, runtime) ?? false);
}
//#endregion
//#region src/agents/mcp-app-model-context.ts
const MCP_APP_MODEL_CONTEXT_MAX_BYTES = 6291456;
const contexts = /* @__PURE__ */ new WeakMap();
const listeners = /* @__PURE__ */ new WeakMap();
function notify(view, state) {
	notifyListeners(listeners.get(view) ?? [], state);
}
function subscribeMcpAppModelContext(view, listener) {
	const subscribed = listeners.get(view) ?? /* @__PURE__ */ new Set();
	subscribed.add(listener);
	listeners.set(view, subscribed);
	return () => {
		subscribed.delete(listener);
		if (!subscribed.size && listeners.get(view) === subscribed) listeners.delete(view);
	};
}
function getMcpAppModelContext(runtime, view) {
	const snapshot = contexts.get(runtime)?.get(view);
	if (!snapshot || runtime.mcpAppModelContextRevoked) return null;
	const { leased: _leased, ...state } = snapshot;
	return structuredClone(state);
}
function revokeMcpAppModelContext(runtime) {
	runtime.mcpAppModelContextRevoked = true;
	const views = contexts.get(runtime);
	contexts.delete(runtime);
	for (const view of views?.keys() ?? []) notify(view, null);
}
function allowMcpAppModelContext(runtime) {
	runtime.mcpAppModelContextRevoked = void 0;
}
function clearMcpAppModelContextForView(runtime, view) {
	if (contexts.get(runtime)?.delete(view)) notify(view, null);
}
function updateMcpAppModelContext(runtime, view, params) {
	if (runtime.mcpAppModelContextRevoked === true) throw new Error("MCP App model context is unavailable for this session");
	if (params.content !== void 0 && !Array.isArray(params.content)) throw new Error("MCP App model context content must be an array");
	const content = params.content?.map((value) => {
		const block = ContentBlockSchema.parse(value);
		if (block.type === "audio") throw new Error("MCP App audio context is unsupported");
		return block;
	});
	const structuredContent = asOptionalRecord(params.structuredContent);
	if (params.structuredContent !== void 0 && !structuredContent) throw new Error("MCP App structured context must be an object");
	const next = {
		...content?.length ? { content } : {},
		...structuredContent !== void 0 ? { structuredContent } : {}
	};
	const serialized = JSON.stringify(next);
	const views = contexts.get(runtime) ?? /* @__PURE__ */ new Map();
	const previous = views.get(view);
	const { updateId: _updateId, leased: _leased, ...previousData } = previous ?? {};
	const updateId = previous && JSON.stringify(previousData) === serialized ? previous.updateId : randomUUID();
	if (Buffer.byteLength(serialized, "utf8") + [...views.entries()].filter(([owner]) => owner !== view).reduce((total, [, state]) => total + Buffer.byteLength(JSON.stringify(state), "utf8"), 0) > MCP_APP_MODEL_CONTEXT_MAX_BYTES) throw new Error(`MCP App model context exceeds ${MCP_APP_MODEL_CONTEXT_MAX_BYTES} bytes`);
	if (!next.content && next.structuredContent === void 0) views.delete(view);
	else if (previous?.updateId !== updateId) views.set(view, {
		...structuredClone(next),
		updateId
	});
	contexts.set(runtime, views);
	notify(view, getMcpAppModelContext(runtime, view));
	return { _meta: { "openai/modelContext": { updateId } } };
}
/** User attachment removal is optimistic only against the exact rendered revision. */
function removeMcpAppModelContextItem(runtime, view, updateId, index) {
	const state = getMcpAppModelContext(runtime, view);
	if (!state) return null;
	if (state.updateId !== updateId) throw new Error("MCP App context changed; refresh before removing it");
	if (index === void 0) updateMcpAppModelContext(runtime, view, {});
	else {
		if (!Number.isInteger(index) || index < 0 || index >= (state.content?.length ?? 0)) throw new Error("MCP App context item does not exist");
		updateMcpAppModelContext(runtime, view, {
			content: state.content?.filter((_, position) => position !== index),
			structuredContent: state.structuredContent
		});
	}
	return getMcpAppModelContext(runtime, view);
}
/** Keep presentation metadata in the host, never in the next-turn model input. */
function modelContent(block) {
	const { _meta: _presentation, ...content } = block;
	if (content.type === "resource") {
		const { _meta: _resourcePresentation, ...resource } = content.resource;
		return {
			...content,
			resource
		};
	}
	return content;
}
/** Native user input keeps image bytes out of text while preserving resource and structured data. */
function projectMcpAppModelContextInput(appContexts, imageOffset = 0) {
	const images = [];
	const content = appContexts.map((context) => ({
		...context.content ? { content: context.content.map((block) => {
			if (block.type === "image") {
				images.push({
					type: "image",
					data: block.data,
					mimeType: block.mimeType
				});
				return {
					type: "image",
					mimeType: block.mimeType,
					imageIndex: imageOffset + images.length - 1
				};
			}
			if (block.type === "resource" && "blob" in block.resource && block.resource.mimeType?.startsWith("image/")) {
				images.push({
					type: "image",
					data: block.resource.blob,
					mimeType: block.resource.mimeType
				});
				return {
					type: "resource",
					resource: {
						uri: block.resource.uri,
						mimeType: block.resource.mimeType,
						imageIndex: imageOffset + images.length - 1
					}
				};
			}
			return block;
		}) } : {},
		...context.structuredContent !== void 0 ? { structuredContent: context.structuredContent } : {}
	}));
	const text = "MCP App context snapshots:\n" + JSON.stringify(content);
	return {
		images,
		context: {
			kind: "conversation-data",
			text
		},
		legacyText: escapeInternalRuntimeContextDelimiters(text)
	};
}
function leaseMcpAppModelContextForTurn(params) {
	if (params.runtime.mcpAppModelContextRevoked === true) return;
	const views = contexts.get(params.runtime);
	const snapshots = [...views?.entries() ?? []].filter(([view, snapshot]) => !snapshot.leased && (!params.views || params.views.has(view)));
	if (!snapshots.length) return;
	for (const [, snapshot] of snapshots) snapshot.leased = true;
	const modelContext = snapshots.map(([, snapshot]) => ({
		...snapshot.content ? { content: snapshot.content.map(modelContent) } : {},
		...snapshot.structuredContent !== void 0 ? { structuredContent: snapshot.structuredContent } : {}
	}));
	const input = projectMcpAppModelContextInput(modelContext);
	let committed = false;
	return {
		modelContext,
		...input,
		assertCurrent: () => {
			params.runtime.assertOwnerCurrent?.();
			if (params.runtime.mcpAppModelContextRevoked || snapshots.some(([view, snapshot]) => views?.get(view) !== snapshot)) throw new Error("MCP App context authority changed before input custody");
		},
		commit: () => {
			committed = true;
			for (const [view, snapshot] of snapshots) if (views?.get(view) === snapshot) {
				views.delete(view);
				notify(view, null);
			}
		},
		rollback: () => {
			if (!committed) for (const [, snapshot] of snapshots) snapshot.leased = void 0;
		}
	};
}
//#endregion
export { projectMcpAppModelContextInput as a, subscribeMcpAppModelContext as c, peekSessionMcpRuntimeManager as d, releaseSessionMcpRuntime as f, leaseMcpAppModelContextForTurn as i, updateMcpAppModelContext as l, clearMcpAppModelContextForView as n, removeMcpAppModelContextItem as o, getMcpAppModelContext as r, revokeMcpAppModelContext as s, allowMcpAppModelContext as t, completeDeferredSessionMcpRuntimeRetirement as u };
