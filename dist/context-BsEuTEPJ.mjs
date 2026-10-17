import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, c as asFiniteNumberInRange, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { o as captureGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as withContainerEnvFile } from "./container-env-file-BATVpQPA.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-B6mKYs2x.mjs";
import { l as isSameSsrFPolicy } from "./ssrf-v45DW-yR.mjs";
import { f as readAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as ensureSandboxWorkspace } from "./workspace-C0xiByg0.mjs";
import { C as SANDBOX_DOCKER_CREATE_ARGS_EPOCH, b as SANDBOX_BROWSER_SECURITY_HASH_EPOCH, v as SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH, w as SANDBOX_GITHUB_CONFIG_DIR } from "./constants-sQ6GWokQ.mjs";
import { n as isToolAllowed } from "./tool-policy-eD9SQrK2.mjs";
import { i as resolveSandboxConfigForAgent, r as resolveSandboxBrowserDockerCreateConfig } from "./config-DGIfx80_.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { r as toSandboxProvisioningError } from "./provisioning-error-bD2pXu_s.mjs";
import "./workspace-mounts-foAiMu-T.mjs";
import { c as DOCKER_SANDBOX_ENGINE } from "./podman-runtime-D0Q3mW9T.mjs";
import { b as readDockerPort, c as prepareSandboxMountPlan, d as handleHotSandboxConfigMismatch, g as dockerContainerState, i as execDocker, o as formatDockerDaemonUnavailableError, s as isDockerDaemonUnavailable, t as buildSandboxCreateArgs, u as sandboxMountPlanMatchesContainer, v as readDockerContainerEnvVar, y as readDockerContainerLabel } from "./docker-CQPi3qhJ.mjs";
import { t as hashTextSha256 } from "./hash-DV5OH4uO.mjs";
import { a as computeSandboxBrowserConfigHash, t as resolveDockerEnvPolicyEpoch } from "./sanitize-env-vars-BYC-Fvaw.mjs";
import { i as slugifySessionKey, r as resolveSandboxWorkspaceLayoutPaths, t as buildSandboxContainerName } from "./shared-2nFGF-qq.mjs";
import { a as readRegisteredSandboxRuntimeIds, i as readBrowserRegistry, p as updateBrowserRegistry } from "./registry-BmXc2WeW.mjs";
import { n as validateNetworkMode } from "./validate-sandbox-security-hKO_A4jd.mjs";
import { f as assertSshSandboxSecretOwnerAvailable } from "./ssh-backend-oJM__Dmi.mjs";
import { a as getSandboxBackendWorkdirResolver, t as createSandboxBackend } from "./backend-Bhk9VbVt.mjs";
import { n as resolveSubagentSessionAttachmentRootDir, t as SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT } from "./subagent-attachment-paths-0g-Tlw0v.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-CVJsA9ab.mjs";
import { a as DEFAULT_OPENCLAW_BROWSER_COLOR, d as ensureBrowserControlAuth, f as resolveBrowserControlAuth, l as resolveBrowserConfig, n as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, s as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, u as resolveProfile } from "./browser-profiles-B1vfrmzn.mjs";
import { a as stopBrowserBridgeServer, i as startBrowserBridgeServer, n as stopCachedBrowserBridge, r as stopCachedBrowserBridgesForContainer, t as BROWSER_BRIDGES } from "./browser-bridges-BI_v0pGs.mjs";
import { t as createOneTimeTicketStore } from "./one-time-ticket-store-B8dK9Gfu.mjs";
import { t as resolveSandboxDockerUser } from "./docker-user-GobfiwVp.mjs";
import { t as createSandboxFsBridge } from "./fs-bridge-BnGXO2JT.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/config/port-defaults.ts
/** Default browser-CDP sidecar port range used when no browser-control-relative range is safe. */
const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
/** Inclusive end of the default browser-CDP sidecar port range. */
const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN = 99;
/** Derives the browser-CDP sidecar range from the browser-control port when it fits. */
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
	const start = asFiniteNumberInRange(browserControlPort + 9, {
		min: 0,
		minExclusive: true,
		max: 65535
	}) ?? DEFAULT_BROWSER_CDP_PORT_RANGE_START;
	const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
	if (end <= 65535) return {
		start,
		end
	};
	return {
		start: DEFAULT_BROWSER_CDP_PORT_RANGE_START,
		end: DEFAULT_BROWSER_CDP_PORT_RANGE_END
	};
}
//#endregion
//#region src/agents/sandbox/novnc-auth.ts
/**
* noVNC observer authentication helpers.
*
* Issues short-lived observer tokens and builds local noVNC URLs without exposing long-lived browser bridge state.
*/
const NOVNC_PASSWORD_ENV_KEY = "OPENCLAW_BROWSER_NOVNC_PASSWORD";
const NOVNC_TOKEN_TTL_MS = 6e4;
const MAX_NOVNC_TOKEN_TTL_MS = NOVNC_TOKEN_TTL_MS;
const NOVNC_PASSWORD_LENGTH = 8;
const NOVNC_PASSWORD_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NO_VNC_OBSERVER_TOKENS = createOneTimeTicketStore({ ttlMs: NOVNC_TOKEN_TTL_MS });
function resolveNoVncObserverTokenExpiresAt(params) {
	return resolveExpiresAtMsFromDurationMs(params.ttlMs, {
		nowMs: params.nowMs,
		minRemainingMs: 1
	}) ?? resolveExpiresAtMsFromDurationMs(NOVNC_TOKEN_TTL_MS, {
		nowMs: params.nowMs,
		minRemainingMs: 1
	});
}
function isNoVncEnabled(params) {
	return params.noVncEnabled && !params.headless;
}
function generateNoVncPassword() {
	let out = "";
	for (let i = 0; i < NOVNC_PASSWORD_LENGTH; i += 1) out += NOVNC_PASSWORD_ALPHABET[crypto.randomInt(0, 62)];
	return out;
}
function issueNoVncObserverToken(params) {
	const now = params.nowMs ?? Date.now();
	const expiresAt = resolveNoVncObserverTokenExpiresAt({
		ttlMs: typeof params.ttlMs === "number" && params.ttlMs <= MAX_NOVNC_TOKEN_TTL_MS ? params.ttlMs : void 0,
		nowMs: now
	});
	if (expiresAt === void 0) return crypto.randomBytes(24).toString("hex");
	return NO_VNC_OBSERVER_TOKENS.mint({
		noVncPort: params.noVncPort,
		password: normalizeOptionalString(params.password)
	}, {
		ttlMs: expiresAt - now,
		nowMs: now
	}).token;
}
function consumeNoVncObserverToken(token, nowMs) {
	const now = asDateTimestampMs(nowMs ?? Date.now());
	if (now === void 0) return null;
	return NO_VNC_OBSERVER_TOKENS.consume(token, now) ?? null;
}
function buildNoVncObserverTokenUrl(baseUrl, token) {
	return `${baseUrl}/sandbox/novnc?${new URLSearchParams({ token }).toString()}`;
}
//#endregion
//#region src/agents/sandbox/browser.ts
const HOT_BROWSER_WINDOW_MS = 3e5;
const CDP_SOURCE_RANGE_ENV_KEY = "OPENCLAW_BROWSER_CDP_SOURCE_RANGE";
const CDP_AUTH_TOKEN_ENV_KEY = "OPENCLAW_BROWSER_CDP_AUTH_TOKEN";
const SANDBOX_BROWSER_IMAGE_CONTRACT_LABEL = "org.openclaw.sandbox-browser.contract";
const browserContainerLifecycleQueue = new KeyedAsyncQueue();
const browserNetworkLifecycleQueue = new KeyedAsyncQueue();
function buildSandboxCdpAuthHeader(token) {
	return `Basic ${Buffer.from(`openclaw:${token}`).toString("base64")}`;
}
function buildSandboxCdpUrl(params) {
	const url = new URL(`http://127.0.0.1:${params.cdpPort}`);
	url.username = "openclaw";
	url.password = params.authToken;
	return url.toString().replace(/\/$/, "");
}
async function waitForSandboxCdp(params) {
	const deadline = Date.now() + Math.max(0, params.timeoutMs);
	const url = `http://127.0.0.1:${params.cdpPort}/json/version`;
	while (Date.now() < deadline) {
		try {
			const requestTimeoutMs = Math.max(1, Math.min(1e3, deadline - Date.now()));
			const ctrl = new AbortController();
			const t = setTimeout(ctrl.abort.bind(ctrl), requestTimeoutMs);
			try {
				const res = await fetch(url, {
					headers: { Authorization: buildSandboxCdpAuthHeader(params.authToken) },
					signal: ctrl.signal
				});
				await res.body?.cancel().catch(() => void 0);
				if (res.ok) return true;
			} finally {
				clearTimeout(t);
			}
		} catch {}
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) break;
		await new Promise((r) => {
			setTimeout(r, Math.min(150, remainingMs));
		});
	}
	return false;
}
function buildSandboxBrowserResolvedConfig(params) {
	const cdpHost = "127.0.0.1";
	const cdpPortRange = deriveDefaultBrowserCdpPortRange(params.controlPort);
	return {
		enabled: true,
		evaluateEnabled: params.evaluateEnabled,
		controlPort: params.controlPort,
		cdpProtocol: "http",
		cdpHost,
		cdpIsLoopback: true,
		cdpPortRangeStart: cdpPortRange.start,
		cdpPortRangeEnd: cdpPortRange.end,
		remoteCdpTimeoutMs: 1500,
		remoteCdpHandshakeTimeoutMs: 3e3,
		localLaunchTimeoutMs: 15e3,
		localCdpReadyTimeoutMs: 8e3,
		actionTimeoutMs: DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		executablePath: void 0,
		headless: params.headless,
		noSandbox: false,
		attachOnly: true,
		defaultProfile: DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
		extraArgs: [],
		tabCleanup: {
			enabled: true,
			idleMinutes: 120,
			maxTabsPerSession: 8,
			sweepMinutes: 5
		},
		profiles: { [DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME]: {
			cdpPort: params.cdpPort,
			cdpUrl: buildSandboxCdpUrl({
				cdpPort: params.cdpPort,
				authToken: params.cdpAuthToken
			}),
			color: DEFAULT_OPENCLAW_BROWSER_COLOR
		} },
		ssrfPolicy: params.ssrfPolicy
	};
}
async function ensureSandboxBrowserImage(image) {
	const result = await execDocker([
		"image",
		"inspect",
		"-f",
		`{{ index .Config.Labels "${SANDBOX_BROWSER_IMAGE_CONTRACT_LABEL}" }}`,
		image
	], { allowFailure: true });
	if (result.code === 0) {
		const contract = result.stdout.trim();
		if (contract === "2026-05-12-cdp-relay-auth") return;
		throw new Error(`Sandbox browser image ${image} is stale or incompatible (contract=${contract && contract !== "<no value>" ? contract : "missing"}, expected=${SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH}). Rebuild it with scripts/sandbox-browser-setup.sh.`);
	}
	const stderr = result.stderr.trim();
	if (isDockerDaemonUnavailable(stderr)) throw new Error(formatDockerDaemonUnavailableError(stderr));
	throw new Error(`Sandbox browser image not found: ${image}. Build it with scripts/sandbox-browser-setup.sh.`);
}
async function ensureDockerNetwork(network, opts) {
	validateNetworkMode(network, { allowContainerNamespaceJoin: opts?.allowContainerNamespaceJoin === true });
	const normalized = normalizeOptionalLowercaseString(network) ?? "";
	if (!normalized || normalized === "bridge" || normalized === "none") return;
	await browserNetworkLifecycleQueue.enqueue(normalized, async () => {
		if ((await execDocker([
			"network",
			"inspect",
			network
		], { allowFailure: true })).code === 0) return;
		opts?.assertCurrent?.();
		await execDocker([
			"network",
			"create",
			"--driver",
			"bridge",
			network
		]);
	});
}
async function ensureSandboxBrowser(params) {
	if (!params.cfg.browser.enabled) return null;
	if (!isToolAllowed(params.cfg.tools, "browser")) return null;
	if (normalizeOptionalLowercaseString(params.cfg.browser.network) === "none") throw new Error("Sandbox browser network mode \"none\" is unsupported because browser control requires a host-reachable published CDP port. Use \"bridge\", a custom bridge network, or disable the sandbox browser.");
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(params.scopeKey);
	const containerName = buildSandboxContainerName(params.cfg.browser.containerPrefix, slug);
	let provisioning = true;
	const withWorkspace = params.withWorkspace;
	const provision = () => browserContainerLifecycleQueue.enqueue(containerName, async () => await ensureSandboxBrowserContainer({
		...params,
		withWorkspace: withWorkspace ? (operation) => provisioning ? operation() : withWorkspace(operation) : void 0
	}, containerName));
	try {
		return await (withWorkspace ? withWorkspace(provision) : provision());
	} finally {
		provisioning = false;
	}
}
async function ensureSandboxBrowserContainer(params, containerName) {
	let existing = BROWSER_BRIDGES.get(params.scopeKey);
	const stopExistingForContainer = async () => {
		await stopCachedBrowserBridgesForContainer(containerName, params.assertCurrent);
		existing = BROWSER_BRIDGES.get(params.scopeKey);
	};
	const state = await dockerContainerState(containerName);
	params.assertCurrent?.();
	const browserImage = params.cfg.browser.image ?? "openclaw-sandbox-browser:bookworm-slim";
	const cdpSourceRange = normalizeOptionalString(params.cfg.browser.cdpSourceRange);
	const browserDockerCfg = resolveSandboxBrowserDockerCreateConfig({
		docker: params.cfg.docker,
		browser: {
			...params.cfg.browser,
			image: browserImage
		}
	});
	const mountPlan = await prepareSandboxMountPlan({
		engine: DOCKER_SANDBOX_ENGINE,
		workspaceDir: params.workspaceDir,
		...params.withWorkspace ? { workspaceSource: "managed-worktree" } : {},
		assertCurrent: params.assertCurrent,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		workdir: params.cfg.docker.workdir,
		workspaceAccess: params.cfg.workspaceAccess,
		binds: browserDockerCfg.binds,
		tmpfs: browserDockerCfg.tmpfs
	});
	params.assertCurrent?.();
	const expectedHash = computeSandboxBrowserConfigHash({
		docker: browserDockerCfg,
		dockerEnvPolicyEpoch: resolveDockerEnvPolicyEpoch(browserDockerCfg.env),
		browser: {
			cdpPort: params.cfg.browser.cdpPort,
			vncPort: params.cfg.browser.vncPort,
			noVncPort: params.cfg.browser.noVncPort,
			headless: params.cfg.browser.headless,
			noVncEnabled: params.cfg.browser.noVncEnabled,
			autoStartTimeoutMs: params.cfg.browser.autoStartTimeoutMs,
			cdpSourceRange
		},
		securityEpoch: SANDBOX_BROWSER_SECURITY_HASH_EPOCH,
		workspaceAccess: params.cfg.workspaceAccess,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		mountFormatVersion: 4,
		createArgsEpoch: SANDBOX_DOCKER_CREATE_ARGS_EPOCH,
		managedMounts: mountPlan.binds
	});
	const now = Date.now();
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	const noVncEnabled = isNoVncEnabled(params.cfg.browser);
	let noVncPassword;
	let cdpAuthToken;
	if (hasContainer) {
		if (noVncEnabled) {
			noVncPassword = await readDockerContainerEnvVar(containerName, "OPENCLAW_BROWSER_NOVNC_PASSWORD") ?? void 0;
			params.assertCurrent?.();
		}
		cdpAuthToken = await readDockerContainerEnvVar(containerName, CDP_AUTH_TOKEN_ENV_KEY) ?? void 0;
		params.assertCurrent?.();
		if (!cdpAuthToken) {
			defaultRuntime.log(`Removing stale sandbox browser container ${containerName} because it lacks the current CDP relay auth contract; it will be recreated.`);
			await stopExistingForContainer();
			params.assertCurrent?.();
			await execDocker([
				"rm",
				"-f",
				containerName
			], { allowFailure: true });
			hasContainer = false;
			running = false;
		}
	}
	if (hasContainer) {
		const registry = await readBrowserRegistry();
		params.assertCurrent?.();
		const registryEntry = registry.entries.find((entry) => entry.containerName === containerName);
		currentHash = await readDockerContainerLabel(containerName, "openclaw.configHash");
		params.assertCurrent?.();
		if (!currentHash) currentHash = registryEntry?.configHash ?? null;
		hashMismatch = !currentHash || currentHash !== expectedHash;
		if (hashMismatch) {
			const lastUsedAtMs = registryEntry?.lastUsedAtMs;
			if (running && (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_BROWSER_WINDOW_MS)) {
				const mountsMatch = await sandboxMountPlanMatchesContainer({
					engine: DOCKER_SANDBOX_ENGINE,
					containerName,
					plan: mountPlan
				});
				params.assertCurrent?.();
				handleHotSandboxConfigMismatch({
					containerName,
					scope: params.cfg.scope,
					sessionKey: params.scopeKey,
					browser: true,
					mountsChanged: !mountsMatch
				});
			} else {
				await stopExistingForContainer();
				params.assertCurrent?.();
				await execDocker([
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				hasContainer = false;
				running = false;
			}
		}
	}
	const registryEntry = {
		containerName,
		sessionKey: params.scopeKey,
		workspaceDir: params.workspaceDir,
		createdAtMs: now,
		lastUsedAtMs: now,
		image: browserImage,
		configHash: hashMismatch && running ? currentHash ?? void 0 : expectedHash
	};
	if (params.withWorkspace) {
		params.assertCurrent?.();
		await updateBrowserRegistry({
			...registryEntry,
			cdpPort: 0
		}, params.assertCurrent);
		params.assertCurrent?.();
	}
	if (!hasContainer) {
		if (noVncEnabled) noVncPassword = generateNoVncPassword();
		cdpAuthToken = crypto.randomBytes(24).toString("hex");
		await ensureDockerNetwork(browserDockerCfg.network, {
			assertCurrent: params.assertCurrent,
			allowContainerNamespaceJoin: browserDockerCfg.dangerouslyAllowContainerNamespaceJoin === true
		});
		await ensureSandboxBrowserImage(browserImage);
		params.assertCurrent?.();
		const { argv: args, env } = buildSandboxCreateArgs({
			name: containerName,
			cfg: browserDockerCfg,
			scopeKey: params.scopeKey,
			labels: {
				"openclaw.sandboxBrowser": "1",
				"openclaw.browserConfigEpoch": SANDBOX_BROWSER_SECURITY_HASH_EPOCH
			},
			configHash: expectedHash,
			includeBinds: false,
			bindSourceRoots: [params.workspaceDir, params.agentWorkspaceDir]
		});
		for (const bind of mountPlan.skippedBinds) defaultRuntime.log(`sandbox browser: skipping user bind "${bind}" — container path conflicts with a protected read-only skill mount`);
		for (const bind of mountPlan.binds) args.push("-v", bind);
		args.push("-p", `127.0.0.1::${params.cfg.browser.cdpPort}`);
		if (noVncEnabled) args.push("-p", `127.0.0.1::${params.cfg.browser.noVncPort}`);
		Object.assign(env, {
			OPENCLAW_BROWSER_HEADLESS: params.cfg.browser.headless ? "1" : "0",
			OPENCLAW_BROWSER_ENABLE_NOVNC: params.cfg.browser.noVncEnabled ? "1" : "0",
			OPENCLAW_BROWSER_CDP_PORT: String(params.cfg.browser.cdpPort),
			[CDP_AUTH_TOKEN_ENV_KEY]: cdpAuthToken,
			OPENCLAW_BROWSER_AUTO_START_TIMEOUT_MS: String(params.cfg.browser.autoStartTimeoutMs),
			OPENCLAW_BROWSER_VNC_PORT: String(params.cfg.browser.vncPort),
			OPENCLAW_BROWSER_NOVNC_PORT: String(params.cfg.browser.noVncPort),
			OPENCLAW_BROWSER_NO_SANDBOX: "1"
		});
		if (cdpSourceRange) env[CDP_SOURCE_RANGE_ENV_KEY] = cdpSourceRange;
		if (noVncEnabled && noVncPassword) env[NOVNC_PASSWORD_ENV_KEY] = noVncPassword;
		params.assertCurrent?.();
		await withContainerEnvFile(env, async (envFile) => {
			args.push("--env-file", envFile, browserImage);
			params.assertCurrent?.();
			await execDocker(args);
		});
		params.assertCurrent?.();
		await execDocker(["start", containerName]);
	} else if (!running) {
		params.assertCurrent?.();
		await execDocker(["start", containerName]);
	}
	const mappedCdp = await readDockerPort(containerName, params.cfg.browser.cdpPort);
	params.assertCurrent?.();
	if (!mappedCdp) throw new Error(`Failed to resolve CDP port mapping for ${containerName}.`);
	if (!cdpAuthToken) throw new Error(`Failed to resolve CDP relay auth for ${containerName}.`);
	const cdpUrl = buildSandboxCdpUrl({
		cdpPort: mappedCdp,
		authToken: cdpAuthToken
	});
	const mappedNoVnc = noVncEnabled ? await readDockerPort(containerName, params.cfg.browser.noVncPort) : null;
	params.assertCurrent?.();
	if (noVncEnabled && !noVncPassword) {
		noVncPassword = await readDockerContainerEnvVar(containerName, "OPENCLAW_BROWSER_NOVNC_PASSWORD") ?? void 0;
		params.assertCurrent?.();
	}
	const existingProfile = existing ? resolveProfile(existing.bridge.state.resolved, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME) : null;
	const desiredEvaluateEnabled = params.evaluateEnabled ?? true;
	let desiredAuthToken = normalizeOptionalString(params.bridgeAuth?.token);
	let desiredAuthPassword = normalizeOptionalString(params.bridgeAuth?.password);
	if (!desiredAuthToken && !desiredAuthPassword) {
		desiredAuthToken = existing?.authToken;
		desiredAuthPassword = existing?.authPassword;
		if (!desiredAuthToken && !desiredAuthPassword) desiredAuthToken = crypto.randomBytes(24).toString("hex");
	}
	const canReuse = Boolean(!params.withWorkspace && !params.assertCurrent && existing && existing.bridge.server.listening && existing.containerName === containerName && existingProfile?.cdpPort === mappedCdp && existingProfile?.cdpUrl === cdpUrl && isSameSsrFPolicy(existing.bridge.state.resolved.ssrfPolicy, params.ssrfPolicy) && existing.authToken === desiredAuthToken && existing.authPassword === desiredAuthPassword && existing.bridge.state.resolved.evaluateEnabled === desiredEvaluateEnabled);
	if (existing && !canReuse) await stopCachedBrowserBridge(params.scopeKey, existing, params.assertCurrent);
	let bridge = canReuse ? existing?.bridge ?? null : null;
	let createdBridge;
	try {
		if (!bridge) {
			const startTarget = async () => {
				const currentState = await dockerContainerState(containerName);
				params.assertCurrent?.();
				if (currentState.exists && !currentState.running) {
					params.assertCurrent?.();
					await execDocker(["start", containerName]);
				}
				const ok = await waitForSandboxCdp({
					cdpPort: mappedCdp,
					authToken: cdpAuthToken,
					timeoutMs: params.cfg.browser.autoStartTimeoutMs
				});
				params.assertCurrent?.();
				if (!ok) {
					await execDocker([
						"rm",
						"-f",
						containerName
					], { allowFailure: true });
					throw new Error(`Sandbox browser CDP did not become reachable on 127.0.0.1:${mappedCdp} within ${params.cfg.browser.autoStartTimeoutMs}ms. The hung container has been forcefully removed.`);
				}
			};
			const onEnsureAttachTarget = params.cfg.browser.autoStart ? () => params.withWorkspace ? params.withWorkspace(startTarget) : startTarget() : void 0;
			params.assertCurrent?.();
			bridge = await startBrowserBridgeServer({
				resolved: buildSandboxBrowserResolvedConfig({
					controlPort: 0,
					cdpPort: mappedCdp,
					cdpAuthToken,
					headless: params.cfg.browser.headless,
					evaluateEnabled: desiredEvaluateEnabled,
					ssrfPolicy: params.ssrfPolicy
				}),
				authToken: desiredAuthToken,
				authPassword: desiredAuthPassword,
				onEnsureAttachTarget,
				resolveSandboxNoVncToken: consumeNoVncObserverToken
			});
			createdBridge = bridge;
			params.assertCurrent?.();
			BROWSER_BRIDGES.set(params.scopeKey, {
				bridge,
				containerName,
				authToken: desiredAuthToken,
				authPassword: desiredAuthPassword
			});
		}
		params.assertCurrent?.();
		await updateBrowserRegistry({
			...registryEntry,
			cdpPort: mappedCdp,
			noVncPort: mappedNoVnc ?? void 0
		}, params.assertCurrent);
		params.assertCurrent?.();
		const noVncUrl = mappedNoVnc && noVncEnabled ? buildNoVncObserverTokenUrl(bridge.baseUrl, issueNoVncObserverToken({
			noVncPort: mappedNoVnc,
			password: noVncPassword
		})) : void 0;
		return {
			bridgeUrl: bridge.baseUrl,
			noVncUrl,
			containerName
		};
	} catch (error) {
		if (createdBridge) try {
			await stopBrowserBridgeServer(createdBridge.server);
			if (BROWSER_BRIDGES.get(params.scopeKey)?.bridge === createdBridge) BROWSER_BRIDGES.delete(params.scopeKey);
		} catch (cleanupError) {
			defaultRuntime.error?.(`Sandbox browser bridge cleanup failed: ${String(cleanupError)}`);
		}
		throw error;
	}
}
//#endregion
//#region src/agents/sandbox/state-owner.ts
var SandboxStateOwnerRequiredError = class extends Error {
	constructor(cause) {
		super("Sandbox workspace preparation cannot run alongside a foreign live owner of the selected state root, or when that ownership cannot be verified. Run this SDK call inside the owning Gateway plugin/runtime, or stop the Gateway through its service owner and wait for any embedded run to finish, then retry offline. Inspect openclaw gateway status; this call does not acquire ownership or route remotely.", { cause });
		this.code = "GATEWAY_STATE_OWNER_REQUIRED";
		this.name = "SandboxStateOwnerRequiredError";
	}
};
/** Retain hosted custody; standalone SDK preparation stays local when the root is offline. */
async function captureSandboxStateOwner() {
	const resolveTarget = () => resolveIdentityPathViaExistingAncestorSync(resolveOpenClawStateSqlitePath());
	try {
		const env = { ...process.env };
		const databasePath = resolveTarget();
		const owner = captureGatewayStateOwner(databasePath);
		if (owner && owner.role !== "gateway" && owner.role !== "agent-embedded") throw new SandboxStateOwnerRequiredError();
		if (!owner && await readActiveGatewayLockIdentity({
			env,
			includeEmbedded: true,
			requireInspection: true
		})) throw new SandboxStateOwnerRequiredError();
		const assertCurrent = () => {
			try {
				if (resolveTarget() !== databasePath) throw new SandboxStateOwnerRequiredError();
				owner?.assertCurrent();
			} catch (error) {
				if (error instanceof SandboxStateOwnerRequiredError) throw error;
				throw new SandboxStateOwnerRequiredError(error);
			}
		};
		assertCurrent();
		return assertCurrent;
	} catch (error) {
		if (error instanceof SandboxStateOwnerRequiredError) throw error;
		throw new SandboxStateOwnerRequiredError(error);
	}
}
//#endregion
//#region src/agents/sandbox/context.ts
const sandboxLog = createSubsystemLogger("agent/sandbox");
const loadSyncWorkspaceSkills = createLazyRuntimeNamedExport(() => import("./workspace-skill-sync.runtime.js"), "syncWorkspaceSkills");
async function syncSandboxSkillsToWorkspace(params) {
	try {
		const [syncWorkspaceSkills, { getRemoteSkillEligibility }, { resolveNodeExecEligibility }] = await Promise.all([
			loadSyncWorkspaceSkills(),
			import("./remote-ci29dy49.mjs"),
			import("./exec-defaults-Duh6Vx-G.mjs")
		]);
		params.assertCurrent?.();
		await prepareRemoteSkillConnections();
		params.assertCurrent?.();
		const nodeSkills = resolveNodeExecEligibility({
			cfg: params.config,
			sessionKey: params.rawSessionKey,
			agentId: params.agentId,
			execOverrides: params.execOverrides
		});
		const eligibility = {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		};
		const skillUsagePaths = await syncWorkspaceSkills({
			sourceWorkspaceDir: params.sourceWorkspaceDir,
			targetWorkspaceDir: params.targetWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			eligibility,
			skillsSnapshot: params.skillsSnapshot,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
		return {
			eligibility,
			skillUsagePaths
		};
	} catch (error) {
		params.assertCurrent?.();
		const message = error instanceof Error ? error.message : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox skill sync failed: ${message}`);
		if (params.skillsSnapshot?.librarySelections?.length) throw error;
		return {};
	}
}
async function ensureSandboxWorkspaceLayout(params, selected, guard) {
	const { rawSessionKey, runtime, localWorkspace } = selected;
	const assertCurrent = localWorkspace?.assertCurrent ?? params.assertCurrent;
	const cfg = localWorkspace ? {
		...selected.cfg,
		workspaceAccess: "rw"
	} : selected.cfg;
	const { agentWorkspaceDir, sandboxWorkspaceDir, scopeKey, skillsWorkspaceDir, workspaceDir } = resolveSandboxWorkspaceLayoutPaths({
		cfg,
		rawSessionKey,
		agentId: runtime.agentId,
		isolationSubject: localWorkspace && runtime.isolationSubject?.kind !== "session" ? {
			kind: "session",
			sessionKey: rawSessionKey
		} : runtime.isolationSubject,
		workspaceDir: localWorkspace?.workspaceDir ?? params.workspaceDir
	});
	assertCurrent?.();
	if (cfg.workspaceAccess !== "rw") await ensureSandboxWorkspace(sandboxWorkspaceDir, agentWorkspaceDir, params.config?.agents?.defaults?.skipBootstrap, params.config?.agents?.defaults?.skipOptionalBootstrapFiles, guard);
	else await fs$1.mkdir(workspaceDir, { recursive: true });
	assertCurrent?.();
	const syncedSkills = await syncSandboxSkillsToWorkspace({
		sourceWorkspaceDir: agentWorkspaceDir,
		targetWorkspaceDir: cfg.workspaceAccess === "rw" ? skillsWorkspaceDir : sandboxWorkspaceDir,
		config: params.config,
		agentId: runtime.agentId,
		rawSessionKey,
		execOverrides: params.execOverrides,
		skillsSnapshot: params.skillsSnapshot,
		assertCurrent
	});
	return {
		agentWorkspaceDir,
		scopeKey,
		skillsWorkspaceDir,
		...syncedSkills.eligibility ? { skillsEligibility: syncedSkills.eligibility } : {},
		...syncedSkills.skillUsagePaths ? { skillUsagePaths: syncedSkills.skillUsagePaths } : {},
		workspaceDir
	};
}
function resolveSandboxSession(params) {
	const rawSessionKey = params.sessionKey?.trim();
	if (!rawSessionKey) return null;
	const runtime = params.preparedRuntimeStatus ? { ...params.preparedRuntimeStatus } : resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: rawSessionKey
	});
	if (!runtime.sandboxed) return null;
	const configured = resolveSandboxConfigForAgent(params.config, runtime.agentId);
	const sessionAttachmentRoot = resolveSubagentSessionAttachmentRootDir({
		agentId: runtime.agentId,
		childSessionKey: rawSessionKey
	});
	try {
		if (fs.statSync(sessionAttachmentRoot).isDirectory()) runtime.isolationSubject = {
			kind: "session",
			sessionKey: rawSessionKey
		};
	} catch {}
	const librarySelections = params.skillsSnapshot?.librarySelections;
	if (librarySelections?.length) runtime.isolationSubject = {
		kind: "session",
		sessionKey: `${rawSessionKey}:skills:${hashTextSha256(JSON.stringify(librarySelections))}`
	};
	const configuredSandbox = librarySelections?.length ? {
		...configured,
		scope: "agent"
	} : configured;
	if (!runtime.sandboxRequired) return {
		rawSessionKey,
		runtime,
		cfg: configuredSandbox
	};
	return {
		rawSessionKey,
		runtime,
		cfg: {
			...configuredSandbox,
			scope: "agent",
			workspaceAccess: runtime.workspaceAccess
		}
	};
}
function assertSandboxSessionSecretOwnerAvailable(config, resolved) {
	if (resolved.cfg.backend !== "ssh") return;
	assertSshSandboxSecretOwnerAvailable({
		config,
		scope: resolved.cfg.scope,
		agentId: resolved.runtime.agentId
	});
}
async function prepareSandboxWorkspaceSelection(params, resolved) {
	const { rawSessionKey, runtime } = resolved;
	const localWorkspace = params.config ? await (await import("./local-workspace-CEKk2xyv.mjs")).prepareLocalSandboxWorkspace({
		cfg: params.config,
		agentId: runtime.agentId,
		sessionKey: rawSessionKey,
		workspaceDir: params.workspaceDir,
		sandbox: resolved.cfg,
		signal: readAdmittedRunOperatorAuthority(params.admittedRunContext)?.signal,
		assertCurrent: params.assertCurrent
	}) : void 0;
	const cfg = localWorkspace ? {
		...resolved.cfg,
		scope: "session",
		workspaceAccess: resolveSandboxConfigForAgent(params.config, runtime.agentId).workspaceAccess === "ro" ? "ro" : "rw"
	} : resolved.cfg;
	if (!localWorkspace && runtime.sandboxRequired && resolveSandboxConfigForAgent(params.config, runtime.agentId).workspaceAccess === "rw") sandboxLog.warn("Configured sandbox workspaceAccess \"rw\" is capped to \"ro\" for a role-required session; guests cannot share the writable agent workspace.");
	return {
		rawSessionKey,
		runtime,
		cfg,
		localWorkspace
	};
}
async function resolveProvisionedSandboxContext(params, resolved, guard) {
	const selected = await prepareSandboxWorkspaceSelection(params, resolved);
	params.assertCurrent?.();
	const { rawSessionKey, runtime, cfg, localWorkspace } = selected;
	const config = params.config;
	const allowGitHub = config && resolveAgentConfig(config, runtime.agentId)?.tools?.github?.allowInSandbox === true;
	if (allowGitHub && cfg.scope === "shared") {
		const message = `GitHub identity for agent "${runtime.agentId}" cannot enter a shared sandbox; use agent or session scope.`;
		sandboxLog.warn(message);
		throw new Error(message);
	}
	const githubIdentity = allowGitHub ? (await import("./github-tool-identity-Bn4QQkjk.mjs")).prepareGitHubToolEnvironment({
		config,
		agentId: runtime.agentId
	}) : void 0;
	const githubMount = githubIdentity ? await (async () => {
		const hostPath = githubIdentity.localIdentityEnv.GH_CONFIG_DIR;
		const stat = hostPath ? await fs$1.lstat(hostPath).catch(() => void 0) : void 0;
		if (!hostPath || !stat?.isDirectory() || stat.isSymbolicLink()) throw new Error("Sandbox GitHub identity profile is unavailable; reconnect GitHub Identity.");
		return {
			hostPath: await fs$1.realpath(hostPath),
			containerPath: SANDBOX_GITHUB_CONFIG_DIR
		};
	})() : void 0;
	if (cfg.prune.idleHours !== 0 || cfg.prune.maxAgeDays !== 0) await (await import("./prune-CyFY6keq.mjs")).maybePruneSandboxes(void 0, params.assertCurrent, guard?.assertHost);
	const { agentWorkspaceDir, scopeKey, skillsEligibility, skillUsagePaths, skillsWorkspaceDir, workspaceDir } = await ensureSandboxWorkspaceLayout(params, selected, guard);
	localWorkspace?.assertCurrent();
	const docker = await resolveSandboxDockerUser({
		backend: cfg.backend,
		docker: cfg.docker,
		workspaceDir
	});
	const resolvedCfg = docker === cfg.docker ? cfg : {
		...cfg,
		docker
	};
	const executionCfg = githubIdentity ? {
		...resolvedCfg,
		docker: {
			...docker,
			env: {
				...docker.env,
				...githubIdentity.credentialScrubEnv,
				...githubIdentity.localIdentityEnv,
				GH_CONFIG_DIR: SANDBOX_GITHUB_CONFIG_DIR
			}
		}
	} : resolvedCfg;
	let readOnlyResourceMounts = resolvedCfg.scope === "shared" ? void 0 : await (async () => {
		const hostPath = resolveSubagentSessionAttachmentRootDir({
			agentId: runtime.agentId,
			childSessionKey: rawSessionKey
		});
		try {
			if (!(await fs$1.stat(hostPath)).isDirectory()) return;
			return [{
				hostPath: await fs$1.realpath(hostPath),
				containerPath: SANDBOX_SUBAGENT_ATTACHMENTS_MOUNT
			}];
		} catch {
			return;
		}
	})();
	if (githubMount) (readOnlyResourceMounts ??= []).push(githubMount);
	const registeredRuntimeIds = await readRegisteredSandboxRuntimeIds({
		backendId: resolvedCfg.backend,
		scopeKey
	});
	const provisionBackend = () => {
		params.assertCurrent?.();
		return createSandboxBackend({
			sessionKey: rawSessionKey,
			scopeKey,
			...registeredRuntimeIds.length > 0 ? { registeredRuntimeIds } : {},
			workspaceDir,
			...localWorkspace ? { workspaceSource: "managed-worktree" } : {},
			assertRuntimeCurrent: localWorkspace?.assertCurrent ?? params.assertCurrent,
			agentWorkspaceDir,
			skillsWorkspaceDir,
			readOnlyResourceMounts,
			cfg: executionCfg,
			...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
		}, readAdmittedRunOperatorAuthority(params.admittedRunContext), githubIdentity, guard);
	};
	const backend = localWorkspace ? await localWorkspace.provision(provisionBackend) : await provisionBackend();
	params.assertCurrent?.();
	const resolvedBrowserConfig = resolvedCfg.browser.enabled ? resolveBrowserConfig(params.config?.browser, params.config) : void 0;
	const evaluateEnabled = resolvedBrowserConfig?.evaluateEnabled ?? true;
	const bridgeAuth = cfg.browser.enabled ? await (async () => {
		const cfgForAuth = params.config ?? (await import("./config/config.js")).getRuntimeConfig();
		let browserAuth = resolveBrowserControlAuth(cfgForAuth);
		try {
			params.assertCurrent?.();
			const ensured = await ensureBrowserControlAuth({ cfg: cfgForAuth });
			params.assertCurrent?.();
			browserAuth = ensured.auth;
		} catch (error) {
			params.assertCurrent?.();
			const message = error instanceof Error ? error.message : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox browser auth ensure failed: ${message}`);
		}
		return browserAuth;
	})() : void 0;
	if (resolvedCfg.browser.enabled && backend.capabilities?.browser !== true) throw new Error(`Sandbox backend "${backend.id}" does not support browser sandboxes yet.`);
	const browser = resolvedCfg.browser.enabled && backend.capabilities?.browser === true ? await ensureSandboxBrowser({
		scopeKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir,
		cfg: resolvedCfg,
		evaluateEnabled,
		bridgeAuth,
		ssrfPolicy: resolvedBrowserConfig?.ssrfPolicy,
		withWorkspace: localWorkspace?.provision,
		assertCurrent: localWorkspace?.assertCurrent ?? params.assertCurrent
	}) : null;
	const sandboxContext = {
		enabled: true,
		...runtime.sandboxRequired ? { required: true } : {},
		...localWorkspace ? {
			workspaceSource: "managed-worktree",
			workspaceCwd: localWorkspace.workspaceCwd
		} : {},
		backendId: backend.id,
		sessionKey: rawSessionKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir,
		...skillsEligibility ? { skillsEligibility } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		...readOnlyResourceMounts ? { readOnlyResourceMounts } : {},
		workspaceAccess: resolvedCfg.workspaceAccess,
		runtimeId: backend.runtimeId,
		runtimeLabel: backend.runtimeLabel,
		containerName: backend.runtimeId,
		containerWorkdir: backend.workdir,
		docker: executionCfg.docker,
		tools: resolvedCfg.tools,
		browserAllowHostControl: resolvedCfg.browser.allowHostControl,
		browser: browser ?? void 0,
		backend
	};
	sandboxContext.fsBridge = backend.createFsBridge?.({ sandbox: sandboxContext }) ?? createSandboxFsBridge({ sandbox: sandboxContext });
	if (localWorkspace) {
		localWorkspace.assertCurrent();
		(await import("./local-workspace-CEKk2xyv.mjs")).bindLocalSandboxWorkspace(sandboxContext, localWorkspace);
	}
	return sandboxContext;
}
async function resolveSandboxContext(params) {
	const resolved = resolveSandboxSession(params);
	if (!resolved) return null;
	const assertStateOwner = await captureSandboxStateOwner();
	const assertCallerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		assertStateOwner();
		assertCallerCurrent?.();
		assertStateOwner();
	};
	const ownedParams = {
		...params,
		assertCurrent
	};
	try {
		assertSandboxSessionSecretOwnerAvailable(params.config, resolved);
		const context = await resolveProvisionedSandboxContext(ownedParams, resolved, {
			assertHost: assertStateOwner,
			beforeLegacyApply: assertCurrent
		});
		assertStateOwner();
		return context;
	} catch (error) {
		if (error instanceof SandboxStateOwnerRequiredError) throw error;
		throw toSandboxProvisioningError(error, resolved.cfg.backend);
	}
}
async function ensureSandboxWorkspaceForSession(params) {
	const resolved = resolveSandboxSession(params);
	if (!resolved) return null;
	assertSandboxSessionSecretOwnerAvailable(params.config, resolved);
	const selected = await prepareSandboxWorkspaceSelection(params, resolved);
	const { rawSessionKey, cfg } = selected;
	const { agentWorkspaceDir, scopeKey, skillsEligibility, skillUsagePaths, skillsWorkspaceDir, workspaceDir } = await ensureSandboxWorkspaceLayout(params, selected);
	const containerWorkdir = getSandboxBackendWorkdirResolver(cfg.backend)?.({
		cfg,
		sessionKey: rawSessionKey,
		scopeKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir
	});
	return {
		workspaceDir,
		...containerWorkdir ? { containerWorkdir } : {},
		skillsWorkspaceDir,
		...skillsEligibility ? { skillsEligibility } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		workspaceAccess: cfg.workspaceAccess
	};
}
//#endregion
export { resolveSandboxContext as n, ensureSandboxWorkspaceForSession as t };
