import { createLazyCliRuntimeLoader, createLiveTransportQaCliRegistration, runLiveTransportQaSuiteCommand } from "openclaw/plugin-sdk/qa-runner-runtime";
//#region extensions/buzz/src/qa/cli.ts
const DEFAULT_BUZZ_QA_SCENARIOS = ["channel-canary", "channel-mention-gating"];
const loadBuzzQaAdapterRuntime = createLazyCliRuntimeLoader(() => import("./.setup/adapter.runtime-FIC9NMFI.mjs"));
async function runQaBuzz(options) {
	await runLiveTransportQaSuiteCommand({
		channelId: "buzz",
		defaultProviderMode: "mock-openai",
		options,
		selectScenarioIds: ({ scenarioIds }) => scenarioIds?.length ? [...scenarioIds] : [...DEFAULT_BUZZ_QA_SCENARIOS]
	});
}
//#endregion
//#region extensions/buzz/qa-runner-api.ts
const qaRunnerCliRegistrations = [createLiveTransportQaCliRegistration({
	commandName: "buzz",
	credentialFileHelp: "JSON credential file for local Buzz QA",
	adapterFactory: {
		id: "buzz",
		matches: ({ channelId, driver }) => channelId === "buzz" && driver === "live",
		async create(context) {
			return await (await loadBuzzQaAdapterRuntime()).createBuzzQaTransportAdapter(context);
		}
	},
	credentialOptions: {
		sourceDescription: "Credential source for Buzz QA: file or convex (default: file with --credential-file; otherwise shared environment)",
		roleDescription: "Credential role for convex auth: maintainer or ci (default: ci in CI, maintainer otherwise)"
	},
	defaultProviderMode: "mock-openai",
	description: "Run the Buzz live QA lane against a dedicated relay room",
	providerModeHelp: "Provider mode: mock-openai, aimock, or live-frontier",
	outputDirHelp: "Buzz QA artifact directory",
	allowFailuresHelp: "Write artifacts without setting a failing exit code when scenarios fail",
	scenarioHelp: "Run only the named Buzz QA scenario (repeatable)",
	sutAccountHelp: "Normalized Buzz SUT account id in QA artifacts",
	run: runQaBuzz
})];
//#endregion
export { qaRunnerCliRegistrations };
