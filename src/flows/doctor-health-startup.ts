import fs from "node:fs";
import type { DoctorOptions } from "../commands/doctor-prompter.js";
import { resolveDoctorRepairMode } from "../commands/doctor-repair-mode.js";
import { resolveIsNixMode, resolveStateDir } from "../config/paths.js";
import { createNonExitingRuntime, type RuntimeEnv } from "../runtime.js";

function stateDirectoryExistsAtDoctorStart(): boolean {
  try {
    return fs.statSync(resolveStateDir()).isDirectory();
  } catch {
    return false;
  }
}

export async function prepareDoctorHealthFlow(
  runtime: RuntimeEnv | undefined,
  options: DoctorOptions,
  intro: (message: string) => void,
) {
  const effectiveRuntime = runtime ?? (await import("../runtime.js")).defaultRuntime;
  const repairRuntime: RuntimeEnv = {
    ...effectiveRuntime,
    exit: createNonExitingRuntime().exit,
  };
  // Config loading can initialize SQLite-backed state before integrity runs.
  // Preserve the entry fact so doctor can report that automatic initialization.
  const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
  intro("OpenClaw doctor");
  const { resolveOpenClawPackageRoot } = await import("../infra/openclaw-root.js");
  const root = await resolveOpenClawPackageRoot({
    moduleUrl: import.meta.url,
    argv1: process.argv[1],
    cwd: process.cwd(),
  });
  if (
    resolveIsNixMode() &&
    (options.repair === true || options.yes === true || options.generateGatewayToken === true)
  ) {
    const { assertConfigWriteAllowedInCurrentMode } =
      await import("../config/config-write-guard.js");
    assertConfigWriteAllowedInCurrentMode();
  }
  // Shipped updaters expose a restricted config-read bridge which cannot perform
  // this advisory source read. Defer it to ordinary Doctor after update settlement.
  if (!resolveDoctorRepairMode(options).updateInProgress) {
    // Source-only config reads avoid database admission and plugin validation: show
    // configured startup dependencies before offline maintenance and repair prompts.
    const [{ readSourceConfigBestEffort }, { inspectDoctorTailscalePrerequisite }] =
      await Promise.all([
        import("../config/io.runtime.js"),
        import("../commands/doctor-tailscale.js"),
      ]);
    const prerequisite = await inspectDoctorTailscalePrerequisite(
      await readSourceConfigBestEffort(),
    );
    if (prerequisite) {
      const { note } = await import("../../packages/terminal-core/src/note.js");
      note(prerequisite, "Gateway startup prerequisite");
    }
  }
  return { effectiveRuntime, repairRuntime, stateDirExistedAtStart, root };
}
