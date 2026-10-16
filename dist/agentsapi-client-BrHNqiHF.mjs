import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Sn as looseObject, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as fetchWithSsrFGuard, u as responseWithRelease } from "./fetch-guard-DI6biu8d.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-By9R9pyt.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import "./fetch-runtime-DT4gd-qk.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./retry-runtime-CZf8_bHp.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { t as DEFAULT_NATIVE_TOOLS } from "./config-C0jAkmTa.mjs";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import OpenAI from "openai";
//#region extensions/agentsapi/agentsapi-client.ts
const usageSchema = looseObject({
	input_tokens: number(),
	output_tokens: number(),
	total_tokens: number().optional(),
	input_tokens_details: looseObject({ cached_tokens: number() }).optional(),
	output_tokens_details: looseObject({ reasoning_tokens: number() }).optional()
});
const errorSchema = looseObject({
	message: string(),
	code: string().nullable().optional(),
	type: string().optional(),
	param: string().nullable().optional()
});
const functionCallSchema = looseObject({
	type: literal("function_call"),
	turn_id: string().min(1),
	call_id: string().min(1),
	name: string().min(1),
	arguments: unknown()
});
const sessionSchema = looseObject({
	id: string(),
	status: _enum([
		"idle",
		"in_progress",
		"requires_action",
		"failed"
	]),
	error: string().nullable(),
	usage: usageSchema.nullable().optional(),
	environment: discriminatedUnion("type", [
		looseObject({
			type: literal("openai_hosted"),
			id: string().min(1)
		}),
		looseObject({
			type: literal("self_hosted"),
			id: string().min(1),
			workspace_directory: string(),
			remote_url: string().min(1)
		}),
		looseObject({ type: literal("none") })
	]),
	required_actions: array(union([functionCallSchema, looseObject({
		type: literal("environment_connection"),
		environment_id: string()
	})]))
});
const artifactSchema = looseObject({
	id: string().min(1),
	object: literal("agent.session.artifact"),
	session_id: string(),
	environment_id: string(),
	turn_id: string(),
	path: string(),
	size_bytes: number().int().nonnegative().safe()
});
const textPartSchema = looseObject({
	type: string(),
	text: string().optional()
});
const itemSchema = looseObject({
	id: string(),
	type: string(),
	role: string().optional(),
	phase: string().nullable().optional(),
	status: string().nullable().optional(),
	turn_id: string().optional(),
	content: array(textPartSchema).optional(),
	summary: array(textPartSchema).optional(),
	command: string().optional(),
	cwd: string().nullable().optional(),
	duration_ms: number().nullable().optional(),
	exit_code: number().nullable().optional(),
	name: string().optional(),
	call_id: string().optional(),
	server_label: string().optional(),
	arguments: unknown().optional(),
	output: unknown().optional(),
	error: unknown().optional(),
	action: looseObject({
		type: string(),
		query: string().nullable().optional(),
		queries: array(string()).nullable().optional(),
		url: string().nullable().optional(),
		pattern: string().nullable().optional()
	}).nullable().optional()
});
const eventSchema = looseObject({
	type: string(),
	event_id: string().optional(),
	session_id: string().optional(),
	turn_id: string().nullable().optional(),
	item_id: string().optional(),
	output_index: number().nullable().optional(),
	content_index: number().optional(),
	summary_index: number().optional(),
	status: string().nullable().optional(),
	delta: string().optional(),
	text: string().optional(),
	part: textPartSchema.optional(),
	item: itemSchema.optional(),
	usage: usageSchema.nullable().optional(),
	session: sessionSchema.optional(),
	environment: looseObject({
		id: string(),
		type: string(),
		status: string(),
		error: errorSchema.nullable()
	}).optional(),
	turn: looseObject({
		id: string(),
		subagent_id: string().nullable(),
		session_id: string().optional(),
		status: string().optional(),
		agent_id: string().optional(),
		created_at: number().optional(),
		started_at: number().nullable().optional(),
		completed_at: number().nullable().optional(),
		error: errorSchema.nullable().optional(),
		usage: usageSchema.nullable().optional()
	}).optional(),
	error: errorSchema.optional()
});
/** The SDK owns the wire protocol; OpenClaw retains native session authority. */
var AgentsApiClient = class {
	constructor(apiKey, assertCurrent, assertRequestCurrent = assertCurrent) {
		this.assertCurrent = assertCurrent;
		const agents = new OpenAI({
			apiKey,
			baseURL: null,
			maxRetries: 0,
			defaultHeaders: {
				Authorization: `Bearer ${apiKey}`,
				"OpenAI-Organization": null,
				"OpenAI-Project": null
			},
			fetch: async (input, init) => {
				this.assertCurrent();
				const url = input instanceof Request ? input.url : String(input);
				const headers = resolveProviderRequestHeaders({
					provider: "openai",
					baseUrl: url,
					transport: "http",
					callerHeaders: Object.fromEntries(new Headers(init?.headers))
				});
				const guarded = await fetchWithSsrFGuard({
					url,
					init: {
						...init,
						headers
					},
					signal: init?.signal ?? void 0,
					beforeRequest: assertRequestCurrent
				});
				const response = responseWithRelease(guarded.response, guarded.release);
				try {
					this.assertCurrent();
				} catch (error) {
					await response.body?.cancel().catch(() => void 0);
					throw error;
				}
				return response;
			}
		}).beta.agents;
		this.sessions = agents.sessions;
		this.environments = agents.environments;
	}
	async create(signal, instructions, model, options) {
		const environment = options?.environment ?? { type: "openai_hosted" };
		const tools = [
			...options?.nativeTools ?? DEFAULT_NATIVE_TOOLS,
			...options?.mcpTools ?? [],
			...options?.functions ?? []
		];
		const body = {
			agent: {
				model,
				instructions,
				reasoning: options?.reasoning,
				multi_agent: { enabled: false }
			},
			environment: environment.type === "openai_hosted" ? {
				...environment,
				files: options?.files ?? []
			} : environment
		};
		const session = await this.sessions.create(body, {
			signal,
			headers: { "Idempotency-Key": randomUUID() },
			body: {
				...body,
				agent: {
					...body.agent,
					tools
				}
			}
		});
		this.assertCurrent();
		return session.id;
	}
	async createIsolated(signal, instructions, input, model, reasoning) {
		const session = await this.sessions.create({
			agent: {
				model,
				instructions,
				reasoning,
				tools: [],
				multi_agent: { enabled: false }
			},
			environment: { type: "none" },
			input,
			vault_ids: []
		}, {
			signal,
			headers: { "Idempotency-Key": randomUUID() }
		});
		this.assertCurrent();
		return session;
	}
	async deleteSession(sessionId, signal) {
		const deleted = await this.sessions.delete(sessionId, { signal });
		this.assertCurrent();
		if (deleted.id !== sessionId || !deleted.deleted) throw new Error("Agents API did not delete the requested isolated session");
	}
	async setReasoningEffort(sessionId, effort, signal) {
		const session = await this.sessions.update(sessionId, {}, {
			signal,
			headers: { "Idempotency-Key": randomUUID() },
			body: { agent: { reasoning: { effort: effort ?? null } } }
		});
		this.assertCurrent();
		if (session.id !== sessionId) throw new Error("Agents API returned a different session");
	}
	async subscribe(sessionId, signal) {
		const stream = await this.sessions.events.stream(sessionId, { signal });
		try {
			this.assertCurrent();
			signal.throwIfAborted();
		} catch (error) {
			stream.controller.abort();
			throw error;
		}
		return observeEvents(stream, signal, sessionId, this.assertCurrent);
	}
	async session(sessionId, signal) {
		const session = await this.sessions.retrieve(sessionId, { signal });
		this.assertCurrent();
		if (session.id !== sessionId) throw new Error("Agents API returned a different session");
		return session;
	}
	async pendingFunctionCalls(sessionId, signal) {
		const session = sessionSchema.parse(await this.session(sessionId, signal));
		if (session.status === "failed") throw new Error(session.error ?? "Agents API session failed");
		if (session.status !== "requires_action") return [];
		const calls = [];
		for (const action of session.required_actions) {
			if (action.type === "environment_connection" && session.environment.type === "self_hosted" && action.environment_id === session.environment.id) continue;
			if (action.type !== "function_call") throw new Error("Agents API hosted prototype cannot reconnect an environment_connection");
			calls.push(action);
		}
		return calls;
	}
	async toolResult(sessionId, call, result, signal) {
		await this.submitEvents(sessionId, [{
			type: "agent.session.input.tool_result",
			turn_id: call.turn_id,
			call_id: call.call_id,
			...result.success ? {
				success: true,
				output: result.output
			} : {
				success: false,
				error: result.error
			}
		}], signal);
	}
	async turn(sessionId, turnId, signal) {
		const turn = await this.sessions.turns.retrieve(turnId, { session_id: sessionId }, { signal });
		this.assertCurrent();
		if (turn.id !== turnId || turn.session_id !== sessionId || turn.subagent_id !== null) throw new Error("Agents API returned a turn outside the requested root session");
		return turn;
	}
	async uploadFile(sessionId, file, signal) {
		const session = await this.session(sessionId, signal);
		signal.throwIfAborted();
		if (session.environment.type !== "openai_hosted") throw new Error("Agents API file upload requires the session's connected hosted environment");
		const retrieved = await this.environments.retrieve(session.environment.id, { signal });
		const environment = object({
			id: string(),
			type: literal("openai_hosted"),
			status: string()
		}).parse(retrieved);
		this.assertCurrent();
		signal.throwIfAborted();
		if (environment.id !== session.environment.id) throw new Error("Agents API file upload requires the session's connected hosted environment");
		if (environment.status === "disconnected") return { status: "unavailable" };
		if (environment.status !== "connected") throw new Error("Agents API file upload requires the session's connected hosted environment");
		let uploaded;
		try {
			uploaded = await this.environments.files.create(session.environment.id, file, {
				signal,
				headers: { "Idempotency-Key": randomUUID() }
			});
		} catch (error) {
			if (error instanceof OpenAI.ConflictError && error.status === 409) {
				const failure = errorSchema.safeParse(error.error);
				if (failure.success && failure.data.type === "conflict_error" && failure.data.message === "the hosted environment is dormant; submit new input to start a fresh sandbox") {
					this.assertCurrent();
					signal.throwIfAborted();
					return { status: "unavailable" };
				}
			}
			throw error;
		}
		const saved = object({
			environment_id: string(),
			path: string(),
			size_bytes: number()
		}).parse(uploaded);
		this.assertCurrent();
		signal.throwIfAborted();
		if (saved.environment_id !== session.environment.id || saved.path !== file.path || saved.size_bytes !== Buffer.from(file.data, "base64").byteLength) throw new Error("Agents API uploaded file did not match the requested environment, path, or size");
		return { status: "uploaded" };
	}
	async artifacts(sessionId, turnId, signal) {
		const artifacts = [];
		const seen = /* @__PURE__ */ new Set();
		let after;
		for (let pages = 0; pages < 100; pages++) {
			const listed = await this.sessions.artifacts.list(sessionId, {
				order: "asc",
				limit: 100,
				after
			}, { signal });
			const page = object({
				data: array(artifactSchema),
				has_more: boolean()
			}).parse(listed);
			this.assertCurrent();
			if (page.data.some((artifact) => artifact.session_id !== sessionId)) throw new Error("Agents API returned an artifact outside the requested session");
			artifacts.push(...page.data.filter((artifact) => artifact.turn_id === turnId));
			if (!page.has_more) return artifacts;
			const lastId = page.data.at(-1)?.id;
			if (!lastId || seen.has(lastId)) throw new Error("Agents API artifacts page has no valid continuation cursor");
			after = lastId;
			seen.add(after);
		}
		throw new Error("Agents API artifact listing exceeded the pagination limit");
	}
	async artifactContent(sessionId, artifact, maxBytes, signal) {
		if (artifact.session_id !== sessionId || !Number.isSafeInteger(maxBytes) || maxBytes < 0 || artifact.size_bytes > maxBytes) throw new Error("Agents API artifact download exceeds its session or byte bounds");
		const response = await this.sessions.artifacts.content(artifact.id, { session_id: sessionId }, { signal });
		if (!response.body) throw new Error("Agents API artifact returned no content body");
		const reader = response.body.getReader();
		const chunks = [];
		let bytes = 0;
		try {
			while (true) {
				signal.throwIfAborted();
				this.assertCurrent();
				const chunk = await reader.read();
				this.assertCurrent();
				if (chunk.done) break;
				bytes += chunk.value.byteLength;
				if (bytes > maxBytes || bytes > artifact.size_bytes) throw new Error("Agents API artifact content exceeded its immutable size or byte limit");
				chunks.push(chunk.value);
			}
			if (bytes !== artifact.size_bytes) throw new Error("Agents API artifact content did not match its immutable size");
			return Buffer.concat(chunks, bytes);
		} finally {
			await closeResponseReader(reader, signal);
		}
	}
	async turns(sessionId, signal, after, latestOnly = false) {
		const turns = [];
		const pages = this.sessions.turns.list(sessionId, {
			order: latestOnly ? "desc" : "asc",
			limit: latestOnly ? 1 : 100,
			after
		}, { signal });
		for await (const page of (await pages).iterPages()) {
			this.assertCurrent();
			if (page.data.some((turn) => turn.session_id !== sessionId || turn.subagent_id !== null)) throw new Error("Agents API returned a turn outside the single-agent session");
			turns.push(...page.data);
			if (latestOnly) break;
			if (page.has_more && !page.hasNextPage()) throw new Error("Agents API turns page has no continuation cursor");
		}
		return turns;
	}
	async message(sessionId, text, signal) {
		await this.submitEvents(sessionId, [{
			type: "agent.session.input.message",
			input: [{
				role: "user",
				content: [{
					type: "input_text",
					text
				}]
			}]
		}], signal);
	}
	async cancel(sessionId, signal) {
		await this.submitEvents(sessionId, [{ type: "agent.session.input.cancel" }], signal);
		while (true) {
			const session = await this.session(sessionId, signal);
			if (session.status === "idle" || session.status === "failed") return;
			await setTimeout(500, void 0, { signal });
		}
	}
	async items(sessionId, turnId, signal) {
		const items = [];
		const pages = this.sessions.items.list(sessionId, {
			order: "asc",
			limit: 100
		}, { signal });
		for await (const page of (await pages).iterPages()) {
			this.assertCurrent();
			items.push(...page.data.filter((item) => turnId === void 0 || item.turn_id === turnId).map((item) => itemSchema.parse(item)));
			if (page.has_more && !page.hasNextPage()) throw new Error("Agents API items page has no continuation cursor");
		}
		return items;
	}
	async submitEvents(sessionId, events, signal) {
		const params = {
			events,
			"Idempotency-Key": randomUUID()
		};
		await retryAsync(async () => {
			signal.throwIfAborted();
			this.assertCurrent();
			await this.sessions.events.create(sessionId, params, { signal });
		}, {
			attempts: 3,
			minDelayMs: 500,
			maxDelayMs: 5e3,
			jitter: .25,
			shouldRetry: (error) => !signal.aborted && error instanceof OpenAI.APIError && error.status !== void 0 && error.status >= 500 && error.status < 600 && error.headers?.get("x-should-retry") !== "false",
			sleep: (ms) => sleepWithAbort(ms, signal)
		});
		this.assertCurrent();
	}
};
function isAgentsApiTerminalTurn(status) {
	return status === "completed" || status === "failed" || status === "cancelled";
}
async function* observeEvents(stream, signal, sessionId, assertCurrent) {
	for await (const rawEvent of stream) {
		signal.throwIfAborted();
		assertCurrent();
		const event = eventSchema.parse(rawEvent);
		if (event.session_id && event.session_id !== sessionId || event.session && event.session.id !== sessionId || event.turn?.session_id && event.turn.session_id !== sessionId) throw new Error("Agents API returned an event outside the requested session");
		yield event;
	}
	signal.throwIfAborted();
}
async function closeResponseReader(reader, signal) {
	try {
		await reader.cancel();
	} catch (error) {
		if (!signal.aborted) throw error;
	} finally {
		reader.releaseLock();
	}
	signal.throwIfAborted();
}
//#endregion
export { isAgentsApiTerminalTurn as n, AgentsApiClient as t };
