import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { h as readToolStringParam } from "../../common-XfKigJno.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { t as callGatewayTool } from "../../gateway-DVDJurQC.mjs";
import "../../agent-harness-runtime-DJD87w0k.mjs";
import "../../param-readers-BfezLD6d.mjs";
//#region extensions/talk-voice/tool.ts
const executeTalkVoiceTool = async (_id, args, signal) => {
	const params = asOptionalRecord(args) ?? {};
	const action = readToolStringParam(params, "action", { required: true });
	let method;
	let request;
	switch (action) {
		case "list":
			method = "talk.voice.get";
			request = {};
			break;
		case "set":
			method = "talk.voice.set";
			request = { voice: readToolStringParam(params, "voice", { required: true }) };
			break;
		default: throw new Error(`Unknown Talk voice action: ${action}`);
	}
	return jsonResult(await callGatewayTool(method, { timeoutMs: 65e3 }, request, {
		requireAgentRuntimeIdentity: true,
		signal
	}));
};
//#endregion
export { executeTalkVoiceTool };
