import { g as validateBindingForWrite } from "./session-binding-record-BGoz8wOK.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { isDeepStrictEqual } from "node:util";
import { deleteSessionUpstreamLink, upsertSessionUpstreamLink } from "openclaw/plugin-sdk/session-catalog";
//#region extensions/codex/src/app-server/session-initialization.ts
const initializations = /* @__PURE__ */ new WeakMap();
/** Associate the host's exact handle before any potentially committing plugin write. */
function prepareCodexSessionInitialization(params) {
	const { initialization, bindingStore, identity } = params;
	initialization.assertCurrent();
	let link;
	const ownership = {
		store: bindingStore,
		identity: structuredClone(identity),
		assertCleanupAllowed: params.assertCleanupAllowed,
		cleanup: async () => {
			initialization.assertRollbackCurrent();
			if (link && deleteSessionUpstreamLink(link.sessionKey, link.agentId, {
				expected: link,
				assertCommitAllowed: initialization.assertRollbackCurrent
			}) === "changed") throw new Error("Codex initialization link changed before cleanup");
			initialization.assertRollbackCurrent();
			await cleanup?.(initialization.assertRollbackCurrent);
			initialization.assertRollbackCurrent();
		}
	};
	initializations.set(initialization, ownership);
	const cleanup = params.prepareCleanup?.();
	return {
		assertCurrent: initialization.assertCurrent,
		async bind(binding) {
			initialization.assertCurrent();
			ownership.binding = validateBindingForWrite(binding);
			if (!await bindingStore.mutate(identity, {
				kind: "set",
				if: { kind: "absent" },
				binding: ownership.binding
			}, initialization.assertCurrent)) {
				ownership.binding = void 0;
				throw new Error("Codex session binding changed during initialization");
			}
			initialization.assertCurrent();
		},
		link(input) {
			initialization.assertCurrent();
			const now = Date.now();
			link = structuredClone({
				...input,
				createdAt: now,
				updatedAt: now
			});
			if (!upsertSessionUpstreamLink(input, {
				now,
				ifAbsent: true,
				assertCommitAllowed: initialization.assertCurrent
			})) {
				link = void 0;
				throw new Error("Codex initialization link could not be persisted");
			}
			initialization.assertCurrent();
		}
	};
}
function getCodexSessionInitializationRollback(store, params, identity, binding) {
	const handle = params.initialization;
	if (!handle) return;
	handle.assertRollbackCurrent();
	const ownership = initializations.get(handle);
	if (!ownership && !binding) return;
	if (!ownership || ownership.store !== store || !isDeepStrictEqual(ownership.identity, identity) || binding && !isDeepStrictEqual(ownership.binding, binding)) throw new Error("Codex initialization binding owner changed before rollback");
	ownership.assertCleanupAllowed?.();
	return ownership.cleanup;
}
//#endregion
export { prepareCodexSessionInitialization as n, getCodexSessionInitializationRollback as t };
