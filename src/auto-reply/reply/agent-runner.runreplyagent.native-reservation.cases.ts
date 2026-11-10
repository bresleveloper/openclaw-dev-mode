import { expect, it, vi, type Mock } from "vitest";
import {
  awaitGateBeforeSettlement,
  createDeferred,
  withinTest,
} from "../../../test/helpers/promise.js";
import type { SessionEntry } from "../../config/sessions.js";
import { replaceSessionEntry } from "../../config/sessions/session-accessor.js";
import * as entryReads from "../../config/sessions/session-entry-read-runtime.js";
import type { TemplateContext } from "../templating.js";
import type { InternalGetReplyOptions } from "./get-reply.types.js";
import { withMessageInjectionAdmission } from "./message-injection-authority.js";
import { enqueueFollowupRun, type FollowupRun } from "./queue.js";
import {
  createReplyOperation,
  replyRunRegistry,
  type ReplyOperation,
} from "./reply-run-registry.js";
import { getReplyOperationSessionReader } from "./reply-run-registry.state.js";
import { admitReplyTurn } from "./reply-turn-admission.js";

type NativeReservationFixture = {
  createMinimalRun: (params: {
    opts: InternalGetReplyOptions;
    attachSteerBackend: boolean;
    sessionKey: string;
    sessionEntry: SessionEntry;
    sessionStore: Record<string, SessionEntry>;
    storePath: string;
    isActive: boolean;
    shouldSteer: boolean;
    resolvedQueueMode: string;
    replyOperation: ReplyOperation;
    sessionCtx: Partial<TemplateContext>;
    runOverrides: Partial<FollowupRun["run"]>;
  }) => { run: () => Promise<unknown> };
  makeSessionEntry: (overrides?: Partial<SessionEntry>) => SessionEntry;
  makeSessionFixture: (
    overrides?: Partial<SessionEntry>,
    sessionKey?: string,
  ) => Promise<{
    sessionEntry: SessionEntry;
    sessionStore: Record<string, SessionEntry>;
    storePath: string;
  }>;
  parkedSteer: {
    admit: Pick<Mock<() => Promise<"steer">>, "mockImplementationOnce">;
    fallback: Mock;
  };
  sessionKeys: Set<string>;
  state: {
    queueEmbeddedAgentMessageMock: Mock;
    runEmbeddedAgentMock: Mock;
    activeBackendCancelMock: Mock;
  };
};

