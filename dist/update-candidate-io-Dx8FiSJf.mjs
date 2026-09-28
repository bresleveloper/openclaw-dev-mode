import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { s as resolveSqliteInspectionBudget } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-BXzjx6E8.mjs";
import { n as formatDiskSpaceBytes } from "./disk-space-CtKhSv74.mjs";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/update-candidate-io.ts
async function measureUpdateStateFiles(files) {
	let bytes = 0;
	let largest = 0;
	const families = [];
	for (const file of files) {
		let family = 0;
		for (const suffix of [
			"",
			"-wal",
			"-shm",
			"-journal"
		]) try {
			family += (await fs.stat(file + suffix)).size;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		}
		bytes += family;
		largest = Math.max(largest, family);
		families.push({
			path: file,
			bytes: family
		});
	}
	return {
		bytes,
		largest,
		families
	};
}
const copyProgressSource = `
  const fs = require("node:fs"), path = require("node:path");
  const { createHash } = require("node:crypto");
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
  const facts = [];
  let bytes = 0;
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      try {
        if (entry.isDirectory()) {
          visit(file);
        } else if (entry.isFile()) {
          const stat = fs.statSync(file);
          bytes += stat.size;
          facts.push([file, stat.size, stat.mtimeMs, stat.ctimeMs].join(":"));
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  visit(JSON.parse(input).directory);
  process.stdout.write(JSON.stringify({
    facts: createHash("sha256").update(facts.sort().join("\\n")).digest("hex"), bytes,
  }));
});
`;
const copyProgressSchema = object({
	facts: string().length(64),
	bytes: number().nonnegative()
});
/** One IO watchdog for private state workers; callers retain child and scratch ownership. */
async function withUpdateCandidateIoBudget(params, run) {
	params.signal?.throwIfAborted();
	const budgetFor = (bytes) => Math.max(params.timeoutMs ?? 0, resolveSqliteInspectionBudget(`update state ${params.operation ?? "inspection"}`, params.directory, bytes).timeoutMs);
	let knownBytes = params.bytes;
	let budget = budgetFor(knownBytes);
	let deadline = Date.now() + budget;
	let previous;
	const stalled = new AbortController();
	const finished = new AbortController();
	const signal = AbortSignal.any([stalled.signal, ...params.signal ? [params.signal] : []]);
	const monitorSignal = AbortSignal.any([signal, finished.signal]);
	const expire = () => stalled.abort(/* @__PURE__ */ new Error(`Update state ${params.operation ?? "inspection"} made no progress for ${budget / 1e3} seconds (${formatDiskSpaceBytes(knownBytes)} of SQLite state). Check storage performance before retrying.`));
	let cancelDeadline = scheduleAbsoluteDeadline(deadline, expire);
	let probeFailure;
	const monitor = (async () => {
		try {
			while (!monitorSignal.aborted) {
				const probe = await runUtf8CommandWithTimeout([
					params.nodeRunner ?? process.execPath,
					"--input-type=commonjs",
					"--eval",
					copyProgressSource
				], {
					cwd: os.tmpdir(),
					baseEnv: params.env,
					input: JSON.stringify({ directory: params.directory }),
					signal: monitorSignal,
					killProcessTree: true,
					requireProcessTreeExtinction: true,
					killSignal: "SIGKILL",
					maxOutputBytes: {
						stdout: 1024,
						stderr: 4e3
					}
				});
				if (probe.cleanup === "uncertain") throw Object.assign(/* @__PURE__ */ new Error("Update progress probe cleanup could not be confirmed"), { cleanup: probe.cleanup });
				monitorSignal.throwIfAborted();
				if (probe.code !== 0) throw new Error(`Update progress probe failed (${probe.termination}): ${probe.stderr}`);
				const current = copyProgressSchema.parse(JSON.parse(probe.stdout));
				if (Date.now() >= deadline) {
					expire();
					return;
				}
				if (current.bytes > knownBytes || previous !== void 0 && current.facts !== previous) {
					knownBytes = Math.max(knownBytes, current.bytes);
					budget = budgetFor(knownBytes);
					deadline = Date.now() + budget;
					cancelDeadline();
					cancelDeadline = scheduleAbsoluteDeadline(deadline, expire);
				}
				previous = current.facts;
				await sleep(1e3, monitorSignal);
			}
		} catch (error) {
			if (isRecord(error) && error.cleanup === "uncertain") probeFailure = error instanceof Error ? error : new Error("Update progress probe cleanup failed", { cause: error });
			if (!monitorSignal.aborted) stalled.abort(error);
		}
	})();
	let outcome;
	try {
		outcome = { value: await run(signal) };
	} catch (error) {
		outcome = { error };
	}
	if (Date.now() >= deadline) expire();
	finished.abort();
	cancelDeadline();
	await monitor;
	if (probeFailure) throw probeFailure;
	if ("error" in outcome) throw outcome.error;
	signal.throwIfAborted();
	return outcome.value;
}
//#endregion
export { withUpdateCandidateIoBudget as n, measureUpdateStateFiles as t };
