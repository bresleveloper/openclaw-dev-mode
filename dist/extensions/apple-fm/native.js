import { i as extractErrorCode } from "../../error-coercion-C787aVxk.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, sr as unknown } from "../../schemas-BOYIvvln.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BSb3HetY.mjs";
import { t as runCommandBuffered } from "../../exec-shcN2-sN.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import { n as parseJsonPreservingUnsafeIntegers } from "../../json-unsafe-integers-BeeNmB5X.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
import "../../temp-path-PENdksor.mjs";
import "../../state-paths-Bk2vDLZh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region extensions/apple-fm/native.ts
const SETUP_REQUIRED = "Run Apple Foundation Models setup again to build its native helper.";
const infoSchema = object({
	available: boolean(),
	reason: string().optional(),
	modelName: string(),
	contextWindow: number().int().nonnegative()
});
const resultSchema = object({
	text: string(),
	toolCalls: array(object({
		id: string().min(1),
		name: string().min(1),
		arguments: record(string(), unknown())
	})),
	inputTokens: number().int().nonnegative(),
	outputTokens: number().int().nonnegative()
});
function supportsNativeModel() {
	return process.platform === "darwin" && process.arch === "arm64" && Number(os.release().split(".")[0]) >= 26;
}
function nativeEnvironment(env = process.env) {
	return {
		HOME: env.HOME ?? os.homedir(),
		PATH: "/usr/bin:/bin:/usr/sbin:/sbin",
		...env.TMPDIR ? { TMPDIR: env.TMPDIR } : {},
		...env.DEVELOPER_DIR ? { DEVELOPER_DIR: env.DEVELOPER_DIR } : {}
	};
}
function createAppleFmNative(pluginRoot) {
	const SOURCE = path.join(pluginRoot, "assets", "AppleFoundationModels.swift");
	let sourceDigest;
	async function helperPath(env) {
		sourceDigest ??= fs.readFile(SOURCE).then((source) => createHash("sha256").update(source).digest("hex"));
		return path.join(resolveStateDir(env), "tools", "apple-fm", `${await sourceDigest}-${os.release().split(".")[0]}`, "helper");
	}
	async function helperExists(command) {
		try {
			const stat = await fs.lstat(command);
			return stat.isFile() && (stat.mode & 73) !== 0;
		} catch (error) {
			if (extractErrorCode(error) === "ENOENT") return false;
			throw error;
		}
	}
	async function invoke(command, args, input, options) {
		options.signal?.throwIfAborted();
		const result = await runCommandBuffered([command, ...args], {
			input,
			baseEnv: nativeEnvironment(options.env),
			signal: options.signal,
			timeoutMs: args[0] === "info" ? 15e3 : 12e4,
			maxOutputBytes: {
				stdout: 2097152,
				stderr: 8192
			},
			killProcessTree: true
		});
		options.signal?.throwIfAborted();
		if (result.code !== 0 || result.termination !== "exit") throw new Error(`Apple Foundation Models helper failed (${result.termination}, exit ${result.code ?? "none"}). ${result.stderr.toString("utf8").trim()}`);
		const value = parseJsonPreservingUnsafeIntegers(result.stdout.toString("utf8"));
		const failure = object({ error: string() }).safeParse(value);
		if (failure.success) throw new Error(failure.data.error);
		return value;
	}
	async function probeAppleFm(options = {}) {
		options.signal?.throwIfAborted();
		if (!supportsNativeModel()) return null;
		const command = await helperPath(options.env);
		if (await helperExists(command)) return infoSchema.parse(await invoke(command, ["info"], "", options));
		const directory = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-apple-fm-probe-"));
		const temporary = path.join(directory, "helper");
		const timeout = AbortSignal.timeout(3e4);
		const probeOptions = {
			...options,
			signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout
		};
		try {
			await compileHelper(temporary, probeOptions);
			return infoSchema.parse(await invoke(temporary, ["info"], "", probeOptions));
		} finally {
			await fs.rm(directory, {
				recursive: true,
				force: true
			});
		}
	}
	async function compileHelper(temporary, options) {
		options.signal?.throwIfAborted();
		const developerTools = await runCommandBuffered(["/usr/bin/xcode-select", "-p"], {
			input: "",
			baseEnv: nativeEnvironment(options.env),
			signal: options.signal,
			timeoutMs: 1e4,
			maxOutputBytes: 4096
		});
		options.signal?.throwIfAborted();
		if (developerTools.code !== 0) throw new Error("Install Apple's developer tools with the macOS 27 SDK, then rerun Apple Foundation Models setup. OpenClaw does not install developer tools automatically.");
		const result = await runCommandBuffered([
			"/usr/bin/xcrun",
			"--sdk",
			"macosx",
			"swiftc",
			"-parse-as-library",
			"-O",
			"-target",
			"arm64-apple-macos27.0",
			SOURCE,
			"-o",
			temporary
		], {
			input: "",
			baseEnv: nativeEnvironment(options.env),
			signal: options.signal,
			timeoutMs: 12e4,
			maxOutputBytes: 65536,
			killProcessTree: true
		});
		options.signal?.throwIfAborted();
		if (result.code !== 0 || result.termination !== "exit") throw new Error(`Could not build the Apple Foundation Models helper. Select Apple developer tools with the macOS 27 SDK and retry setup. ${result.stderr.toString("utf8").trim()}`);
	}
	/** Only selected setup publishes the helper used by ordinary inference. */
	async function prepareAppleFm(options = {}) {
		options.signal?.throwIfAborted();
		if (!supportsNativeModel()) throw new Error("Apple Foundation Models requires an Apple Silicon Mac running macOS 27 or later.");
		const command = await helperPath(options.env);
		if (!await helperExists(command)) {
			await fs.mkdir(path.dirname(command), {
				recursive: true,
				mode: 448
			});
			const directory = await fs.mkdtemp(path.join(path.dirname(command), "build-"));
			const temporary = path.join(directory, "helper");
			try {
				await compileHelper(temporary, options);
				await fs.chmod(temporary, 448);
				options.signal?.throwIfAborted();
				await fs.rename(temporary, command);
			} finally {
				await fs.rm(directory, {
					recursive: true,
					force: true
				});
			}
		}
		return infoSchema.parse(await invoke(command, ["info"], "", options));
	}
	async function runAppleFm(request, options = {}) {
		if (!supportsNativeModel()) throw new Error("Apple Foundation Models is only available on Apple Silicon with macOS 27 or later.");
		const command = await helperPath(options.env);
		if (!await helperExists(command)) throw new Error(SETUP_REQUIRED);
		return resultSchema.parse(await invoke(command, ["run"], JSON.stringify(request), options));
	}
	return {
		probe: probeAppleFm,
		prepare: prepareAppleFm,
		run: runAppleFm
	};
}
//#endregion
export { createAppleFmNative };