export function registerNativeReservationCases({
  createMinimalRun,
  makeSessionEntry,
  makeSessionFixture,
  parkedSteer,
  sessionKeys,
  state,
}: NativeReservationFixture): void {
  it.for([
    { sourceState: "current", revokeAt: "before-read" },
    { sourceState: "aborted", revokeAt: "before-read" },
    { sourceState: "released", revokeAt: "before-read" },
    { sourceState: "aborted", revokeAt: "target-read" },
    { sourceState: "released", revokeAt: "target-read" },
    { sourceState: "aborted", revokeAt: "steer-preparation" },
    { sourceState: "released", revokeAt: "steer-preparation" },
    { sourceState: "aborted", revokeAt: "backend-preparation" },
    { sourceState: "released", revokeAt: "backend-preparation" },
  ] as const)(
    "steers with a $sourceState source-keyed native reservation revoked at $revokeAt only while it is current",
    async ({ sourceState, revokeAt }, { signal }) => {
      // A native command continuation whose target-slot adoption was skipped
      // (#104844) still carries its slash-source reservation; steering must
      // target the operation that owns this session's run slot.
      const targetKey = "agent:main:discord:channel:steer-target";
      const sourceKey = "agent:main:discord:slash:steer-user";
      const { sessionEntry, sessionStore, storePath } = await makeSessionFixture(
        { sessionId: "target-active-session" },
        targetKey,
      );
      const sourceEntry = makeSessionEntry({ sessionId: "source-reservation-session" });
      await replaceSessionEntry({ storePath, sessionKey: sourceKey }, sourceEntry);
      const admitted = await admitReplyTurn({
        agentId: "main",
        sessionKey: sourceKey,
        sessionId: sourceEntry.sessionId,
        storePath,
        kind: "visible",
        resetTriggered: false,
      });
      if (admitted.status !== "owned") {
        throw new Error("Expected native command source admission");
      }
      sessionKeys.add(sourceKey);
      expect(getReplyOperationSessionReader(admitted.operation)).toBeDefined();
      state.queueEmbeddedAgentMessageMock.mockReturnValueOnce(true);
      const targetOwner = createReplyOperation({
        sessionKey: targetKey,
        sessionId: "target-active-session",
        resetTriggered: false,
      });
      targetOwner.setPhase("running");
      const preparationStarted = createDeferred();
      const continuePreparation = createDeferred();
      const readSessionEntryInWorker = entryReads.readSessionEntryInWorker;
      const targetRead =
        revokeAt === "target-read"
          ? vi
              .spyOn(entryReads, "readSessionEntryInWorker")
              .mockImplementationOnce(async (...args) => {
                // Keep the real SQLite read and its authority checks; hold only
                // publication of its result to the awaiting runner.
                const entry = await readSessionEntryInWorker(...args);
                preparationStarted.resolve();
                await continuePreparation.promise;
                return entry;
              })
          : undefined;
      if (revokeAt === "steer-preparation") {
        parkedSteer.admit.mockImplementationOnce(async () => {
          preparationStarted.resolve();
          await continuePreparation.promise;
          return "steer";
        });
      }
      const { run } = createMinimalRun({
        opts: { abortSignal: admitted.operation.abortSignal },
        attachSteerBackend: false,
        sessionKey: targetKey,
        sessionEntry,
        sessionStore,
        storePath,
        isActive: true,
        shouldSteer: true,
        resolvedQueueMode: "steer",
        replyOperation: admitted.operation,
        sessionCtx: {
          Provider: "discord",
          SessionKey: sourceKey,
          CommandTargetSessionKey: targetKey,
          CommandSource: "native",
        },
        runOverrides: {
          agentId: "main",
          sessionId: sessionEntry.sessionId,
          sessionKey: targetKey,
          config: { session: { store: storePath } },
        },
      });
      targetOwner.attachBackend({
        kind: "embedded",
        cancel: state.activeBackendCancelMock,
        messageInjectionV2: {
          version: 2,
          isAvailable: () => true,
          async queueMessage() {
            throw new Error("Native steering requires awaited source-bound preparation");
          },
          async queueMessageAsync(prompt, options, preparation, authorityKind) {
            expect(authorityKind).toBe("source-bound");
            if (revokeAt === "backend-preparation") {
              preparationStarted.resolve();
              await continuePreparation.promise;
            }
            await withMessageInjectionAdmission(preparation.prepareCurrent, () => {
              preparation.assertCurrent();
              state.queueEmbeddedAgentMessageMock(targetOwner.sessionId, prompt, options);
              options?.onQueueAccepted?.(true);
            });
          },
        },
      });
      let pending: ReturnType<typeof run> | undefined;
      try {
        if (sourceState !== "current") {
          if (revokeAt !== "before-read") {
            pending = run();
            void pending.catch(() => {});
            await withinTest(
              awaitGateBeforeSettlement(
                preparationStarted.promise,
                pending,
                "Native steering settled before its awaited preparation",
              ),
              signal,
            );
          }
          if (sourceState === "aborted") {
            expect(admitted.operation.abortByUser()).toBe(true);
          } else {
            admitted.operation.complete();
          }
          continuePreparation.resolve();
          const revokedRun = pending ?? run();
          await Promise.allSettled([revokedRun]);
          expect(state.queueEmbeddedAgentMessageMock).not.toHaveBeenCalled();
          expect(parkedSteer.fallback).not.toHaveBeenCalled();
          expect(vi.mocked(enqueueFollowupRun)).not.toHaveBeenCalled();
          expect(state.runEmbeddedAgentMock).not.toHaveBeenCalled();
          expect(replyRunRegistry.get(targetKey)).toBe(targetOwner);
          if (sourceState === "aborted") {
            await expect(revokedRun).rejects.toBe(admitted.operation.abortSignal.reason);
          } else {
            await expect(revokedRun).rejects.toThrow(
              "Agent database execution reference is released",
            );
          }
          return;
        }
        await expect(run()).resolves.toBeUndefined();
        expect(state.queueEmbeddedAgentMessageMock).toHaveBeenCalledExactlyOnceWith(
          "target-active-session",
          "hello",
          expect.objectContaining({ steeringMode: "all" }),
        );
        expect(state.runEmbeddedAgentMock).not.toHaveBeenCalled();
        expect(replyRunRegistry.get(targetKey)).toBe(targetOwner);
      } finally {
        continuePreparation.resolve();
        await Promise.allSettled(pending ? [pending] : []);
        targetRead?.mockRestore();
        targetOwner.complete();
        admitted.operation.complete();
      }
    },
  );
}
