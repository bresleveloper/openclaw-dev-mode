import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as resolveCrabboxBinary } from "./crabbox-binary-BMI8aWfR.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./model-ref-parse-BI8o1mtw.mjs";
import { t as withConfiguredModelEgress } from "./secret-egress-runtime-BBU26SIQ.mjs";
import "./logging-core-e269L3HU.mjs";
import { randomBytes } from "node:crypto";
//#region extensions/crabbox/src/crabbox-model-run.ts
const UPSTREAM_PROXY_ENV = "CRABBOX_MODEL_PROXY";
const MAX_OUTPUT_BYTES = 1048576;
function shellQuote(value) {
	if (value.includes("\0")) throw new Error("Crabbox model command cannot contain NUL bytes");
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function remoteCommandScript(egress) {
	const delimiter = `MODEL_EGRESS_CA_${randomBytes(12).toString("hex")}`;
	return `#!/bin/bash
set -euo pipefail
umask 077
egress_dir=$(mktemp -d)
trap 'rm -rf -- "$egress_dir"' EXIT
cat > "$egress_dir/ca.pem" <<'${delimiter}'
${egress.caBundle}
${delimiter}
export OPENAI_API_KEY=${shellQuote(egress.sentinel)}
export OPENAI_BASE_URL=${shellQuote(egress.baseUrl)}
export OPENAI_MODEL=${shellQuote(egress.model)}
export HTTPS_PROXY=http://127.0.0.1:3128 HTTP_PROXY=http://127.0.0.1:3128
export https_proxy="$HTTPS_PROXY" http_proxy="$HTTP_PROXY"
export NO_PROXY=localhost,127.0.0.1,::1 no_proxy=localhost,127.0.0.1,::1
unset ALL_PROXY all_proxy
export NODE_USE_ENV_PROXY=1
export NODE_EXTRA_CA_CERTS="$egress_dir/ca.pem" SSL_CERT_FILE="$egress_dir/ca.pem"
export CURL_CA_BUNDLE="$egress_dir/ca.pem" REQUESTS_CA_BUNDLE="$egress_dir/ca.pem"
export GIT_SSL_CAINFO="$egress_dir/ca.pem"
"$@"
`;
}
async function runCrabboxModelCommand(params) {
	const model = parseModelRef(params.model, "");
	if (!params.model.includes("/") || !model?.provider || !model.model) throw new Error("--model must name an explicit provider/model");
	const signal = AbortSignal.any([AbortSignal.timeout(params.timeoutMs), ...params.signal ? [params.signal] : []]);
	const command = (args, options = {}) => runCommandWithTimeout([
		params.binary,
		"egress",
		"run",
		...args
	], {
		timeoutMs: params.timeoutMs,
		maxOutputBytes: MAX_OUTPUT_BYTES,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		killGraceMs: 75e3,
		signal,
		...options,
		env: {
			CRABBOX_ENV_ALLOW: ",",
			[UPSTREAM_PROXY_ENV]: void 0,
			...options.env
		}
	});
	const help = await command(["--help"]);
	if (help.termination !== "exit" || help.code !== 0 || !/(?:^|\n)\s+-{1,2}upstream-proxy-env(?:\s|$)/u.test(`${help.stdout}\n${help.stderr}`)) throw new Error("This Crabbox binary lacks native egress run support; update Crabbox first");
	return await withConfiguredModelEgress({
		config: params.config,
		...model,
		signal,
		onOutput: params.onOutput
	}, async (egress) => {
		const result = await command([
			"--id",
			params.id,
			...params.provider ? ["--provider", params.provider] : [],
			"--allow",
			egress.allowedHosts.join(","),
			"--upstream-proxy-env",
			UPSTREAM_PROXY_ENV,
			"--no-sync",
			"--no-hydrate",
			"--script-stdin",
			"--",
			...params.argv
		], {
			env: { [UPSTREAM_PROXY_ENV]: egress.hostEnv.HTTPS_PROXY },
			input: remoteCommandScript(egress),
			onOutputChunk: egress.onOutputChunk
		});
		if (result.cleanup === "uncertain") throw new Error("Crabbox could not confirm that the command stopped");
		return {
			...result,
			stdout: redactSensitiveText(result.stdout),
			stderr: redactSensitiveText(result.stderr)
		};
	});
}
//#endregion
//#region extensions/crabbox/src/crabbox-model-run-cli.ts
function registerCrabboxModelRunCommand({ program, config }) {
	const crabbox = program.commands.find((command) => command.name() === "crabbox") ?? program.command("crabbox");
	crabbox.description("Run model-backed commands and manage Crabbox warm images");
	crabbox.command("run").description("Run a foreground command on an exclusive Linux lease using a protected model credential").requiredOption("--id <lease>", "Existing, exclusively owned Crabbox lease").requiredOption("--model <provider/model>", "Configured OpenAI-compatible API-key model").option("--provider <provider>", "Crabbox backend override; otherwise use the lease's provider").option("--binary <path>", "Crabbox binary with upstream proxy support").option("--timeout <seconds>", "Total command and setup deadline in seconds", "600").argument("<command...>", "Remote executable and arguments, following --").action(async (argv, options) => {
		const seconds = Number(options.timeout);
		if (!Number.isSafeInteger(seconds) || seconds < 1 || seconds > 86400) throw new Error("--timeout must be an integer between 1 and 86400 seconds");
		const controller = new AbortController();
		const cancel = () => controller.abort(/* @__PURE__ */ new Error("Crabbox model command interrupted"));
		process.once("SIGINT", cancel);
		process.once("SIGTERM", cancel);
		try {
			const result = await runCrabboxModelCommand({
				config,
				binary: resolveCrabboxBinary({
					explicit: options.binary,
					pathEnv: process.env.PATH
				}),
				id: options.id,
				model: options.model,
				provider: options.provider,
				argv,
				timeoutMs: seconds * 1e3,
				signal: controller.signal,
				onOutput: (text, stream) => {
					process[stream].write(text);
				}
			});
			process.exitCode = result.termination === "exit" ? result.code ?? 1 : 1;
		} finally {
			process.off("SIGINT", cancel);
			process.off("SIGTERM", cancel);
		}
	});
}
//#endregion
export { registerCrabboxModelRunCommand };
