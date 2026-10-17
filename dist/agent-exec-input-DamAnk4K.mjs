import { t as mergeDeep } from "./deep-merge-B-AVx-Uc.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";
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
* Keep state under exec's lock and bind every agent to the requested folder.
* Per-agent workspaces outrank defaults; ACP cwd can redirect the native harness.
* Channel binding cwd needs no adjustment because exec matches no channel.
*/
function pinExecAgentLocations(base, cwd) {
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
					workspace: cwd,
					...runtime ? { runtime } : {}
				}];
				const { cwd: _cwd, ...acp } = runtime.acp;
				return [id, {
					...rest,
					workspace: cwd,
					runtime: {
						...runtime,
						acp
					}
				}];
			}))
		}
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
* Config is a credential source (provider keys, headers, env and shell imports).
* Environment-only execution therefore skips it entirely; ordinary exec inherits it.
*/
async function resolveExecBaseConfig(opts) {
	if (opts.config && (opts.isolated || opts.authEnvOnly === true)) {
		const conflicting = opts.isolated ? "--isolated" : "--auth-env-only";
		throw new Error(`--config cannot be combined with ${conflicting}.`);
	}
	if (opts.isolated || opts.authEnvOnly === true) {
		const { applyImplicitAgentRosterDefaults } = await import("./implicit-agent-roster-BdVyk84N.mjs");
		const { coerceConfig } = await import("./io.read-helpers-DzqIh7Xd.mjs");
		return coerceConfig(applyImplicitAgentRosterDefaults({}));
	}
	const { createConfigIO, getRuntimeConfig } = await import("./io-BM-qEheD.mjs");
	if (!opts.config) return getRuntimeConfig();
	const io = createConfigIO({ configPath: path.resolve(opts.config) });
	if (!existsSync(io.configPath)) throw new Error(`--config file not found: ${io.configPath}`);
	return io.loadConfig();
}
function buildExecRunConfig(params) {
	const opts = params.opts ?? {};
	const base = pinExecAgentLocations(params.base, params.cwd);
	return mergeDeep(mergeDeep(buildExecConfigDefaults(), base), {
		agents: { defaults: {
			workspace: params.cwd,
			skipBootstrap: true,
			...opts.localModelLean ? { experimental: { localModelLean: true } } : {}
		} },
		skills: { load: { watch: false } }
	});
}
//#endregion
export { resolveAgentExecPrompt as n, resolveExecBaseConfig as r, buildExecRunConfig as t };
