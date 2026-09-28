import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as runCommandWithTimeout, n as runExec } from "./exec-shcN2-sN.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { n as COGNITIVE_SERVICES_RESOURCE } from "./shared-DU2ZpUlv.mjs";
import { execFileSync } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
//#region extensions/microsoft-foundry/cli.ts
function summarizeAzErrorMessage(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const normalized = trimmed.replace(/\s+/g, " ");
	if (/not recognized|enoent|spawn .* az/i.test(normalized)) return "Azure CLI (az) is not installed or not on PATH.";
	if (/az login/i.test(normalized) || /please run 'az login'/i.test(normalized)) return "Azure CLI is not logged in. Run `az login --use-device-code`.";
	if (/subscription/i.test(normalized) && /could not be found|does not exist|no subscriptions/i.test(normalized)) return "Azure CLI could not find an accessible subscription. Check the selected subscription or tenant access.";
	if (/tenant/i.test(normalized) && /not found|invalid|doesn't exist|does not exist/i.test(normalized)) return "Azure CLI could not use that tenant. Verify the tenant ID or tenant domain and try `az login --tenant <tenant>`.";
	if (/aadsts\d+/i.test(normalized)) return "Azure login failed for the selected tenant. Re-run `az login --use-device-code` and confirm the tenant is correct.";
	return truncateUtf16Safe(normalized, 300);
}
function buildAzCommandError(error, stderr, stdout) {
	const details = summarizeAzErrorMessage(`${stderr ?? ""} ${stdout ?? ""}`);
	return new Error(details ? `${error.message}: ${details}` : error.message);
}
function execAz(args) {
	return normalizeOptionalString(execFileSync("az", args, {
		encoding: "utf-8",
		timeout: 3e4,
		shell: process.platform === "win32",
		killSignal: "SIGKILL"
	})) ?? "";
}
async function execAzAsync(args) {
	try {
		const { stdout } = await runExec("az", args, {
			logOutput: false,
			timeoutMs: 3e4
		});
		return normalizeStringifiedOptionalString(stdout) ?? "";
	} catch (error) {
		const commandError = error instanceof Error ? error : new Error(String(error));
		const output = error;
		throw buildAzCommandError(commandError, typeof output.stderr === "string" ? output.stderr : "", typeof output.stdout === "string" ? output.stdout : "");
	}
}
function isAzCliInstalled() {
	try {
		execAz([
			"version",
			"--output",
			"none"
		]);
		return true;
	} catch {
		return false;
	}
}
function getLoggedInAccount() {
	try {
		return parseAzJson(execAz([
			"account",
			"show",
			"--output",
			"json"
		]), "account");
	} catch {
		return null;
	}
}
function listSubscriptions() {
	try {
		return parseAzJson(execAz([
			"account",
			"list",
			"--output",
			"json",
			"--all"
		]), "subscriptions").filter((sub) => sub.state === "Enabled");
	} catch {
		return [];
	}
}
function parseAzJson(raw, label) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error(`Azure CLI returned malformed ${label} JSON.`);
	}
}
function buildAccessTokenArgs(params) {
	const args = ["account", "get-access-token"];
	if (params?.scope) args.push("--scope", params.scope);
	else args.push("--resource", COGNITIVE_SERVICES_RESOURCE);
	args.push("--output", "json");
	if (params?.subscriptionId) args.push("--subscription", params.subscriptionId);
	else if (params?.tenantId) args.push("--tenant", params.tenantId);
	return args;
}
function getAccessTokenResult(params) {
	return parseAzJson(execAz(buildAccessTokenArgs(params)), "access token");
}
async function getAccessTokenResultAsync(params) {
	return parseAzJson(await execAzAsync(buildAccessTokenArgs(params)), "access token");
}
const AZ_LOGIN_TIMEOUT_MS = 12e5;
async function azLoginDeviceCode() {
	return azLoginDeviceCodeWithOptions({});
}
async function azLoginDeviceCodeWithOptions(params) {
	const maxCapturedLoginOutputChars = 8e3;
	const args = [
		"login",
		"--use-device-code",
		...params.tenantId ? ["--tenant", params.tenantId] : [],
		...params.allowNoSubscriptions ? ["--allow-no-subscriptions"] : []
	];
	const chunks = {
		stdout: [],
		stderr: []
	};
	const lengths = {
		stdout: 0,
		stderr: 0
	};
	const decoders = {
		stdout: new StringDecoder("utf8"),
		stderr: new StringDecoder("utf8")
	};
	const appendOutput = (stream, text) => {
		if (!text) return;
		chunks[stream].push(text);
		lengths[stream] += text.length;
		while (lengths[stream] > maxCapturedLoginOutputChars && chunks[stream].length > 0) lengths[stream] -= chunks[stream].shift()?.length ?? 0;
		process[stream].write(text);
	};
	const result = await runCommandWithTimeout(["az", ...args], {
		timeoutMs: AZ_LOGIN_TIMEOUT_MS,
		killProcessTree: true,
		outputCapture: "discard",
		onOutputChunk: (chunk, stream) => {
			appendOutput(stream, decoders[stream].write(chunk));
		}
	});
	appendOutput("stdout", decoders.stdout.end());
	appendOutput("stderr", decoders.stderr.end());
	if (result.termination === "timeout") throw new Error("az login timed out after 20 minutes");
	if (result.code === 0) return;
	const output = normalizeOptionalString([...chunks.stderr, ...chunks.stdout].join("")) ?? "";
	throw new Error(output ? `az login exited with code ${result.code}: ${output}` : `az login exited with code ${result.code}`);
}
//#endregion
export { getAccessTokenResultAsync as a, listSubscriptions as c, getAccessTokenResult as i, azLoginDeviceCodeWithOptions as n, getLoggedInAccount as o, execAz as r, isAzCliInstalled as s, azLoginDeviceCode as t };
