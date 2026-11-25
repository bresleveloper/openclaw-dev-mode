import "./config-contracts-hzlacViZ.js";
import { Dt as ModelDecisionCapabilities, Et as DecisionAnswerCapabilities } from "./types.openclaw-D8uW-XQA.js";
import { _ as DecisionEntry, l as DecisionBatchResultV2, o as DecisionBatch, s as DecisionBatchResult, u as DecisionBatchV2 } from "./provider-context-BvC7EnIY.js";
/** Malformed input throws; unsupported size or unrepresentable data returns undefined. */
declare function decisionBatchV1ToV2(batch: unknown): DecisionBatchV2 | undefined;
type V1RepresentableBatch = DecisionBatchV2 & {
  readonly state: {
    readonly type: "text";
    readonly text: string;
  } | {
    readonly type: "json";
    readonly value: Exclude<DecisionEntry, string>;
  };
  readonly questions: DecisionBatch["questions"];
};
/** Validate V2 input and narrow to the losslessly representable V1 subset without conversion. */
declare function isDecisionBatchV1Representable(batch: unknown): batch is V1RepresentableBatch;
/** Never sends native-only inputs to V1, or changes explicit JSON strings into text. */
declare function decisionBatchV2ToV1(batch: DecisionBatchV2): DecisionBatch | undefined;
/** Preserve provider estimates and labels verbatim; never threshold or take an argmax. */
declare function decisionResultV1ToV2(batch: DecisionBatch, result: DecisionBatchResult): DecisionBatchResultV2 | undefined;
/** Narrow only losslessly: V1 cannot carry explicit decisions, errors, or extra usage/metadata. */
declare function decisionResultV2ToV1(batch: DecisionBatchV2, result: DecisionBatchResultV2): DecisionBatchResult | undefined;
/** Malformed caller data throws; finite supported-shape data over resource bounds returns false. */
declare function validateDecisionBatchV2(batch: unknown): batch is DecisionBatchV2;
/** A partial provider failure is explicit data, never a negative or fabricated answer. */
declare function validateDecisionResultV2(batch: DecisionBatchV2, value: unknown, capabilities?: DecisionAnswerCapabilities | ModelDecisionCapabilities): value is DecisionBatchResultV2;
/** A caller contract defect is not a provider outage. Never include evidence in errors. */
declare class DecisionContractError extends Error {
  constructor();
}
/** Callers admit their supported question kinds before encoding the wire names. */
declare function encodeSystemOneQuestions(batch: DecisionBatchV2): {
  [k: string]: {
    instructions?: DecisionEntry;
    type: string;
  } | {
    instructions: Exclude<DecisionEntry, null>;
    type: string;
  } | {
    instructions?: DecisionEntry;
    criteria: Readonly<Record<string, DecisionEntry>>;
    type: string;
  } | {
    instructions?: DecisionEntry;
    criteria: Readonly<Record<string, DecisionEntry>>;
    type: string;
  } | {
    instructions?: DecisionEntry;
    criteria: readonly DecisionEntry[];
    type: string;
  } | {
    instructions?: DecisionEntry;
    criteria?: {
      readonly true?: DecisionEntry;
      readonly false?: DecisionEntry;
    } | null;
    type: string;
  };
};
/** Decode native estimates without normalizing distributions or recomputing scores. */
declare function decodeSystemOneResponse(batch: DecisionBatchV2, response: unknown, options?: {
  readonly confidence: "optional";
}): unknown;
export { validateDecisionBatchV2 as a, decisionResultV1ToV2 as c, validateDecisionResultV2 as i, decisionResultV2ToV1 as l, encodeSystemOneQuestions as n, decisionBatchV1ToV2 as o, DecisionContractError as r, decisionBatchV2ToV1 as s, decodeSystemOneResponse as t, isDecisionBatchV1Representable as u };