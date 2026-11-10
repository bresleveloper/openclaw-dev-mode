import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
//#region src/skills/runtime/snapshot-config-fingerprint.ts
let configFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintSkillSnapshotConfig(config) {
	const cached = configFingerprints.get(config);
	if (cached) return cached;
	const fingerprint = sha256Hex(stableStringify(redactConfigObject(config)));
	configFingerprints.set(config, fingerprint);
	return fingerprint;
}
function resetSkillSnapshotConfigFingerprintCache() {
	configFingerprints = /* @__PURE__ */ new WeakMap();
}
//#endregion
export { resetSkillSnapshotConfigFingerprintCache as n, fingerprintSkillSnapshotConfig as t };
