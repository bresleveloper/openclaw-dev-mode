import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import path from "node:path";
//#region src/gateway/control-ui-session-pr-source.ts
/** Retain source lifetime through the caller's last assertion and publication. */
async function withControlUiSessionPrSource(source, operation) {
	const target = {
		agentId: normalizeAgentId(source.agentId),
		path: path.resolve(source.path)
	};
	const selected = getSessionActorStorageBinding({
		agentId: target.agentId,
		storePath: target.path
	});
	if (selected) {
		const assertCurrent = () => {
			selected.authority.assertCurrent();
			selected.actor.assertReadable();
		};
		return operation(assertCurrent, JSON.stringify(selected.actor.target.database));
	}
	const unregister = [];
	let active = true;
	const changed = () => /* @__PURE__ */ new Error("Session PR source changed or closed. Retry the request.");
	try {
		if (isIncognitoOpenClawAgentSqlitePath(target.path, target)) {
			const assertActive = () => {
				if (!active) throw changed();
			};
			const captured = captureSessionActorStorageOwner({
				agentId: target.agentId,
				storePath: target.path
			}, {
				assertCurrent: assertActive,
				authorize: assertActive
			});
			const owner = captured?.owner;
			if (!captured || !owner) throw changed();
			const assertCurrent = () => {
				captured.authority.assertCurrent();
				owner.assertCurrent();
			};
			assertCurrent();
			return await operation(assertCurrent, JSON.stringify(owner.identity));
		}
		const candidate = captureSessionStoreReadCandidate(target.path);
		const identity = readDatabasePathIdentitySync(candidate.path);
		if (!identity.key.startsWith("file:") || identity.canonicalPath !== candidate.physicalPath) throw changed();
		const sourceIdentity = identity.key;
		const paths = [.../* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])];
		const assertSource = () => {
			const current = readDatabasePathIdentitySync(candidate.path);
			if (current.key !== identity.key || current.canonicalPath !== candidate.physicalPath) throw changed();
		};
		for (const pathname of paths) unregister.push(registerOpenClawAgentDatabaseSyncResource({
			agentId: target.agentId,
			path: pathname,
			revoke: () => {
				active = false;
			},
			close: () => {
				active = false;
			}
		}));
		const assertCurrent = () => {
			if (!active) throw changed();
			assertSource();
		};
		assertCurrent();
		return await operation(assertCurrent, sourceIdentity);
	} finally {
		active = false;
		for (const release of unregister.toReversed()) release();
	}
}
//#endregion
export { withControlUiSessionPrSource as t };
