import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { StringDecoder } from "node:string_decoder";
//#region src/infra/update-doctor-section-timing.ts
const TRACE_ENV = "OPENCLAW_GATEWAY_STARTUP_TRACE";
const TRACE_MARKER = "[gateway] startup trace: ";
const DOCTOR_TRACE = /\[gateway\] startup trace: doctor\.([^\s"]+) (\d+(?:\.\d+)?)ms(?=[\s"]|$)/u;
const CONTRIBUTION_PREFIX = "contribution.";
const MAX_PENDING_CHARS = 16384;
const MAX_PHASES = 256;
const SLOWEST_CONTRIBUTIONS = 5;
/** Best effort: bookkeeping failures yield no line and never affect the Doctor. */
function createUpdateDoctorSectionTiming(parentEnv = process.env) {
	const operatorTrace = isTruthyEnvValue(parentEnv[TRACE_ENV]);
	const phases = /* @__PURE__ */ new Map();
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let droppingLine = false;
	const observeLine = (line) => {
		try {
			const match = DOCTOR_TRACE.exec(line);
			if (!match) return;
			const [, name, value] = match;
			const milliseconds = Number(value);
			if (!name || !Number.isFinite(milliseconds)) return;
			const previous = phases.get(name);
			if (previous !== void 0 || phases.size < MAX_PHASES) phases.set(name, (previous ?? 0) + milliseconds);
		} catch {}
	};
	const observeStderr = (chunk) => {
		try {
			let text = decoder.write(chunk);
			if (droppingLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				droppingLine = false;
			}
			const lines = `${pending}${text}`.split("\n");
			pending = lines.pop() ?? "";
			for (const line of lines) observeLine(line);
			if (pending.length > MAX_PENDING_CHARS) {
				pending = "";
				droppingLine = true;
			}
		} catch {}
	};
	const hidesLine = (line) => !operatorTrace && line.includes(TRACE_MARKER);
	const stripTrace = (stderr) => operatorTrace || !stderr.includes(TRACE_MARKER) ? stderr : stderr.split("\n").filter((line) => !hidesLine(line)).join("\n");
	const diagnostic = () => {
		try {
			if (pending) {
				observeLine(pending);
				pending = "";
			}
			const sections = [];
			const contributions = [];
			for (const [name, milliseconds] of phases) if (name.startsWith(CONTRIBUTION_PREFIX)) contributions.push([name.slice(13).replace(/^doctor:/u, ""), milliseconds]);
			else sections.push(`${name} ${(milliseconds / 1e3).toFixed(1)} s`);
			const slowest = contributions.toSorted((left, right) => right[1] - left[1]).slice(0, SLOWEST_CONTRIBUTIONS).map(([id, milliseconds]) => `${id} ${(milliseconds / 1e3).toFixed(1)} s`);
			if (!sections.length && !slowest.length) return;
			const line = [`Doctor sections: ${sections.length ? sections.join(", ") : "none"}`, ...slowest.length ? [`slowest contributions: ${slowest.join(", ")}`] : []].join("; ");
			return line.length > 1024 ? `${line.slice(0, UPDATE_RUN_TEXT_LIMIT - 1)}…` : line;
		} catch {
			return;
		}
	};
	return {
		env: { [TRACE_ENV]: "1" },
		observeLine,
		wrap: (run) => async (argv, options) => {
			const observer = options.onOutputChunk;
			const result = await run(argv, {
				...options,
				onOutputChunk: (chunk, stream) => {
					if (stream === "stderr") observeStderr(chunk);
					return observer?.(chunk, stream);
				}
			});
			return {
				...result,
				stderr: stripTrace(result.stderr)
			};
		},
		hidesLine,
		stripTrace,
		annotate: (step) => {
			const line = diagnostic();
			if (line) step.diagnostics = [line, ...step.diagnostics ?? []];
			return step;
		}
	};
}
//#endregion
export { createUpdateDoctorSectionTiming as t };
