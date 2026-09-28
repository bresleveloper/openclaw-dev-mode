import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-E5oPIr_h.mjs";
import { escape } from "minimatch";
//#region src/daemon/systemd-unit.ts
/** Renders and parses systemd unit snippets for managed gateway services. */
const SYSTEMD_LINE_BREAKS = /[\r\n]/;
/** Copy only policy fields admitted for preservation by the native audit. */
function preserveSystemdUnitPolicy(generated, previous, keys = []) {
	if (!keys.length) return generated;
	const keyedLines = (content) => {
		let section = "";
		return splitSystemdLogicalLines(content).map((line) => {
			const trimmed = line.trim();
			if (trimmed.startsWith("[") && trimmed.endsWith("]")) section = trimmed.slice(1, -1);
			const separator = trimmed.indexOf("=");
			return {
				line,
				key: separator < 0 ? "" : `${section}.${trimmed.slice(0, separator).trim()}`
			};
		});
	};
	const installed = keyedLines(previous);
	const retained = new Map(keys.map((key) => [key, installed.filter((line) => line.key === key)]));
	const copied = /* @__PURE__ */ new Set();
	return `${keyedLines(generated).flatMap(({ line, key }) => {
		const original = retained.get(key);
		if (!original) return [line];
		if (!original.length) throw new Error(`Custom systemd policy ${key} disappeared before publication.`);
		if (copied.has(key)) return [];
		copied.add(key);
		return original.map((entry) => entry.line);
	}).join("\n").trimEnd()}\n`;
}
const SYSTEMD_FIXED_POLICY = {
	"Unit.After": "network-online.target",
	"Unit.Wants": "network-online.target",
	"Unit.StartLimitBurst": "10",
	"Unit.StartLimitIntervalSec": "300",
	"Service.Restart": "always",
	"Service.RestartSec": "5",
	"Service.RestartPreventExitStatus": "78",
	"Service.TimeoutStopSec": String(GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3),
	"Service.TimeoutStartSec": "30",
	"Service.SuccessExitStatus": "0 143",
	"Service.OOMPolicy": "continue",
	"Service.KillMode": "mixed",
	"Install.WantedBy": "default.target"
};
function renderFixedPolicy(section) {
	return Object.entries(SYSTEMD_FIXED_POLICY).filter(([key]) => key.startsWith(`${section}.`)).map(([key, value]) => `${key.slice(section.length + 1)}=${value}`);
}
/** Keep installed launch arguments and environment while migrating installer policy. */
function refreshSystemdUnitPolicy(content) {
	const lines = [];
	const sections = /* @__PURE__ */ new Set();
	let section = "";
	for (const raw of splitSystemdLogicalLines(content)) {
		const line = raw.trim();
		if (line.startsWith("[") && line.endsWith("]")) {
			lines.push(...renderFixedPolicy(section));
			section = line.slice(1, -1);
			sections.add(section);
		}
		const separator = line.indexOf("=");
		if (separator > 0 && Object.hasOwn(SYSTEMD_FIXED_POLICY, `${section}.${line.slice(0, separator).trim()}`)) continue;
		lines.push(raw);
	}
	lines.push(...renderFixedPolicy(section));
	for (const name of new Set(Object.keys(SYSTEMD_FIXED_POLICY).map((key) => key.split(".")[0]))) if (!sections.has(name)) lines.push(`[${name}]`, ...renderFixedPolicy(name));
	return `${lines.join("\n").trimEnd()}\n`;
}
function assertNoSystemdLineBreaks(value, label) {
	if (SYSTEMD_LINE_BREAKS.test(value)) throw new Error(`${label} cannot contain CR or LF characters.`);
}
function systemdEscapeArg(value) {
	assertNoSystemdLineBreaks(value, "Systemd unit values");
	if (!/[\s"\\]/.test(value)) return value;
	return `"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
}
function renderEnvLines(env) {
	if (!env) return [];
	const entries = Object.entries(env).filter(([key, value]) => typeof value === "string" && (value.trim() || key === "NODE_OPTIONS"));
	if (entries.length === 0) return [];
	return entries.map(([key, value]) => {
		const rawValue = value ?? "";
		assertNoSystemdLineBreaks(key, "Systemd environment variable names");
		assertNoSystemdLineBreaks(rawValue, "Systemd environment variable values");
		return `Environment=${systemdEscapeArg(`${key}=${rawValue.trim()}`.replaceAll("%", "%%"))}`;
	});
}
function renderEnvironmentFileLines(environmentFiles) {
	if (!environmentFiles) return [];
	return normalizeStringEntries(environmentFiles).map((entry) => `EnvironmentFile=${renderSystemdEnvironmentFile(entry)}`);
}
function renderSystemdEnvironmentFile(entry) {
	assertNoSystemdLineBreaks(entry, "Systemd EnvironmentFile values");
	return `-${escape(entry).replaceAll("%", "%%")}`;
}
function buildSystemdUnit({ description, programArguments, workingDirectory, environment, environmentFiles }) {
	const execStart = programArguments.map((argument) => systemdEscapeArg(argument.replaceAll("%", "%%"))).join(" ");
	const descriptionValue = description?.trim() || "OpenClaw Gateway";
	assertNoSystemdLineBreaks(descriptionValue, "Systemd Description");
	const descriptionLine = `Description=${descriptionValue}`;
	if (workingDirectory) {
		assertNoSystemdLineBreaks(workingDirectory, "Systemd WorkingDirectory");
		const lastComponent = workingDirectory.split("/").findLast((part) => part !== "" && part !== ".");
		if (lastComponent && /[ \t]$/u.test(lastComponent)) throw new Error("Systemd WorkingDirectory cannot end in spaces or tabs; choose a directory without trailing whitespace.");
	}
	const workingDirPath = workingDirectory?.replace(/\\$/u, "$&/.");
	const workingDirLine = workingDirPath ? `WorkingDirectory=${workingDirPath.replaceAll("%", "%%")}` : null;
	const envLines = renderEnvLines(environment);
	const environmentFileLines = renderEnvironmentFileLines(environmentFiles);
	return [
		"[Unit]",
		descriptionLine,
		...renderFixedPolicy("Unit"),
		"",
		"[Service]",
		`ExecStart=${execStart}`,
		...renderFixedPolicy("Service"),
		workingDirLine,
		...environmentFileLines,
		...envLines,
		"",
		"[Install]",
		...renderFixedPolicy("Install"),
		""
	].filter((line) => line !== null).join("\n");
}
function parseSystemdExecStart(value) {
	return splitArgsPreservingQuotes(value, { escapeMode: "backslash" });
}
function splitSystemdEnvironmentWords(value) {
	return splitArgsPreservingQuotes(value, {
		escapeMode: "backslash",
		quoteChars: ["\"", "'"],
		quoteStart: "item-start"
	});
}
function parseSystemdEnvAssignments(raw) {
	return splitSystemdEnvironmentWords(raw).flatMap((entry) => {
		const assignment = entry.trim();
		const separator = assignment.indexOf("=");
		return separator <= 0 ? [] : [{
			key: assignment.slice(0, separator).trim(),
			value: assignment.slice(separator + 1)
		}];
	});
}
function splitSystemdLogicalLines(content) {
	const lines = [];
	let continued = "";
	for (const physicalLine of content.split(/\r?\n/)) {
		if (/^\s*[#;]/u.test(physicalLine)) {
			if (!continued) lines.push(physicalLine);
			continue;
		}
		const line = continued + physicalLine;
		if (/(?:^|[^\\])(?:\\\\)*\\$/u.test(line)) continued = `${line.slice(0, -1)} `;
		else {
			lines.push(line);
			continued = "";
		}
	}
	return continued ? [...lines, continued] : lines;
}
function renderSystemdEnvAssignment(key, value) {
	return systemdEscapeArg(`${key}=${value}`);
}
//#endregion
export { preserveSystemdUnitPolicy as a, renderSystemdEnvironmentFile as c, parseSystemdExecStart as i, splitSystemdEnvironmentWords as l, buildSystemdUnit as n, refreshSystemdUnitPolicy as o, parseSystemdEnvAssignments as r, renderSystemdEnvAssignment as s, SYSTEMD_FIXED_POLICY as t, splitSystemdLogicalLines as u };
