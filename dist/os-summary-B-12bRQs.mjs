import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { spawnSync } from "node:child_process";
import os from "node:os";
//#region src/infra/os-summary.ts
const cachedOsFactsByKey = /* @__PURE__ */ new Map();
function resolveOsFacts() {
	const platform = os.platform();
	const release = os.release();
	const arch = os.arch();
	const cacheKey = `${platform}\0${release}\0${arch}`;
	let facts = cachedOsFactsByKey.get(cacheKey);
	if (!facts) {
		facts = {
			platform,
			arch,
			release
		};
		cachedOsFactsByKey.set(cacheKey, facts);
	}
	return facts;
}
const DARWIN_SYSTEM_PROBE_TIMEOUT_MS = 5e3;
function readDarwinProductVersion(facts) {
	if (facts.productVersion !== void 0) return facts.productVersion;
	const res = spawnSync("sw_vers", ["-productVersion"], {
		encoding: "utf-8",
		timeout: DARWIN_SYSTEM_PROBE_TIMEOUT_MS,
		killSignal: "SIGKILL"
	});
	const out = normalizeOptionalString(res.stdout) ?? "";
	if (out) facts.productVersion = out;
	return out || os.release();
}
/**
* Resolve Darwin product version via sw_vers. Kernel and product versions diverge
* starting with macOS 26, so keep the product fact separate from the raw release.
*/
function resolveDarwinProductVersion() {
	return readDarwinProductVersion(resolveOsFacts());
}
/**
* Resolves the OS string used in agent runtime prompt metadata, without the
* architecture suffix. The prompt renderer appends `arch` separately. Off
* Darwin this preserves the historical `${os.type()} ${os.release()}` shape.
*/
function resolveRuntimeOsLabel() {
	const facts = resolveOsFacts();
	return facts.runtimeLabel ??= facts.platform === "darwin" ? `macOS ${readDarwinProductVersion(facts)}` : `${os.type()} ${facts.release}`;
}
/** Resolves a compact OS label for diagnostics, logs, and environment summaries. */
function resolveOsSummary() {
	const facts = resolveOsFacts();
	if (!facts.summary) {
		const { platform, arch, release } = facts;
		facts.summary = {
			platform,
			arch,
			release,
			label: `${platform === "darwin" ? `macos ${readDarwinProductVersion(facts)}` : `${platform === "win32" ? "windows" : platform} ${release}`} (${arch})`
		};
	}
	return facts.summary;
}
//#endregion
export { resolveRuntimeOsLabel as i, resolveDarwinProductVersion as n, resolveOsSummary as r, DARWIN_SYSTEM_PROBE_TIMEOUT_MS as t };
