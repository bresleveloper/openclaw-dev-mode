import { t as drainGlobalSingletonLifecycleState } from "../global-singleton-DrXvEBww.mjs";
import path from "node:path";
//#region src/worker/skills-worker-entry.ts
try {
	const [workspace, home, operation, ...extra] = process.argv.slice(2);
	if (!workspace || !home || !operation || extra.length) throw new Error("Skills worker requires workspace, home, and operation");
	console.log = console.info = (...values) => console.error(...values);
	const { serveWorkspaceSkills } = await import("../workspace-worker-CgSTyerm.mjs");
	await serveWorkspaceSkills({
		workspace: path.resolve(workspace),
		home: path.resolve(home),
		operation,
		input: process.stdin,
		output: process.stdout
	});
} catch (error) {
	process.stderr.write(`Skills worker failed: ${String(error)}\n`);
	process.exitCode = 1;
} finally {
	process.stdin.destroy();
	try {
		await drainGlobalSingletonLifecycleState();
	} catch (error) {
		process.stderr.write(`Skills worker cleanup failed: ${String(error)}\n`);
		process.exitCode = 1;
	}
	if (process.connected) process.disconnect?.();
}
//#endregion
export {};
