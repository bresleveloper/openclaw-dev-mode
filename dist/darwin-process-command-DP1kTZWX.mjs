import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as isPidDefinitelyDead } from "./pid-alive-dd7OR8F6.mjs";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { readProcessCommand } from "@openclaw/proc-safe/inspect";
//#region src/process/supervisor/darwin-process-command.ts
let reportedForeignArguments = false;
/** Exact argv, or observed foreign ownership when Darwin denies argument inspection.
* Callers that never consult the service marker skip the environment: some macOS
* argument images end without the separator that bounds it. */
function readDarwinProcessCommand(pid, owner, options = {}) {
	try {
		const command = readProcessCommand(pid, options.serviceMarker === false ? {} : { environmentKeys: ["OPENCLAW_SERVICE_MARKER"] });
		if (!command) return;
		const serviceMarker = command.environment.OPENCLAW_SERVICE_MARKER;
		return {
			argv: [...command.argv],
			executable: command.executable,
			...serviceMarker === void 0 ? {} : { serviceMarker }
		};
	} catch (cause) {
		if (!(cause instanceof ProcSafeError)) throw cause;
		if (cause.code === "unsupported-platform" && process.platform === "darwin") throw new Error("Cannot inspect Darwin process arguments under Rosetta; run OpenClaw with native arm64 Node.js.", { cause });
		if (cause.code !== "access-denied" && cause.code !== "operation-failed") throw cause;
		if (isPidDefinitelyDead(pid)) return;
		if (owner === "different") {
			if (!reportedForeignArguments) {
				reportedForeignArguments = true;
				createSubsystemLogger("process/census").debug("Unreadable Darwin arguments for another UID do not establish capture custody.", {
					pid,
					code: cause.code
				});
			}
			return {
				argvUnavailable: true,
				owner
			};
		}
		throw new Error(`Could not classify PID ${pid}: cannot inspect Darwin arguments (${cause.code}).`, { cause });
	}
}
//#endregion
export { readDarwinProcessCommand as t };
