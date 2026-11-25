import { r as loadCopilotSdkWithIdentity, t as fingerprintCopilotPackage } from "./sdk-loader-MZ7UHepf.mjs";
import { createRequire } from "node:module";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import path from "node:path";
import fsp from "node:fs/promises";
import { existsSync } from "node:fs";
// extensions/copilot/src/runtime-artifact.ts
function runtimePlatform() {
	if (process.arch !== "x64" && process.arch !== "arm64") throw new Error(`Copilot runtime artifacts do not support architecture ${process.arch}.`);
	if (process.platform === "linux") {
		const report = process.report?.getReport();
		return `${(isRecord(report) && isRecord(report.header) ? report.header : void 0)?.glibcVersionRuntime ? "linux" : "linuxmusl"}-${process.arch}`;
	}
	if (process.platform === "darwin" || process.platform === "win32") return `${process.platform}-${process.arch}`;
	throw new Error(`Copilot runtime artifacts do not support platform ${process.platform}.`);
}
async function resolveRuntimePackage(entryPath, packageName) {
	const packageRoot = (createRequire(entryPath).resolve.paths(packageName) ?? []).map((lookupPath) => path.join(lookupPath, packageName)).find((candidate) => existsSync(path.join(candidate, "package.json")));
	if (!packageRoot) throw new Error(`Copilot runtime package ${packageName} is not installed.`);
	return await fsp.realpath(packageRoot);
}
async function captureCopilotRuntimeArtifact(env = process.env) {
	const defaultConnection = process.env.COPILOT_SDK_DEFAULT_CONNECTION;
	if (defaultConnection && defaultConnection.toLowerCase() !== "stdio") throw new Error("Copilot runtime artifact verification requires the stdio transport.");
	const { sdk, identity } = await loadCopilotSdkWithIdentity();
	if (await fingerprintCopilotPackage(identity.packageRoot) !== identity.fingerprint) throw new Error("Copilot SDK changed after loading. Restart OpenClaw before verifying inference.");
	const platform = runtimePlatform();
	const packageName = `@github/copilot-sdk-${platform}`;
	const packageRoot = await resolveRuntimePackage(identity.entryPath, packageName);
	const executable = await fsp.realpath(path.join(packageRoot, "prebuilds", platform, process.platform === "win32" ? "copilot-runtime.exe" : "copilot-runtime"));
	if (env.COPILOT_CLI_PATH && await fsp.realpath(env.COPILOT_CLI_PATH) !== executable) throw new Error("Copilot runtime artifact verification does not support a custom COPILOT_CLI_PATH.");
	const runtimeFingerprint = await fingerprintCopilotPackage(packageRoot);
	const id = `copilot-sdk:${platform}:${path.relative(identity.packageRoot, identity.entryPath).split(path.sep).join("/")}`;
	return {
		binding: {
			id,
			fingerprint: createHash("sha256").update(JSON.stringify([
				id,
				identity.fingerprint,
				runtimeFingerprint
			])).digest("hex")
		},
		connection: sdk.RuntimeConnection.forStdio({ path: executable })
	};
}
async function validateCopilotRuntimeArtifact(binding) {
	try {
		const current = await captureCopilotRuntimeArtifact();
		return current.binding.id === binding.id && current.binding.fingerprint === binding.fingerprint;
	} catch {
		return false;
	}
}
export { captureCopilotRuntimeArtifact, validateCopilotRuntimeArtifact };
