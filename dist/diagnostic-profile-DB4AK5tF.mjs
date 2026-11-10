import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import * as v8 from "node:v8";
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
function parseNativeCpuProfile(json) {
	const escaped = json.replace(/"functionName":"(.*?)"(,"lineNumber":-?\d+,"columnNumber":-?\d+,"scriptId":-?\d+,"url":)"(.*?)"}(?=,"(?:children|deoptReason|positionTicks)":|})/gs, (_match, name, location, url) => `"functionName":${JSON.stringify(name)}${location}${JSON.stringify(url)}}`);
	const profile = JSON.parse(escaped);
	const nodes = [];
	for (const { callFrame, ...node } of profile.nodes) {
		const { scriptId, ...frame } = callFrame;
		nodes.push({
			...node,
			callFrame: {
				...frame,
				scriptId: String(scriptId)
			}
		});
	}
	return {
		...profile,
		nodes
	};
}
function createInspectorProfileCapture(inspector, options) {
	const session = new inspector.Session();
	session.connect();
	return {
		setup: () => options.setup(session),
		start: () => options.start(session),
		stop: () => options.stop(session),
		close: async () => {
			let disabled = false;
			try {
				await options.disable(session);
				disabled = true;
			} catch {}
			try {
				session.disconnect();
			} catch (error) {
				cleanupUncertain = true;
				throw error;
			}
			if (!disabled) throw new ProfileFailure("cleanup-failed");
		}
	};
}
function createNativeCpuProfileCapture(intervalMicros) {
	let handle;
	return {
		start: () => handle = v8.startCpuProfile({ sampleInterval: intervalMicros / 1e3 }),
		stop: () => handle && { profile: parseNativeCpuProfile(handle.stop()) },
		close: () => {
			try {
				handle?.[Symbol.dispose]();
			} catch (error) {
				cleanupUncertain = true;
				throw error;
			}
		}
	};
}
function hasProfilerConflict() {
	const options = parseNodeOptionsEnvVar(process.env.NODE_OPTIONS);
	return options === null || Boolean(process.env.NODE_V8_COVERAGE) || Boolean(process.versions.bun && (process.env.BUN_INSPECT || process.env.BUN_INSPECT_CONNECT_TO)) || [...process.execArgv, ...options ?? []].some((option) => /^--(?:inspect|cpu-prof|heap-prof|prof|perf-|.*coverage)/.test(option.replaceAll("_", "-")));
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
	let capture;
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
		capture = options.create(inspector);
		await capture.setup?.();
		assertActive();
		assertTracingInactive();
		before = {
			...process.memoryUsage(),
			heapSpaces: v8.getHeapSpaceStatistics()
		};
		const startedAt = performance.now();
		startAttempted = true;
		const starting = capture.start();
		startBlockedMs = performance.now() - startedAt;
		await starting;
		if (options.durationMs > 0) await setTimeout(options.durationMs, void 0, { signal: options.signal });
		assertActive();
		stopAttempted = true;
		const stopped = await capture.stop();
		if (!stopped) throw new ProfileFailure("capture-failed");
		({profile} = stopped);
		durationMs = performance.now() - startedAt;
		after = {
			...process.memoryUsage(),
			heapSpaces: v8.getHeapSpaceStatistics()
		};
	} catch (error) {
		failure = error instanceof ProfileFailure ? error.reason : options.signal.aborted ? "cancelled" : "capture-failed";
	} finally {
		if (capture) {
			if (startAttempted && !stopAttempted) try {
				await capture.stop();
			} catch {
				cleanupFailed = true;
			}
			try {
				await capture.close();
			} catch {
				cleanupFailed = true;
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
export { createInspectorProfileCapture as a, parseNativeCpuProfile as c, captureDiagnosticProfile as i, sanitizeDiagnosticProfileFrame as l, ProfileFailure as n, createNativeCpuProfileCapture as o, assertProfile as r, hasProfilerConflict as s, DIAGNOSTIC_PROFILE_MAX_BYTES as t };
