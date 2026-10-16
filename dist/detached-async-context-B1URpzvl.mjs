import { d as isRootVersionInvocation } from "./argv-D_Nxd_3s.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as resolveCliContainerTarget } from "./container-target-Bj4zLvq3.mjs";
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const output = deps.output ?? ((message) => console.log(message));
	const exit = deps.exit ?? ((code) => process.exit(code));
	const onError = deps.onError ?? (async (error) => {
		const message = `[openclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-DprAYqRb.mjs"), import("./json-console-line-lWJWZD8J.mjs")]);
			loadCliDotEnv({ quiet: true });
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		} catch {
			process.stderr.write(message);
		} finally {
			exit(1);
		}
	});
	(deps.resolveVersion ?? (async () => {
		const [{ VERSION }, { resolveCommitHash }] = await Promise.all([import("./version-Rz_KSRMi.mjs"), import("./git-commit-DFlHjnef.mjs")]);
		return {
			VERSION,
			resolveCommitHash
		};
	}))().then(({ VERSION, resolveCommitHash }) => {
		const commit = resolveCommitHash({ moduleUrl: deps.moduleUrl ?? import.meta.url });
		output(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
		exit(0);
	}).catch(onError);
	return true;
}
//#endregion
//#region src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule("node:async_hooks");
if (asyncHooks) resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context"));
//#endregion
export { tryHandleRootVersionFastPath as t };
