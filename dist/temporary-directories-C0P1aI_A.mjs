import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { n as resolveNewStateDir } from "./state-dir-BHJORNly.mjs";
import path from "node:path";
//#region src/commands/doctor/shared/temporary-directories.ts
/** Service scratch can outlive the shell environment that originally selected it. */
async function inspectDoctorTemporaryDirectories(env, options) {
	const keys = [
		"TMPDIR",
		"TMP",
		"TEMP"
	];
	const directories = keys.map((key) => resolveEnvironmentValue(env, key)).filter((directory) => Boolean(directory?.trim()));
	directories.push(path.join(resolveNewStateDir(() => resolveRequiredHomeDir(env)), "tmp"));
	const warnings = [];
	if (options?.inspectService === false) return {
		directories,
		warnings
	};
	try {
		const { resolveGatewayService } = await import("./service-CEHmkj0v.mjs");
		const command = await resolveGatewayService().readCommand(env, {
			requireLoaded: true,
			timeoutMs: 5e3
		});
		const paths = process.platform === "win32" ? path.win32 : path;
		const absolute = (value) => paths.isAbsolute(value) && (process.platform !== "win32" || paths.parse(value).root.length > 1);
		for (const definition of [command, command?.managedDefinition]) for (const key of keys) {
			const directory = resolveEnvironmentValue(definition?.environment, key);
			if (!directory?.trim()) continue;
			const workingDirectory = definition?.workingDirectory;
			const drive = paths.parse(directory).root.replace(/[\\/]+$/u, "").toLowerCase();
			if (absolute(directory)) directories.push(directory);
			else if (workingDirectory && absolute(workingDirectory) && (!drive || paths.parse(workingDirectory).root.toLowerCase().startsWith(drive))) directories.push(paths.resolve(workingDirectory, directory));
			else warnings.push(`The managed service records a relative ${key} without an absolute working directory; its temporary artifacts could not be inspected.`);
		}
	} catch (error) {
		warnings.push(`Could not inspect the managed service temporary directory: ${String(error)}`);
	}
	return {
		directories,
		warnings
	};
}
//#endregion
export { inspectDoctorTemporaryDirectories as t };
