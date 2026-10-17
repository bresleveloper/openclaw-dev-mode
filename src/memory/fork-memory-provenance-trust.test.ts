// SEC-103 (openclaw-dev-mode fork): dev-mode never marks the agent's memory files untrusted.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveBootstrapFilesForPreparation } from "../agents/bootstrap-files.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  listMemoryArtifactProvenance,
  type MemoryArtifactOriginClass,
  readMemoryArtifactProvenance,
  recordMemoryArtifactWriteProvenance,
} from "./memory-artifact-provenance.js";

// The bootstrap gate asks the memory plugin to classify MEMORY.md; pin the answer to "untrusted".
vi.mock("../plugins/memory-runtime.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../plugins/memory-runtime.js")>()),
  classifyActiveMemoryWorkspacePaths: vi.fn(async (params: { relativePaths: string[] }) => ({
    status: "classified" as const,
    classifications: params.relativePaths.map((relativePath) => ({
      relativePath,
      originClass: "untrusted",
    })),
  })),
}));

const previousDevMode = process.env.OPENCLAW_DEV_MODE;
let workspaceDir: string;

function setDevMode(on: boolean) {
  if (on) {
    process.env.OPENCLAW_DEV_MODE = "1";
  } else {
    delete process.env.OPENCLAW_DEV_MODE;
  }
}

async function writeMemory(
  originClass: MemoryArtifactOriginClass,
  contentBefore: string,
  contentAfter: string,
) {
  await recordMemoryArtifactWriteProvenance({
    workspaceDir,
    relativePath: "MEMORY.md",
    contentBefore,
    contentAfter,
    originClass,
    observedAt: Date.now(),
  });
}

async function memoryLabel() {
  return (await readMemoryArtifactProvenance({ workspaceDir, relativePath: "MEMORY.md" }))
    ?.originClass;
}

describe("SEC-103 memory provenance trust", () => {
  beforeEach(async () => {
    workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-sec103-"));
  });

  afterEach(async () => {
    if (previousDevMode === undefined) {
      delete process.env.OPENCLAW_DEV_MODE;
    } else {
      process.env.OPENCLAW_DEV_MODE = previousDevMode;
    }
    await fs.rm(workspaceDir, { recursive: true, force: true });
  });

  it("records a write from a tainted turn as agent", async () => {
    setDevMode(true);
    await writeMemory("untrusted", "", "remember X");
    setDevMode(false);
    // The stored row itself says agent, not just the dev-mode read of it.
    expect(await memoryLabel()).toBe("agent");
  });

  it("reads labels stored before dev-mode as agent; upstream still quarantines them", async () => {
    setDevMode(false);
    await writeMemory("untrusted", "", "written in a web-tainted turn");
    expect(await memoryLabel()).toBe("untrusted");
    setDevMode(true);
    expect(await memoryLabel()).toBe("agent");
    expect(await listMemoryArtifactProvenance({ workspaceDir })).toEqual([
      { relativePath: "MEMORY.md", provenance: expect.objectContaining({ originClass: "agent" }) },
    ]);
  });

  it("an out-of-band edit no longer turns the next clean write untrusted", async () => {
    setDevMode(false);
    await writeMemory("agent", "", "v1");
    // Upstream: the file changed outside OpenClaw (hand edit, claude-cli Edit), so a clean
    // write is quarantined.
    await writeMemory("agent", "v1 edited by hand", "v2");
    expect(await memoryLabel()).toBe("untrusted");
    setDevMode(true);
    await writeMemory("agent", "v2 edited by hand", "v3");
    setDevMode(false);
    expect(await memoryLabel()).toBe("agent");
  });

  it("keeps MEMORY.md in the bootstrap context even when classified untrusted", async () => {
    await fs.writeFile(path.join(workspaceDir, "MEMORY.md"), "# Memory\n- remember X\n");
    const loadsMemory = async () => {
      const files = await resolveBootstrapFilesForPreparation({
        workspaceDir,
        config: {} as OpenClawConfig,
        agentId: "main",
      });
      return files.some((file) => file.name === "MEMORY.md" && !file.missing);
    };
    setDevMode(false);
    expect(await loadsMemory()).toBe(false);
    setDevMode(true);
    expect(await loadsMemory()).toBe(true);
  });
});
