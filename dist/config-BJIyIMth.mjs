import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/skills/workshop/config.ts
function resolveSkillWorkshopConfig(config) {
	const raw = asNullableRecord(config?.skills?.workshop) ?? {};
	const autonomous = asNullableRecord(raw.autonomous);
	const mode = autonomous?.mode;
	const maxSkillBytes = raw.maxSkillBytes;
	return {
		autonomous: {
			mode: mode === "off" || mode === "auto" ? mode : "auto",
			channelNotices: autonomous?.channelNotices === true
		},
		maxSkillBytes: typeof maxSkillBytes === "number" && Number.isFinite(maxSkillBytes) ? Math.min(Math.max(Math.trunc(maxSkillBytes), 1024), 2e5) : 4e4
	};
}
//#endregion
export { resolveSkillWorkshopConfig as t };
