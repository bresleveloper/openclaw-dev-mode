// FIX-07 (dev-mode fork): `openclaw config validate --fix` output; doctor's repair itself is mocked.
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ConfigContentFixReport } from "../commands/doctor/config-content-fix.js";
import type { ConfigFileSnapshot, OpenClawConfig } from "../config/types.js";
import { createPluginMetadataSnapshotFixture } from "../plugins/plugin-metadata.test-support.js";
import {
  readConfigCliSnapshotWithMetadata,
  type ConfigCliSnapshotReader,
} from "./config-cli.snapshot.test-support.js";

const { defaultRuntime, resetRuntimeCapture, mockRuntimeModule } = await vi.hoisted(async () => {
  const runtimeHelpers = await import("./test-runtime-capture.js");
  return {
    ...runtimeHelpers.createCliRuntimeCapture(),
    mockRuntimeModule: runtimeHelpers.mockRuntimeModule,
  };
});

type FixParams = { dryRun?: boolean; skipOutputLogs?: boolean };
const mockFixConfigContent = vi.fn<(params?: FixParams) => Promise<ConfigContentFixReport>>();
const mockReadConfigFileSnapshot = vi.fn<ConfigCliSnapshotReader>();

vi.mock("../commands/doctor/config-content-fix.js", () => ({
  fixConfigContent: (params?: FixParams) => mockFixConfigContent(params),
}));

vi.mock("../config/config.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../config/config.js")>()),
  readConfigFileSnapshotWithPluginMetadata: async (
    ...args: Parameters<typeof mockReadConfigFileSnapshot>
  ) => readConfigCliSnapshotWithMetadata(mockReadConfigFileSnapshot, ...args),
}));

vi.mock("../plugins/plugin-metadata-snapshot.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../plugins/plugin-metadata-snapshot.js")>()),
  loadPluginMetadataSnapshot: () => createPluginMetadataSnapshotFixture(),
  resolvePluginMetadataSnapshot: () => createPluginMetadataSnapshotFixture(),
}));

vi.mock("../plugins/bundled-plugin-metadata.js", () => ({
  listBundledPluginMetadata: () => [],
}));

vi.mock("../runtime.js", async () =>
  mockRuntimeModule(
    () => vi.importActual<typeof import("../runtime.js")>("../runtime.js"),
    defaultRuntime,
  ),
);

const CONFIG_PATH = "/tmp/openclaw.json";

function snapshot(config: OpenClawConfig, issues: ConfigFileSnapshot["issues"] = []) {
  return {
    path: CONFIG_PATH,
    exists: true,
    raw: JSON.stringify(config),
    parsed: config,
    sourceConfig: config,
    resolved: config,
    valid: issues.length === 0,
    runtimeConfig: config,
    config,
    issues,
    warnings: [],
    legacyIssues: [],
  } satisfies ConfigFileSnapshot;
}

function fixReport(overrides: Partial<ConfigContentFixReport>): ConfigContentFixReport {
  return {
    status: "unchanged",
    path: CONFIG_PATH,
    changes: [],
    warnings: [],
    issues: [],
    ...overrides,
  };
}

const logs = () => defaultRuntime.log.mock.calls.map((call) => String(call[0])).join("\n");
const errors = () => defaultRuntime.error.mock.calls.map((call) => String(call[0])).join("\n");

