import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as createAsyncLock } from "./json-files-DYmSFHoN.mjs";
import { n as runExec } from "./exec-Bf6uhUA7.mjs";
import { i as withTempDownloadPath } from "./temp-download-DmCt_Uvg.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import "./async-lock-runtime-DndUFK6j.mjs";
import "./temp-path-D_RJiwsA.mjs";
import "./logging-core-CsXmxYo2.mjs";
import { n as redactCdpUrl } from "./browser-cdp-Dob0VJzE.mjs";
import { d as resolveBrowserNavigationTimeoutMs } from "./act-policy-BRluzhGf.mjs";
import { n as normalizeChromeMcpOptions, t as buildChromeMcpSessionCacheKey } from "./chrome-mcp-options-5_xQvdjP.mjs";
import { c as BrowserProfileUnavailableError, d as BrowserTabNotFoundError, i as BrowserCdpEndpointBlockedError } from "./errors-BqlAThZX.mjs";
import { a as fetchJson, d as redactCdpErrorText, f as resolveCdpTabOwnership, l as normalizeCdpHttpBaseForJsonEndpoints, o as fetchOk, t as appendCdpPath } from "./cdp.helpers-BaWyTLh_.mjs";
import { t as createBoundedUtf8Tail } from "./bounded-utf8-tail-D6yB9rpq.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
//#region extensions/browser/src/browser/chrome-mcp-contracts.ts
var ChromeMcpDocumentUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ChromeMcpDocumentUnavailableError";
	}
};
function rethrowChromeMcpDocumentError(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (/Element (?:with )?uid .* (?:not found|no longer exists) on (?:the )?page|Snapshot document (?:changed|disappeared)\. Take a new snapshot\.|Execution context was destroyed|Cannot find context with specified id|Frame (?:was |is )?detached|detached Frame|Node is detached from document/i.test(message)) throw new ChromeMcpDocumentUnavailableError(message, { cause: error });
	throw error;
}
const MCP_REQUEST_TIMEOUT_CODE = ErrorCode.RequestTimeout;
const CHROME_MCP_NEW_PAGE_TIMEOUT_MS = 5e3;
const CHROME_MCP_NAVIGATE_TIMEOUT_MS = 2e4;
const CHROME_MCP_HANDSHAKE_TIMEOUT_MS = 3e4;
const CHROME_MCP_STDERR_MAX_BYTES = 8192;
const DEVTOOLS_ACTIVE_PORT_RE = /\bDevToolsActivePort\b/i;
const CHROME_CONNECTION_TOOL_ERROR_RE = /(?:Could not connect to Chrome|DevToolsActivePort|ECONNREFUSED|ECONNRESET|websocket|timed out)/i;
const CHROME_MCP_SESSION_TARGET_PREFIX = "chrome-mcp:";
const CHROME_MCP_SNAPSHOT_REF_PREFIX = "mcp-ref:";
var ChromeMcpReconnectRequiredError = class extends Error {};
var ChromeMcpProcessSnapshotError = class extends Error {};
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-diagnostics.ts
function drainStderr(transport) {
	const stream = transport.stderr;
	if (!stream) return () => "";
	const tail = createBoundedUtf8Tail(CHROME_MCP_STDERR_MAX_BYTES);
	stream.on("data", (chunk) => {
		tail.append(chunk);
	});
	stream.on("error", () => {});
	return () => tail.text().trim();
}
function redactChromeMcpDiagnosticTextWithLocalPaths(text) {
	const homeDir = normalizeOptionalString(os.homedir());
	const homePath = homeDir ? path.resolve(homeDir) : void 0;
	const withHomeRedacted = homePath ? text.split(homePath).join("~") : text;
	return redactCdpErrorText(withHomeRedacted);
}
function redactChromeMcpLocalPathForDiagnostic(filePath) {
	const homeDir = normalizeOptionalString(os.homedir());
	if (!homeDir || !path.isAbsolute(filePath)) return redactCdpErrorText(filePath);
	const relative = path.relative(path.resolve(homeDir), path.resolve(filePath));
	if (relative === "") return "~";
	if (!relative.startsWith("..") && !path.isAbsolute(relative)) return redactCdpErrorText(`~/${relative.split(path.sep).join("/")}`);
	return redactCdpErrorText(filePath);
}
function redactChromeMcpProfileLabelForDiagnostic(profileName) {
	return path.isAbsolute(profileName) ? redactChromeMcpLocalPathForDiagnostic(profileName) : redactCdpErrorText(profileName);
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-process.ts
function readChromeMcpTransportPid(transport) {
	const pid = transport.pid;
	return typeof pid === "number" && Number.isInteger(pid) && pid > 0 && pid !== process.pid ? pid : void 0;
}
function parseChromeMcpLinuxStat(pid, stat) {
	const fields = stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/);
	const ppid = Number.parseInt(fields[1] ?? "", 10);
	const startTime = normalizeOptionalString(fields[19]);
	return Number.isInteger(ppid) && startTime ? {
		pid,
		ppid,
		identity: `linux:${startTime}`
	} : null;
}
async function listChromeMcpLinuxProcesses() {
	const pids = (await fs.readdir("/proc")).filter((name) => /^\d+$/.test(name)).map((name) => Number.parseInt(name, 10));
	const rows = [];
	for (const pid of pids) try {
		const row = parseChromeMcpLinuxStat(pid, await fs.readFile(`/proc/${pid}/stat`, "utf8"));
		if (row) rows.push(row);
	} catch {}
	return rows;
}
function parseChromeMcpDelimitedProcessList(stdout, platform) {
	return stdout.split(/\r?\n/).flatMap((line) => {
		const [rawPid, rawPpid, rawStarted, ...rawCommand] = line.split("	");
		const pid = Number.parseInt(rawPid ?? "", 10);
		const ppid = Number.parseInt(rawPpid ?? "", 10);
		const started = normalizeOptionalString(rawStarted);
		const command = normalizeOptionalString(rawCommand.join("	"));
		return Number.isInteger(pid) && Number.isInteger(ppid) && started && command ? [{
			pid,
			ppid,
			identity: `${platform}:${started}|${command}`
		}] : [];
	});
}
function parseChromeMcpUnixProcessList(stdout, platform) {
	return parseChromeMcpDelimitedProcessList(stdout.replace(/^\s*(\d+)\s+(\d+)\s+(.{24})\s+(.+)$/gm, "$1	$2	$3	$4"), platform);
}
async function listChromeMcpPlatformProcesses() {
	try {
		const platform = process.platform;
		if (platform === "linux") return await listChromeMcpLinuxProcesses();
		const windows = platform === "win32";
		const { stdout } = await runExec(windows ? "powershell.exe" : "ps", windows ? [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"Get-CimInstance Win32_Process | ForEach-Object { \"{0}`t{1}`t{2:o}`t{3}\" -f $_.ProcessId,$_.ParentProcessId,$_.CreationDate,$_.ExecutablePath }"
		] : [
			"-axww",
			"-o",
			"pid=,ppid=,lstart=,command="
		], {
			env: windows ? void 0 : {
				...process.env,
				LC_ALL: "C",
				TZ: "UTC"
			},
			logOutput: false,
			maxBuffer: 4194304,
			timeoutMs: 2e3
		});
		if (windows) return parseChromeMcpDelimitedProcessList(stdout, platform);
		return parseChromeMcpUnixProcessList(stdout, platform);
	} catch (err) {
		throw new ChromeMcpProcessSnapshotError(err instanceof Error ? err.message : "Unable to inspect the Chrome MCP process tree.", { cause: err });
	}
}
function captureChromeMcpProcessTarget(rootPid, snapshots) {
	const root = snapshots.findLast((snapshot) => snapshot.pid === rootPid);
	if (!root) throw new ChromeMcpProcessSnapshotError(`Chrome MCP process identity unavailable for pid ${rootPid}.`);
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const snapshot of snapshots) {
		const children = childrenByParent.get(snapshot.ppid) ?? [];
		children.push(snapshot);
		childrenByParent.set(snapshot.ppid, children);
	}
	const descendants = [];
	const queue = [...childrenByParent.get(rootPid) ?? []];
	for (const next of queue) {
		if (next.pid === process.pid || next.pid === rootPid) continue;
		descendants.push({
			pid: next.pid,
			identity: next.identity
		});
		queue.push(...childrenByParent.get(next.pid) ?? []);
	}
	return {
		root: {
			pid: root.pid,
			identity: root.identity
		},
		descendants
	};
}
function cleanupTarget(state) {
	return state.status === "tracked" || state.status === "uncertain" ? state.target : void 0;
}
async function refreshChromeMcpCleanupProcess(session) {
	const state = session.processCleanup;
	if (!state || state.status === "closed") return;
	if (session.processCleanupRefresh) return await session.processCleanupRefresh;
	const refresh = (async () => {
		const existing = cleanupTarget(state);
		const rootPid = existing?.root.pid ?? readChromeMcpTransportPid(session.transport);
		if (!rootPid) {
			if (state.status === "uncertain") throw new Error("Chrome MCP subprocess tree cleanup could not be verified.");
			return;
		}
		const snapshots = await listChromeMcpPlatformProcesses();
		if (session.processCleanup?.status === "closed") return;
		const currentRoot = snapshots.find((snapshot) => snapshot.pid === rootPid);
		if (existing && currentRoot?.identity !== existing.root.identity) {
			if (state.status === "uncertain") throw new Error("Chrome MCP subprocess tree cleanup could not be verified.");
			return;
		}
		const captured = captureChromeMcpProcessTarget(rootPid, snapshots);
		session.processCleanup = {
			status: "tracked",
			target: {
				root: existing?.root ?? captured.root,
				descendants: [...new Map([...existing?.descendants ?? [], ...captured.descendants].map((owned) => [owned.pid, owned])).values()]
			}
		};
	})();
	session.processCleanupRefresh = refresh;
	try {
		await refresh;
	} catch (err) {
		if (session.processCleanup?.status !== "closed") {
			const target = cleanupTarget(state);
			session.processCleanup = {
				status: "uncertain",
				...target ? { target } : {}
			};
		}
		throw err;
	} finally {
		if (session.processCleanupRefresh === refresh) session.processCleanupRefresh = void 0;
	}
}
async function taskkillChromeMcpProcessTree(rootPid) {
	await runExec("taskkill", [
		"/pid",
		String(rootPid),
		"/t",
		"/f"
	], {
		logOutput: false,
		maxBuffer: 65536,
		timeoutMs: 2e3
	});
}
async function currentChromeMcpProcesses(targets) {
	const snapshots = await listChromeMcpPlatformProcesses();
	const currentByPid = new Map(snapshots.map((snapshot) => [snapshot.pid, snapshot.identity]));
	return targets.filter((target) => currentByPid.get(target.pid) === target.identity);
}
async function terminateChromeMcpProcessTree(target) {
	if (!target) return;
	const targets = [...target.descendants.toReversed(), target.root];
	let surviving = await currentChromeMcpProcesses(targets);
	if (surviving.length === 0) return;
	let firstError;
	const windows = process.platform === "win32";
	for (const secondPass of [false, true]) {
		if (windows) {
			const candidates = secondPass ? surviving.filter(({ pid }) => pid !== target.root.pid) : surviving.filter(({ pid }) => pid === target.root.pid).slice(0, 1);
			for (const owned of candidates) {
				if (secondPass && (await currentChromeMcpProcesses([owned])).length === 0) continue;
				try {
					await taskkillChromeMcpProcessTree(owned.pid);
				} catch (err) {
					firstError ??= toErrorObject(err, "Chrome MCP process-tree cleanup failed.");
				}
			}
		} else for (const owned of surviving) try {
			process.kill(owned.pid, secondPass ? "SIGKILL" : "SIGTERM");
		} catch {}
		await setTimeout$1(250);
		surviving = await currentChromeMcpProcesses(targets);
		if (surviving.length === 0) return;
	}
	throw firstError ?? /* @__PURE__ */ new Error(`Chrome MCP process cleanup failed for pid ${surviving.map(({ pid }) => pid).join(", ")}.`);
}
async function closeChromeMcpSessionHandle(session) {
	let firstError;
	let cleanupUncertain = session.processCleanup?.status === "uncertain";
	const attempt = async (operation) => {
		try {
			await operation();
		} catch (err) {
			cleanupUncertain ||= err instanceof ChromeMcpProcessSnapshotError;
			firstError ??= toErrorObject(err, "Chrome MCP session cleanup failed.");
		}
	};
	await attempt(async () => await refreshChromeMcpCleanupProcess(session));
	const target = session.processCleanup ? cleanupTarget(session.processCleanup) : void 0;
	const terminateFirst = Boolean(target) && process.platform === "win32";
	if (terminateFirst) await attempt(async () => await terminateChromeMcpProcessTree(target));
	await attempt(async () => await session.closeTransport());
	if (!terminateFirst) await attempt(async () => await terminateChromeMcpProcessTree(target));
	if (firstError) {
		if (cleanupUncertain) session.processCleanup = {
			status: "uncertain",
			...target ? { target } : {}
		};
		throw firstError;
	}
	session.processCleanup = { status: "closed" };
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-connect.ts
const log = createSubsystemLogger("browser").child("chrome-mcp");
let sessionFactory = null;
function setChromeMcpSessionFactoryForTest(factory) {
	sessionFactory = factory;
}
async function createRealSession(owner, profileName, options) {
	const transport = new StdioClientTransport({
		command: options.command,
		args: options.args,
		env: options.env,
		stderr: "pipe"
	});
	const client = new Client({
		name: "openclaw-browser",
		version: "0.0.0"
	}, {});
	const getStderr = drainStderr(transport);
	const startTransport = transport.start.bind(transport);
	let spawned = false;
	const session = {
		client,
		transport,
		closeTransport: transport.close.bind(transport),
		ready: Promise.resolve(),
		processCleanup: { status: "open" }
	};
	transport.start = async () => {
		await startTransport();
		spawned = true;
		await refreshChromeMcpCleanupProcess(session);
	};
	client.close = transport.close = () => owner.close(session);
	const ready = (async () => {
		try {
			await waitForChromeMcpOperation((async () => {
				await client.connect(transport);
				if (!(await client.listTools()).tools.some((tool) => tool.name === "list_pages")) throw new Error("Chrome MCP server did not expose the expected navigation tools.");
				await refreshChromeMcpCleanupProcess(session);
			})(), void 0, {
				ms: CHROME_MCP_HANDSHAKE_TIMEOUT_MS,
				error: () => /* @__PURE__ */ new Error("Chrome MCP handshake timed out"),
				unref: true
			});
		} catch (err) {
			try {
				await transport.close();
				const stderr = transport.stderr;
				if (spawned && stderr instanceof Readable) await finished(stderr, {
					readable: true,
					writable: false,
					cleanup: true
				});
			} finally {
				const stderr = getStderr();
				if (stderr) log.warn(`Chrome MCP attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Subprocess stderr:\n${redactChromeMcpDiagnosticTextWithLocalPaths(stderr)}`);
			}
			const targetLabel = options.browserUrl ? `the configured Chrome endpoint (${redactToolPayloadText(redactCdpUrl(options.browserUrl) ?? options.browserUrl)})` : options.userDataDir ? `the configured Chromium user data dir (${redactChromeMcpLocalPathForDiagnostic(options.userDataDir)})` : "Google Chrome's default profile";
			const detail = redactChromeMcpDiagnosticTextWithLocalPaths(err instanceof Error ? err.message : String(err));
			throw new BrowserProfileUnavailableError(`Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Make sure ${targetLabel} is running locally with remote debugging enabled. Details: ${detail}`);
		}
	})();
	ready.catch(() => {});
	session.ready = ready;
	return session;
}
async function waitForChromeMcpReady(session, profileName, timeoutMs, signal) {
	await waitForChromeMcpOperation(session.ready, signal, timeoutMs && timeoutMs > 0 ? {
		ms: timeoutMs,
		error: () => new BrowserProfileUnavailableError(`Chrome MCP existing-session attach for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}" timed out after ${timeoutMs}ms.`)
	} : void 0);
}
async function waitForChromeMcpOperation(pending, signal, timeout) {
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	const abortError = (aborted) => toErrorObject(aborted.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection");
	if (!timeout) return await racePromiseWithAbortSignal(pending, signal, abortError);
	return await raceWithTimeout(pending, timeout.ms, () => {
		throw timeout.error();
	}, {
		ref: !timeout.unref,
		signal,
		onAbort: (aborted) => {
			throw abortError(aborted);
		}
	});
}
function createChromeMcpSession(owner, profileName, options, signal) {
	const created = sessionFactory ? sessionFactory(profileName, options) : createRealSession(owner, profileName, options);
	let adopted = false;
	let closePromise;
	const closeCreated = async (session) => {
		closePromise ??= owner.close(session);
		await closePromise;
	};
	const promise = (async () => {
		const session = await waitForChromeMcpOperation(created, signal);
		if (signal?.aborted) {
			await closeCreated(session);
			throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
		}
		adopted = true;
		return session;
	})();
	const cleanup = (async () => {
		await promise.catch(() => {});
		if (adopted) return;
		const session = await created.catch(() => null);
		if (session) await closeCreated(session);
	})();
	cleanup.catch(() => {});
	return {
		promise,
		cleanup
	};
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-session.ts
const owners = /* @__PURE__ */ new Map();
var ChromeMcpSessionOwner = class {
	constructor(profileName, options, key) {
		this.profileName = profileName;
		this.options = options;
		this.key = key;
		this.retired = /* @__PURE__ */ new Map();
		this.temporary = 0;
		this.admissions = 0;
	}
	forgetIfEmpty() {
		if (!this.session && !this.pending && !this.retired.size && !this.temporary && !this.admissions && owners.get(this.key) === this) owners.delete(this.key);
	}
	isCurrent(session) {
		return this.session?.transport === session.transport;
	}
	get pid() {
		if (this.session) return this.session.transport.pid ?? null;
		const retained = this.retired.keys().next().value;
		return (retained?.processCleanup && cleanupTarget(retained.processCleanup))?.root.pid ?? retained?.transport.pid ?? null;
	}
	close(session) {
		if (this.session?.transport === session.transport) this.session = void 0;
		if (session.processCleanup?.status === "closed") {
			this.retired.delete(session);
			this.forgetIfEmpty();
			return Promise.resolve();
		}
		const existing = this.retired.get(session);
		if (existing) return existing;
		session.transport.send = async () => {
			throw new Error("Chrome MCP session is closing");
		};
		owners.set(this.key, this);
		const cleanup = closeChromeMcpSessionHandle(session).then(() => {
			this.retired.delete(session);
		}).finally(() => {
			if (this.retired.has(session)) this.retired.set(session, void 0);
			this.forgetIfEmpty();
		});
		this.retired.set(session, cleanup);
		cleanup.catch(() => {});
		return cleanup;
	}
	cancel(pending, reason) {
		pending.cancelled = true;
		if (!pending.settled) pending.controller.abort(reason ?? /* @__PURE__ */ new Error("Chrome MCP session attach no longer has active waiters"));
	}
	async drainRetired() {
		const failed = (await Promise.allSettled([...this.retired.keys()].map((session) => this.close(session)))).find((result) => result.status === "rejected");
		if (failed?.status === "rejected") throw failed.reason;
	}
	async drainPending(pending) {
		try {
			await pending.cleanup;
		} finally {
			if (this.pending === pending) this.pending = void 0;
		}
	}
	async stop() {
		const active = Boolean(this.pending || this.session || this.retired.size);
		if (this.pending) {
			this.cancel(this.pending, /* @__PURE__ */ new Error("Chrome MCP profile session was replaced"));
			await this.drainPending(this.pending);
		}
		await this.drainRetired();
		if (this.session) await this.close(this.session);
		this.forgetIfEmpty();
		return active;
	}
	start() {
		const controller = new AbortController();
		const creation = createChromeMcpSession(this, this.profileName, this.options, controller.signal);
		const pending = {
			...creation,
			controller,
			waiters: 0,
			settled: false,
			cancelled: false
		};
		this.pending = pending;
		owners.set(this.key, this);
		pending.promise = creation.promise.then(async (session) => {
			pending.session = session;
			if (this.pending === pending) this.session = session;
			else await this.close(session);
			return session;
		}).finally(() => {
			pending.settled = true;
		});
		pending.promise.catch(() => {});
		pending.cleanup.catch(() => {});
		return pending;
	}
	async join(pending, options) {
		pending.waiters++;
		let released = false;
		const release = async (close) => {
			if (released) return;
			released = true;
			if (--pending.waiters !== 0) return;
			if (!pending.settled) {
				this.cancel(pending, options.signal?.reason);
				await this.drainPending(pending);
			} else if (close && pending.session) {
				this.cancel(pending, options.signal?.reason);
				await this.close(pending.session);
			}
			if (this.pending === pending) this.pending = void 0;
			this.forgetIfEmpty();
		};
		let abortRelease;
		const abort = () => {
			abortRelease ??= release(true);
			abortRelease.catch(() => {});
		};
		options.signal?.addEventListener("abort", abort, { once: true });
		if (options.signal?.aborted) abort();
		try {
			const session = await waitForChromeMcpOperation(pending.promise, options.signal);
			await waitForChromeMcpReady(session, this.profileName, options.timeoutMs, options.signal);
			return session;
		} catch (error) {
			await (abortRelease ?? release(options.signal?.aborted === true || pending.waiters <= 1));
			throw error;
		} finally {
			options.signal?.removeEventListener("abort", abort);
			await release(false);
		}
	}
	async lease(options) {
		this.admissions++;
		try {
			if (!options.ephemeral) await stopOwners(this.profileName, this);
			options.signal?.throwIfAborted();
			return await this.acquire(options);
		} finally {
			this.admissions--;
			this.forgetIfEmpty();
		}
	}
	async acquire(options) {
		if (this.pending?.cancelled) await this.drainPending(this.pending);
		await this.drainRetired();
		options.signal?.throwIfAborted();
		if (this.session?.transport.pid === null) await this.close(this.session);
		const temporary = Boolean(options.ephemeral && (this.pending || !this.session));
		let session = this.pending ? void 0 : this.session;
		if (temporary) {
			this.temporary++;
			const creation = createChromeMcpSession(this, this.profileName, this.options, options.signal);
			try {
				session = await creation.promise;
				await waitForChromeMcpReady(session, this.profileName, options.timeoutMs, options.signal);
			} catch (error) {
				try {
					await creation.cleanup;
					if (session) await this.close(session);
				} finally {
					this.temporary--;
					this.forgetIfEmpty();
				}
				throw error;
			}
		} else if (session) try {
			await waitForChromeMcpReady(session, this.profileName, options.timeoutMs, options.signal);
		} catch (error) {
			if (!options.ephemeral || !options.signal?.aborted) await this.close(session);
			throw error;
		}
		else session = await this.join(this.pending ?? this.start(), options);
		if (!options.ephemeral && session.transport.pid === null) {
			if (this.pending?.session === session) this.pending = void 0;
			await this.close(session);
			throw new BrowserProfileUnavailableError(`Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(this.profileName)}". The Chrome MCP subprocess exited before it became usable.`);
		}
		return {
			session,
			temporary,
			owner: this,
			release: async () => {
				if (temporary) try {
					await this.close(session);
				} finally {
					this.temporary--;
					this.forgetIfEmpty();
				}
			}
		};
	}
};
function getChromeMcpSessionOwner(profileName, options) {
	const key = buildChromeMcpSessionCacheKey(profileName, options);
	let owner = owners.get(key);
	if (!owner) {
		owner = new ChromeMcpSessionOwner(profileName, options, key);
		owners.set(key, owner);
	}
	return owner;
}
async function stopOwners(profileName, keep) {
	const results = await Promise.allSettled([...owners.values()].filter((owner) => owner !== keep && (profileName === void 0 || owner.profileName === profileName)).map((owner) => owner.stop()));
	const failed = results.find((result) => result.status === "rejected");
	if (failed?.status === "rejected") throw toErrorObject(failed.reason, "Chrome MCP session cleanup failed.");
	return results.some((result) => result.status === "fulfilled" && result.value);
}
function getChromeMcpPid(profileName) {
	for (const owner of owners.values()) if (owner.profileName === profileName && owner.pid !== null) return owner.pid;
	return null;
}
async function closeChromeMcpSession(profileName) {
	return await stopOwners(profileName);
}
async function resetChromeMcpSessionsForTest() {
	setChromeMcpSessionFactoryForTest(null);
	await stopOwners();
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-result.ts
function asPages(value) {
	if (!Array.isArray(value)) return [];
	const out = [];
	for (const entry of value) {
		const record = asNullableRecord(entry);
		if (!record || typeof record.id !== "number") continue;
		out.push({
			id: record.id,
			url: readStringValue(record.url),
			selected: record.selected === true
		});
	}
	return out;
}
function extractStructuredContent(result) {
	return asNullableRecord(result.structuredContent) ?? {};
}
function extractTextContent(result) {
	return (Array.isArray(result.content) ? result.content : []).map((entry) => {
		const record = asNullableRecord(entry);
		return record && typeof record.text === "string" ? record.text : "";
	}).filter(Boolean);
}
function extractTextPages(result) {
	const pages = [];
	for (const block of extractTextContent(result)) for (const line of block.split(/\r?\n/)) {
		const match = line.match(/^\s*(\d+):\s+(.+?)(?:\s+\[(selected)\])?\s*$/i);
		if (!match) continue;
		pages.push({
			id: Number.parseInt(match[1] ?? "", 10),
			url: normalizeOptionalString(match[2]),
			selected: Boolean(match[3])
		});
	}
	return pages;
}
function extractStructuredPages(result) {
	const structured = asPages(extractStructuredContent(result).pages);
	return structured.length > 0 ? structured : extractTextPages(result);
}
function normalizeSnapshotFields(record) {
	const snapshotValue = record.value;
	return {
		id: readStringValue(record.id),
		role: readStringValue(record.role),
		name: readStringValue(record.name),
		...typeof snapshotValue === "string" || typeof snapshotValue === "number" || typeof snapshotValue === "boolean" ? { value: snapshotValue } : {},
		description: readStringValue(record.description)
	};
}
function normalizeSnapshotNode(value) {
	const rootRecord = asNullableRecord(value);
	if (!rootRecord) return null;
	const root = normalizeSnapshotFields(rootRecord);
	const pending = [{
		record: rootRecord,
		node: root
	}];
	while (pending.length > 0) {
		const current = pending.pop();
		if (!current || !Array.isArray(current.record.children)) continue;
		const children = [];
		for (const child of current.record.children) {
			const record = asNullableRecord(child);
			if (!record) continue;
			const node = normalizeSnapshotFields(record);
			children.push(node);
			pending.push({
				record,
				node
			});
		}
		current.node.children = children;
	}
	return root;
}
function extractSnapshot(result) {
	const snapshot = normalizeSnapshotNode(extractStructuredContent(result).snapshot);
	if (!snapshot) throw new Error("Chrome MCP snapshot response was missing structured snapshot data.");
	return snapshot;
}
function extractMessageText(result) {
	const message = extractStructuredContent(result).message;
	if (typeof message === "string" && message.trim()) return message;
	return extractTextContent(result).find((block) => block.trim()) ?? "";
}
function extractChromeMcpToolError(result, name, args) {
	if (result.isError || name === "close_page" && extractStructuredPages(result).some((page) => page.id === args.pageId)) return extractMessageText(result).trim() || `Chrome MCP tool "${name}" failed.`;
	if (name !== "navigate_page") return;
	return [extractMessageText(result), ...extractTextContent(result)].flatMap((text) => text.split(/\r?\n/)).find((line) => line.startsWith("Unable to navigate in the selected page:"));
}
function formatChromeMcpToolErrorMessage(params) {
	const detail = redactChromeMcpDiagnosticTextWithLocalPaths(params.message);
	const profileLabel = redactChromeMcpProfileLabelForDiagnostic(params.profileName);
	if (params.options.browserUrl && CHROME_CONNECTION_TOOL_ERROR_RE.test(params.message)) return `Chrome MCP tool "${params.toolName}" failed for profile "${profileLabel}" while using the configured Chrome endpoint (${redactToolPayloadText(redactCdpUrl(params.options.browserUrl) ?? params.options.browserUrl)}). Details: ${detail}`;
	if (!params.options.browserUrl && params.options.userDataDir && DEVTOOLS_ACTIVE_PORT_RE.test(params.message)) return `${detail} If this browser was started with --remote-debugging-port, set ${path.isAbsolute(params.profileName) ? "this existing-session profile's cdpUrl" : `browser.profiles.${params.profileName}.cdpUrl`} to that DevTools endpoint instead of relying on Chrome MCP auto-connect.`;
	return detail;
}
function extractJsonMessage(result) {
	const candidates = [extractMessageText(result), ...extractTextContent(result)].filter((text) => text.trim());
	let lastError;
	for (const candidate of candidates) try {
		const json = candidate.match(/^[\t ]*```json[\t ]*\r?\n([\s\S]*?)\r?\n[\t ]*```[\t ]*\r?$/im)?.[1]?.trim() || candidate.trim();
		return json === "undefined" ? void 0 : JSON.parse(json);
	} catch (err) {
		lastError = err;
	}
	if (lastError) throw toErrorObject(lastError, "Non-Error thrown");
	return null;
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-routing.ts
function getChromeMcpRoutingState(session) {
	session.routing ??= {
		sessionNonce: randomUUID().replaceAll("-", "").slice(0, 12),
		withOperationLock: createAsyncLock(),
		targetIdByPageId: /* @__PURE__ */ new Map(),
		nextTargetHandleId: 1,
		snapshotsByTarget: /* @__PURE__ */ new Map(),
		nextSnapshotRefId: 1
	};
	return session.routing;
}
async function withChromeMcpOperationLock(session, options, operation) {
	const signal = options.signal;
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	let started = false;
	let cancelled = false;
	let cancelReason;
	const queued = getChromeMcpRoutingState(session).withOperationLock(async () => {
		if (cancelled) throw cancelReason ?? /* @__PURE__ */ new Error("Chrome MCP operation cancelled before it started.");
		started = true;
		if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
		return await operation();
	});
	const timeoutMs = options.timeoutMs;
	if (!signal && !(timeoutMs !== void 0 && timeoutMs > 0)) return await queued;
	let timer;
	let abortListener;
	const cancelBeforeStart = new Promise((_resolve, reject) => {
		const cancel = (reason) => {
			if (started || cancelled) return;
			cancelled = true;
			cancelReason = toErrorObject(reason, "Chrome MCP operation cancelled");
			reject(cancelReason);
		};
		if (signal) {
			abortListener = () => cancel(signal.reason ?? /* @__PURE__ */ new Error("aborted"));
			signal.addEventListener("abort", abortListener, { once: true });
		}
		if (timeoutMs !== void 0 && timeoutMs > 0) {
			timer = setTimeout(() => cancel(/* @__PURE__ */ new Error(`Chrome MCP operation timed out after ${timeoutMs}ms while waiting for another operation.`)), timeoutMs);
			timer.unref?.();
		}
	});
	try {
		return await Promise.race([queued, cancelBeforeStart]);
	} finally {
		if (timer) clearTimeout(timer);
		if (signal && abortListener) signal.removeEventListener("abort", abortListener);
		if (cancelled) queued.catch(() => {});
	}
}
/** UID-only MCP actions cannot distinguish collisions between renderer documents. */
function validateChromeMcpSnapshotRefs(root) {
	const documents = /* @__PURE__ */ new Map();
	const pending = [{
		node: root,
		document: root,
		documentUid: normalizeOptionalString(root.id)
	}];
	for (let current = pending.pop(); current; current = pending.pop()) {
		const role = current.node.role?.trim().toLowerCase();
		const document = role === "rootwebarea" ? current.node : current.document;
		const documentUid = role === "rootwebarea" ? normalizeOptionalString(current.node.id) : current.documentUid;
		const uid = normalizeOptionalString(current.node.id);
		if (uid) {
			const previous = documents.get(uid);
			if (previous && previous.document !== document) throw new Error("Chrome MCP returned ambiguous element IDs across documents. The snapshot and its refs were discarded. Use a managed browser profile for this page; ref-free screenshots remain available.");
			if (previous) previous.nodes.push(current.node);
			else documents.set(uid, {
				document,
				documentUid,
				nodes: [current.node]
			});
		}
		for (const child of current.node.children?.toReversed() ?? []) pending.push({
			node: child,
			document: role === "iframe" ? current.node : document,
			documentUid: role === "iframe" ? void 0 : documentUid
		});
	}
	return documents;
}
function registerChromeMcpSnapshot(session, targetId, result) {
	const root = extractSnapshot(result);
	const documentUid = normalizeOptionalString(root.id);
	if (!documentUid || root.role?.trim().toLowerCase() !== "rootwebarea") throw new Error("Chrome MCP snapshot did not contain a top-level document uid");
	const documents = validateChromeMcpSnapshotRefs(root);
	const routing = getChromeMcpRoutingState(session);
	const refs = /* @__PURE__ */ new Map();
	for (const [uid, binding] of documents) {
		const id = `${CHROME_MCP_SNAPSHOT_REF_PREFIX}${routing.sessionNonce}:${routing.nextSnapshotRefId}`;
		routing.nextSnapshotRefId += 1;
		refs.set(id, {
			uid,
			documentUid: binding.documentUid
		});
		for (const node of binding.nodes) node.id = id;
	}
	routing.snapshotsByTarget.set(targetId, {
		documentUid,
		refs
	});
	return {
		root,
		documentUid
	};
}
function resolveChromeMcpSnapshotRef(session, targetId, refId) {
	const resolved = getChromeMcpRoutingState(session).snapshotsByTarget.get(targetId)?.refs.get(refId);
	if (!resolved) throw new Error(`Unknown ref "${refId}". Run a new snapshot and use a ref from that snapshot.`);
	return resolved;
}
async function callTool(profileName, profileOptions, name, args, options, lease) {
	const timeoutMs = options.timeoutMs;
	const signal = options.signal;
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	const request = {
		name,
		arguments: args
	};
	const rawCall = timeoutMs !== void 0 && timeoutMs > 0 || signal ? lease.session.client.callTool(request, void 0, {
		...timeoutMs !== void 0 && timeoutMs > 0 ? { timeout: timeoutMs } : {},
		...signal ? { signal } : {}
	}) : lease.session.client.callTool(request);
	let result;
	try {
		result = await rawCall;
	} catch (err) {
		if (!lease.temporary && lease.owner.isCurrent(lease.session)) await lease.owner.close(lease.session);
		if (signal?.aborted) throw toErrorObject(signal.reason ?? err, "Non-Error abort reason");
		if (timeoutMs && err instanceof McpError && err.code === MCP_REQUEST_TIMEOUT_CODE) throw new Error(`Chrome MCP "${name}" timed out after ${timeoutMs}ms. Session reset for reconnect.`, { cause: err });
		throw err;
	}
	const message = extractChromeMcpToolError(result, name, args);
	if (message) {
		if (name === "list_pages" && message.includes("The selected page has been closed. Call list_pages to see open pages.")) {
			if (!lease.temporary && lease.owner.isCurrent(lease.session)) await lease.owner.close(lease.session);
			throw new ChromeMcpReconnectRequiredError(message);
		}
		throw new Error(formatChromeMcpToolErrorMessage({
			profileName,
			options: profileOptions,
			toolName: name,
			message
		}));
	}
	return result;
}
async function callTargetTool(params, name, args) {
	return await withChromeMcpTarget(params, async (target) => {
		const resolvedArgs = typeof args === "function" ? args(target.session) : args;
		return await target.callTool(name, {
			...resolvedArgs,
			pageId: target.pageId
		});
	});
}
async function withChromeMcpLease(profileName, profileOptions, options, operation) {
	const normalizedProfileOptions = normalizeChromeMcpOptions(profileOptions);
	options.signal?.throwIfAborted();
	const lease = await getChromeMcpSessionOwner(profileName, normalizedProfileOptions).lease(options);
	try {
		return await withChromeMcpOperationLock(lease.session, options, async () => {
			if (!lease.temporary && (!lease.owner.isCurrent(lease.session) || lease.session.transport.pid === null)) throw new BrowserProfileUnavailableError(`Chrome MCP session for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}" changed before the operation could start. Run the browser command again to reconnect.`);
			const call = (name, args, callOptions = options) => callTool(profileName, normalizedProfileOptions, name, args, callOptions, lease);
			return await operation({
				session: lease.session,
				profileOptions: normalizedProfileOptions,
				callTool: call,
				listTargets: async (callOptions = options) => registerChromeMcpTargets(lease.session, extractStructuredPages(await call("list_pages", {}, callOptions)))
			});
		});
	} finally {
		await lease.release();
	}
}
function registerChromeMcpTargets(session, pages, options = {}) {
	const routing = getChromeMcpRoutingState(session);
	const targetIdByPageId = options.authoritative === false ? new Map(routing.targetIdByPageId) : /* @__PURE__ */ new Map();
	const returnedPageIds = /* @__PURE__ */ new Set();
	const targets = [];
	for (const page of pages) {
		if (returnedPageIds.has(page.id)) throw new Error(`Chrome MCP returned duplicate numeric page id ${page.id}.`);
		returnedPageIds.add(page.id);
		let targetId = routing.targetIdByPageId.get(page.id);
		if (!targetId) {
			targetId = `${CHROME_MCP_SESSION_TARGET_PREFIX}${routing.sessionNonce}:${routing.nextTargetHandleId}`;
			routing.nextTargetHandleId += 1;
		}
		targetIdByPageId.set(page.id, targetId);
		targets.push({
			page,
			targetId
		});
	}
	for (const [pageId, targetId] of routing.targetIdByPageId) if (!targetIdByPageId.has(pageId)) routing.snapshotsByTarget.delete(targetId);
	routing.targetIdByPageId = targetIdByPageId;
	return targets;
}
async function withChromeMcpTarget(params, operation) {
	return await withChromeMcpLease(params.profileName, params.profile, params, async (sessionOperation) => {
		const pageId = [...getChromeMcpRoutingState(sessionOperation.session).targetIdByPageId].find(([, targetId]) => targetId === params.targetId)?.[0];
		if (pageId === void 0) throw new BrowserTabNotFoundError({ input: params.targetId });
		return await operation({
			...sessionOperation,
			pageId
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-actions.ts
async function focusChromeMcpTab(profileName, targetId, profileOptions, options = {}) {
	await callTargetTool({
		profileName,
		profile: profileOptions,
		targetId,
		...options
	}, "select_page", { bringToFront: true });
}
async function closeChromeMcpTab(profileName, targetId, profileOptions, options = {}) {
	await withChromeMcpTarget({
		profileName,
		profile: profileOptions,
		targetId,
		...options
	}, async (target) => {
		await target.callTool("close_page", { pageId: target.pageId });
		const routing = getChromeMcpRoutingState(target.session);
		routing.targetIdByPageId.delete(target.pageId);
		routing.snapshotsByTarget.delete(targetId);
	});
}
async function navigateChromeMcpPage(params) {
	const resolvedTimeoutMs = resolveBrowserNavigationTimeoutMs(params.timeoutMs);
	const callTimeoutMs = resolveChromeMcpNavigateCallTimeoutMs(resolvedTimeoutMs);
	return await withChromeMcpTarget({
		...params,
		timeoutMs: callTimeoutMs
	}, async (target) => {
		return { url: (await navigateChromeMcpPageOnTarget({
			...params,
			timeoutMs: resolvedTimeoutMs
		}, target, "Chrome MCP tab identity changed while navigation was running; the navigation outcome is unknown.")).url ?? params.url };
	});
}
async function navigateChromeMcpPageOnTarget(params, target, identityChangedMessage) {
	const options = {
		timeoutMs: resolveChromeMcpNavigateCallTimeoutMs(params.timeoutMs),
		signal: params.signal
	};
	await target.callTool("navigate_page", {
		pageId: target.pageId,
		type: "url",
		url: params.url,
		timeout: params.timeoutMs
	}, options);
	const page = (await target.listTargets(options)).find((entry) => entry.targetId === params.targetId)?.page;
	if (!page) throw new Error(identityChangedMessage);
	return page;
}
function resolveChromeMcpNavigateCallTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
async function takeChromeMcpSnapshot(params) {
	return await withChromeMcpTarget(params, async (target) => {
		getChromeMcpRoutingState(target.session).snapshotsByTarget.delete(params.targetId);
		const result = await target.callTool("take_snapshot", { pageId: target.pageId });
		return registerChromeMcpSnapshot(target.session, params.targetId, result).root;
	});
}
/** Run document-bound evaluations without releasing the target/session lock. */
async function withChromeMcpDocument(params, task) {
	return await withChromeMcpTarget(params, async (target) => {
		const routing = getChromeMcpRoutingState(target.session);
		try {
			let uid = routing.snapshotsByTarget.get(params.targetId)?.documentUid;
			if (!uid) {
				const snapshot = await target.callTool("take_snapshot", {
					pageId: target.pageId,
					verbose: true
				}).catch(rethrowChromeMcpDocumentError);
				uid = registerChromeMcpSnapshot(target.session, params.targetId, snapshot).documentUid;
			}
			return await task({ evaluate: async (fn) => {
				return extractJsonMessage(await target.callTool("evaluate_script", {
					pageId: target.pageId,
					function: fn,
					args: [uid],
					waitForStableDom: false
				}).catch(rethrowChromeMcpDocumentError));
			} });
		} catch (error) {
			if (error instanceof ChromeMcpDocumentUnavailableError) routing.snapshotsByTarget.delete(params.targetId);
			throw error;
		}
	});
}
/** Capture within an existing target operation, including its snapshot ref lifetime. */
async function takeChromeMcpScreenshotOnTarget(params, target) {
	return await withTempDownloadPath({
		prefix: "openclaw-chrome-mcp",
		fileName: "screenshot"
	}, async (filePath) => {
		const format = params.format ?? "png";
		await target.callTool("take_screenshot", {
			pageId: target.pageId,
			filePath,
			format,
			...params.uid ? { uid: resolveChromeMcpSnapshotRef(target.session, params.targetId, params.uid).uid } : {},
			...params.fullPage ? { fullPage: true } : {}
		}, params);
		return await fs.readFile(`${filePath}.${format}`);
	});
}
async function takeChromeMcpScreenshot(params) {
	return await withChromeMcpTarget(params, (target) => takeChromeMcpScreenshotOnTarget(params, target));
}
async function clickChromeMcpElement(params) {
	await callTargetTool(params, "click", (session) => ({
		uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid).uid,
		...params.doubleClick ? { dblClick: true } : {}
	}));
}
async function clickChromeMcpCoords(params) {
	await callTargetTool(params, "click_at", {
		x: params.x,
		y: params.y,
		...params.doubleClick ? { dblClick: true } : {}
	});
}
/** Select an HTML option by value; MCP fill selects by visible label instead. */
async function selectChromeMcpOption(params) {
	await evaluateChromeMcpScript({
		...params,
		args: [params.uid],
		fn: `(el) => {
      if (!(el instanceof HTMLSelectElement)) throw new Error("Element is not a select");
      if (el.matches(":disabled")) throw new Error("Select element is disabled");
      const option = Array.from(el.options).find((entry) => entry.value === ${JSON.stringify(params.value)});
      if (!option) throw new Error("No option has the requested value");
      el.value = option.value;
      el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el.value;
    }`
	});
}
async function fillChromeMcpElement(params) {
	await callTargetTool(params, "fill", (session) => ({
		uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid).uid,
		value: params.value
	}));
}
async function fillChromeMcpForm(params) {
	await callTargetTool(params, "fill_form", (session) => ({ elements: params.elements.map((element) => ({
		...element,
		uid: resolveChromeMcpSnapshotRef(session, params.targetId, element.uid).uid
	})) }));
}
async function hoverChromeMcpElement(params) {
	await callTargetTool(params, "hover", (session) => ({ uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid).uid }));
}
async function dragChromeMcpElement(params) {
	await callTargetTool(params, "drag", (session) => ({
		from_uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.fromUid).uid,
		to_uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.toUid).uid
	}));
}
async function uploadChromeMcpFile(params) {
	await callTargetTool(params, "upload_file", (session) => ({
		uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid).uid,
		filePaths: params.filePaths
	}));
}
async function pressChromeMcpKey(params) {
	await callTargetTool(params, "press_key", { key: params.key });
}
async function resizeChromeMcpPage(params) {
	await callTargetTool(params, "resize_page", {
		width: params.width,
		height: params.height
	});
}
async function evaluateChromeMcpScript(params) {
	return extractJsonMessage(await callTargetTool(params, "evaluate_script", (session) => ({
		function: params.fn,
		...params.args?.length ? { args: params.args.map((ref) => resolveChromeMcpSnapshotRef(session, params.targetId, ref).uid) } : {}
	})));
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp-tabs.ts
async function ensureChromeMcpAvailable(profileName, profileOptions, options = {}) {
	await withChromeMcpLease(profileName, profileOptions, options, async (operation) => {
		if (!options.pageProbe) return;
		try {
			const pages = await operation.listTargets({
				...options,
				timeoutMs: options.pageProbe.timeoutMs?.() ?? options.timeoutMs
			});
			options.pageProbe.onResult(pages.length);
		} catch {
			options.signal?.throwIfAborted();
			options.pageProbe.onResult(null);
		}
	});
}
async function readChromeMcpTabs(profileName, profileOptions, options = {}) {
	for (let attempt = 0;; attempt += 1) try {
		return await withChromeMcpLease(profileName, profileOptions, options, async (operation) => (await operation.listTargets()).map(({ page, targetId }) => ({
			targetId,
			title: "",
			url: page.url ?? "",
			type: "page"
		})));
	} catch (err) {
		if (err instanceof ChromeMcpReconnectRequiredError && attempt === 0) continue;
		throw err;
	}
}
/** List Chrome MCP pages converted to persistent BrowserTab handles. */
async function listChromeMcpTabs(profileName, profileOptions, options = {}) {
	return await readChromeMcpTabs(profileName, profileOptions, {
		timeoutMs: options.timeoutMs,
		signal: options.signal
	});
}
/** Count Chrome MCP pages without returning handles from an ephemeral session. */
async function countChromeMcpTabs(profileName, profileOptions, options = {}) {
	return (await readChromeMcpTabs(profileName, profileOptions, options)).length;
}
async function lookupChromeMcpMarkerNativeTarget(params) {
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(params.browserUrl);
	const rawTargets = await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), params.options.cdpTimeouts?.httpTimeoutMs, { signal: params.options.signal }, params.options.cdpPolicy);
	if (!Array.isArray(rawTargets)) throw new Error("CDP target list response was not an array");
	if (rawTargets.some((target) => !target || typeof target !== "object")) throw new Error("CDP target list response contained a malformed entry");
	const matches = rawTargets.filter((target) => target.url === params.markerUrl && typeof target.id === "string" && target.id.trim() && (target.type === void 0 || target.type === "page"));
	if (matches.length !== 1) return;
	const nativeTargetId = matches[0]?.id;
	return typeof nativeTargetId === "string" ? nativeTargetId.trim() || void 0 : void 0;
}
async function captureChromeMcpTabOwnership(params) {
	if (!params.browserUrl || !params.markerUrl) return { ownership: {
		status: "non-durable",
		reason: "explicit-cdp-url-required"
	} };
	let nativeTargetId;
	try {
		nativeTargetId = await lookupChromeMcpMarkerNativeTarget({
			browserUrl: params.browserUrl,
			markerUrl: params.markerUrl,
			options: params.options
		});
	} catch (error) {
		if (params.options.signal?.aborted) throw params.options.signal.reason ?? error;
		if (error instanceof BrowserCdpEndpointBlockedError) throw error;
		return { ownership: {
			status: "non-durable",
			reason: "target-marker-lookup-failed"
		} };
	}
	if (!nativeTargetId) return { ownership: {
		status: "non-durable",
		reason: "target-marker-not-unique"
	} };
	return {
		ownership: await resolveCdpTabOwnership({
			profileName: params.profileName,
			cdpUrl: params.browserUrl,
			nativeTargetId,
			timeoutMs: params.options.cdpTimeouts?.httpTimeoutMs,
			signal: params.options.signal,
			ssrfPolicy: params.options.cdpPolicy
		}),
		nativeTargetId
	};
}
/** Open a new Chrome MCP tab and navigate it to the requested URL. */
async function openChromeMcpTab(profileName, url, profileOptions, options = {}) {
	const targetUrl = url.trim() || "about:blank";
	return await withChromeMcpLease(profileName, profileOptions, options, async (operation) => {
		const { session, profileOptions: normalizedProfileOptions } = operation;
		const canUseMcpCompensation = (await operation.listTargets({
			timeoutMs: CHROME_MCP_NEW_PAGE_TIMEOUT_MS,
			signal: options.signal
		})).length > 0;
		if (!canUseMcpCompensation && !normalizedProfileOptions.browserUrl) throw new Error("Chrome MCP cannot safely open the first page without an explicit CDP endpoint.");
		const markerUrl = normalizedProfileOptions.browserUrl ? `about:blank#openclaw-${randomUUID()}` : void 0;
		const initialUrl = markerUrl ?? "about:blank";
		const createdPages = registerChromeMcpTargets(session, extractStructuredPages(await operation.callTool("new_page", {
			url: initialUrl,
			timeout: CHROME_MCP_NEW_PAGE_TIMEOUT_MS
		})), { authoritative: false });
		const created = createdPages.find(({ page }) => page.selected) ?? createdPages.at(-1);
		if (!created) throw new Error("Chrome MCP did not return the created page.");
		let capturedNativeTargetId;
		const closeUntrackedPage = async () => {
			let directCloseError;
			if (normalizedProfileOptions.browserUrl && markerUrl) try {
				const nativeTargetId = capturedNativeTargetId ?? await lookupChromeMcpMarkerNativeTarget({
					browserUrl: normalizedProfileOptions.browserUrl,
					markerUrl,
					options: {
						...options,
						signal: void 0
					}
				});
				if (nativeTargetId) {
					const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(normalizedProfileOptions.browserUrl);
					await fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${encodeURIComponent(nativeTargetId)}`), options.cdpTimeouts?.httpTimeoutMs, void 0, options.cdpPolicy);
					const routing = getChromeMcpRoutingState(session);
					routing.targetIdByPageId.delete(created.page.id);
					routing.snapshotsByTarget.delete(created.targetId);
					return;
				}
			} catch (error) {
				directCloseError = error;
			}
			if (!canUseMcpCompensation) throw directCloseError instanceof Error ? directCloseError : new Error("Could not resolve the created Chrome MCP target", { cause: directCloseError });
			await operation.callTool("close_page", { pageId: created.page.id }, { timeoutMs: CHROME_MCP_NEW_PAGE_TIMEOUT_MS });
			const routing = getChromeMcpRoutingState(session);
			routing.targetIdByPageId.delete(created.page.id);
			routing.snapshotsByTarget.delete(created.targetId);
		};
		try {
			const captured = await captureChromeMcpTabOwnership({
				profileName,
				browserUrl: normalizedProfileOptions.browserUrl,
				markerUrl,
				options
			});
			capturedNativeTargetId = captured.nativeTargetId;
			if (!canUseMcpCompensation && captured.ownership.status !== "durable") throw new Error("Chrome MCP cannot safely track the first page without durable CDP ownership.");
			let page = created.page;
			if (targetUrl !== initialUrl) page = await navigateChromeMcpPageOnTarget({
				targetId: created.targetId,
				url: targetUrl,
				timeoutMs: CHROME_MCP_NAVIGATE_TIMEOUT_MS,
				signal: options.signal
			}, {
				...operation,
				pageId: created.page.id
			}, "Chrome MCP created page identity changed before navigation completed.");
			return {
				targetId: created.targetId,
				title: "",
				url: page.url ?? targetUrl,
				type: "page",
				ownership: captured.ownership
			};
		} catch (openError) {
			try {
				await closeUntrackedPage();
			} catch (closeError) {
				throw Object.assign(new Error("Failed to open a tracked Chrome MCP page and close its marker", { cause: openError }), { errors: [openError, closeError] });
			}
			throw openError;
		}
	});
}
//#endregion
export { setChromeMcpSessionFactoryForTest as A, withChromeMcpDocument as C, closeChromeMcpSession as D, extractJsonMessage as E, rethrowChromeMcpDocumentError as M, getChromeMcpPid as O, uploadChromeMcpFile as S, withChromeMcpTarget as T, resolveChromeMcpNavigateCallTimeoutMs as _, clickChromeMcpCoords as a, takeChromeMcpScreenshotOnTarget as b, dragChromeMcpElement as c, fillChromeMcpForm as d, focusChromeMcpTab as f, resizeChromeMcpPage as g, pressChromeMcpKey as h, openChromeMcpTab as i, ChromeMcpDocumentUnavailableError as j, resetChromeMcpSessionsForTest as k, evaluateChromeMcpScript as l, navigateChromeMcpPage as m, ensureChromeMcpAvailable as n, clickChromeMcpElement as o, hoverChromeMcpElement as p, listChromeMcpTabs as r, closeChromeMcpTab as s, countChromeMcpTabs as t, fillChromeMcpElement as u, selectChromeMcpOption as v, resolveChromeMcpSnapshotRef as w, takeChromeMcpSnapshot as x, takeChromeMcpScreenshot as y };
