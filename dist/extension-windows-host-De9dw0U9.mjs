import { n as assertNoSymlinkParents } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { v as readSecureFile } from "./fs-safe-BAPek8At.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Nt as array, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { a as inspectPathPermissions } from "./permissions-DOmAO-Zd.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { r as isValidProfileName } from "./profiles-CQrkMz7M.mjs";
import { n as BROWSER_NATIVE_HOST_NAME, t as BROWSER_NATIVE_HOST_DESCRIPTION } from "./extension-native-host.constants-CchS6g7H.mjs";
import { f as parseStrictJsonObject } from "./auth-v2-B-IXoFi_.mjs";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/extension-windows-contract.ts
const WINDOWS_MANAGEMENT_LIMIT = 32768;
const WINDOWS_NATIVE_EXE = "OpenClaw.BrowserBootstrap.exe";
const WINDOWS_BINDING = "OpenClaw.BrowserBootstrap.binding.json";
const WINDOWS_RECEIPT = "OpenClaw.BrowserBootstrap.owned.json";
const WINDOWS_MANIFEST = BROWSER_NATIVE_HOST_NAME + ".json";
const WINDOWS_OFFICIAL_ORIGIN = "chrome-extension://kcdjddhmeafeomebliikmbpblkmkfoig/";
const windowsPathKey = (value) => value.replace(/[A-Z]/g, (c) => c.toLowerCase());
const sameWindowsPath = (a, b) => windowsPathKey(a) === windowsPathKey(b);
const wellFormed = (value) => !/[\uD800-\uDFFF]/u.test(value);
function isWindowsNativePath(value) {
	if (!value || value.length > 4096 || !wellFormed(value) || !/^[a-z]:\\/i.test(value) || value !== path.win32.normalize(value) || value.includes("/") || value.slice(2).includes(":")) return false;
	if (value.length > 3 && value.endsWith("\\")) return false;
	return value.slice(3).split("\\").filter(Boolean).every((part) => Array.from(part).every((character) => character.charCodeAt(0) >= 32) && !/[<>:"|?*]/u.test(part) && part.trim() === part && !part.endsWith(".") && !/^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³]|conin\$|conout\$)(?:\.|$)/i.test(part));
}
const windowsPathSchema = string().refine(isWindowsNativePath);
const generationSchema = string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).refine((s) => s !== "00000000-0000-0000-0000-000000000000");
const sidSchema = string().max(184).refine((value) => {
	if (!/^S-1-(?:0|[1-9][0-9]*)(?:-(?:0|[1-9][0-9]*)){1,15}$/.test(value)) return false;
	const parts = value.split("-").slice(2).map(BigInt);
	return parts[0] <= 281474976710655n && parts.slice(1).every((v) => v <= 4294967295n) && ![
		"S-1-5-18",
		"S-1-5-19",
		"S-1-5-20"
	].includes(value);
});
const originsSchema = array(string().regex(/^chrome-extension:\/\/[a-p]{32}\/$/)).min(1).max(32).refine((values) => values.includes("chrome-extension://kcdjddhmeafeomebliikmbpblkmkfoig/") && values.every((value, i) => i === 0 || values[i - 1] < value));
const nativeWindowsContextSchema = strictObject({
	nodePath: windowsPathSchema.refine((v) => windowsPathKey(path.win32.basename(v)) === "node.exe"),
	cliPath: windowsPathSchema.refine((v) => windowsPathKey(path.win32.basename(v)) === "openclaw.mjs"),
	stateDir: windowsPathSchema,
	configPath: windowsPathSchema,
	browserProfile: string().refine(isValidProfileName)
});
const modeSchema = _enum(["companion-managed-wsl", "native-windows-cli"]);
const actionSchema = _enum([
	"inspect",
	"install",
	"uninstall"
]);
const storeActionSchema = _enum([
	"preserve",
	"request",
	"remove"
]);
const modeContext = (value) => value.mode === "native-windows-cli" ? value.context !== null : value.context === null && value.expectedOrigins.length === 1 && value.expectedOrigins[0] === "chrome-extension://kcdjddhmeafeomebliikmbpblkmkfoig/";
const managementRequestSchema = strictObject({
	v: literal(1),
	action: actionSchema,
	mode: modeSchema,
	context: nativeWindowsContextSchema.nullable(),
	expectedOrigins: originsSchema,
	store: storeActionSchema
}).refine(modeContext).refine((r) => r.action === "inspect" ? r.store === "preserve" : r.action === "install" ? r.store !== "remove" : r.store !== "request");
const installationSchema = strictObject({
	generation: generationSchema,
	manifestPath: windowsPathSchema,
	launcherPath: windowsPathSchema,
	bindingPath: windowsPathSchema,
	receiptPath: windowsPathSchema
}).refine((v) => {
	const dir = path.win32.dirname(v.manifestPath);
	return path.win32.basename(dir) === v.generation && v.manifestPath === path.win32.join(dir, WINDOWS_MANIFEST) && v.launcherPath === path.win32.join(dir, "OpenClaw.BrowserBootstrap.exe") && v.bindingPath === path.win32.join(dir, "OpenClaw.BrowserBootstrap.binding.json") && v.receiptPath === path.win32.join(dir, "OpenClaw.BrowserBootstrap.owned.json");
});
const managementResponseSchema = strictObject({
	v: literal(1),
	ok: boolean(),
	code: _enum([
		"ok",
		"invalid_request",
		"context_conflict",
		"foreign_registration",
		"unsafe_path",
		"unsafe_acl",
		"binding_invalid",
		"browser_control_disabled",
		"transport_failed",
		"busy",
		"cancelled",
		"io_error",
		"platform_unsupported"
	]),
	registration: _enum([
		"missing",
		"owned",
		"foreign",
		"invalid"
	]).nullable(),
	mode: modeSchema.nullable(),
	store: _enum([
		"missing",
		"requested",
		"foreign",
		"invalid"
	]).nullable(),
	installation: installationSchema.nullable()
}).refine((r) => r.ok === (r.code === "ok")).refine((r) => r.registration === "owned" ? r.mode !== null : r.mode === null && r.installation === null).refine((r) => ![
	"invalid_request",
	"platform_unsupported",
	"busy"
].includes(r.code) || [
	r.registration,
	r.mode,
	r.store,
	r.installation
].every((v) => v === null));
const bindingSchema = strictObject({
	version: literal(1),
	mode: modeSchema,
	manifestPath: windowsPathSchema,
	expectedOrigins: originsSchema,
	nativeWindows: nativeWindowsContextSchema.nullable()
}).refine((b) => modeContext({
	...b,
	context: b.nativeWindows
}));
const receiptSchema = strictObject({
	owner: literal("openclaw-browser-native-host"),
	version: literal(1),
	generation: generationSchema,
	ownerSid: sidSchema,
	transportVerified: literal(true),
	executableSha256: string().regex(/^[a-f0-9]{64}$/),
	bindingSha256: string().regex(/^[a-f0-9]{64}$/),
	manifestSha256: string().regex(/^[a-f0-9]{64}$/)
});
const windowsManifestSchema = strictObject({
	name: literal(BROWSER_NATIVE_HOST_NAME),
	description: literal(BROWSER_NATIVE_HOST_DESCRIPTION),
	path: windowsPathSchema,
	type: literal("stdio"),
	allowed_origins: originsSchema
});
/** Reuse the browser's duplicate-key owner; version tokens and UTF-8 are ABI-specific. */
function parseWindowsJson(bytes, compact = false) {
	if (!bytes.length || bytes.length > 32768 || bytes.subarray(0, 3).equals(Buffer.from([
		239,
		187,
		191
	]))) throw new Error("Invalid Windows management JSON");
	const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	const tokens = /"(?:\\.|[^"\\])*"/g;
	let invalidString = false;
	const outside = text.replace(tokens, (token) => {
		const value = JSON.parse(token);
		if (typeof value !== "string" || !wellFormed(value)) invalidString = true;
		return "\"\"";
	});
	if (invalidString || compact && /\s/u.test(outside) || [...outside.matchAll(/-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/g)].some((m) => m[0] !== "1")) throw new Error("Invalid Windows management JSON");
	const result = parseStrictJsonObject(text);
	if (!result) throw new Error("Invalid Windows management JSON");
	return result;
}
function parseWindowsManagementResponse(bytes, exitCode, request) {
	if (bytes.length > 32768 || bytes.at(-1) !== 10) throw new Error("Invalid management frame");
	const r = managementResponseSchema.parse(parseWindowsJson(bytes.subarray(0, -1), true));
	if (exitCode !== (r.ok ? 0 : 1) || r.installation && r.mode !== request.mode || r.code === "context_conflict" && r.installation) throw new Error("Invalid management receipt");
	if (r.ok) {
		const owned = r.registration === "owned" && r.mode === request.mode && r.installation !== null;
		if (request.action === "install" && (!owned || request.store === "request" && r.store !== "requested")) throw new Error("Incomplete install");
		if (request.action === "uninstall" && (r.registration !== "missing" || request.store === "remove" && r.store !== "missing")) throw new Error("Incomplete uninstall");
		if (request.action === "inspect" && (!owned && r.registration !== "missing" || !["missing", "requested"].includes(r.store ?? ""))) throw new Error("Incomplete inspection");
	}
	return r;
}
//#endregion
//#region extensions/browser/src/browser/extension-windows-context.ts
const hash$1 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function matchesWindowsContext(a, b) {
	return a.browserProfile === b.browserProfile && [
		"nodePath",
		"cliPath",
		"stateDir",
		"configPath"
	].every((key) => {
		switch (key) {
			case "nodePath": return sameWindowsPath(a.nodePath, b.nodePath);
			case "cliPath": return sameWindowsPath(a.cliPath, b.cliPath);
			case "stateDir": return sameWindowsPath(a.stateDir, b.stateDir);
			default: return sameWindowsPath(a.configPath, b.configPath);
		}
	});
}
/** Descriptor/receipt are evidence, never permission to skip current OS admission. */
async function readWindowsNativeGeneration(manifestPath, ops) {
	const identity = await ops.identity();
	const root = path.win32.join(identity.localAppData, "OpenClawTray", "browser-native", "generations");
	const dir = path.win32.dirname(manifestPath);
	const installation = installationSchema.parse({
		generation: path.win32.basename(dir),
		manifestPath,
		launcherPath: path.win32.join(dir, WINDOWS_NATIVE_EXE),
		bindingPath: path.win32.join(dir, WINDOWS_BINDING),
		receiptPath: path.win32.join(dir, WINDOWS_RECEIPT)
	});
	if (!sameWindowsPath(path.win32.dirname(dir), root)) throw new Error("Windows generation is outside the fixed root");
	for (const directory of [root, dir]) await ops.assertPath(directory, {
		kind: "directory",
		private: true
	});
	const files = await ops.listFiles(dir);
	if (files.length !== 4 || files.some((name) => ![
		"OpenClaw.BrowserBootstrap.exe",
		"OpenClaw.BrowserBootstrap.binding.json",
		"OpenClaw.BrowserBootstrap.owned.json",
		WINDOWS_MANIFEST
	].includes(name))) throw new Error("Windows generation contains foreign files");
	const [receiptBytes, bindingBytes, manifestBytes, image] = await Promise.all([
		ops.readFile(installation.receiptPath, 32768),
		ops.readFile(installation.bindingPath, 32768),
		ops.readFile(installation.manifestPath, 32768),
		ops.readFile(installation.launcherPath, 268435456)
	]);
	const receipt = receiptSchema.parse(parseWindowsJson(receiptBytes));
	const binding = bindingSchema.parse(parseWindowsJson(bindingBytes));
	const manifest = windowsManifestSchema.parse(parseWindowsJson(manifestBytes));
	if (receipt.ownerSid !== identity.sid || receipt.generation !== installation.generation || receipt.bindingSha256 !== hash$1(bindingBytes) || receipt.manifestSha256 !== hash$1(manifestBytes) || receipt.executableSha256 !== hash$1(image) || binding.manifestPath !== installation.manifestPath || manifest.path !== installation.launcherPath || JSON.stringify(binding.expectedOrigins) !== JSON.stringify(manifest.allowed_origins)) throw new Error("Windows generation integrity mismatch");
	return {
		installation,
		binding
	};
}
async function admitWindowsNativeRuntime(params, context, ops) {
	const owned = await readWindowsNativeGeneration(params.manifestPath, ops);
	if (owned.binding.mode !== "native-windows-cli" || !owned.binding.nativeWindows || !matchesWindowsContext(owned.binding.nativeWindows, context) || !sameWindowsPath(owned.installation.launcherPath, params.launcherPath) || JSON.stringify(owned.binding.expectedOrigins) !== JSON.stringify(params.expectedOrigins)) throw new Error("Windows native execution context mismatch");
	await ops.assertPath(context.nodePath, {
		kind: "file",
		private: false
	});
	await ops.assertPath(context.cliPath, {
		kind: "file",
		private: false
	});
	await ops.assertPath(context.stateDir, {
		kind: "directory",
		private: true,
		allowMissing: true
	});
	await ops.assertPath(context.configPath, {
		kind: "file",
		private: true,
		allowMissing: true
	});
	return context.browserProfile;
}
//#endregion
//#region extensions/browser/src/browser/extension-windows-management.ts
/** No unverified transport output is ever projected as registration state. */
var WindowsManagementTransportError = class extends Error {
	constructor(started) {
		super(started ? "Windows setup outcome is unknown. Inspect the same local context before retrying; no fallback was attempted." : "Windows bootstrap management is unavailable. Install a compatible helper; no fallback was attempted.");
		this.outcome = started ? "unknown" : "not-started";
	}
};
async function runWindowsManagement(executable, request, options = {}) {
	const admitted = managementRequestSchema.parse(request);
	const input = JSON.stringify(admitted);
	if (Buffer.byteLength(input) > 32768) throw new WindowsManagementTransportError(false);
	options.signal?.throwIfAborted();
	const env = Object.fromEntries(Object.entries(options.env ?? process.env).filter(([key]) => !/^(NODE_|OPENCLAW_)/i.test(key)));
	const result = await (options.run ?? runCommandBuffered)([executable, "--manage"], {
		baseEnv: env,
		input,
		timeoutMs: 6e4,
		signal: options.signal,
		maxOutputBytes: {
			stdout: WINDOWS_MANAGEMENT_LIMIT,
			stderr: 1
		},
		maxCombinedOutputBytes: WINDOWS_MANAGEMENT_LIMIT,
		killProcessTree: true,
		terminateOnOutputError: true
	}).catch(() => {
		throw new WindowsManagementTransportError(true);
	});
	if (result.termination !== "exit" || result.signal || result.stderr.length || options.signal?.aborted) throw new WindowsManagementTransportError(true);
	try {
		return parseWindowsManagementResponse(result.stdout, result.code, admitted);
	} catch {
		throw new WindowsManagementTransportError(true);
	}
}
//#endregion
//#region extensions/browser/src/browser/extension-windows-platform.ts
const IDENTITY_SCRIPT = String.raw`$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
[Console]::Out.Write((ConvertTo-Json -Compress -InputObject ([ordered]@{
localAppData = [Environment]::GetFolderPath([Environment+SpecialFolder]::LocalApplicationData)
sid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
})))`;
const identitySchema = strictObject({
	localAppData: windowsPathSchema,
	sid: sidSchema
});
function createWindowsNativePlatform(env = process.env) {
	const inspect = async (script) => {
		const executable = path.win32.join(env.SystemRoot || "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
		if (process.platform !== "win32" || !isWindowsNativePath(executable)) throw new Error("Windows OS inspection unavailable");
		await assertNoSymlinkParents({
			rootDir: path.win32.parse(executable).root,
			targetPath: executable
		});
		if (!(await fs.lstat(executable)).isFile()) throw new Error("Windows OS inspection unavailable");
		const { stdout } = await promisify(execFile)(executable, [
			"-NoLogo",
			"-NoProfile",
			"-NonInteractive",
			"-EncodedCommand",
			Buffer.from(script, "utf16le").toString("base64")
		], {
			env,
			windowsHide: true,
			timeout: 5e3,
			maxBuffer: 32768
		});
		return stdout;
	};
	const assertParents = async (target) => {
		const encoded = Buffer.from(path.win32.dirname(target)).toString("base64");
		await inspect(String.raw`$ErrorActionPreference='Stop'
$p=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('` + encoded + String.raw`'))
$sid=[Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$trusted=@($sid,'S-1-5-18','S-1-5-32-544','S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464')
while($p){
 $acl=[IO.Directory]::GetAccessControl($p)
 if($acl.GetOwner([Security.Principal.SecurityIdentifier]).Value -notin $trusted){throw 'Unsafe ancestor'}
 $raw=[Security.AccessControl.RawSecurityDescriptor]::new($acl.GetSecurityDescriptorBinaryForm(),0)
 if($null -eq $raw.DiscretionaryAcl){throw 'Unverified ancestor'}
 foreach($ace in $raw.DiscretionaryAcl){
  if($ace -isnot [Security.AccessControl.CommonAce] -or $ace.IsCallback -or [int]$ace.AceType -notin @(0,1)){throw 'Unverified ancestor'}
  if([int]$ace.AceType -eq 0 -and ([int]$ace.AceFlags -band 8) -eq 0 -and $ace.SecurityIdentifier.Value -notin $trusted -and (([long]$ace.AccessMask -band 0x500d0150) -ne 0)){throw 'Unsafe ancestor writer'}
 }
 $parent=[IO.Directory]::GetParent($p)
 $p=if($null -eq $parent){$null}else{$parent.FullName}
}
`);
	};
	const assertPath = async (target, options) => {
		if (process.platform !== "win32" || !isWindowsNativePath(target)) throw new Error("Windows path unavailable");
		await assertNoSymlinkParents({
			rootDir: path.win32.parse(target).root,
			targetPath: target,
			allowMissing: options.allowMissing
		});
		const info = await fs.lstat(target).catch((error) => {
			if (options.allowMissing && error instanceof Error && "code" in error && error.code === "ENOENT") return null;
			throw error;
		});
		if (!info) {
			const parent = path.win32.dirname(target);
			if (parent === target) throw new Error("Windows path unavailable");
			await assertPath(parent, {
				kind: "directory",
				private: false,
				allowMissing: true
			});
			return;
		}
		if (info.isSymbolicLink() || (options.kind === "file" ? !info.isFile() : !info.isDirectory()) || !sameWindowsPath(await fs.realpath(target), target)) throw new Error("Windows path redirected");
		const acl = await inspectPathPermissions(target, {
			platform: "win32",
			env
		});
		if (!acl.ok || acl.source !== "windows-acl" || acl.ownerTrusted !== true || acl.groupWritable || acl.worldWritable || options.private && (acl.groupReadable || acl.worldReadable)) throw new Error("Windows path ownership unavailable");
		if (path.win32.dirname(target) !== target) await assertParents(target);
	};
	return {
		assertPath,
		async identity() {
			if (process.platform !== "win32") throw new Error("Windows identity unavailable");
			const stdout = await inspect(IDENTITY_SCRIPT);
			const value = JSON.parse(stdout);
			return identitySchema.parse(value);
		},
		async readFile(target, maxBytes, privateFile = true) {
			await assertPath(target, {
				kind: "file",
				private: privateFile
			});
			const { buffer } = await readSecureFile({
				filePath: target,
				permissions: { allowReadableByOthers: !privateFile },
				io: { maxBytes }
			});
			return buffer;
		},
		listFiles: (directory) => fs.readdir(directory),
		realpath: (target) => fs.realpath(target)
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-windows-host.ts
const products = [
	["chrome", "Google Chrome"],
	["chromium", "Chromium"],
	["chrome-for-testing", "Google Chrome for Testing"]
];
const operations = (deps) => deps.windowsNative?.platform ?? createWindowsNativePlatform(deps.env);
async function resolveCliPath(pluginRoot) {
	if (!pluginRoot) return await fs.realpath(process.argv[1]);
	for (let cursor = path.resolve(pluginRoot);;) {
		const candidate = path.join(cursor, "openclaw.mjs");
		try {
			return await fs.realpath(candidate);
		} catch (error) {
			if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) throw new Error("Local Windows CLI unavailable");
		cursor = parent;
	}
}
async function selectedContext(deps, profile, pluginRoot) {
	if (deps.windowsNative?.context) return nativeWindowsContextSchema.parse({
		...deps.windowsNative.context,
		browserProfile: profile
	});
	const env = deps.env ?? process.env;
	const stateDir = deps.stateDir ?? resolveStateDir(env);
	return nativeWindowsContextSchema.parse({
		nodePath: await operations(deps).realpath(deps.nodePath ?? process.execPath),
		cliPath: await operations(deps).realpath(deps.windowsNative?.cliPath ?? await resolveCliPath(pluginRoot)),
		stateDir,
		configPath: resolveConfigPath(env, stateDir),
		browserProfile: profile
	});
}
async function executableFor(pluginRoot, explicit, deps) {
	const ops = operations(deps);
	const identity = await ops.identity();
	const candidates = explicit ? [explicit] : [...pluginRoot ? [path.win32.join(pluginRoot, "native-host", "win32-" + process.arch, WINDOWS_NATIVE_EXE)] : [], path.win32.join(identity.localAppData, "OpenClawTray", "tools", "browser-bootstrap", WINDOWS_NATIVE_EXE)];
	for (const candidate of candidates) try {
		const canonical = await ops.realpath(candidate);
		await ops.readFile(canonical, 268435456, false);
		return canonical;
	} catch (error) {
		if (explicit || !(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
	}
	throw new WindowsManagementTransportError(false);
}
const managementObservations = /* @__PURE__ */ new WeakMap();
function windowsManagementObservation(registrations) {
	return managementObservations.get(registrations);
}
function projection(response, origins, issue, browserProfile) {
	const nativeIssue = issue ?? (!response?.ok && response?.code !== "browser_control_disabled" && !(response?.registration === "owned" && response.code === "foreign_registration" && response.store === "foreign") ? "Windows management reported " + (response?.code ?? "an unknown outcome") : void 0);
	const result = {
		registrations: products.map(([product, browser]) => ({
			product,
			browser,
			manifestPath: "Windows current-user native registration",
			state: response?.registration ?? null,
			extensionIds: response?.installation ? origins.map((o) => o.slice(19, -1)) : [],
			issue: nativeIssue,
			browserProfile
		})),
		storeInstallRequests: [{
			browser: "Google Chrome",
			path: "Windows current-user Chrome Store request",
			state: response?.store ?? null,
			...!response?.ok ? { issue: issue ?? "Windows management reported " + (response?.code ?? "an unknown outcome") } : {}
		}],
		issues: issue ? [issue] : response && !response.ok ? ["Windows management reported " + response.code] : []
	};
	managementObservations.set(result.registrations, {
		response,
		browserProfile
	});
	return result;
}
async function operate(params) {
	let started = false;
	try {
		params.signal?.throwIfAborted();
		const deps = params.deps;
		const context = await selectedContext(deps, params.browserProfile ?? "chrome", params.pluginRoot);
		const origins = originsSchema.parse([.../* @__PURE__ */ new Set([WINDOWS_OFFICIAL_ORIGIN, ...(params.extensionIds ?? []).map((id) => "chrome-extension://" + id + "/")])].toSorted());
		const request = managementRequestSchema.parse({
			v: 1,
			mode: "native-windows-cli",
			context,
			action: params.action,
			store: params.store,
			expectedOrigins: origins
		});
		const executable = await executableFor(params.pluginRoot, params.executable ?? deps.windowsNative?.executable, deps);
		params.signal?.throwIfAborted();
		started = true;
		const response = await (deps.windowsNative?.manage ?? runWindowsManagement)(executable, request, {
			env: deps.env,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		let browserProfile;
		if (response.installation) {
			const owned = await readWindowsNativeGeneration(response.installation.manifestPath, operations(deps));
			if (JSON.stringify(owned.installation) !== JSON.stringify(response.installation) || owned.binding.mode !== "native-windows-cli" || !owned.binding.nativeWindows || !matchesWindowsContext(owned.binding.nativeWindows, context) || JSON.stringify(owned.binding.expectedOrigins) !== JSON.stringify(origins)) throw new WindowsManagementTransportError(true);
			browserProfile = owned.binding.nativeWindows.browserProfile;
		}
		params.signal?.throwIfAborted();
		return {
			response,
			origins,
			browserProfile
		};
	} catch (error) {
		if (error instanceof WindowsManagementTransportError) throw error;
		throw new WindowsManagementTransportError(started);
	}
}
async function installWindowsNativeHost(params) {
	const { response, origins, browserProfile } = await operate({
		...params,
		action: "install",
		store: params.requestStoreInstall === true ? "request" : "preserve"
	});
	return projection(response, origins, void 0, browserProfile);
}
async function inspectWindowsNativeHosts(params = {}) {
	try {
		const { response, origins, browserProfile } = await operate({
			...params,
			deps: params.deps ?? {},
			action: "inspect",
			store: "preserve"
		});
		return projection(response, origins, void 0, browserProfile);
	} catch {
		return projection(null, [], "Windows management observation is unavailable. Inspect the same local context with a compatible helper.");
	}
}
async function uninstallWindowsNativeHosts(params = {}) {
	const { response } = await operate({
		...params,
		deps: params.deps ?? {},
		action: "uninstall",
		store: params.removeStore ? "remove" : "preserve"
	});
	return {
		removed: response.ok ? ["Windows current-user native registration"] : [],
		refused: response.ok ? [] : ["Windows management reported " + response.code],
		manualRequired: false
	};
}
/** Used only by the native CLI, behind frame validation and before config or keys. */
async function validateWindowsNativeContext(params, deps = {}) {
	const profileIndex = process.argv.indexOf("--browser-profile");
	const profile = deps.windowsNative?.context?.browserProfile ?? (profileIndex < 0 ? "chrome" : process.argv[profileIndex + 1]);
	if (!profile) throw new Error("Missing bound browser profile");
	return await admitWindowsNativeRuntime(params, await selectedContext({
		...deps,
		stateDir: params.stateDir ?? deps.stateDir
	}, profile), operations(deps));
}
//#endregion
export { inspectWindowsNativeHosts, installWindowsNativeHost, uninstallWindowsNativeHosts, validateWindowsNativeContext, windowsManagementObservation };
