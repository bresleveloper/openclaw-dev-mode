import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam } from "../../common-Dyxcwsy8.mjs";
import { t as callGatewayTool } from "../../gateway-w2F8o2pH.mjs";
import "../../agent-harness-runtime-BxShxpgh.mjs";
import "../../param-readers-B4Zo5Lzz.mjs";
//#region extensions/talk-voice/tool.ts
async function executeTalkVoiceTool(sessionKey, ...toolArgs) {
	const [, args, signal] = toolArgs;
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
	if (sessionKey) request.sessionKey = sessionKey;
	return jsonResult(await callGatewayTool(method, { timeoutMs: 65e3 }, request, {
		requireAgentRuntimeIdentity: true,
		signal
	}));
}
//#endregion
export { executeTalkVoiceTool };
