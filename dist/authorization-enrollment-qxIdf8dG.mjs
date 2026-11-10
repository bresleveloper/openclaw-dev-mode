import "./user-model-account-authority-DFFjC5J5.mjs";
import { a as enrollAuthProfileAuthorization } from "./authorization-lifetime-CLdd1God.mjs";
import { w as writeAuthProfileJsonCell } from "./sqlite-BlFpr2YD.mjs";
import { s as inspectAuthProfileJsonCell } from "./sqlite-json-Dyr7VLoH.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/authorization-enrollment.ts
/** The existing auth row is the only durable owner; enrollment is a credential-preserving CAS. */
function enrollAuthProfileAuthorizationInDatabase(database, kind, input) {
	const existing = inspectAuthProfileJsonCell(database, "store", kind);
	const wasMissing = input.expected.status === "missing" && existing.status === "missing";
	if (existing.status === "unreadable" || !wasMissing && !isDeepStrictEqual(existing, input.expected)) throw new Error("Auth profile changed before authorization enrollment");
	const raw = existing.status === "readable" ? existing.raw : {
		version: 1,
		profiles: {}
	};
	const next = enrollAuthProfileAuthorization(raw, input.profileId);
	if (next !== raw) writeAuthProfileJsonCell(database, "store", kind, next);
	return { raw: next };
}
//#endregion
export { enrollAuthProfileAuthorizationInDatabase as t };
