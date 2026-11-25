import { createSshSandboxSessionFromConfigText, runPluginCommandWithTimeout, shellEscape } from "openclaw/plugin-sdk/sandbox";
import path from "node:path";
import { formatPluginConfigIssue, mapPluginConfigIssues } from "openclaw/plugin-sdk/extension-shared";
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { MAX_TIMER_TIMEOUT_SECONDS } from "openclaw/plugin-sdk/number-runtime";
import { z } from "zod";
// extensions/openshell/src/cli.ts
function buildOpenShellBaseArgv(config) {
	const argv = [config.command];
	if (config.gateway) argv.push("--gateway", config.gateway);
	if (config.gatewayEndpoint) argv.push("--gateway-endpoint", config.gatewayEndpoint);
	if (config.workspace) argv.push("--workspace", config.workspace);
	return argv;
}
function applyGatewayEndpointToSshConfig(params) {
	const endpoint = params.gatewayEndpoint?.trim();
	if (!endpoint) return params.configText;
	return params.configText.replace(/^(\s*ProxyCommand\s+)(.*)$/m, (line, prefix, command) => {
		if (!command.includes("ssh-proxy")) return line;
		if (/(^|\s)--server(\s|=)|(^|\s)--gateway-endpoint(\s|=)/.test(command)) return line;
		return `${prefix}${command} --server ${shellEscape(endpoint)}`;
	});
}
async function runOpenShellCli(params) {
	return await runPluginCommandWithTimeout({
		argv: [...buildOpenShellBaseArgv(params.context.config), ...params.args],
		cwd: params.cwd,
		timeoutMs: params.timeoutMs ?? params.context.timeoutMs ?? params.context.config.timeoutMs,
		env: process.env
	});
}
async function createOpenShellSshSession(params) {
	const result = await runOpenShellCli({
		context: params.context,
		args: [
			"sandbox",
			"ssh-config",
			params.context.sandboxName
		]
	});
	if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox ssh-config failed");
	return await createSshSandboxSessionFromConfigText({ configText: applyGatewayEndpointToSshConfig({
		configText: result.stdout,
		gatewayEndpoint: params.context.config.gatewayEndpoint
	}) });
}
// extensions/openshell/src/config.ts
const DEFAULT_COMMAND = "openshell";
const DEFAULT_MODE = "mirror";
const DEFAULT_SOURCE = "openclaw";
const DEFAULT_REMOTE_WORKSPACE_DIR = "/sandbox";
const DEFAULT_REMOTE_AGENT_WORKSPACE_DIR = "/agent";
const DEFAULT_TIMEOUT_MS = 12e4;
const OPEN_SHELL_MANAGED_REMOTE_PATH = /^\/(?:sandbox|agent)(?:\/|$)/;
const nonEmptyTrimmedString = (message) => z.string({ error: message }).trim().min(1, { error: message });
const openShellManagedRemotePath = (fieldName) => nonEmptyTrimmedString(`${fieldName} must be a non-empty string`).regex(OPEN_SHELL_MANAGED_REMOTE_PATH, { error: (issue) => String(issue.input).startsWith("/") ? `OpenShell ${fieldName} must stay under /sandbox or /agent` : `OpenShell ${fieldName} must be absolute` }).refine((value) => OPEN_SHELL_MANAGED_REMOTE_PATH.test(path.posix.normalize(value)), { error: `OpenShell ${fieldName} must stay under /sandbox or /agent` });
const openShellWorkspaceName = z.string({ error: "workspace must be a valid OpenShell workspace name" }).trim().min(1, { error: "workspace must be a valid OpenShell workspace name" }).max(19, { error: "workspace must be at most 19 characters" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "workspace must contain lowercase alphanumeric characters or single hyphens and must not start or end with a hyphen" });
const OpenShellWorkerConfigSchema = z.strictObject({
	agentWorkspace: z.strictObject({
		agentId: z.string().trim().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
		remoteRoot: openShellManagedRemotePath("worker.agentWorkspace.remoteRoot").refine((value) => path.posix.normalize(value) === value && !["/sandbox", "/agent"].includes(value) && ![
			"\\",
			"\0",
			"*",
			"?",
			"[",
			"]",
			"{",
			"}",
			"!",
			"(",
			")"
		].some((part) => value.includes(part)), "worker.agentWorkspace.remoteRoot must be a normalized directory below /sandbox or /agent without glob characters")
	}).optional(),
	nodeCommand: nonEmptyTrimmedString("worker.nodeCommand must be a non-empty string").default("openclaw"),
	nodeExecutable: nonEmptyTrimmedString("worker.nodeExecutable must be a non-empty string").default("node"),
	stateDir: openShellManagedRemotePath("worker.stateDir").default("/sandbox/.openclaw-node"),
	model: z.strictObject({
		provider: z.string().trim().min(1).regex(/^[a-z0-9][a-z0-9_-]*$/),
		id: z.string().trim().min(1),
		api: z.enum([
			"openai-completions",
			"openai-responses",
			"anthropic-messages"
		]),
		baseUrl: z.url().refine((value) => {
			const url = new URL(value);
			return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash;
		}, "worker.model.baseUrl must be an HTTPS endpoint without credentials, query, or fragment"),
		credentialEnv: z.string().regex(/^(?!NODE_|OPENCLAW_|OPENSHELL_|PATH$|HOME$|TMPDIR$|TMP$|TEMP$|LANG$|TZ$)[A-Z][A-Z0-9_]*$/, "Use a dedicated model credential environment variable, not a runtime control variable"),
		contextWindow: z.number().int().positive(),
		maxTokens: z.number().int().positive(),
		reasoning: z.boolean().default(false),
		input: z.array(z.enum(["text", "image"])).min(1).default(["text"])
	})
});
const OpenShellPluginConfigSchema = z.strictObject({
	worker: OpenShellWorkerConfigSchema.optional(),
	mode: z.enum(["mirror", "remote"], { error: "mode must be one of mirror, remote" }).optional(),
	command: nonEmptyTrimmedString("command must be a non-empty string").optional(),
	gateway: nonEmptyTrimmedString("gateway must be a non-empty string").optional(),
	gatewayEndpoint: nonEmptyTrimmedString("gatewayEndpoint must be a non-empty string").optional(),
	workspace: openShellWorkspaceName.optional(),
	from: nonEmptyTrimmedString("from must be a non-empty string").optional(),
	policy: nonEmptyTrimmedString("policy must be a non-empty string").optional(),
	providers: z.array(z.string({ error: "providers must be an array of strings" }).trim().min(1, { error: "providers must be an array of strings" }), { error: "providers must be an array of strings" }).optional(),
	gpu: z.boolean({ error: "gpu must be a boolean" }).optional(),
	autoProviders: z.boolean({ error: "autoProviders must be a boolean" }).optional(),
	remoteWorkspaceDir: openShellManagedRemotePath("remoteWorkspaceDir").optional(),
	remoteAgentWorkspaceDir: openShellManagedRemotePath("remoteAgentWorkspaceDir").optional(),
	timeoutSeconds: z.number({ error: `timeoutSeconds must be a number between 1 and ${MAX_TIMER_TIMEOUT_SECONDS}` }).min(1, { error: "timeoutSeconds must be a number >= 1" }).max(MAX_TIMER_TIMEOUT_SECONDS, { error: `timeoutSeconds must be a number <= ${MAX_TIMER_TIMEOUT_SECONDS}` }).optional()
});
function normalizeOpenShellRemotePath(value) {
	const normalized = path.posix.normalize(value);
	if (!OPEN_SHELL_MANAGED_REMOTE_PATH.test(normalized)) throw new Error(`OpenShell remote path must stay under /sandbox or /agent: ${value}`);
	return normalized;
}
function createOpenShellPluginConfigSchema() {
	return buildPluginConfigSchema(OpenShellPluginConfigSchema, { safeParse(value) {
		if (value === void 0) return {
			success: true,
			data: void 0
		};
		const parsed = OpenShellPluginConfigSchema.safeParse(value);
		if (parsed.success) return {
			success: true,
			data: parsed.data
		};
		return {
			success: false,
			error: { issues: mapPluginConfigIssues(parsed.error.issues) }
		};
	} });
}
function resolveOpenShellPluginConfig(value) {
	const parsed = OpenShellPluginConfigSchema.safeParse(value === void 0 ? {} : value);
	if (!parsed.success) {
		const message = formatPluginConfigIssue(parsed.error.issues[0]);
		throw new Error(`Invalid openshell plugin config: ${message}`);
	}
	const cfg = parsed.data;
	return {
		...cfg.worker ? { worker: cfg.worker } : {},
		mode: cfg.mode ?? DEFAULT_MODE,
		command: cfg.command ?? DEFAULT_COMMAND,
		gateway: cfg.gateway,
		gatewayEndpoint: cfg.gatewayEndpoint,
		workspace: cfg.workspace,
		from: cfg.from ?? DEFAULT_SOURCE,
		policy: cfg.policy,
		providers: [...new Set(cfg.providers ?? [])],
		gpu: cfg.gpu ?? false,
		autoProviders: cfg.autoProviders ?? true,
		remoteWorkspaceDir: normalizeOpenShellRemotePath(cfg.remoteWorkspaceDir ?? DEFAULT_REMOTE_WORKSPACE_DIR),
		remoteAgentWorkspaceDir: normalizeOpenShellRemotePath(cfg.remoteAgentWorkspaceDir ?? DEFAULT_REMOTE_AGENT_WORKSPACE_DIR),
		timeoutMs: typeof cfg.timeoutSeconds === "number" ? Math.floor(cfg.timeoutSeconds * 1e3) : DEFAULT_TIMEOUT_MS
	};
}
export { runOpenShellCli as a, createOpenShellSshSession as i, resolveOpenShellPluginConfig as n, buildOpenShellBaseArgv as r, createOpenShellPluginConfigSchema as t };
