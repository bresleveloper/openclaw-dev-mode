import { a as asOptionalRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import fs from "node:fs/promises";
//#region src/daemon/launchd-plist.ts
/** Reads and renders macOS LaunchAgent plists for gateway service installs. */
const LAUNCH_AGENT_POLICY = {
	RunAtLoad: true,
	KeepAlive: true,
	ExitTimeOut: 20,
	ProcessType: "Interactive",
	ThrottleInterval: 10,
	Umask: 63,
	StandardInPath: "/dev/null"
};
const LAUNCH_AGENT_ENV_WRAPPER_SHELL = "/bin/sh";
const plistEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
function quoteLaunchAgentEnvironmentValue(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function parseGeneratedEnvValue(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("'") || !trimmed.endsWith("'")) return trimmed;
	return trimmed.slice(1, -1).replaceAll("'\\''", "'");
}
function includesGeneratedEnvironmentPathToken(value, token) {
	return Boolean(value?.replaceAll("\\", "/").includes(token));
}
function includesGeneratedEnvironmentDirToken(value) {
	return Boolean(value?.replaceAll("\\", "/").includes("/service-env/"));
}
function resolveSiblingGeneratedEnvFilePath(envFilePath, options) {
	const label = options?.generatedEnvironmentLabel?.trim();
	if (!label) return;
	const markerIndex = envFilePath.replaceAll("\\", "/").lastIndexOf("/service-env/");
	if (markerIndex < 0) return;
	const serviceEnvDirEnd = markerIndex + 13 - 1;
	return `${envFilePath.slice(0, serviceEnvDirEnd)}/${label}.env`;
}
function isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) {
	if (!wrapperPath || !envFilePath) return false;
	if (!options) return wrapperPath.endsWith("-env-wrapper.sh");
	if (options.expectedEnvironmentWrapperPath && options.expectedEnvironmentFilePath && wrapperPath === options.expectedEnvironmentWrapperPath && envFilePath === options.expectedEnvironmentFilePath) return true;
	const label = options.generatedEnvironmentLabel?.trim();
	if (!label) return false;
	return includesGeneratedEnvironmentDirToken(wrapperPath) && includesGeneratedEnvironmentDirToken(envFilePath) && includesGeneratedEnvironmentPathToken(wrapperPath, `${label}-env-wrapper.sh`) && includesGeneratedEnvironmentPathToken(envFilePath, `${label}.env`);
}
function resolveGeneratedEnvWrapperLayout(programArguments, options) {
	if (programArguments[0] === "/bin/sh") {
		const wrapperPath = programArguments[1];
		const envFilePath = programArguments[2];
		if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath) return {
			envFilePath,
			commandStartIndex: 3
		};
	}
	const wrapperPath = programArguments[0];
	const envFilePath = programArguments[1];
	if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath) return {
		envFilePath,
		commandStartIndex: 2
	};
	return null;
}
async function readLaunchAgentEnvironmentFile(programArguments, options) {
	const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
	if (!layout) return {};
	const envFilePath = layout.envFilePath;
	let content = "";
	const candidateEnvFilePaths = options?.requireEffective ? [envFilePath] : Array.from(new Set([
		envFilePath,
		resolveSiblingGeneratedEnvFilePath(envFilePath, options),
		options?.expectedEnvironmentFilePath
	].filter((candidate) => Boolean(candidate))));
	for (const candidate of candidateEnvFilePaths) try {
		content = await fs.readFile(candidate, "utf8");
		break;
	} catch (error) {
		if (options?.requireEffective) throw error;
	}
	if (!content) return {};
	const environment = {};
	const lines = content.split("\n");
	for (let index = 0; index < lines.length; index++) {
		const rawLine = lines[index] ?? "";
		const line = options?.requireEffective ? rawLine.trimStart() : rawLine.trim();
		if (!line.trim() || line.startsWith("#")) continue;
		const match = line.match(/^export\s+([A-Za-z_][A-Za-z0-9_]*)=([\s\S]*)$/);
		if (!match) {
			if (options?.requireEffective) throw new Error("Unsupported LaunchAgent environment syntax");
			continue;
		}
		const key = match[1];
		let value = match[2];
		if (!key || value === void 0) continue;
		let parsedValue = parseGeneratedEnvValue(value);
		if (options?.requireEffective) {
			while (quoteLaunchAgentEnvironmentValue(parsedValue) !== value.trim() && index + 1 < lines.length) {
				value += `\n${lines[++index]}`;
				parsedValue = parseGeneratedEnvValue(value);
			}
			if (quoteLaunchAgentEnvironmentValue(parsedValue) !== value.trim()) throw new Error("Unsupported LaunchAgent environment value");
		}
		environment[key] = parsedValue;
	}
	return environment;
}
function unwrapGeneratedEnvWrapperArgs(programArguments, options) {
	const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
	if (!layout) return programArguments;
	return programArguments.slice(layout.commandStartIndex);
}
const renderEnvDict = (env) => {
	if (!env) return "";
	const entries = Object.entries(env).filter(([key, value]) => typeof value === "string" && (value.trim() || key === "NODE_OPTIONS"));
	if (entries.length === 0) return "";
	return `\n    <key>EnvironmentVariables</key>\n    <dict>${entries.map(([key, value]) => `\n    <key>${plistEscape(key)}</key>\n    <string>${plistEscape(value?.trim() ?? "")}</string>`).join("")}\n    </dict>`;
};
async function normalizeLaunchdPlistXml(contents, timeoutMs = 5e3) {
	const { stdout } = await runExec("/usr/bin/plutil", [
		"-convert",
		"xml1",
		"-o",
		"-",
		"--",
		"-"
	], {
		input: contents,
		timeoutMs: Math.max(1, Math.min(timeoutMs, 5e3)),
		maxBuffer: 1048576,
		logOutput: false
	});
	return stdout;
}
async function decodeLaunchdPlistMetadata(contents, timeoutMs) {
	const deadline = performance.now() + Math.min(timeoutMs ?? 5e3, 5e3);
	const xml = await normalizeLaunchdPlistXml(contents, deadline - performance.now());
	const { stdout } = await runExec("/usr/bin/plutil", [
		"-convert",
		"json",
		"-o",
		"-",
		"--",
		"-"
	], {
		input: xml.replace(/<(data|date)>[\s\S]*?<\/\1>/g, "<integer>0</integer>"),
		timeoutMs: Math.max(1, deadline - performance.now()),
		maxBuffer: 1048576,
		logOutput: false
	});
	return asOptionalRecord(JSON.parse(stdout));
}
async function readLaunchAgentProgramArgumentsFromFile(plistPath, options) {
	try {
		const contents = await fs.readFile(plistPath).catch(async (error) => {
			if (hasErrnoCode(error, "ENOENT")) {
				if (options?.requireEffective) {
					if (!await fs.lstat(plistPath).then(() => false, (statError) => hasErrnoCode(statError, "ENOENT"))) throw new Error("Unreadable LaunchAgent definition");
				}
				return null;
			}
			throw error;
		});
		if (contents === null) return null;
		const plist = await decodeLaunchdPlistMetadata(contents, options?.timeoutMs);
		const args = plist?.ProgramArguments;
		const workingDirectory = plist?.WorkingDirectory;
		const inlineEnvironment = plist?.EnvironmentVariables;
		if (!Array.isArray(args) || !args.every((arg) => typeof arg === "string") || workingDirectory !== void 0 && typeof workingDirectory !== "string" || inlineEnvironment !== void 0 && !isStringRecord(inlineEnvironment)) throw new Error("Invalid LaunchAgent command fields");
		const fileEnvironment = await readLaunchAgentEnvironmentFile(args, options);
		const effectiveProgramArguments = unwrapGeneratedEnvWrapperArgs(args, options);
		if (options?.requireEffective && !effectiveProgramArguments[0]) throw new Error("Missing LaunchAgent command");
		const environment = {
			...inlineEnvironment,
			...fileEnvironment
		};
		const environmentValueSources = {};
		for (const key of Object.keys(environment)) environmentValueSources[key] = !Object.hasOwn(fileEnvironment, key) ? "inline" : Object.hasOwn(inlineEnvironment ?? {}, key) ? "inline-and-file" : "file";
		return {
			programArguments: effectiveProgramArguments,
			...workingDirectory ? { workingDirectory } : {},
			...Object.keys(environment).length > 0 ? { environment } : {},
			...Object.keys(environmentValueSources).length > 0 ? { environmentValueSources } : {},
			sourcePath: plistPath
		};
	} catch {
		if (options?.requireEffective) throw new Error("Effective LaunchAgent service command could not be inspected.");
		return null;
	}
}
function buildLaunchAgentPlist({ label, comment, programArguments, workingDirectory, stdoutPath, stderrPath, environment }) {
	const argsXml = programArguments.map((arg) => `\n      <string>${plistEscape(arg)}</string>`).join("");
	const workingDirXml = workingDirectory ? `\n    <key>WorkingDirectory</key>\n    <string>${plistEscape(workingDirectory)}</string>` : "";
	const commentXml = comment?.trim() ? `\n    <key>Comment</key>\n    <string>${plistEscape(comment.trim())}</string>` : "";
	const envXml = renderEnvDict(environment);
	const policyXml = Object.entries(LAUNCH_AGENT_POLICY).map(([key, value]) => {
		const type = typeof value === "number" ? "integer" : "string";
		return `    <key>${key}</key>\n    ${typeof value === "boolean" ? `<${value}/>` : `<${type}>${plistEscape(String(value))}</${type}>`}`;
	}).join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n  <dict>\n    <key>Label</key>\n    <string>${plistEscape(label)}</string>\n    ${commentXml}\n${policyXml}\n    <key>ProgramArguments</key>\n    <array>${argsXml}\n    </array>\n    ${workingDirXml}\n    <key>StandardOutPath</key>\n    <string>${plistEscape(stdoutPath)}</string>\n    <key>StandardErrorPath</key>\n    <string>${plistEscape(stderrPath)}</string>${envXml}\n  </dict>\n</plist>\n`;
}
//#endregion
export { normalizeLaunchdPlistXml as a, decodeLaunchdPlistMetadata as i, LAUNCH_AGENT_POLICY as n, quoteLaunchAgentEnvironmentValue as o, buildLaunchAgentPlist as r, readLaunchAgentProgramArgumentsFromFile as s, LAUNCH_AGENT_ENV_WRAPPER_SHELL as t };
