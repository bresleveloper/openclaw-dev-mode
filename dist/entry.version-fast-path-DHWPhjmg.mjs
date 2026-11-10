import { d as isRootVersionInvocation } from "./argv-C7hqFLn5.mjs";
import { r as resolveCliContainerTarget } from "./container-target-DzrX5jVY.mjs";
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv) {
	if (resolveCliContainerTarget(argv)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const onError = async (error) => {
		const message = `[openclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-Dr6nhquT.mjs"), import("./json-console-line-CytzoCTe.mjs")]);
			loadCliDotEnv({ quiet: true });
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		} catch {
			process.stderr.write(message);
		} finally {
			process.exitCode = 1;
		}
	};
	Promise.all([import("./version-Dhb_IK_3.mjs"), import("./git-commit-HlX7f7I5.mjs")]).then(([{ VERSION }, { resolveCommitHash }]) => {
		const commit = resolveCommitHash({ moduleUrl: import.meta.url });
		console.log(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
		process.exitCode = 0;
	}).catch(onError);
	return true;
}
//#endregion
export { tryHandleRootVersionFastPath as t };
