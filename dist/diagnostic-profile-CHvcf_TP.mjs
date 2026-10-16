import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.mjs";
import { fileURLToPath } from "node:url";
import { getHeapSpaceStatistics } from "node:v8";
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
	if (url.length > 2048 || /[?#]/.test(url)) return;
	let filename = url;
	if (url.startsWith("file:")) try {
		filename = fileURLToPath(url);
	} catch {
		return;
	}
	if (!path.isAbsolute(filename)) return;
	const relative = packageRoot ? path.relative(packageRoot, filename).split(path.sep).join("/") : "";
	const dependency = (packageRoot && !relative.startsWith("..") ? `/${relative}` : path.normalize(filename).split(path.sep).join("/")).match(/.*\/node_modules\/((?:@[a-zA-Z0-9_-][a-zA-Z0-9._-]*\/)?[a-zA-Z0-9_-][a-zA-Z0-9._-]*)\//)?.[1];
	if (dependency) return `node_modules/${dependency}`;
	return /^(?:src|dist)\/[a-zA-Z0-9_@./+-]+\.[cm]?js$/.test(relative) || /^src\/[a-zA-Z0-9_@./+-]+\.ts$/.test(relative) ? `openclaw:${relative}` : void 0;
}
/** Applies the same code-location and symbol policy to both native profilers. */
function sanitizeDiagnosticProfileFrame(frame, packageRoot) {
	assertProfile(Boolean(frame) && typeof frame.functionName === "string" && typeof frame.url === "string" && typeof frame.scriptId === "string" && /^-?\d{1,32}$/.test(frame.scriptId) && Number.isSafeInteger(frame.lineNumber) && Number.isSafeInteger(frame.columnNumber));
	const url = codeUrl(frame.url, packageRoot);
	const engine = frame.url === "" && ENGINE_NAMES.has(frame.functionName);
	const attribution = url?.startsWith("node_modules/") ? `[dep:${url.slice(13)}]` : frame.scriptId === "0" && frame.url === "" && frame.lineNumber < 0 && !engine ? "[native]" : void 0;
	const safeName = engine || url !== void 0 && frame.functionName.length <= 256 && /^(?:(?:(?:get|set) )?[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*)?$/.test(frame.functionName);
	return {
		redacted: !safeName && !attribution,
		callFrame: {
			functionName: attribution ?? (safeName ? frame.functionName : "[redacted]"),
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
	let startBlockedMs = 0;
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
		before = {
			...process.memoryUsage(),
			heapSpaces: getHeapSpaceStatistics()
		};
		const startedAt = performance.now();
		startAttempted = true;
		const starting = options.start(session);
		startBlockedMs = performance.now() - startedAt;
		await starting;
		await setTimeout(options.durationMs, void 0, { signal: options.signal });
		assertActive();
		stopAttempted = true;
		({profile} = await options.stop(session));
		durationMs = performance.now() - startedAt;
		after = {
			...process.memoryUsage(),
			heapSpaces: getHeapSpaceStatistics()
		};
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
				startBlockedMs,
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
