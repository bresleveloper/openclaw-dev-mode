import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./update-run-schema-DOichlUj.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-Cab7F5S1.mjs";
//#region src/infra/update-admission-contract.ts
const authorityEnvKeys = /* @__PURE__ */ new Set([
	...SUPERVISOR_HINT_ENV_VARS,
	"OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META",
	"OPENCLAW_GATEWAY_SERVICE_PID",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION"
]);
/** Admission may observe a live profile, but cannot inherit an update or service continuation. */
function isUpdateAdmissionAuthorityEnvKey(key) {
	const normalized = key.toUpperCase();
	return authorityEnvKeys.has(normalized) || normalized.startsWith("OPENCLAW_UPDATE_");
}
const text = string().min(1);
const channel = _enum([
	"stable",
	"extended-stable",
	"beta",
	"dev"
]);
const contextSchema = object({
	protocol: literal(1),
	installation: object({
		root: text,
		canonicalRoot: text,
		version: text.nullable(),
		installKind: _enum([
			"package",
			"git",
			"unknown"
		]),
		packageManager: _enum([
			"npm",
			"pnpm",
			"bun"
		]),
		globalRoot: text.optional()
	}),
	target: object({
		spec: text,
		version: text.nullable(),
		source: _enum(["registry", "artifact"]),
		channel,
		tag: text.optional()
	}),
	request: object({
		yes: boolean(),
		noRestart: boolean(),
		acceptCapabilities: boolean(),
		json: boolean(),
		timeoutMs: number().finite().positive().optional(),
		requestedChannel: channel.nullable().optional()
	}),
	run: object({ id: text }),
	supervisor: object({
		version: text,
		host: text,
		pid: number().int().positive()
	})
});
/** Admission carries observations only, never update execution authority. */
function parseUpdateAdmissionContext(value) {
	const parsed = contextSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
//#endregion
export { parseUpdateAdmissionContext as n, isUpdateAdmissionAuthorityEnvKey as t };