describe("config validate --fix", () => {
  let program: Command;
  let ExitError: new (code: number, message?: string) => Error;
  const run = (...args: string[]) =>
    program.parseAsync(["config", "validate", ...args], { from: "user" });

  beforeAll(async () => {
    const { registerConfigCli } = await import("./config-cli.js");
    program = new Command();
    program.exitOverride();
    registerConfigCli(program);
    ExitError = (await vi.importActual<typeof import("../runtime.js")>("../runtime.js")).ExitError;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    resetRuntimeCapture();
    mockReadConfigFileSnapshot.mockResolvedValue(snapshot({ gateway: { port: 18789 } }));
  });

  it("does not run doctor's repairs without --fix", async () => {
    await run();

    expect(mockFixConfigContent).not.toHaveBeenCalled();
    expect(logs()).toContain("Config valid:");
  });

  it("prints the applied repairs, then validates the rewritten file", async () => {
    mockFixConfigContent.mockResolvedValueOnce(
      fixReport({ status: "fixed", changes: ["Removed unknown config key: gateway.bogus"] }),
    );

    await run("--fix");

    expect(mockFixConfigContent).toHaveBeenCalledWith({ dryRun: false, skipOutputLogs: false });
    expect(logs()).toContain("Fixed /tmp/openclaw.json: 1 change(s)");
    expect(logs()).toContain("  - Removed unknown config key: gateway.bogus");
    expect(logs()).toContain("Config valid:");
    expect(defaultRuntime.error).not.toHaveBeenCalled();
  });

  it("previews with --dry-run and stops before validating the unchanged file", async () => {
    mockFixConfigContent.mockResolvedValueOnce(
      fixReport({
        status: "would-fix",
        changes: ["Removed unknown config key: gateway.bogus"],
        warnings: ["agents.defaults.contextTokens cannot be represented per model"],
      }),
    );

    await run("--fix", "--dry-run");

    expect(mockFixConfigContent).toHaveBeenCalledWith({ dryRun: true, skipOutputLogs: false });
    expect(mockReadConfigFileSnapshot).not.toHaveBeenCalled();
    expect(logs()).toContain("Dry run: 1 change(s) would fix /tmp/openclaw.json");
    expect(logs()).toContain("  - Removed unknown config key: gateway.bogus");
    expect(logs()).toContain("agents.defaults.contextTokens cannot be represented per model");
    expect(logs()).toContain("openclaw config validate --fix");
  });

  it("exits 1 with the remaining problems when the repairs are not enough", async () => {
    mockFixConfigContent.mockResolvedValueOnce(
      fixReport({
        status: "still-invalid",
        changes: ["Removed unknown config key: gateway.bogus"],
        issues: [{ path: "gateway.port", message: "Expected number, received string" }],
      }),
    );

    await expect(run("--fix")).rejects.toThrow(ExitError);

    expect(mockReadConfigFileSnapshot).not.toHaveBeenCalled();
    expect(errors()).toContain("would still be invalid; nothing was written");
    expect(errors()).toContain("  - Removed unknown config key: gateway.bogus");
    expect(errors()).toContain("gateway.port");
    expect(errors()).toContain("Expected number, received string");
  });

  it("exits 1 when the writer refuses the repaired config", async () => {
    mockFixConfigContent.mockResolvedValueOnce(
      fixReport({
        status: "write-failed",
        changes: ["Removed unknown config key: bogusBlob"],
        error: "Config write rejected: /tmp/openclaw.json (size-drop:2050->160).",
      }),
    );

    await expect(run("--fix")).rejects.toThrow(ExitError);

    expect(mockReadConfigFileSnapshot).not.toHaveBeenCalled();
    expect(errors()).toContain("Config fix failed: Config write rejected");
    expect(errors()).toContain("size-drop:2050->160");
  });

  it("still reports an invalid config when doctor's repairs had nothing to fix", async () => {
    mockFixConfigContent.mockResolvedValueOnce(fixReport({ status: "unchanged" }));
    mockReadConfigFileSnapshot.mockResolvedValue(
      snapshot({}, [{ path: "gateway.port", message: "Expected number, received string" }]),
    );

    await expect(run("--fix")).rejects.toThrow(ExitError);

    expect(logs()).toContain("Nothing for doctor's config repairs to fix in /tmp/openclaw.json.");
    expect(errors()).toContain("needs correction");
    expect(errors()).toContain("gateway.port");
  });

  it("prints why it skipped, then validates as usual", async () => {
    mockFixConfigContent.mockResolvedValueOnce(
      fixReport({
        status: "skipped",
        reason: "config uses $include; run openclaw doctor --fix instead",
      }),
    );

    await run("--fix");

    expect(logs()).toContain("Config fix skipped: config uses $include");
    expect(logs()).toContain("Config valid:");
  });

  it("adds the fix report to --json output and keeps writer logs off stdout", async () => {
    const report = fixReport({
      status: "fixed",
      changes: ["Removed unknown config key: gateway.bogus"],
    });
    mockFixConfigContent.mockResolvedValueOnce(report);

    await run("--fix", "--json");

    expect(mockFixConfigContent).toHaveBeenCalledWith({ dryRun: false, skipOutputLogs: true });
    expect(defaultRuntime.log).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(logs()) as { valid: boolean; fix: ConfigContentFixReport };
    expect(payload).toMatchObject({ valid: true, path: CONFIG_PATH, fix: report });
  });

  it("prints a single --json failure document when the repairs are not enough", async () => {
    const report = fixReport({
      status: "still-invalid",
      issues: [{ path: "gateway.port", message: "Expected number, received string" }],
    });
    mockFixConfigContent.mockResolvedValueOnce(report);

    await expect(run("--fix", "--json")).rejects.toThrow(ExitError);

    expect(defaultRuntime.log).toHaveBeenCalledTimes(1);
    expect(defaultRuntime.error).not.toHaveBeenCalled();
    expect(JSON.parse(logs())).toMatchObject({
      ok: false,
      valid: false,
      path: CONFIG_PATH,
      issues: [{ path: "gateway.port", message: "Expected number, received string" }],
      fix: report,
    });
  });
});
