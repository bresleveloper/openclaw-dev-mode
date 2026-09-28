import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as resolveSessionPermissionExecMode } from "./session-permission-exec-mode-Bn0mEuts.mjs";
//#region src/agents/embedded-agent-runner/run/permission-change.ts
const PERMISSION_CHANGE_NOTICE = "Permission change. The operator changed this session's permissions. Continue with the updated policy, preserving completed work. Inspect interrupted actions before retrying them; do not repeat completed actions.";
const permissionChangeAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.embeddedRunPermissionChangeAuthorities"), () => /* @__PURE__ */ new WeakMap());
/** Core dispatcher alone authorizes the synchronous handoff after its operator/owner checks. */
function withAuthorizedPermissionChange(owner, mode, apply) {
	const authority = permissionChangeAuthorities.get(owner);
	if (!authority) throw new Error("Permission change run owner is no longer active.");
	const previous = authority.authorized;
	authority.authorized = { mode };
	try {
		return apply();
	} finally {
		authority.authorized = previous;
	}
}
/** Owns apply acknowledgements across replacement attempts within one admitted run. */
function createEmbeddedRunPermissionChanges(params) {
	const owner = Object.freeze({});
	const authority = {};
	permissionChangeAuthorities.set(owner, authority);
	const baseExecOverrides = Object.freeze({ ...params.execOverrides });
	let closed = false;
	let revision = 0;
	let pending;
	const assertAuthorized = (mode) => {
		if (closed || permissionChangeAuthorities.get(owner) !== authority || authority.authorized?.mode !== mode) throw new Error("Permission change was not authorized by the current operator request.");
	};
	const updatePermissionMode = (mode) => {
		params.permissionMode = mode ?? void 0;
		params.execOverrides ??= {};
		params.execOverrides.mode = mode ? resolveSessionPermissionExecMode({ mode }) : baseExecOverrides.mode;
	};
	const request = (mode) => {
		assertAuthorized(mode);
		if (pending?.mode === mode) return pending.promise;
		pending?.resolve(false);
		const completion = createDeferredCore();
		pending = {
			mode,
			revision: ++revision,
			...completion
		};
		return pending.promise;
	};
	return {
		forAttempt() {
			const preparedRevision = revision;
			return {
				owner,
				baseExecOverrides,
				...revision > 0 ? { notice: `${PERMISSION_CHANGE_NOTICE} Requested mode: ${params.permissionMode ?? "default"}.` } : {},
				request,
				recordApplied: (mode) => {
					assertAuthorized(mode);
					updatePermissionMode(mode);
				},
				applied: () => {
					if (closed || preparedRevision !== revision) return false;
					pending?.resolve(true);
					pending = void 0;
					return true;
				}
			};
		},
		prepareRestart: () => {
			if (closed || !pending) return false;
			updatePermissionMode(pending.mode);
			return true;
		},
		close: () => {
			closed = true;
			permissionChangeAuthorities.delete(owner);
			pending?.resolve(false);
			pending = void 0;
		}
	};
}
//#endregion
export { withAuthorizedPermissionChange as n, createEmbeddedRunPermissionChanges as t };
