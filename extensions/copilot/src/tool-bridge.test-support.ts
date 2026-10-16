import type { Tool as SdkTool, ToolInvocation } from "@github/copilot-sdk";
import { expectDefined } from "@openclaw/normalization-core";
import { createOpenClawCodingTools as createRealOpenClawCodingTools } from "openclaw/plugin-sdk/agent-harness";
import type { AnyAgentTool } from "openclaw/plugin-sdk/agent-harness-runtime";
import { vi } from "vitest";
import { createCopilotTestHostCapabilities } from "./host-capability.test-support.js";
import { createCopilotToolBridge as createCopilotToolBridgeImpl } from "./tool-bridge.js";

export type CopilotToolBridgeInput = Parameters<typeof createCopilotToolBridgeImpl>[0];
type CopilotToolBridgeAttemptParams = NonNullable<CopilotToolBridgeInput["attemptParams"]>;
type CopilotToolBridgeTestInput = Omit<
  CopilotToolBridgeInput,
  "agentId" | "attemptParams" | "modelId" | "modelProvider" | "sessionId" | "spawnWorkspaceDir"
> &
  Partial<Pick<CopilotToolBridgeInput, "agentId" | "modelId" | "modelProvider" | "sessionId">> & {
    createOpenClawCodingTools?: typeof createRealOpenClawCodingTools;
    sessionKey?: string;
    abortSignal?: AbortSignal;
    spawnWorkspaceDir?: CopilotToolBridgeInput["spawnWorkspaceDir"];
    attemptParams?: Omit<CopilotToolBridgeAttemptParams, "hostCapabilities"> &
      Partial<Pick<CopilotToolBridgeAttemptParams, "hostCapabilities">>;
  };
export type CopilotCodingToolsOptions = NonNullable<
  Parameters<typeof createRealOpenClawCodingTools>[0]
>;
const testHostCapabilities = createCopilotTestHostCapabilities(createRealOpenClawCodingTools);

export function createCopilotToolBridge(input: CopilotToolBridgeTestInput) {
  const { attemptParams, createOpenClawCodingTools, sessionKey, abortSignal, ...baseInput } = input;
  const preparedInput: CopilotToolBridgeInput = {
    agentId: "agent-1",
    modelId: "gpt-4o",
    modelProvider: "github-copilot",
    sessionId: "session-1",
    spawnWorkspaceDir: undefined,
    ...baseInput,
    attemptParams: {
      ...attemptParams,
      sessionKey: attemptParams?.sessionKey ?? sessionKey,
      abortSignal: abortSignal ?? attemptParams?.abortSignal,
      hostCapabilities:
        attemptParams?.hostCapabilities ??
        (createOpenClawCodingTools
          ? createCopilotTestHostCapabilities(createOpenClawCodingTools)
          : testHostCapabilities),
    },
  };
  return createCopilotToolBridgeImpl(preparedInput);
}
type ConvertToolOptions = Pick<CopilotToolBridgeInput, "onToolCompleted"> &
  Pick<CopilotToolBridgeAttemptParams, "abortSignal"> & {
    onAgentToolResult?: NonNullable<CopilotToolBridgeInput["attemptParams"]>["onAgentToolResult"];
    observeToolTerminal?: NonNullable<
      CopilotToolBridgeInput["attemptParams"]
    >["observeToolTerminal"];
  };

export async function convertOpenClawToolToSdkToolForTest(
  sourceTool: AnyAgentTool,
  options: ConvertToolOptions,
): Promise<SdkTool> {
  const bridge = await createCopilotToolBridge({
    abortSignal: options.abortSignal,
    allowModelTools: true,
    attemptParams: {
      // Conversion targets the direct SDK handler; default Tool Search would catalog the tool.
      config: { tools: { toolSearch: false } },
      ...(options.onAgentToolResult ? { onAgentToolResult: options.onAgentToolResult } : {}),
      ...(options.observeToolTerminal ? { observeToolTerminal: options.observeToolTerminal } : {}),
    },
    createOpenClawCodingTools: () => [sourceTool],
    modelId: "gpt-test",
    onToolCompleted: options.onToolCompleted,
  });
  return expectDefined(bridge.promptToolPolicy.apply().tools[0], "Copilot SDK tool");
}

export function makeInvocation(overrides: Partial<ToolInvocation> = {}): ToolInvocation {
  return {
    arguments: { value: "input" },
    sessionId: "session-1",
    toolCallId: "call-1",
    toolName: "tool-a",
    ...overrides,
  };
}

export function runSdkTool(tool: SdkTool, args: unknown, invocation = makeInvocation()) {
  if (!tool.handler) {
    throw new Error(`SDK tool '${tool.name}' has no handler`);
  }
  return tool.handler(args, invocation);
}

type FakeTool = AnyAgentTool & {
  execute: ReturnType<typeof vi.fn>;
  prepareArguments?: ReturnType<typeof vi.fn>;
};

export function makeTool(
  overrides: Partial<FakeTool> = {},
  result: { content?: unknown; details: unknown } = {
    content: [{ text: "done", type: "text" }],
    details: null,
  },
): FakeTool {
  return {
    description: "A fake tool",
    execute: vi.fn(async () => result),
    label: "Fake Tool",
    name: "tool-a",
    parameters: {
      properties: { value: { type: "string" } },
      type: "object",
    } as never,
    ...overrides,
  } as unknown as FakeTool;
}

export function makeTools(...names: string[]) {
  return names.map((name) => makeTool({ name }));
}

export function sdkToolNamed(
  bridge: Awaited<ReturnType<typeof createCopilotToolBridge>>,
  name: string,
) {
  return expectDefined(
    bridge.promptToolPolicy.apply().tools.find((tool) => tool.name === name),
    name,
  );
}
