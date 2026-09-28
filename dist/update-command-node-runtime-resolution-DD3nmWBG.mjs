import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { u as parseNodeReleaseVersion } from "./node-version-DdJ6cN09.mjs";
import { o as nodeVersionSatisfiesEngine } from "./runtime-guard-QhifpZGP.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/cli/update-cli/update-command-node-runtime-resolution.ts
/** Select the newest patch in the lowest compatible even-numbered Node release line. */
async function resolveTargetNodeRuntime(params) {
	const driverRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	if (!driverRoot) return;
	const { findUsableNodeRuntime } = await import(pathToFileURL(path.join(driverRoot, "node-runtime-recovery.mjs")).href);
	const acceptVersion = (version) => nodeVersionSatisfiesEngine(version, params.engine) === true;
	const options = {
		...params.recovery,
		acceptVersion
	};
	const available = await findUsableNodeRuntime(options);
	if (available) return available.nodePath;
	if (!params.recovery.installCommand) return;
	let nodeVersion;
	try {
		const signal = AbortSignal.timeout(resolveTimerTimeoutMs(params.timeoutMs, 3e4));
		const response = await fetch("https://nodejs.org/dist/index.json", {
			signal,
			redirect: "error"
		});
		if (!response.ok) {
			response.body?.cancel();
			return;
		}
		const releases = JSON.parse((await readResponseWithLimit(response, 2097152, { signal })).toString("utf8"));
		if (!Array.isArray(releases)) return;
		nodeVersion = releases.flatMap((release) => {
			const version = typeof release?.version === "string" ? parseNodeReleaseVersion(release.version) : null;
			if (!version || version.major < 24 || version.major % 2 !== 0) return [];
			const label = `${version.major}.${version.minor}.${version.patch}`;
			return acceptVersion(label) ? [{
				...version,
				label
			}] : [];
		}).toSorted((a, b) => a.major - b.major || b.minor - a.minor || b.patch - a.patch)[0]?.label;
	} catch {
		return;
	}
	if (!nodeVersion) return;
	return (await findUsableNodeRuntime({
		...options,
		allowInstall: true,
		nodeVersion
	}))?.nodePath;
}
//#endregion
export { resolveTargetNodeRuntime };
