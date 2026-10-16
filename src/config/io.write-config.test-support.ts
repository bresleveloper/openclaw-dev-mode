import fs from "node:fs/promises";
import path from "node:path";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import { createPathResolutionEnv, withEnvAsync } from "../test-utils/env.js";

export function createConfigWriteHomeFixture(makeHome: (prefix: string) => Promise<string>) {
  return async <T>(fn: (home: string) => Promise<T>): Promise<T> => {
    const home = await makeHome("case");
    return withEnvAsync(
      createPathResolutionEnv(home, {
        // Env-only state readers and global write metadata must share the injected IO home.
        OPENCLAW_CONFIG_PATH: undefined,
        OPENCLAW_DEFER_SHELL_ENV_FALLBACK: undefined,
        OPENCLAW_LOAD_SHELL_ENV: undefined,
        OPENCLAW_SHELL_ENV_TIMEOUT_MS: undefined,
      }),
      () => fn(home),
    );
  };
}

export const defaultedDemoPluginRegistry = {
  diagnostics: [],
  plugins: [
    {
      id: "demo",
      origin: "bundled",
      enabledByDefault: true,
      channels: [],
      providers: [],
      cliBackends: [],
      skills: [],
      hooks: [],
      rootDir: "/tmp/openclaw-test-demo",
      source: "/tmp/openclaw-test-demo/index.ts",
      manifestPath: "/tmp/openclaw-test-demo/openclaw.plugin.json",
      configSchema: {
        type: "object",
        properties: { mode: { type: "string", default: "auto" } },
        additionalProperties: true,
      },
    },
  ],
} satisfies PluginManifestRegistry;

export function configPathForHome(home: string, fileName = "openclaw.json") {
  return path.join(home, ".openclaw", fileName);
}

export function formatConfig(config: unknown) {
  return `${JSON.stringify(config, null, 2)}\n`;
}

export async function writeConfigFixture(home: string, config: unknown) {
  const configPath = configPathForHome(home);
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  const raw = formatConfig(config);
  await fs.writeFile(configPath, raw, "utf-8");
  return { configPath, raw };
}
