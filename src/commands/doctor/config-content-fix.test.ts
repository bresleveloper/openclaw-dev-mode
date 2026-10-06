// FIX-07 (dev-mode fork): doctor's config-only repairs against real config files and the real writer.
import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readConfigFileSnapshot } from "../../config/config.js";
import { writeOpenClawConfig } from "../../config/test-helpers.js";
import { closeOpenClawStateDatabaseForTest } from "../../state/openclaw-state-db.js";
import { withEnvAsync } from "../../test-utils/env.js";
import { withDoctorConfigPreflightHome } from "../doctor-config-preflight.test-support.js";
import { fixConfigContent } from "./config-content-fix.js";

type ConfigHome = { configPath: string; originalRaw: string };

// Empty bundled-plugin inventory: these cases exercise core rules and the real writer only.
async function withConfigHome<T>(
  config: unknown,
  run: (home: ConfigHome) => Promise<T>,
  options: { env?: Record<string, string>; extraFiles?: Record<string, string> } = {},
): Promise<T> {
  return await withDoctorConfigPreflightHome(
    async (home) =>
      await withEnvAsync({ OPENCLAW_DISABLE_BUNDLED_PLUGINS: "1", ...options.env }, async () => {
        const configPath = await writeOpenClawConfig(home, config);
        for (const [name, content] of Object.entries(options.extraFiles ?? {})) {
          await fs.writeFile(path.join(path.dirname(configPath), name), content, "utf-8");
        }
        const originalRaw = await fs.readFile(configPath, "utf-8");
        return await run({ configPath, originalRaw });
      }),
  );
}

async function readWrittenConfig(configPath: string): Promise<Record<string, unknown>> {
  const written = JSON.parse(await fs.readFile(configPath, "utf-8")) as Record<string, unknown>;
  // The writer stamps meta.lastTouched* on every write; it is not part of the repair.
  delete written.meta;
  return written;
}

