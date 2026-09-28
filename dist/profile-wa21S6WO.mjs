import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { a as scanCliRootOptions, i as takeCliRootOptionValue } from "./container-target-QMB0jS0E.mjs";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS, c as isGatewayServiceEnv, l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { n as resolveHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveProfileStateDir, t as isValidProfileName } from "./profile-utils-D5FwriYc.mjs";
import path from "node:path";
import os from "node:os";
//#region src/cli/profile.ts
function parseCliProfileArgs(argv) {
	let profile = null;
	let sawDev = false;
	const scanned = scanCliRootOptions(argv, ({ arg, args, index, out }) => {
		if (arg === "--dev") {
			if (resolveCliArgvInvocation(out).primary === "gateway") {
				out.push(arg);
				return { kind: "handled" };
			}
			if (profile && profile !== "dev") return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			return { kind: "handled" };
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			const next = args[index + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			const [primary, secondary] = resolveCliArgvInvocation(out).commandPath;
			if (primary === "qa" && secondary === "matrix") {
				out.push(arg);
				if (consumedNext && next !== void 0) out.push(next);
				return {
					kind: "handled",
					consumedNext
				};
			}
			if (sawDev) return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			if (!value) return {
				kind: "error",
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				kind: "error",
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			return {
				kind: "handled",
				consumedNext
			};
		}
		return { kind: "pass" };
	});
	if (!scanned.ok) return scanned;
	return {
		ok: true,
		profile,
		argv: scanned.argv
	};
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	const inheritedProfile = normalizeOptionalString(env.OPENCLAW_PROFILE) ?? "default";
	const existingStateDir = normalizeOptionalString(env.OPENCLAW_STATE_DIR);
	const existingConfigPath = normalizeOptionalString(env.OPENCLAW_CONFIG_PATH);
	const profileEnv = env;
	const inheritedProfileStateDir = resolveProfileStateDir(inheritedProfile, profileEnv, homedir);
	const selectedProfileStateDir = resolveProfileStateDir(profile, profileEnv, homedir);
	const switchesInheritedProfile = inheritedProfileStateDir !== selectedProfileStateDir;
	const inheritedSystemdServiceName = resolveGatewaySystemdServiceName(inheritedProfile);
	const inheritedServiceSelectors = {
		OPENCLAW_LAUNCHD_LABEL: [resolveGatewayLaunchAgentLabel(inheritedProfile)],
		OPENCLAW_SYSTEMD_UNIT: [inheritedSystemdServiceName, `${inheritedSystemdServiceName}.service`],
		OPENCLAW_WINDOWS_TASK_NAME: [resolveGatewayWindowsTaskName(inheritedProfile)]
	};
	const switchesInheritedProfileState = Boolean(existingStateDir && switchesInheritedProfile && resolveHomeRelativePath(existingStateDir, {
		env,
		homedir
	}) === inheritedProfileStateDir);
	const replacesInheritedProfileConfig = Boolean(switchesInheritedProfile && (!existingStateDir || switchesInheritedProfileState) && existingConfigPath && resolveHomeRelativePath(existingConfigPath, {
		env,
		homedir
	}) === path.join(inheritedProfileStateDir, "openclaw.json"));
	const inheritedManagedServiceSelectors = switchesInheritedProfile && isGatewayServiceEnv(env) && switchesInheritedProfileState && replacesInheritedProfileConfig;
	if (inheritedManagedServiceSelectors) for (const key of GATEWAY_SERVICE_SELECTOR_ENV_KEYS) delete env[key];
	env.OPENCLAW_PROFILE = profile;
	const retainedStateDir = inheritedManagedServiceSelectors ? void 0 : existingStateDir;
	const stateDir = retainedStateDir && !switchesInheritedProfileState ? retainedStateDir : selectedProfileStateDir;
	if (!retainedStateDir || switchesInheritedProfileState) env.OPENCLAW_STATE_DIR = stateDir;
	if (!inheritedManagedServiceSelectors && (!existingConfigPath || replacesInheritedProfileConfig)) env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	if (switchesInheritedProfile && !inheritedManagedServiceSelectors) for (const [key, inheritedValues] of Object.entries(inheritedServiceSelectors)) {
		const activeValue = normalizeOptionalString(env[key]);
		if (activeValue && inheritedValues.includes(activeValue)) delete env[key];
	}
	if (profile === "dev" && !env.OPENCLAW_GATEWAY_PORT?.trim()) env.OPENCLAW_GATEWAY_PORT = "19001";
}
//#endregion
export { parseCliProfileArgs as n, applyCliProfileEnv as t };
