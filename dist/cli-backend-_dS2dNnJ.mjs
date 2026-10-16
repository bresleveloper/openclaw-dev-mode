import crypto from "node:crypto";
//#region extensions/google/cli-backend.ts
const GEMINI_MODEL_ALIASES = {
	pro: "gemini-3.1-pro-preview",
	flash: "gemini-3.1-flash-preview",
	"flash-lite": "gemini-3.1-flash-lite"
};
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3-flash-preview";
const GEMINI_ALLOWED_MCP_SERVERS_ARG = "--allowed-mcp-server-names";
function mapGeminiCliOutputFormat(value) {
	if (value === "stream-json") return "jsonl";
	if (value === "json" || value === "text") return value;
}
function readGeminiCliOutputFormat(args) {
	for (let index = 0; index < (args?.length ?? 0); index += 1) {
		const arg = args?.[index];
		if (arg === "--output-format" || arg === "-o") return mapGeminiCliOutputFormat(args?.[index + 1]) ?? "text";
		const mapped = mapGeminiCliOutputFormat(arg?.startsWith("--output-format=") ? arg.slice(16) : arg?.startsWith("-o=") ? arg.slice(3) : void 0);
		if (mapped) return mapped;
	}
	return "text";
}
function normalizeGeminiCliBackendConfig(config) {
	const output = readGeminiCliOutputFormat(config.args);
	const resumeOutput = readGeminiCliOutputFormat(config.resumeArgs ?? config.args);
	const usesStreamJson = output === "jsonl" || resumeOutput === "jsonl";
	return {
		...config,
		output,
		resumeOutput,
		jsonlDialect: usesStreamJson ? "gemini-stream-json" : void 0
	};
}
function isGeminiAllowedMcpServersArg(arg) {
	const [name] = arg.split("=", 1);
	if (!name?.startsWith("--")) return false;
	return name.slice(2).replaceAll(/[-_]/g, "").toLowerCase() === "allowedmcpservernames";
}
function resolveGeminiCliExecutionArgs(ctx) {
	if (!ctx.toolAvailability) return ctx.baseArgs;
	const terminatorIndex = ctx.baseArgs.indexOf("--");
	const optionArgs = terminatorIndex === -1 ? ctx.baseArgs : ctx.baseArgs.slice(0, terminatorIndex);
	const positionalArgs = terminatorIndex === -1 ? [] : ctx.baseArgs.slice(terminatorIndex);
	const args = [];
	for (let index = 0; index < optionArgs.length; index += 1) {
		const arg = optionArgs[index];
		if (arg && isGeminiAllowedMcpServersArg(arg)) {
			if (!arg.includes("=")) index += 1;
			continue;
		}
		if (arg !== void 0) args.push(arg);
	}
	const allowedServer = ctx.toolAvailability.openClaw.length > 0 ? "openclaw" : crypto.randomUUID();
	return [
		...args,
		GEMINI_ALLOWED_MCP_SERVERS_ARG,
		allowedServer,
		...positionalArgs
	];
}
function buildGoogleGeminiCliBackend() {
	return {
		id: "google-gemini-cli",
		modelProvider: "google",
		liveTest: {
			defaultModelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			defaultImageProbe: true,
			defaultMcpProbe: true,
			docker: {
				npmPackage: "@google/gemini-cli",
				binaryName: "gemini"
			}
		},
		runtimeArtifact: {
			kind: "bundled-package-tree",
			packageName: "@google/gemini-cli",
			entrypoint: "command",
			exactToolAvailabilityVersionPolicy: {
				stableMinimum: "0.39.1",
				prereleaseMinimums: {
					preview: "0.40.0-preview.3",
					nightly: "0.41.0-nightly.20260427.g42587de73"
				}
			}
		},
		bundleMcp: true,
		bundleMcpMode: "gemini-system-settings",
		ownsNativeCompaction: true,
		nativeToolMode: "selectable",
		toolAvailabilityEnforcement: "prepare-execution",
		authEpochMode: "profile-only",
		normalizeConfig: normalizeGeminiCliBackendConfig,
		resolveExecutionArgs: resolveGeminiCliExecutionArgs,
		prepareExecution: async (ctx) => {
			const { prepareGeminiCliExecution } = await import("./extensions/google/cli-backend-auth.runtime.js");
			const privateContext = ctx;
			return await prepareGeminiCliExecution({
				agentDir: ctx.agentDir,
				authProfileId: ctx.authProfileId,
				workspaceDir: ctx.workspaceDir,
				baseEnv: ctx.env,
				isolatedCompletionCwd: privateContext.isolatedCompletionCwd,
				systemSettingsPath: ctx.env?.GEMINI_CLI_SYSTEM_SETTINGS_PATH ?? process.env.GEMINI_CLI_SYSTEM_SETTINGS_PATH,
				toolAvailability: ctx.toolAvailability,
				isolatedCompletionModelId: privateContext.isolatedCompletionModelId,
				isolatedCompletionPrompt: privateContext.isolatedCompletionPrompt,
				isolatedCompletionSystemPrompt: privateContext.isolatedCompletionSystemPrompt
			}, privateContext.authCredential);
		},
		config: {
			command: "gemini",
			args: [
				"--skip-trust",
				"--approval-mode",
				"auto_edit",
				"--output-format",
				"stream-json",
				"--prompt",
				"{prompt}"
			],
			resumeArgs: [
				"--skip-trust",
				"--approval-mode",
				"auto_edit",
				"--resume",
				"{sessionId}",
				"--output-format",
				"stream-json",
				"--prompt",
				"{prompt}"
			],
			output: "jsonl",
			input: "arg",
			jsonlDialect: "gemini-stream-json",
			imageArg: "@",
			imagePathScope: "workspace",
			modelArg: "--model",
			modelAliases: GEMINI_MODEL_ALIASES,
			sessionMode: "existing",
			sessionIdFields: ["session_id", "sessionId"],
			serialize: true
		}
	};
}
//#endregion
export { buildGoogleGeminiCliBackend as t };