// The first agent-roster case in a fresh worker transforms doctor's agent-policy modules
// (about a minute on Windows); the same calls then take milliseconds.
describe("fixConfigContent", { timeout: 300_000 }, () => {
  afterEach(() => {
    closeOpenClawStateDatabaseForTest();
  });

  it("removes an unknown key, writes only the repaired config, and keeps a backup", async () => {
    await withConfigHome(
      { gateway: { mode: "local", port: 18789, bogusSetting: true } },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "fixed" });
        expect(report.path).toBe(home.configPath);
        expect(report.changes).toEqual(["Removed unknown config key: gateway.bogusSetting"]);
        // The reader's in-memory implicit agent roster must not reach the file.
        expect(await readWrittenConfig(home.configPath)).toEqual({
          gateway: { mode: "local", port: 18789 },
        });
        expect(await fs.readFile(`${home.configPath}.bak`, "utf-8")).toBe(home.originalRaw);
        expect((await readConfigFileSnapshot()).valid).toBe(true);
      },
    );
  });

  it("migrates a moved legacy key through doctor's legacy step", async () => {
    await withConfigHome(
      { gateway: { mode: "local" }, messages: { tts: { provider: "edge" } } },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "fixed" });
        expect(report.changes).toContain("Moved messages.tts to top-level tts.");
        const written = await readWrittenConfig(home.configPath);
        expect(written.tts).toEqual({ provider: "microsoft" });
        expect(written.messages).not.toHaveProperty("tts");
        expect((await readConfigFileSnapshot()).valid).toBe(true);
      },
    );
  });

  it("repairs an invalid value through doctor's compatibility normalizers", async () => {
    await withConfigHome(
      {
        gateway: { mode: "local" },
        agents: { defaults: { heartbeat: { activeHours: { start: "25:99", end: "nope" } } } },
      },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "fixed" });
        expect(report.changes).toEqual([
          expect.stringContaining("Removed invalid agents.defaults.heartbeat.activeHours"),
        ]);
        expect(await readWrittenConfig(home.configPath)).toEqual({
          gateway: { mode: "local" },
          agents: { defaults: { heartbeat: {} } },
        });
      },
    );
  });

  it("persists a read-time migration in a config that already passes validation", async () => {
    await withConfigHome(
      { gateway: { mode: "local" }, agents: { defaults: { contextTokens: 100000 } } },
      async (home) => {
        expect((await readConfigFileSnapshot()).valid).toBe(true);

        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "fixed" });
        expect(report.changes).toContain("Removed agents.defaults.contextTokens.");
        expect(report.warnings).toEqual([
          expect.stringContaining("agents.defaults.contextTokens cannot be represented per model"),
        ]);
        const written = await readWrittenConfig(home.configPath);
        expect(written.agents).not.toHaveProperty(["defaults", "contextTokens"]);
      },
    );
  });

  it("keeps a canonical multi-agent roster untouched while fixing something else", async () => {
    const authored = {
      gateway: { mode: "local" },
      agents: {
        ownership: "explicit",
        defaults: { heartbeat: { agentId: "main" }, systemAgent: { agentId: "main" } },
        entries: { main: {}, work: { workspace: "~/work-agent" } },
      },
      talk: { agentId: "main" },
    };
    await withConfigHome(
      { ...authored, gateway: { mode: "local", bogusSetting: true } },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({
          status: "fixed",
          changes: ["Removed unknown config key: gateway.bogusSetting"],
        });
        expect(await readWrittenConfig(home.configPath)).toEqual(authored);
      },
    );
  });

  it("leaves a legacy agents.list roster to doctor's one-time migration", async () => {
    await withConfigHome(
      {
        gateway: { mode: "local", bind: "localhost" },
        agents: { list: [{ id: "main", default: true }, { id: "work" }] },
      },
      async (home) => {
        const report = await fixConfigContent();

        // Doctor persists rosters with workspace pins; the plain writer would save the
        // reader's projection and drop the legacy default-agent marker.
        expect(report).toMatchObject({ status: "skipped", changes: [] });
        expect(report.reason).toContain("agents.list");
        expect(report.reason).toContain("openclaw doctor --fix");
        expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      },
    );
  });

  it("keeps ${VAR} references literal, including one a migration moves", async () => {
    await withConfigHome(
      {
        gateway: {
          mode: "local",
          auth: { mode: "token", token: "${OPENCLAW_CONTENT_FIX_TEST_TOKEN}" },
          bogusSetting: true,
        },
        agents: {
          defaults: { memorySearch: { remote: { apiKey: "${OPENCLAW_CONTENT_FIX_TEST_KEY}" } } },
        },
      },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "fixed" });
        expect(report.changes).toContain("Removed unknown config key: gateway.bogusSetting");
        const raw = await fs.readFile(home.configPath, "utf-8");
        expect(raw).not.toContain("resolved-secret-token");
        expect(raw).not.toContain("resolved-secret-key");
        expect(await readWrittenConfig(home.configPath)).toEqual({
          gateway: {
            mode: "local",
            auth: { mode: "token", token: "${OPENCLAW_CONTENT_FIX_TEST_TOKEN}" },
          },
          agents: { defaults: {} },
          memory: { search: { remote: { apiKey: "${OPENCLAW_CONTENT_FIX_TEST_KEY}" } } },
        });
      },
      {
        env: {
          OPENCLAW_CONTENT_FIX_TEST_TOKEN: "resolved-secret-token",
          OPENCLAW_CONTENT_FIX_TEST_KEY: "resolved-secret-key",
        },
      },
    );
  });

  it("writes nothing and reports what is left when the repaired config is still invalid", async () => {
    await withConfigHome(
      { gateway: { mode: "local", port: "not-a-port", bogusSetting: true } },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "still-invalid" });
        expect(report.changes).toEqual(["Removed unknown config key: gateway.bogusSetting"]);
        expect(report.issues.map((issue) => issue.path)).toEqual(["gateway.port"]);
        expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      },
    );
  });

  it("previews the repairs without touching the file in dry-run mode", async () => {
    await withConfigHome({ gateway: { mode: "local", bogusSetting: true } }, async (home) => {
      const report = await fixConfigContent({ dryRun: true });

      expect(report).toMatchObject({ status: "would-fix" });
      expect(report.changes).toEqual(["Removed unknown config key: gateway.bogusSetting"]);
      expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      await expect(fs.access(`${home.configPath}.bak`)).rejects.toThrow();
    });
  });

  it("leaves an already-clean config untouched", async () => {
    await withConfigHome({ gateway: { mode: "local", port: 18789 } }, async (home) => {
      const report = await fixConfigContent();

      expect(report).toMatchObject({ status: "unchanged" });
      expect(report.changes).toEqual([]);
      expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      await expect(fs.access(`${home.configPath}.bak`)).rejects.toThrow();
    });
  });

  it("refuses configs that use $include", async () => {
    await withConfigHome(
      { gateway: { mode: "local", bogusSetting: true }, agents: { $include: "./agents.json5" } },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "skipped" });
        expect(report.reason).toContain("$include");
        expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      },
      { extraFiles: { "agents.json5": "{ defaults: {} }\n" } },
    );
  });

  it("skips when there is no config file", async () => {
    await withConfigHome({}, async (home) => {
      await fs.rm(home.configPath);

      const report = await fixConfigContent();

      expect(report).toMatchObject({ status: "skipped" });
      expect(report.reason).toContain("not found");
      await expect(fs.access(home.configPath)).rejects.toThrow();
    });
  });

  it("skips a file that does not parse", async () => {
    await withConfigHome({}, async (home) => {
      await fs.writeFile(home.configPath, "{ gateway: ", "utf-8");

      const report = await fixConfigContent();

      expect(report).toMatchObject({ status: "skipped" });
      expect(report.reason).toContain("parse");
      expect(await fs.readFile(home.configPath, "utf-8")).toBe("{ gateway: ");
    });
  });

  it("keeps the writer's size-drop guard: a repair that removes most of the file is not written", async () => {
    await withConfigHome(
      { gateway: { mode: "local" }, bogusBlob: "x".repeat(2000) },
      async (home) => {
        const report = await fixConfigContent();

        expect(report).toMatchObject({ status: "write-failed" });
        expect(report.error).toContain("size-drop");
        expect(await fs.readFile(home.configPath, "utf-8")).toBe(home.originalRaw);
      },
    );
  });
});
