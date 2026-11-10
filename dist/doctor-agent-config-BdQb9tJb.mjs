import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/memory-core/src/doctor-agent-config.ts
/** Blocked include migrations can leave Doctor candidates in the raw roster shape. */
function readDoctorAgentEntries(config) {
	const agents = asOptionalObjectRecord(asOptionalObjectRecord(config)?.agents);
	const listed = Object.prototype.propertyIsEnumerable.call(agents ?? {}, "list") && Array.isArray(agents?.list) ? agents.list : [];
	return {
		keyed: asOptionalObjectRecord(agents?.entries),
		listed
	};
}
//#endregion
export { readDoctorAgentEntries as t };
