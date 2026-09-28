import { createHash } from "node:crypto";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { z } from "zod";
//#region extensions/codex/src/app-server/managed-thread-store.ts
const CODEX_MANAGED_THREAD_NAMESPACE = "app-server-managed-threads";
const CODEX_MANAGED_THREAD_MAX_ENTRIES = 2e4;
const managedThreadSchema = z.object({
	version: z.literal(1),
	kind: z.literal("managed-thread"),
	sourceHomeId: z.string().min(1),
	threadId: z.string().min(1),
	rolloutPath: z.string().min(1).optional()
});
async function markStartedCodexManagedThread(store, params) {
	if (!store) return;
	try {
		await store.mark({
			sourceHomeId: params.sourceHomeId,
			threadId: params.threadId,
			...params.rolloutPath ? { rolloutPath: params.rolloutPath } : {}
		});
	} catch (error) {
		embeddedAgentLog.warn("failed to record Codex managed thread ownership", { error });
	}
}
function managedThreadStoreKey(sourceHomeId, threadId) {
	return `sha256:${createHash("sha256").update("openclaw:codex-managed-thread:v1\0").update(sourceHomeId).update("\0").update(threadId).digest("hex")}`;
}
/** Durable ownership index for Codex threads created by OpenClaw. */
function createCodexManagedThreadStore(state) {
	const byHome = /* @__PURE__ */ new Map();
	const memberships = /* @__PURE__ */ new Map();
	let hydration;
	const remember = ({ sourceHomeId, threadId }) => {
		const key = managedThreadStoreKey(sourceHomeId, threadId);
		if (memberships.has(key)) return key;
		memberships.set(key, {
			sourceHomeId,
			threadId
		});
		let ids = byHome.get(sourceHomeId);
		if (!ids) {
			ids = /* @__PURE__ */ new Set();
			byHome.set(sourceHomeId, ids);
		}
		ids.add(threadId);
		if (memberships.size > 2e4) {
			const oldest = memberships.entries().next().value;
			if (oldest) {
				memberships.delete(oldest[0]);
				const oldestHome = byHome.get(oldest[1].sourceHomeId);
				oldestHome?.delete(oldest[1].threadId);
				if (oldestHome?.size === 0) byHome.delete(oldest[1].sourceHomeId);
			}
		}
		return key;
	};
	const snapshot = async () => {
		hydration ??= state.entries().then((entries) => {
			const marked = new Map(memberships);
			memberships.clear();
			byHome.clear();
			for (const entry of entries.toSorted((a, b) => a.createdAt - b.createdAt)) {
				const parsed = managedThreadSchema.safeParse(entry.value);
				if (parsed.success) marked.delete(remember(parsed.data));
			}
			for (const membership of marked.values()) remember(membership);
		}).catch((error) => {
			hydration = void 0;
			throw error;
		});
		await hydration;
		return byHome;
	};
	return {
		async has(sourceHomeId, threadId) {
			return (await snapshot()).get(sourceHomeId)?.has(threadId) ?? false;
		},
		async mark(params) {
			try {
				const value = managedThreadSchema.parse({
					version: 1,
					kind: "managed-thread",
					sourceHomeId: params.sourceHomeId.trim(),
					threadId: params.threadId.trim(),
					...params.rolloutPath?.trim() ? { rolloutPath: params.rolloutPath.trim() } : {}
				});
				await state.registerIfAbsent(managedThreadStoreKey(value.sourceHomeId, value.threadId), value);
				remember(value);
				return true;
			} catch (error) {
				embeddedAgentLog.warn("failed to record Codex managed thread ownership", { error });
				return false;
			}
		},
		snapshot
	};
}
//#endregion
export { markStartedCodexManagedThread as i, CODEX_MANAGED_THREAD_NAMESPACE as n, createCodexManagedThreadStore as r, CODEX_MANAGED_THREAD_MAX_ENTRIES as t };
