import { n as getFsSafeNativeConfig, t as configureFsSafeNative } from "../fs-safe-defaults-D3xd3zKO.mjs";
import { readFileSync } from "node:fs";
import { parentPort } from "node:worker_threads";
import { copyTree, createCloneSource, probeTreeClone, readCloneFileMetadata } from "@openclaw/fs-safe/copy";
import { serialize } from "node:v8";
//#region src/infra/fs-safe-copy.worker.ts
function failure(error) {
	return {
		type: "failed",
		message: error instanceof Error ? error.message : String(error),
		...error instanceof Error && "code" in error && typeof error.code === "string" ? { code: error.code } : {}
	};
}
if (parentPort) {
	const nativeConfig = getFsSafeNativeConfig();
	const { serveWorkerTasks } = await import("../worker-task-server-BDPOy8uz.mjs");
	configureFsSafeNative(nativeConfig);
	serveWorkerTasks(async (input) => {
		const command = input;
		try {
			switch (command.type) {
				case "probe": return {
					type: "probe",
					backend: probeTreeClone(command.parent)
				};
				case "metadata": return {
					type: "metadata",
					entries: await readCloneFileMetadata(command.paths)
				};
				default: throw new Error("Unknown native worktree read operation");
			}
		} catch (error) {
			return failure(error);
		}
	});
} else {
	const controller = new AbortController();
	const abort = () => controller.abort();
	process.on("SIGTERM", abort);
	let reply;
	try {
		const command = JSON.parse(readFileSync(0, "utf8"));
		switch (command.type) {
			case "create":
				await createCloneSource(command.destination, { signal: controller.signal });
				break;
			case "copy":
				await copyTree(command.source, command.destination, {
					clone: "always",
					signal: controller.signal
				});
				break;
			default: throw new Error("Unknown native worktree operation");
		}
		reply = { type: "written" };
	} catch (error) {
		reply = failure(error);
	} finally {
		process.off("SIGTERM", abort);
	}
	process.stdout.write(serialize(reply));
}
//#endregion
export {};
