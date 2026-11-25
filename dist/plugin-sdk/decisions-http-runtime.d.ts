import "../types.openclaw-D8uW-XQA.js";
import { f as ModelRequestHeaders } from "../types-B1zI2CfC.js";
import { t as ModelProviderRequestTransportOverrides } from "../provider-request-config.types-BDimJcpZ.js";
import { h as DecisionExecutionContext, i as ProviderFailureReason, r as ProviderDecisionOutcomeV2, t as DecisionProviderContextV2, x as ResolvedProviderAuth } from "../provider-context-BvC7EnIY.js";
export type DecisionHttpUnavailable = Extract<ProviderDecisionOutcomeV2, {
  status: "unavailable";
}>;
/** Provider-owned facts for one Decision HTTP request. */
export type DecisionHttpRoute<T> = {
  readonly provider: string;
  /** API prefix; `endpointPath` is appended to it. */
  readonly baseUrl: string;
  readonly endpointPath: string;
  /** Serialized JSON request. Omit for a GET request. */
  readonly body?: string;
  /** Auth headers for the active credential. Defaults to `Authorization: Bearer <key>`. */
  readonly authHeaders?: (apiKey: string) => ModelRequestHeaders;
  /** Non-secret headers that describe this body; they win, and `null` removes one. */
  readonly requestHeaders?: ModelRequestHeaders;
  /** Decodes the bounded JSON response. A throw means an invalid response. */
  readonly decode: (payload: unknown) => T | DecisionHttpUnavailable;
  /** Documented provider statuses that differ from the shared mapping. */
  readonly statusReason?: (status: number) => ProviderFailureReason | undefined;
  readonly maxResponseBytes?: number;
};
export type DecisionHttpExecution<T> = DecisionExecutionContext & DecisionHttpRoute<T> & {
  readonly auth: Readonly<Pick<ResolvedProviderAuth, "apiKey" | "mode">>;
  readonly headers?: ModelRequestHeaders | undefined;
  readonly request?: ModelProviderRequestTransportOverrides | undefined;
};
/** Project the host-prepared context without loading a plugin's host-harness facade. */
export declare function evaluateDecisionHttp<T = ProviderDecisionOutcomeV2>(context: DecisionProviderContextV2, route: DecisionHttpRoute<T>): Promise<T | DecisionHttpUnavailable>;
/**
 * Execute one provider-owned JSON Decision request with prepared auth.
 * Admission is checked once when the request starts; a request that passed may finish.
 */
export declare function executeDecisionHttp<T = ProviderDecisionOutcomeV2>(execution: DecisionHttpExecution<T>): Promise<T | DecisionHttpUnavailable>;