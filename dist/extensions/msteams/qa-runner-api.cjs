Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let openclaw_plugin_sdk_qa_runner_runtime = require("openclaw/plugin-sdk/qa-runner-runtime");
//#region extensions/msteams/src/qa/cli.ts
const DEFAULT_MSTEAMS_QA_SCENARIOS = ["channel-canary"];
const loadMSTeamsQaAdapterRuntime = (0, openclaw_plugin_sdk_qa_runner_runtime.createLazyCliRuntimeLoader)(() => Promise.resolve().then(() => require("./.setup/adapter.runtime-CQWZeqB5.cjs")));
async function runQaMSTeams(options) {
	await (0, openclaw_plugin_sdk_qa_runner_runtime.runLiveTransportQaSuiteCommand)({
		channelId: "msteams",
		defaultProviderMode: "mock-openai",
		options,
		selectScenarioIds: ({ scenarioIds }) => scenarioIds?.length ? [...scenarioIds] : [...DEFAULT_MSTEAMS_QA_SCENARIOS]
	});
}
//#endregion
//#region extensions/msteams/qa-runner-api.ts
const qaRunnerCliRegistrations = [(0, openclaw_plugin_sdk_qa_runner_runtime.createLiveTransportQaCliRegistration)({
	commandName: "msteams",
	adapterFactory: {
		id: "msteams",
		isolatesInstances: true,
		matches: ({ channelId, driver }) => channelId === "msteams" && driver === "live",
		async create(context) {
			return await (await loadMSTeamsQaAdapterRuntime()).createMSTeamsQaTransportAdapter(context);
		}
	},
	defaultProviderMode: "mock-openai",
	description: "Run Microsoft Teams Gateway QA against a local Bot Framework mock",
	providerModeHelp: "Provider mode: mock-openai, aimock, or live-frontier",
	outputDirHelp: "Microsoft Teams QA artifact directory",
	allowFailuresHelp: "Write artifacts without setting a failing exit code when scenarios fail",
	scenarioHelp: "Run only the named Microsoft Teams QA scenario (repeatable)",
	sutAccountHelp: "Normalized Microsoft Teams SUT account id in QA artifacts",
	run: runQaMSTeams
})];
//#endregion
exports.qaRunnerCliRegistrations = qaRunnerCliRegistrations;
