import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
//#region src/infra/update-dev-target.ts
const UPDATE_DEV_TARGET_REF_ENV = "OPENCLAW_UPDATE_DEV_TARGET_REF";
const TRACKED_DEV_TARGET_PREFIX = "openclaw-dev-target:v1:";
const MAX_TRACKED_DEV_TARGET_PAYLOAD_LENGTH = 4096;
function isValidTargetPart(value) {
	return typeof value === "string" && value.length > 0 && !/\s/u.test(value) && Array.from(value).every((char) => {
		const code = char.charCodeAt(0);
		return code >= 32 && code !== 127;
	});
}
function parseTrackedTarget(payload) {
	if (payload.length === 0 || payload.length > MAX_TRACKED_DEV_TARGET_PAYLOAD_LENGTH || !/^[A-Za-z0-9_-]+$/.test(payload)) return;
	try {
		const json = Buffer.from(payload, "base64url").toString("utf8");
		if (Buffer.from(json, "utf8").toString("base64url") !== payload) return;
		const decoded = safeParseJson(json);
		if (!isRecord(decoded) || Object.keys(decoded).length !== 2 || !("upstreamRef" in decoded) || !("upstreamSha" in decoded)) return;
		const { upstreamRef, upstreamSha } = decoded;
		if (!isValidTargetPart(upstreamRef) || !isValidTargetPart(upstreamSha)) return;
		return {
			mode: "tracked",
			upstreamRef,
			upstreamSha
		};
	} catch {
		return;
	}
}
function resolveDevUpdateTargetRevision(target) {
	return target.mode === "tracked" ? target.upstreamSha : target.ref;
}
function devUpdateTargetFromGitTarget(target) {
	return {
		mode: "tracked",
		upstreamRef: target.upstreamRef,
		upstreamSha: target.upstreamSha
	};
}
function parseDevUpdateTargetEnv(env) {
	const value = env[UPDATE_DEV_TARGET_REF_ENV]?.trim();
	if (!value) return { status: "absent" };
	if (value.startsWith(TRACKED_DEV_TARGET_PREFIX)) {
		const target = parseTrackedTarget(value.slice(23));
		return target ? {
			status: "valid",
			target
		} : { status: "invalid" };
	}
	if (value.includes(":")) return { status: "invalid" };
	return isValidTargetPart(value) ? {
		status: "valid",
		target: {
			mode: "detached",
			ref: value
		}
	} : { status: "invalid" };
}
function applyDevUpdateTargetEnv(env, target) {
	const value = target.mode === "tracked" ? `${TRACKED_DEV_TARGET_PREFIX}${Buffer.from(stableStringify({
		upstreamRef: target.upstreamRef,
		upstreamSha: target.upstreamSha
	}), "utf8").toString("base64url")}` : target.ref;
	return {
		...env,
		[UPDATE_DEV_TARGET_REF_ENV]: value
	};
}
//#endregion
export { resolveDevUpdateTargetRevision as a, parseDevUpdateTargetEnv as i, applyDevUpdateTargetEnv as n, devUpdateTargetFromGitTarget as r, UPDATE_DEV_TARGET_REF_ENV as t };
