import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { a as sanitizeDiagnosticProfileFrame, i as captureDiagnosticProfile, n as ProfileFailure, r as assertProfile } from "./diagnostic-profile-BvqSg8ak.mjs";
//#region src/logging/diagnostic-cpu-profile.ts
const DURATION_MS = 5e3;
const INTERVAL_MICROS = 1e4;
const MAX_NODES = 16384;
const MAX_SAMPLES = 65536;
function sanitizeProfile(profile, packageRoot) {
	assertProfile(Array.isArray(profile.nodes) && profile.nodes.length > 0 && Array.isArray(profile.samples) && Array.isArray(profile.timeDeltas) && profile.samples.length === profile.timeDeltas.length && Number.isFinite(profile.startTime) && Number.isFinite(profile.endTime) && profile.endTime >= profile.startTime);
	if (profile.nodes.length > MAX_NODES || profile.samples.length > MAX_SAMPLES) throw new ProfileFailure("profile-too-large");
	const ids = /* @__PURE__ */ new Set();
	const parents = /* @__PURE__ */ new Map();
	let redactedNodeCount = 0;
	const nodes = profile.nodes.map((node) => {
		assertProfile(Number.isSafeInteger(node.id) && node.id > 0 && !ids.has(node.id));
		ids.add(node.id);
		const { callFrame, redacted } = sanitizeDiagnosticProfileFrame(node.callFrame, packageRoot);
		redactedNodeCount += Number(redacted || node.deoptReason !== void 0);
		if (node.children !== void 0) {
			assertProfile(Array.isArray(node.children));
			for (const child of node.children) {
				assertProfile(Number.isSafeInteger(child) && !parents.has(child));
				parents.set(child, node.id);
			}
		}
		assertProfile(node.hitCount === void 0 || Number.isSafeInteger(node.hitCount) && node.hitCount >= 0);
		if (node.positionTicks !== void 0) {
			assertProfile(Array.isArray(node.positionTicks));
			for (const tick of node.positionTicks) assertProfile(Number.isSafeInteger(tick.line) && Number.isSafeInteger(tick.ticks) && tick.ticks >= 0);
		}
		return {
			id: node.id,
			callFrame,
			...node.children !== void 0 ? { children: node.children } : {},
			...node.hitCount !== void 0 ? { hitCount: node.hitCount } : {},
			...node.positionTicks !== void 0 ? { positionTicks: node.positionTicks } : {},
			...node.deoptReason !== void 0 ? { deoptReason: "[redacted]" } : {}
		};
	});
	const roots = nodes.filter((node) => !parents.has(node.id));
	const root = roots[0];
	assertProfile(root !== void 0 && roots.length === 1 && [...parents.keys()].every((id) => ids.has(id)));
	const byId = new Map(nodes.map((node) => [node.id, node]));
	const visited = /* @__PURE__ */ new Set();
	const pending = [root.id];
	while (pending.length) {
		const id = pending.pop();
		assertProfile(!visited.has(id));
		visited.add(id);
		pending.push(...byId.get(id).children ?? []);
	}
	assertProfile(visited.size === nodes.length);
	assertProfile(profile.samples.every((id) => ids.has(id)));
	assertProfile(profile.timeDeltas.every((delta) => Number.isFinite(delta)));
	const result = {
		requestedDurationMs: DURATION_MS,
		actualDurationMs: (profile.endTime - profile.startTime) / 1e3,
		samplingIntervalMicros: INTERVAL_MICROS,
		sampleLossCount: null,
		redactedNodeCount,
		profile: {
			nodes,
			startTime: profile.startTime,
			endTime: profile.endTime,
			samples: profile.samples,
			timeDeltas: profile.timeDeltas
		}
	};
	if (!boundedJsonUtf8Bytes(result, 1048576).complete) throw new ProfileFailure("profile-too-large");
	return result;
}
/** Captures the main isolate's CPU samples through the shared inspector owner. */
function captureDiagnosticCpuProfile(options) {
	return captureDiagnosticProfile({
		...options,
		durationMs: DURATION_MS,
		setup: async (session) => {
			await session.post("Profiler.enable");
			await session.post("Profiler.setSamplingInterval", { interval: INTERVAL_MICROS });
		},
		start: (session) => session.post("Profiler.start"),
		stop: (session) => session.post("Profiler.stop"),
		disable: (session) => session.post("Profiler.disable"),
		sanitize: sanitizeProfile
	});
}
//#endregion
export { captureDiagnosticCpuProfile };
