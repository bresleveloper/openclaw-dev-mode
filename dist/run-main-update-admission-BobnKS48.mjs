import { i as getCommandArgsWithRootOptions, n as consumeRootCommandOptionToken } from "./cli-root-options-DGcy1qRg.mjs";
import { r as normalizeFsSafeNativeEnv } from "./fs-safe-env-CCe2lU-3.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-DEgnfd3z.mjs";
import path from "node:path";
//#region src/cli/run-main-update-admission.ts
/** Only the internal command owns the early read-only boundary; help follows normal startup. */
function isUpdateAdmissionInvocation(invocation) {
	return !invocation.hasHelpOrVersion && invocation.commandPath.length === 2 && invocation.commandPath[0] === "update" && invocation.commandPath[1] === "admit";
}
/** Reject inherited update authority before general CLI startup can write diagnostics. */
async function tryRunUpdateAdmissionBeforeStartup(invocation) {
	if (!isUpdateAdmissionInvocation(invocation)) return false;
	const reject = (message) => {
		console.error(message);
		process.exitCode = 2;
		return true;
	};
	const profile = parseCliProfileArgs(invocation.argv);
	if (!profile.ok) return reject(profile.error);
	const args = getCommandArgsWithRootOptions(profile.argv, {
		commandPath: ["update", "admit"],
		mode: "command-path"
	});
	let contextPath;
	if (args) for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		const rootConsumed = consumeRootCommandOptionToken(args, index);
		if (rootConsumed > 0) index += rootConsumed - 1;
		else if (contextPath === void 0 && arg === "--context") contextPath = args[++index];
		else if (contextPath === void 0 && arg?.startsWith("--context=")) contextPath = arg.slice(10);
		else return reject("Candidate admission requires only --context <absolute-path> and root options.");
	}
	if (!args || !contextPath || !path.isAbsolute(contextPath)) return reject("Candidate admission requires --context <absolute-path>.");
	const { isUpdateAdmissionAuthorityEnvKey } = await import("./update-admission-contract-CLHu12YV.mjs");
	if (Object.keys(process.env).some(isUpdateAdmissionAuthorityEnvKey)) return reject("Candidate admission requires an authority-free supervisor invocation.");
	if (profile.profile) applyCliProfileEnv({ profile: profile.profile });
	normalizeFsSafeNativeEnv();
	const { updateAdmitCommand } = await import("./update-command-admit-BSi2KdjF.mjs");
	await updateAdmitCommand(contextPath);
	return true;
}
//#endregion
export { tryRunUpdateAdmissionBeforeStartup as n, isUpdateAdmissionInvocation as t };
