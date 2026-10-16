import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./plugin-entry-2l_2QeB2.mjs";
import { i as CRABBOX_HEARTBEAT_TIMEOUT_MS } from "./crabbox-worker-timeouts-DXsC1sef.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/crabbox/src/crabbox-worker-profile.ts
const PROFILE_KEYS = /* @__PURE__ */ new Set([
	"binary",
	"class",
	"desktop",
	"idleTimeout",
	"provider",
	"setup",
	"setupEnv",
	"ttl",
	"target",
	"warmImage"
]);
const GO_DURATION_PATTERN = /^\+?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:ns|us|µs|μs|ms|s|m|h))+$/u;
const GO_DURATION_TOKEN_PATTERN = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|μs|ms|s|m|h)/gu;
const MAX_GO_DURATION_NANOSECONDS = 9223372036854775807n;
const CRABBOX_LEASE_ID_DOMAIN = "openclaw:crabbox-worker-lease-id:v1\0";
const LEGACY_PROVISION_OPERATION_ID_PATTERN = /^provision:[a-f0-9]{64}$/u;
const DURATION_UNIT_NANOSECONDS = {
	h: 3600000000000n,
	m: 60000000000n,
	s: 1000000000n,
	ms: 1000000n,
	us: 1000n,
	µs: 1000n,
	μs: 1000n,
	ns: 1n
};
const MAX_CRABBOX_MACHINE_CLASS_LENGTH = 128;
const MAX_CRABBOX_MACHINE_OPTIONS = 64;
const CRABBOX_ENROLLABLE_TARGETS = [
	"linux",
	"windows/wsl2",
	"windows/normal",
	"macos"
];
const CRABBOX_OS_LABELS = {
	linux: "Linux",
	"windows/wsl2": "Windows (WSL2)",
	"windows/normal": "Windows",
	macos: "macOS"
};
function parseCrabboxOperatingSystem(value) {
	if (value === void 0) return "linux";
	const target = normalizeOptionalString(value);
	const supported = CRABBOX_ENROLLABLE_TARGETS.find((os) => os === target);
	if (supported) return supported;
	throw new WorkerProviderError(`Crabbox target must be ${CRABBOX_ENROLLABLE_TARGETS.join(" or ")}`);
}
const CRABBOX_DESKTOP_PROVIDERS = /* @__PURE__ */ new Set([
	"aws",
	"azure",
	"hetzner"
]);
const CRABBOX_WORKER_PROVIDER_ID = "crabbox";
function requirePositiveDuration(value, key) {
	const duration = normalizeOptionalString(value);
	const nanoseconds = duration ? parsePositiveGoDurationNanoseconds(duration) : void 0;
	if (!duration || nanoseconds === void 0) throw new WorkerProviderError(`Crabbox profile ${key} must be a positive Go duration such as 60m`);
	return {
		duration,
		milliseconds: Number(nanoseconds) / 1e6
	};
}
function parsePositiveGoDurationNanoseconds(duration) {
	if (!GO_DURATION_PATTERN.test(duration)) return;
	let total = 0n;
	for (const match of duration.matchAll(GO_DURATION_TOKEN_PATTERN)) {
		const numberText = match[1];
		const unit = match[2] ? DURATION_UNIT_NANOSECONDS[match[2]] : void 0;
		if (!numberText || unit === void 0) return;
		const [wholeText = "", fractionText = ""] = numberText.split(".", 2);
		const whole = wholeText.replace(/^0+/u, "") || "0";
		if (whole.length > 19) return;
		total += BigInt(whole) * unit;
		const fraction = fractionText.slice(0, 18);
		if (fraction) total += BigInt(fraction) * unit / 10n ** BigInt(fraction.length);
		if (total > MAX_GO_DURATION_NANOSECONDS) return;
	}
	return total > 0n ? total : void 0;
}
function heartbeatIntervalMs(idleTimeoutMs) {
	const referenceIntervalMs = Math.max(5e3, Math.min(6e4, idleTimeoutMs / 3));
	return Math.min(referenceIntervalMs, Math.max(1, Math.floor(idleTimeoutMs / 2)));
}
function parseCrabboxProfile(profile) {
	for (const key of Object.keys(profile)) if (!PROFILE_KEYS.has(key)) throw new WorkerProviderError(`unknown Crabbox profile setting: ${key}`);
	const provider = normalizeOptionalString(profile.provider)?.toLowerCase();
	const machineClass = normalizeOptionalString(profile.class);
	const target = parseCrabboxOperatingSystem(profile.target);
	if (!provider) throw new WorkerProviderError("Crabbox profile provider must be a non-empty string");
	if (profile.class !== void 0 && !machineClass) throw new WorkerProviderError("Crabbox profile class must be a non-empty string");
	const { duration: ttl } = requirePositiveDuration(profile.ttl, "ttl");
	const { duration: idleTimeout, milliseconds: idleTimeoutMs } = requirePositiveDuration(profile.idleTimeout, "idleTimeout");
	const binary = normalizeOptionalString(profile.binary);
	if (profile.binary !== void 0 && !binary) throw new WorkerProviderError("Crabbox profile binary must be a non-empty string");
	if (binary && !path.isAbsolute(binary)) throw new WorkerProviderError("Crabbox profile binary must be an absolute path");
	const setup = normalizeOptionalString(profile.setup);
	if (profile.setup !== void 0 && !setup) throw new WorkerProviderError("Crabbox profile setup must be a non-empty command string");
	let setupEnv;
	if (profile.setupEnv !== void 0) {
		if (!Array.isArray(profile.setupEnv)) throw new WorkerProviderError("Crabbox profile setupEnv must be an array");
		if (profile.setupEnv.length > 16) throw new WorkerProviderError("Crabbox profile setupEnv must contain at most 16 names");
		setupEnv = profile.setupEnv.map((name) => {
			if (typeof name !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/u.test(name)) throw new WorkerProviderError("Crabbox profile setupEnv must contain only valid POSIX environment variable names");
			if (name === "CRABBOX_ENV_ALLOW") throw new WorkerProviderError(`Crabbox profile setupEnv name ${name} is reserved`);
			return name;
		});
		if (new Set(setupEnv).size !== setupEnv.length) throw new WorkerProviderError("Crabbox profile setupEnv must not contain duplicate names");
		if (setupEnv.length > 0 && !setup) throw new WorkerProviderError("Crabbox profile setupEnv requires setup");
	}
	const desktop = profile.desktop;
	if (desktop !== void 0 && typeof desktop !== "boolean") throw new WorkerProviderError("Crabbox profile desktop must be a boolean");
	if (desktop && !CRABBOX_DESKTOP_PROVIDERS.has(provider)) throw new WorkerProviderError("Crabbox desktop profiles support only AWS, Azure, and coordinator-backed Hetzner");
	const warmImage = profile.warmImage;
	if (warmImage !== void 0 && typeof warmImage !== "boolean") throw new WorkerProviderError("Crabbox profile warmImage must be a boolean");
	return {
		binary,
		class: machineClass,
		desktop,
		heartbeatIntervalMs: heartbeatIntervalMs(idleTimeoutMs),
		heartbeatTimeoutMs: Math.min(CRABBOX_HEARTBEAT_TIMEOUT_MS, Math.max(1, Math.floor(idleTimeoutMs / 2))),
		idleTimeout,
		idleTimeoutMs,
		provider,
		setup,
		setupEnv,
		ttl,
		target,
		warmImage
	};
}
function resolveCrabboxProfileSetupEnv(setupEnv) {
	if (!setupEnv?.length) return;
	return Object.fromEntries(setupEnv.map((name) => {
		const value = process.env[name];
		if (!Object.hasOwn(process.env, name) || value === void 0) throw new Error(`Crabbox profile setupEnv variable is missing: ${name}`);
		return [name, value];
	}));
}
function resolveCrabboxWarmImageProfile(profile, machineClass = profile.class, target = profile.target) {
	if (target === "windows/wsl2" && profile.desktop) throw new WorkerProviderError("Crabbox WSL2 does not support desktops; select native Windows for a desktop viewer");
	return {
		...profile,
		class: machineClass,
		target,
		warmImage: target === "linux" && (profile.warmImage ?? (machineClass !== void 0 && !profile.setupEnv?.length))
	};
}
function resolveCrabboxWarmImageProfileKey(profile, projectKey) {
	return createHash("sha256").update(JSON.stringify({
		backendProvider: profile.provider,
		...profile.target !== "linux" ? { target: profile.target } : {},
		setup: profile.setup ?? "",
		setupEnvKeys: [...profile.setupEnv ?? []].toSorted(),
		desktop: profile.desktop ?? false,
		machineClass: profile.class,
		...projectKey ? { projectKey } : {}
	})).digest("hex");
}
function resolveCrabboxProvisionProfile(profile, requestedClassValue, requestedOsValue) {
	const configured = parseCrabboxProfile(profile);
	const requestedClass = normalizeOptionalString(requestedClassValue);
	if (requestedClassValue !== void 0 && (!requestedClass || requestedClass.length > MAX_CRABBOX_MACHINE_CLASS_LENGTH)) throw new WorkerProviderError("Crabbox machine class must be a non-empty string of at most 128 characters");
	const resolved = resolveCrabboxWarmImageProfile(configured, requestedClass ?? configured.class, requestedOsValue === void 0 ? configured.target : parseCrabboxOperatingSystem(requestedOsValue));
	let provisionProfile;
	if (!resolved.warmImage) provisionProfile = {
		...resolved,
		warmImage: false
	};
	else {
		if (!resolved.class) throw new WorkerProviderError("Crabbox warmImage requires a configured class or a placement machine class");
		provisionProfile = {
			...resolved,
			class: resolved.class,
			warmImage: true
		};
	}
	return {
		profile: provisionProfile,
		forwardedEnv: resolveCrabboxProfileSetupEnv(resolved.setupEnv)
	};
}
function listCrabboxMachineOptions(configuredClass, shapes = []) {
	const seen = /* @__PURE__ */ new Set();
	const options = [];
	for (const os of CRABBOX_ENROLLABLE_TARGETS) {
		const candidates = shapes.filter((shape) => {
			const key = `${shape.os}:${shape.class}`;
			if (shape.os !== os || shape.class.length > MAX_CRABBOX_MACHINE_CLASS_LENGTH || seen.has(key)) return false;
			seen.add(key);
			return true;
		});
		if (candidates.length === 0) continue;
		const remaining = MAX_CRABBOX_MACHINE_OPTIONS - options.length;
		const reserveDefault = configuredClass !== void 0 && !candidates.slice(0, remaining).some((shape) => shape.class === configuredClass);
		for (const shape of candidates.slice(0, Math.max(0, remaining - Number(reserveDefault)))) options.push({
			id: shape.class,
			os,
			label: shape.class.replace(/^./u, (initial) => initial.toUpperCase()),
			...shape.cpu !== void 0 ? { cpu: shape.cpu } : {},
			...shape.memoryGb !== void 0 ? { memoryGb: shape.memoryGb } : {},
			...shape.class === configuredClass ? { default: true } : {}
		});
		if (reserveDefault && remaining > 0 && configuredClass !== void 0) options.push({
			id: configuredClass,
			os,
			label: configuredClass,
			default: true
		});
	}
	return options;
}
function buildCrabboxAllocationArgs(profile, leaseId, slug) {
	const args = [
		"--provider",
		profile.provider,
		"--network",
		"public",
		"--tailscale=false",
		...profile.class ? ["--class", profile.class] : [],
		...profile.target === "linux" ? ["--target", "linux"] : [],
		...profile.target === "windows/wsl2" ? [
			"--target",
			"windows",
			"--windows-mode",
			"wsl2"
		] : [],
		...profile.target === "windows/normal" ? [
			"--target",
			"windows",
			"--windows-mode",
			"normal"
		] : [],
		...profile.target === "macos" ? [
			"--target",
			"macos",
			"--market",
			"on-demand"
		] : [],
		"--ttl",
		profile.ttl,
		"--idle-timeout",
		profile.idleTimeout,
		"--lease-id",
		leaseId,
		"--slug",
		slug,
		"--keep=true"
	];
	if (profile.desktop) {
		args.push("--desktop");
		if (profile.target === "linux") args.push("--browser", "--desktop-env", "xfce");
	}
	return args;
}
function resolveOpenClawRoot(pluginRoot) {
	if (!pluginRoot) return process.cwd();
	const extensionsDir = path.dirname(pluginRoot);
	if (path.basename(extensionsDir) !== "extensions") return process.cwd();
	const extensionParent = path.dirname(extensionsDir);
	return path.basename(extensionParent) === "dist" || path.basename(extensionParent) === "dist-runtime" ? path.dirname(extensionParent) : extensionParent;
}
function operationSlug(operationId) {
	return `openclaw-${createHash("sha256").update(operationId).digest("hex").slice(0, 32)}`;
}
const LEASE_ID_PATTERN = /^(?:cbx_|tbx_)[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/u;
function assertCrabboxLeaseId(leaseId) {
	if (!LEASE_ID_PATTERN.test(leaseId)) throw new Error("Crabbox lease id is invalid");
}
function operationLeaseId(operationId) {
	if (!operationId.trim()) throw new Error("Crabbox provision requires an operation id");
	if (LEGACY_PROVISION_OPERATION_ID_PATTERN.test(operationId)) throw new Error("Legacy Crabbox provision state cannot be replayed safely; clean up any prior lease and dispatch again");
	return `cbx_${createHash("sha256").update(CRABBOX_LEASE_ID_DOMAIN).update(operationId).digest("hex").slice(0, 12)}`;
}
//#endregion
export { buildCrabboxAllocationArgs as a, operationSlug as c, resolveCrabboxProvisionProfile as d, resolveCrabboxWarmImageProfile as f, assertCrabboxLeaseId as i, parseCrabboxOperatingSystem as l, resolveOpenClawRoot as m, CRABBOX_OS_LABELS as n, listCrabboxMachineOptions as o, resolveCrabboxWarmImageProfileKey as p, CRABBOX_WORKER_PROVIDER_ID as r, operationLeaseId as s, CRABBOX_ENROLLABLE_TARGETS as t, parseCrabboxProfile as u };
