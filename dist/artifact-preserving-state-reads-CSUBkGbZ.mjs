import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isPathInside } from "@openclaw/fs-safe/path";
//#region src/state/artifact-preserving-state-reads.ts
const artifactPreservingReads = resolveGlobalSingleton(Symbol.for("openclaw.artifactPreservingStateReads"), () => new AsyncLocalStorage());
function withArtifactPreservingStateReads(operation, options = {}) {
	if (isArtifactPreservingStateRead("agent")) return operation();
	const scope = {
		agentDatabases: options.agentDatabases === true,
		readers: /* @__PURE__ */ new Set(),
		privateRoots: /* @__PURE__ */ new Set()
	};
	const finish = (value, errors = []) => {
		for (const close of scope.readers) try {
			close();
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Artifact-preserving inspection and cleanup failed.");
		return value;
	};
	let result;
	try {
		result = artifactPreservingReads.run(scope, operation);
	} catch (error) {
		return finish(void 0, [error]);
	}
	return isPromiseLike(result) ? Promise.resolve(result).then(finish, (error) => finish(void 0, [error])) : finish(result);
}
function isArtifactPreservingStateRead(kind = "shared", pathname) {
	const scope = artifactPreservingReads.getStore();
	return Boolean(scope && (kind === "shared" || scope.agentDatabases) && (!pathname || ![...scope.privateRoots].some((root) => isPathInside(root, pathname))));
}
//#endregion
export { isArtifactPreservingStateRead as n, withArtifactPreservingStateReads as r, artifactPreservingReads as t };
