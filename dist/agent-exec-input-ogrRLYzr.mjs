import { t as mergeDeep } from "./deep-merge-CthyICF6.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { createReadStream, existsSync } from "node:fs";
import { TextDecoder } from "node:util";
import path from "node:path";
//#region src/commands/agent-exec-input.ts
const AGENT_EXEC_MESSAGE_MAX_BYTES = 4194304;
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });
function decodePrompt(bytes, source) {
	let value;
	try {
		value = UTF8_DECODER.decode(bytes).replace(/^\uFEFF/, "");
	} catch {
		throw new Error(`${source} must be valid UTF-8`);
	}
	if (!value.trim()) throw new Error(`${source} is empty`);
	return value;
}
async function readPromptStream(stream, source) {
	return decodePrompt(await readByteStreamWithLimit(stream, {
		maxBytes: AGENT_EXEC_MESSAGE_MAX_BYTES,
		onOverflow: () => /* @__PURE__ */ new Error(`${source} exceeds ${String(AGENT_EXEC_MESSAGE_MAX_BYTES)} bytes`)
	}), source);
}
/** Resolve the one allowed prompt source for `agent exec`. */
async function resolveAgentExecPrompt(positionalMessage, messageFile, stdin = process.stdin) {
	const file = messageFile?.trim();
	if (positionalMessage !== void 0 && file) throw new Error("Use either the prompt argument or --message-file, not both.");
	if (messageFile !== void 0 && !file) throw new Error("--message-file must not be empty.");
	if (file) {
		const stream = file === "-" ? stdin : createReadStream(file);
		try {
			return await readPromptStream(stream, file === "-" ? "stdin" : `Message file ${file}`);
		} catch (error) {
			if (file === "-" || !(error instanceof Error) || !("code" in error)) throw error;
			if (error.code === "ENOENT") throw new Error(`Message file not found: ${file}`, { cause: error });
			throw error;
		}
	}
	if (!positionalMessage?.trim()) throw new Error("Missing prompt. Pass text or use --message-file <path>.");
	return positionalMessage;
}
/**
* Facts owned by this invocation rather than by any config, so they win over
* both the ambient config and `--config`: exec is always scoped to the folder
* it was pointed at, a one-shot turn never bootstraps, and explicit flags
* outrank whatever the resolved config says.
*/
/**
* Drops inherited state and workspace location overrides, which outrank the
* facts this invocation owns. `session.store` and `agentDir` can redirect state
* outside the invocation root, where its lock or temporary cleanup cannot own
* it; a native harness `runtime.acp.cwd` can make the turn edit the wrong repo.
* `agents.bindings[].acp.cwd` needs no equivalent because exec runs no channel,
* so no binding matches.
*/
function stripInheritedAgentLocations(base) {
	const { session, ...root } = base;
	const { store: _store, ...sessionWithoutStore } = session ?? {};
	const withoutSessionStore = session ? {
		...root,
		session: sessionWithoutStore
	} : base;
	const entries = withoutSessionStore.agents?.entries;
	if (!entries) return withoutSessionStore;
	return {
		...withoutSessionStore,
		agents: {
			...withoutSessionStore.agents,
			entries: Object.fromEntries(Object.entries(entries).map(([id, entry]) => {
				const { agentDir: _agentDir, runtime, ...rest } = entry;
				if (runtime?.type !== "acp" || runtime.acp?.cwd === void 0) return [id, {
					...rest,
					...runtime ? { runtime } : {}
				}];
				const { cwd: _cwd, ...acp } = runtime.acp;
				return [id, {
					...rest,
					runtime: {
						...runtime,
						acp
					}
				}];
			}))
		}
	};
}
function buildExecRunOverlay(params) {
	const entries = Object.keys(params.base.agents?.entries ?? {});
	return {
		agents: {
			defaults: {
				workspace: params.cwd,
				skipBootstrap: true,
				...params.opts.localModelLean ? { experimental: { localModelLean: true } } : {}
			},
			...entries.length > 0 ? { entries: Object.fromEntries(entries.map((id) => [id, { workspace: params.cwd }])) } : {}
		},
		skills: { load: { watch: false } }
	};
}
/**
* Coding one-shot defaults. These merge *under* the resolved config so an
* operator who configured a tool profile, shell env, or sandbox keeps it;
* notably exec must never downgrade a configured sandbox to `off`.
*/
function buildExecConfigDefaults() {
	return {
		env: { shellEnv: { enabled: false } },
		agents: { defaults: { sandbox: { mode: "off" } } },
		tools: {
			profile: "coding",
			fs: { workspaceOnly: true },
			exec: { mode: "full" }
		}
	};
}
/**
* Resolves the config exec runs against. Default is the ambient config, so a
* one-shot turn behaves like other folder-scoped coding CLIs and can reach
* configured providers, credentials, and `agentRuntime` harness choices.
*
* `--auth-env-only` opts out of that inheritance entirely rather than trying to
* launder the resolved config. A config is a credential store by design -- API
* keys, secret headers, request auth, an inline `env` block, and login-shell
* import all feed provider auth -- so the only closed way to promise
* environment-only credentials is to not read it.
*/
async function resolveExecBaseConfig(opts) {
	if (opts.config && (opts.isolated || opts.authEnvOnly === true)) {
		const conflicting = opts.isolated ? "--isolated" : "--auth-env-only";
		throw new Error(`--config cannot be combined with ${conflicting}.`);
	}
	if (opts.isolated || opts.authEnvOnly === true) {
		const { migratePersistedImplicitMainRoster } = await import("./legacy.roster-BkBZYPpL.mjs");
		const { coerceConfig } = await import("./io.read-helpers-DTthvKPk.mjs");
		return coerceConfig(migratePersistedImplicitMainRoster({}).config);
	}
	const { createConfigIO, getRuntimeConfig } = await import("./io-CPLwHuZl.mjs");
	if (!opts.config) return getRuntimeConfig();
	const io = createConfigIO({ configPath: path.resolve(opts.config) });
	if (!existsSync(io.configPath)) throw new Error(`--config file not found: ${io.configPath}`);
	return io.loadConfig();
}
function buildExecRunConfig(params) {
	const opts = params.opts ?? {};
	const base = stripInheritedAgentLocations(params.base);
	return mergeDeep(mergeDeep(buildExecConfigDefaults(), base), buildExecRunOverlay({
		base,
		cwd: params.cwd,
		opts
	}));
}
//#endregion
export { resolveAgentExecPrompt as n, resolveExecBaseConfig as r, buildExecRunConfig as t };
