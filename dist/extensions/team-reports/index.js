import { a as periodSchema, n as DAY_MS, r as describePeriod } from "./.setup/limits-iMrGeJ-3.mjs";
import { n as listWorkSessions, t as createTeamReportsHttpHandler } from "./.setup/http-CUibCjNT.mjs";
import { n as createTeamReportsStore } from "./.setup/store-DqhGhUBl.mjs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { open } from "node:fs/promises";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { readFileHandleBounded } from "openclaw/plugin-sdk/file-access-runtime";
import { z } from "zod";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
import { randomUUID } from "node:crypto";
import { WorkerTaskPool } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/team-reports/src/config.ts
const nonempty = z.string().min(1).regex(/\S/);
const secretInputSchema = z.union([nonempty, z.strictObject({
	source: z.enum([
		"env",
		"file",
		"exec",
		"store"
	]),
	provider: nonempty,
	id: nonempty
})]);
const personSchema = z.strictObject({
	github: z.array(nonempty).min(1),
	display: nonempty.optional(),
	affiliation: nonempty.optional(),
	roleGroup: nonempty.optional(),
	roleLabel: nonempty.optional(),
	access: z.array(nonempty).optional(),
	areas: z.array(nonempty).optional(),
	discordUserId: z.string().regex(/^\d+$/).optional(),
	discordUsername: nonempty.optional(),
	status: z.enum(["active", "archived"]).optional(),
	archivedAt: z.iso.date().optional()
});
const githubSchema = z.strictObject({
	token: secretInputSchema,
	orgs: z.array(nonempty).min(1),
	teams: z.array(z.strictObject({
		org: nonempty,
		slug: nonempty
	})).default([]),
	includeDirectCollaborators: z.boolean().default(false),
	excludeRepos: z.array(nonempty).default([]),
	apiBaseUrl: z.string().regex(/^https:\/\/[^/?#\s]+(?:\/[^?#\s]*)?$/).default("https://api.github.com"),
	ignoreCommentPatterns: z.array(z.string()).default([])
});
const summariesSchema = z.strictObject({
	enabled: z.boolean().default(true),
	model: nonempty.optional(),
	reasoning: z.enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"adaptive",
		"max",
		"ultra"
	]).optional(),
	agentId: nonempty.optional()
});
const scheduleSchema = z.strictObject({
	closedDayUtc: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).default("00:05"),
	intradayEveryHours: z.number().int().min(0).max(24).default(4),
	jitterMinutes: z.number().int().min(0).max(59).default(5),
	weekly: z.boolean().default(true),
	monthly: z.boolean().default(true)
});
const retentionSchema = z.strictObject({ days: z.number().int().min(0).default(400) });
const teamReportsConfigSchema = z.strictObject({
	basePath: z.string().regex(/^\/(?!api\/channels(?:\/|$))(?!\.{1,2}(?:\/|$))(?!.*\/\.{1,2}(?:\/|$))[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/*$/).default("/plugins/team-reports"),
	displayTimezone: nonempty.default("UTC"),
	github: githubSchema,
	discord: z.strictObject({
		token: secretInputSchema,
		guildId: z.string().regex(/^\d+$/),
		channels: z.array(z.strictObject({
			id: z.string().regex(/^\d+$/),
			excerpts: z.boolean().default(false)
		})).min(1),
		excerptMaxChars: z.number().int().min(1).max(4e3).default(260)
	}).optional(),
	people: z.array(personSchema).optional(),
	peopleFile: z.string().regex(/^(?:\/|[A-Za-z]:[\\/]|\\\\)[^\0]*$/).optional(),
	summaries: summariesSchema.prefault({}),
	schedule: scheduleSchema.prefault({}),
	retention: retentionSchema.prefault({})
}).superRefine((config, context) => {
	if (config.people !== void 0 && config.peopleFile !== void 0) context.addIssue({
		code: "custom",
		path: ["peopleFile"],
		message: "people and peopleFile are mutually exclusive."
	});
	try {
		new Intl.DateTimeFormat("en", { timeZone: config.displayTimezone }).resolvedOptions();
	} catch {
		context.addIssue({
			code: "custom",
			path: ["displayTimezone"],
			message: "Expected an IANA time zone."
		});
	}
	for (const [index, pattern] of config.github.ignoreCommentPatterns.entries()) try {
		RegExp(pattern);
	} catch {
		context.addIssue({
			code: "custom",
			path: [
				"github",
				"ignoreCommentPatterns",
				index
			],
			message: "Expected a valid regular expression."
		});
	}
});
function parseTeamReportsConfig(value, controlUiBasePath) {
	const config = teamReportsConfigSchema.parse(value);
	config.basePath = config.basePath.replace(/\/+$/, "");
	const controlPath = controlUiBasePath?.replace(/\/+$/, "");
	if (controlPath && (config.basePath === controlPath || config.basePath.startsWith(`${controlPath}/`))) throw new Error("team-reports.basePath must not equal or nest the Control UI base path.");
	return config;
}
const peopleFileSchema = z.strictObject({ people: z.array(personSchema) });
const MAX_PEOPLE_FILE_BYTES = 2097152;
async function readPeopleFile(filePath) {
	const handle = await open(filePath, "r");
	const invalidFileMessage = "team-reports.peopleFile must be a regular JSON file of at most 2 MiB.";
	try {
		if (!(await handle.stat()).isFile()) throw new Error(invalidFileMessage);
		const data = JSON.parse((await readFileHandleBounded(handle, MAX_PEOPLE_FILE_BYTES)).toString("utf8"));
		return peopleFileSchema.parse(data).people;
	} catch (error) {
		throw extractErrorCode(error) === "too-large" ? /* @__PURE__ */ new Error(invalidFileMessage) : error;
	} finally {
		await handle.close();
	}
}
async function resolveTeamReportsConfig(config, fullConfig) {
	const people = config.peopleFile ? await readPeopleFile(config.peopleFile) : config.people ?? [];
	const { applyResolvedAssignments, createResolverContext, resolveSecretRefValues } = await import("openclaw/plugin-sdk/secret-ref-runtime");
	const context = createResolverContext({
		sourceConfig: fullConfig,
		env: process.env
	});
	const tokens = {
		github: "",
		discord: ""
	};
	for (const name of ["github", "discord"]) {
		const token = config[name]?.token;
		if (token === void 0) continue;
		if (typeof token === "string") {
			tokens[name] = token;
			continue;
		}
		context.assignments.push({
			ref: token,
			path: `plugins.entries.team-reports.config.${name}.token`,
			expected: "string",
			ownerKind: "capability",
			ownerId: `team-reports.${name}`,
			requiredForGateway: false,
			disposition: "fail-closed",
			apply(value) {
				if (typeof value !== "string" || value.trim().length === 0) throw new Error(`team-reports.${name}.token resolved to an empty or non-string value.`);
				tokens[name] = value;
			}
		});
	}
	if (context.assignments.length > 0) try {
		const resolved = await resolveSecretRefValues(context.assignments.map(({ ref }) => ref), {
			config: fullConfig,
			env: context.env,
			cache: context.cache
		});
		applyResolvedAssignments({
			assignments: context.assignments,
			resolved
		});
	} catch {
		throw new Error("Team Reports could not resolve its source credentials. Check the configured SecretRefs and restart the Gateway.");
	}
	return {
		github: {
			...config.github,
			token: tokens.github,
			apiBaseUrl: config.github.apiBaseUrl.replace(/\/+$/, ""),
			ignoreCommentPatterns: config.github.ignoreCommentPatterns.map((pattern) => new RegExp(pattern))
		},
		...config.discord ? { discord: {
			...config.discord,
			token: tokens.discord,
			apiBaseUrl: "https://discord.com/api/v10"
		} } : {},
		people
	};
}
//#endregion
//#region extensions/team-reports/src/gateway-methods.ts
const listSchema = z.strictObject({ period: periodSchema.optional() });
const getSchema = z.strictObject({
	period: periodSchema,
	key: z.string(),
	format: z.enum(["json", "markdown"]).default("json")
});
const generateSchema = z.strictObject({
	period: z.literal("day"),
	date: z.iso.date().optional(),
	intraday: z.boolean().optional()
});
function registerTeamReportsGatewayMethods(api, access) {
	const register = (name, scope, run) => {
		api.registerGatewayMethod(`team-reports.${name}`, async ({ params, respond }) => {
			try {
				respond(true, await run(params ?? {}));
			} catch (error) {
				const message = error instanceof Error ? error.message : "Team Reports request failed";
				respond(false, void 0, errorShape(error instanceof z.ZodError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, message));
			}
		}, { scope });
	};
	register("status", "operator.read", (params) => {
		z.strictObject({}).parse(params);
		return access.scheduler().status();
	});
	register("list", "operator.read", async (params) => ({ periods: await access.store().listPeriods(listSchema.parse(params)) }));
	register("get", "operator.read", async (params) => {
		const { period, key, format } = getSchema.parse(params);
		describePeriod(period, key);
		if (format === "markdown") {
			const stored = await access.store().getPeriod(period, key);
			if (!stored) throw new Error("Report not found; generate the requested UTC day first");
			return { markdown: stored.markdown };
		}
		const stored = await access.store().getPeriodDocument(period, key);
		if (!stored) throw new Error("Report not found; generate the requested UTC day first");
		return stored;
	});
	register("generate", "operator.admin", async (params) => ({ runId: await access.scheduler().generate(generateSchema.parse(params)) }));
}
//#endregion
//#region extensions/team-reports/src/run-worker-contract.ts
const REPORT_RUN_TIMEOUT_MS = 27e5;
//#endregion
//#region extensions/team-reports/src/run-worker.ts
var TeamReportsRunner = class {
	constructor(workerUrl) {
		this.requests = /* @__PURE__ */ new Set();
		this.pool = new WorkerTaskPool({
			workerUrl,
			maxWorkers: 1,
			maxPendingTasks: 1
		});
	}
	async run(params) {
		const deadline = Date.now() + REPORT_RUN_TIMEOUT_MS;
		try {
			return await this.pool.run({
				config: params.config,
				resolved: params.resolved,
				periods: params.periods,
				reuseCollectedDays: params.reuseCollectedDays
			}, {
				signal: params.runtime.signal,
				timeoutMs: REPORT_RUN_TIMEOUT_MS,
				onRequest: (value, { signal }) => {
					const request = value;
					const pending = (async () => {
						signal.throwIfAborted();
						for (const log of request.logs) params.runtime.logger[log.level]?.(log.message, log.meta);
						if (request.roster) params.onRoster(request.roster);
						let response;
						try {
							response = {
								ok: true,
								value: request.kind === "store" ? await params.store.execute(request.command.type, request.command.input, { signal }) : request.kind === "llm" ? await params.llm.complete({
									...request.params,
									signal
								}) : void 0
							};
						} catch (error) {
							response = {
								ok: false,
								error: error instanceof Error ? error.message : String(error)
							};
						}
						signal.throwIfAborted();
						return {
							input: response,
							timeoutMs: Math.max(1, deadline - Date.now())
						};
					})();
					this.requests.add(pending);
					pending.finally(() => this.requests.delete(pending)).catch(() => {});
					return pending;
				}
			});
		} finally {
			await Promise.allSettled(this.requests);
		}
	}
	async close() {
		try {
			await this.pool.close();
		} finally {
			await Promise.allSettled(this.requests);
		}
	}
};
//#endregion
//#region extensions/team-reports/src/scheduler.ts
const STOP_TIMEOUT_MS = 3e4;
function nextClosedDayDue(nowMs, schedule) {
	const random = Math.random();
	const [hours = 0, minutes = 0] = schedule.closedDayUtc.split(":").map(Number);
	const today = describePeriod("day", nowMs).sinceMs;
	const jitter = Math.floor(Math.max(0, Math.min(1, random)) * schedule.jitterMinutes * 6e4);
	const scheduled = today + hours * 36e5 + minutes * 6e4 + jitter;
	return scheduled > nowMs ? scheduled : scheduled + DAY_MS;
}
function nextIntradayDue(nowMs, everyHours) {
	if (everyHours === 0) return;
	const today = describePeriod("day", nowMs).sinceMs;
	const interval = everyHours * 36e5;
	return today + Math.min(DAY_MS, (Math.floor((nowMs - today) / interval) + 1) * interval);
}
function runPeriods(config, days) {
	const periods = new Map(days.map((day) => [`day/${day.key}`, day]));
	for (const day of days) for (const period of ["week", "month"]) if (period === "week" ? config.schedule.weekly : config.schedule.monthly) {
		const descriptor = describePeriod(period, day.sinceMs);
		periods.set(`${period}/${descriptor.key}`, descriptor);
	}
	return [...periods.values()];
}
var TeamReportsScheduler = class {
	constructor(options) {
		this.options = options;
		this.accepting = false;
		this.due = {};
		this.deferred = /* @__PURE__ */ new Set();
		this.roster = options.resolved.people;
	}
	async start() {
		if (this.accepting || this.stopPromise || this.options.context.scheduler.signal.aborted) throw new Error("Team Reports scheduler cannot be started again");
		this.accepting = true;
		return this.startPromise = this.startOnce().catch((error) => {
			this.accepting = false;
			throw error;
		});
	}
	async startOnce() {
		const yesterday = describePeriod("day", Date.now() - DAY_MS);
		const completed = await this.closedDayCompleted(yesterday.key);
		if (!this.accepting) return;
		this.armClosedDay();
		this.armIntraday();
		if (!completed) {
			this.due.catchUp = Date.now() + 6e4;
			this.schedule("catch-up", this.due.catchUp, () => {
				delete this.due.catchUp;
				return this.tick("closed-day", true);
			});
		}
	}
	orgs() {
		return this.options.config.github.orgs;
	}
	people() {
		return this.roster;
	}
	async status() {
		return {
			running: this.accepting,
			activeRunId: this.active?.id,
			nextDue: { ...this.due },
			runs: await this.options.store.listRuns(),
			periods: await this.options.store.listPeriods(),
			sourceWarnings: await this.options.store.latestSourceWarnings()
		};
	}
	async health() {
		const finished = [...await this.options.store.listRuns(1, { status: "ok" }), ...await this.options.store.listRuns(1, { status: "error" })].toSorted((a, b) => (b.finishedAtMs ?? 0) - (a.finishedAtMs ?? 0) || b.startedAtMs - a.startedAtMs)[0];
		const due = Object.values(this.due).filter((value) => value !== void 0);
		return {
			running: this.accepting,
			...finished && finished.status !== "running" && finished.finishedAtMs !== null ? { lastRun: {
				status: finished.status,
				kind: finished.kind,
				finishedAtMs: finished.finishedAtMs
			} } : {},
			...due.length ? { nextDueMs: Math.min(...due) } : {},
			warnings: (await this.options.store.latestSourceWarnings()).length
		};
	}
	async generate(params = {}) {
		const now = Date.now();
		const day = describePeriod("day", params.date ?? now - (params.intraday ? 0 : 864e5));
		const today = describePeriod("day", now);
		if (day.sinceMs > today.sinceMs) throw new Error("Cannot generate a future UTC day");
		if (params.intraday && day.key !== today.key) throw new Error("intraday generation requires today's UTC date");
		return this.begin("manual", [day]);
	}
	stop() {
		return this.stopPromise ??= this.stopOnce();
	}
	async stopOnce() {
		this.accepting = false;
		this.due = {};
		this.options.context.scheduler.beginClose();
		this.deferred.clear();
		const active = this.active;
		const timeout = active ? setTimeout(() => active.controller.abort(/* @__PURE__ */ new Error("Team Reports stopped after 30 seconds")), STOP_TIMEOUT_MS) : void 0;
		try {
			await this.startPromise?.catch(() => void 0);
			await this.options.context.scheduler.stop();
			await active?.done;
		} finally {
			clearTimeout(timeout);
			await this.options.closeRunner();
			await this.options.store.close();
		}
	}
	schedule(id, atMs, callback) {
		if (this.options.context.scheduler.signal.aborted) return;
		this.options.context.scheduler.schedule({
			id,
			atMs,
			run: async () => {
				try {
					await callback();
				} catch (error) {
					this.options.context.logger.error(`team-reports: ${this.safeError(error)}`);
				}
			}
		});
	}
	armClosedDay(afterMs = Date.now()) {
		const due = nextClosedDayDue(afterMs, this.options.config.schedule);
		this.due.closedDay = due;
		this.schedule("closed-day", due, async () => {
			await this.tick("closed-day");
			if (!this.accepting) return;
			this.armClosedDay(describePeriod("day", due).untilMs - 1);
		});
	}
	armIntraday() {
		this.due.intraday = nextIntradayDue(Date.now(), this.options.config.schedule.intradayEveryHours);
		if (this.due.intraday !== void 0) this.schedule("intraday", this.due.intraday, async () => {
			await this.tick("intraday");
			if (this.accepting) this.armIntraday();
		});
	}
	async tick(kind, catchUp = false) {
		if (catchUp && await this.closedDayCompleted(describePeriod("day", Date.now() - 864e5).key)) return;
		if (!this.accepting) return;
		if (this.active) {
			if (!this.deferred.has(kind)) {
				this.deferred.add(kind);
				this.schedule(`deferred:${kind}`, Date.now() + 6e4, () => {
					this.deferred.delete(kind);
					return this.tick(kind, catchUp);
				});
			}
			return;
		}
		const now = Date.now();
		const days = kind === "closed-day" ? [describePeriod("day", now - DAY_MS), describePeriod("day", now)] : [describePeriod("day", now)];
		await this.begin(kind, days, catchUp);
	}
	async closedDayCompleted(key) {
		const untilMs = describePeriod("day", key).untilMs;
		return (await this.options.store.listRuns(-1, { status: "ok" })).some((run) => run.startedAtMs >= untilMs && run.periods.some((period) => period.period === "day" && period.key === key));
	}
	async begin(kind, days, reuseCollectedDays = false) {
		if (!this.accepting || this.options.context.scheduler.signal.aborted) throw new Error("Team Reports service is not running");
		if (this.active) throw new Error("A Team Reports run is already in progress");
		const id = randomUUID();
		const periods = runPeriods(this.options.config, days);
		const controller = new AbortController();
		const started = this.options.store.startRun({
			id,
			kind,
			startedAtMs: Date.now(),
			periods: periods.map(({ period, key }) => ({
				period,
				key
			}))
		});
		const deadline = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("Team Reports run exceeded its 45-minute deadline")), REPORT_RUN_TIMEOUT_MS);
		const done = Promise.resolve().then(async () => {
			let stats;
			let recorded = false;
			try {
				await started;
				recorded = true;
				controller.signal.throwIfAborted();
				stats = await this.options.runReports({
					...this.options,
					periods,
					reuseCollectedDays,
					runtime: {
						logger: this.options.context.logger,
						signal: controller.signal
					},
					onRoster: (people) => {
						this.roster = people;
					}
				});
				controller.signal.throwIfAborted();
				if (kind === "closed-day") {
					await this.options.store.prune(this.options.config.retention.days);
					controller.signal.throwIfAborted();
				}
				const failed = Object.entries(stats).filter(([, source]) => !source.ok).map(([sourceId]) => sourceId);
				if (failed.length > 0) throw new Error(`Activity sources failed (${failed.join(", ")}); inspect run source warnings and check access`);
				await this.options.store.finishRun(id, {
					status: "ok",
					finishedAtMs: Date.now(),
					stats
				});
				this.options.context.serviceHealth?.clearFailure();
			} catch (error) {
				const message = this.safeError(error);
				try {
					if (recorded) await this.options.store.finishRun(id, {
						status: "error",
						finishedAtMs: Date.now(),
						error: message,
						stats
					});
				} catch {
					this.options.context.logger.error("team-reports: failed to record run outcome; check database access and disk space");
				}
				this.options.context.serviceHealth?.reportFailure(new Error(message));
				this.options.context.logger.error(`team-reports: ${message}`);
			} finally {
				clearTimeout(deadline);
				if (this.active?.id === id) this.active = void 0;
			}
		});
		this.active = {
			id,
			controller,
			done
		};
		await started;
		return id;
	}
	safeError(error) {
		let message = error instanceof Error ? error.message : "Team Reports run failed";
		for (const token of [this.options.resolved.github.token, this.options.resolved.discord?.token]) if (token) message = message.replaceAll(token, "[redacted]");
		return message.slice(0, 2e3);
	}
};
//#endregion
//#region extensions/team-reports/index.ts
var team_reports_default = definePluginEntry({
	id: "team-reports",
	name: "Team Reports",
	description: "Daily, weekly, and monthly team activity reports from GitHub and Discord, with model-written summaries.",
	configSchema: { parse: parseTeamReportsConfig },
	register(api) {
		const initial = parseTeamReportsConfig(api.pluginConfig, api.config.gateway?.controlUi?.basePath);
		let scheduler;
		let store;
		let generation = 0;
		let retired = false;
		let stopping;
		let startingStore;
		const stop = () => {
			generation++;
			const current = scheduler;
			scheduler = void 0;
			store = void 0;
			const pendingStart = startingStore;
			return stopping ??= (async () => {
				await pendingStart?.catch(() => void 0);
				await current?.stop();
			})();
		};
		const requireScheduler = () => {
			if (!scheduler) throw new Error("Team Reports service is not running; check plugin configuration and reload the plugin");
			return scheduler;
		};
		const requireStore = () => {
			if (!store) throw new Error("Team Reports storage is unavailable; check service status");
			return store;
		};
		api.registerService({
			id: "team-reports",
			apiVersion: 2,
			async start(ctx) {
				if (retired) throw new Error("Team Reports runtime has been retired");
				const currentGeneration = ++generation;
				await stopping;
				if (retired || currentGeneration !== generation) return;
				stopping = void 0;
				const config = parseTeamReportsConfig(ctx.config.plugins?.entries?.["team-reports"]?.config ?? api.pluginConfig, ctx.config.gateway?.controlUi?.basePath);
				const resolved = await resolveTeamReportsConfig(config, ctx.config);
				if (retired || currentGeneration !== generation) return;
				const policy = ctx.config.plugins?.entries?.["team-reports"]?.llm;
				const summaryOptions = { ...config.summaries };
				if (policy?.allowModelOverride !== true) delete summaryOptions.model;
				startingStore = (async () => {
					if (!api.runtimeSource) throw new Error("Team Reports requires an OpenClaw host with runtime entrypoint metadata");
					const nextStore = await createTeamReportsStore({
						stateDir: ctx.stateDir,
						workerModuleUrl: new URL(`./src/store.worker${path.extname(api.runtimeSource)}`, pathToFileURL(api.runtimeSource))
					});
					if (retired || currentGeneration !== generation) {
						await nextStore.close();
						return;
					}
					const runner = new TeamReportsRunner(new URL(`./src/run.worker${path.extname(api.runtimeSource)}`, pathToFileURL(api.runtimeSource)));
					const nextScheduler = new TeamReportsScheduler({
						config: {
							...config,
							summaries: summaryOptions
						},
						resolved,
						store: nextStore,
						llm: { complete: (params) => api.runtime.llm.complete(params) },
						context: ctx,
						runReports: (params) => runner.run(params),
						closeRunner: () => runner.close()
					});
					try {
						await nextScheduler.start();
						if (retired || currentGeneration !== generation) {
							await nextScheduler.stop();
							return;
						}
						store = nextStore;
						scheduler = nextScheduler;
					} catch (error) {
						await nextScheduler.stop();
						throw error;
					}
				})();
				await startingStore;
			},
			stop
		});
		api.lifecycle.registerRuntimeLifecycle({
			id: "team-reports-service",
			cleanup: ({ reason, sessionKey, runId }) => {
				if (sessionKey === void 0 && runId === void 0 && (reason === "disable" || reason === "restart")) {
					retired = true;
					return stop();
				}
			}
		});
		api.registerHttpRoute({
			path: initial.basePath,
			match: "prefix",
			auth: "gateway",
			handler: createTeamReportsHttpHandler({
				basePath: initial.basePath,
				displayTimezone: initial.displayTimezone,
				sessionRouting: () => {
					const config = api.runtime.config.current();
					return {
						controlUiBasePath: config.gateway?.controlUi?.basePath,
						mainKey: config.session?.mainKey
					};
				},
				workSessions: listWorkSessions,
				assetsDir: path.join(api.rootDir ?? path.dirname(fileURLToPath(import.meta.url)), "assets"),
				getStore: () => store,
				status: () => requireScheduler().status(),
				health: () => requireScheduler().health(),
				orgs: () => scheduler?.orgs() ?? initial.github.orgs,
				people: () => scheduler?.people() ?? initial.people ?? []
			})
		});
		api.session.controls.registerControlUiDescriptor({
			surface: "tab",
			id: "team-reports",
			label: "Reports",
			slug: "reports",
			description: "Team activity reports from GitHub and Discord.",
			icon: "chart",
			group: "control",
			requiredScopes: ["operator.read"],
			path: `${initial.basePath}/`
		});
		registerTeamReportsGatewayMethods(api, {
			scheduler: requireScheduler,
			store: requireStore
		});
		api.registerCli(async ({ program }) => {
			const { registerTeamReportsCli } = await import("./.setup/cli-CCCfOFlP.mjs");
			registerTeamReportsCli({ program });
		}, { descriptors: [{
			name: "team-reports",
			description: "Read and generate team activity reports",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { team_reports_default as default };
