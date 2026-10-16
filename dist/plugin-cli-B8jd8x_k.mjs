import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
//#region src/meeting-bot/plugin-cli.ts
function parseTimeout(value) {
	if (value === void 0) return;
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0 || parsed === 0) throw new Error("timeout-ms must be a positive integer");
	return parsed;
}
function parseMeetingCliMode(value) {
	if (value === void 0 || value === "agent" || value === "bidi" || value === "transcribe") return value;
	throw new Error(`mode must be agent, bidi, or transcribe; received ${value}`);
}
function parseMeetingCliTransport(value) {
	if (value === void 0 || value === "chrome" || value === "chrome-node") return value;
	throw new Error(`transport must be chrome or chrome-node; received ${value}`);
}
function markMeetingSetupFailure(result) {
	if (result && typeof result === "object" && "ok" in result && result.ok === false) process.exitCode = 1;
}
function joinPayload(url, options) {
	return {
		url,
		...options.transport ? { transport: parseMeetingCliTransport(options.transport) } : {},
		...options.mode ? { mode: parseMeetingCliMode(options.mode) } : {},
		...options.message ? { message: options.message } : {},
		...options.timeoutMs ? { timeoutMs: parseTimeout(options.timeoutMs) } : {}
	};
}
function addJoinOptions(command) {
	return command.option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").option("--message <text>", "instructions to speak after joining");
}
function registerMeetingPluginCli(options) {
	const call = async (method, payload) => {
		const requestedTimeoutMs = typeof payload?.timeoutMs === "number" ? payload.timeoutMs : void 0;
		const timeoutMs = options.resolveGatewayTimeoutMs({
			config: options.config,
			method,
			requestedTimeoutMs
		});
		const result = await options.callGateway(method, {
			json: true,
			timeout: String(timeoutMs)
		}, payload, {
			progress: false,
			scopes: ["operator.admin"]
		});
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
		return result;
	};
	const method = (action) => `${options.methodPrefix}.${action}`;
	const root = options.program.command(options.commandName).description(options.descriptions.root);
	const command = (usage, description) => root.command(usage).description(description);
	addJoinOptions(command("join <url>", options.descriptions.join)).action(async (url, joinOptions) => {
		await call(method("join"), joinPayload(url, joinOptions));
	});
	command("leave <session-id>", options.descriptions.leave).action(async (sessionId) => {
		await call(method("leave"), { sessionId });
	});
	command("status [session-id]", options.descriptions.status).action(async (sessionId) => {
		await call(method("status"), sessionId ? { sessionId } : {});
	});
	command("transcript <session-id>", "read the current transcript snapshot").option("--since-index <index>", "resume from a prior transcript index").action(async (sessionId, transcriptOptions) => {
		const sinceIndex = transcriptOptions.sinceIndex === void 0 ? void 0 : parseStrictNonNegativeInteger(transcriptOptions.sinceIndex);
		if (transcriptOptions.sinceIndex !== void 0 && sinceIndex === void 0) throw new Error("since-index must be a non-negative integer");
		await call(method("transcript"), {
			sessionId,
			...sinceIndex === void 0 ? {} : { sinceIndex }
		});
	});
	command("speak <session-id> [message]", "speak through an active talk-back session").action(async (sessionId, message) => {
		await call(method("speak"), {
			sessionId,
			...message ? { message } : {}
		});
	});
	command("setup", options.descriptions.setup).option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").action(async (setupOptions) => {
		markMeetingSetupFailure(await call(method("setup"), {
			transport: parseMeetingCliTransport(setupOptions.transport),
			mode: parseMeetingCliMode(setupOptions.mode)
		}));
	});
	for (const [name, action, description] of [[
		"test-speech",
		"testSpeech",
		options.descriptions.testSpeech
	], [
		"test-listen",
		"testListen",
		options.descriptions.testListen
	]]) addJoinOptions(command(`${name} <url>`, description)).option("--timeout-ms <ms>", "probe timeout in milliseconds").action(async (url, joinOptions) => {
		await call(method(action), joinPayload(url, joinOptions));
	});
}
//#endregion
export { registerMeetingPluginCli as t };
