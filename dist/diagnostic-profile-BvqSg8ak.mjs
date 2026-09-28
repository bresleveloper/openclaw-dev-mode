import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
//#region src/logging/diagnostic-profile.ts
const DIAGNOSTIC_PROFILE_MAX_BYTES = 1048576;
const ENGINE_NAMES = /* @__PURE__ */ new Set([
	"(root)",
	"(program)",
	"(idle)",
	"(garbage collector)"
]);
let capturing = false;
let cleanupUncertain = false;
var ProfileFailure = class extends Error {
	constructor(reason) {
		super(reason);
		this.reason = reason;
	}
};
function assertProfile(valid) {
	if (!valid) throw new ProfileFailure("invalid-profile");
}
function hasProfilerConflict() {
	const options = parseNodeOptionsEnvVar(process.env.NODE_OPTIONS);
	return options === null || Boolean(process.env.NODE_V8_COVERAGE) || [...process.execArgv, ...options ?? []].some((option) => /^--(?:inspect|cpu-prof|heap-prof|prof|perf-|.*coverage)/.test(option.replaceAll("_", "-")));
}
function codeUrl(url, packageRoot) {
	if (/^node:[a-zA-Z0-9_./-]+$/.test(url)) return url;
	if (!packageRoot || url.length > 2048) return;
	let filename = url;
	if (url.startsWith("file:")) try {
		const parsed = new URL(url);
		if (parsed.search || parsed.hash) return;
		filename = fileURLToPath(parsed);
	} catch {
		return;
	}
	if (!path.isAbsolute(filename)) return;
	const relative = path.relative(packageRoot, filename).split(path.sep).join("/");
	return /^(?:src|dist|node_modules)\/[a-zA-Z0-9_@./+-]+\.[cm]?js$/.test(relative) || /^src\/[a-zA-Z0-9_@./+-]+\.ts$/.test(relative) ? `openclaw:${relative}` : void 0;
}
/** Applies the same code-location and symbol policy to both native profilers. */
function sanitizeDiagnosticProfileFrame(frame, packageRoot) {
	assertProfile(Boolean(frame) && typeof frame.functionName === "string" && typeof frame.url === "string" && typeof frame.scriptId === "string" && /^-?\d{1,32}$/.test(frame.scriptId) && Number.isSafeInteger(frame.lineNumber) && Number.isSafeInteger(frame.columnNumber));
	const url = codeUrl(frame.url, packageRoot);
	const engine = frame.url === "" && ENGINE_NAMES.has(frame.functionName);
	const safeName = engine || url !== void 0 && frame.functionName.length <= 256 && /^(?:(?:(?:get|set) )?[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*)?$/.test(frame.functionName);
	return {
		redacted: !safeName || !engine && !url,
		callFrame: {
			functionName: safeName ? frame.functionName : "[redacted]",
			scriptId: frame.scriptId,
			url: url ?? "",
			lineNumber: frame.lineNumber,
			columnNumber: frame.columnNumber
		}
	};
}
/** Owns one ephemeral main-isolate capture; it never opens an inspector listener. */
async function captureDiagnosticProfile(options) {
	const unavailable = (reason, cleanupFailed = false) => ({
		status: "unavailable",
		reason,
		cleanupFailed
	});
	if (cleanupUncertain) return unavailable("cleanup-failed", true);
	if (capturing) return unavailable("busy");
	capturing = true;
	let session;
	let connected = false;
	let startAttempted = false;
	let stopAttempted = false;
	let failure;
	let cleanupFailed = false;
	let profile;
	let before;
	let after;
	let durationMs = 0;
	let packageRoot = null;
	const assertActive = () => {
		if (options.signal.aborted || !options.hasAuthority()) throw new ProfileFailure("cancelled");
	};
	try {
		assertActive();
		if (process.versions.bun) throw new ProfileFailure("unsupported");
		const inspector = await import("node:inspector/promises").catch(() => {
			throw new ProfileFailure("unsupported");
		});
		const { getEnabledCategories } = await import("node:trace_events").catch(() => {
			throw new ProfileFailure("unsupported");
		});
		const assertTracingInactive = () => {
			if (getEnabledCategories()) throw new ProfileFailure("tracing-active");
		};
		packageRoot = await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url });
		assertActive();
		if (inspector.url() || hasProfilerConflict()) throw new ProfileFailure("conflict");
		assertTracingInactive();
		session = new inspector.Session();
		session.connect();
		connected = true;
		await options.setup(session);
		assertActive();
		assertTracingInactive();
		before = process.memoryUsage();
		const startedAt = performance.now();
		startAttempted = true;
		await options.start(session);
		await setTimeout(options.durationMs, void 0, { signal: options.signal });
		assertActive();
		stopAttempted = true;
		({profile} = await options.stop(session));
		durationMs = performance.now() - startedAt;
		after = process.memoryUsage();
	} catch (error) {
		failure = error instanceof ProfileFailure ? error.reason : options.signal.aborted ? "cancelled" : "capture-failed";
	} finally {
		if (session && connected) {
			if (startAttempted && !stopAttempted) try {
				await options.stop(session);
			} catch {
				cleanupFailed = true;
			}
			try {
				await options.disable(session);
			} catch {
				cleanupFailed = true;
			}
			try {
				session.disconnect();
			} catch {
				cleanupFailed = cleanupUncertain = true;
			}
		}
		capturing = false;
	}
	if (failure || cleanupFailed) return unavailable(failure ?? "cleanup-failed", cleanupFailed);
	try {
		assertActive();
		return {
			status: "complete",
			result: options.sanitize(profile, packageRoot, {
				durationMs,
				before,
				after
			})
		};
	} catch (error) {
		return unavailable(error instanceof ProfileFailure ? error.reason : "invalid-profile");
	}
}
//#endregion
export { sanitizeDiagnosticProfileFrame as a, captureDiagnosticProfile as i, ProfileFailure as n, assertProfile as r, DIAGNOSTIC_PROFILE_MAX_BYTES as t };
