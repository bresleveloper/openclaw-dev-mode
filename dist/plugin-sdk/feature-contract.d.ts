import { Static, TSchema } from "typebox";
//#region src/plugin-sdk/feature-contract.d.ts
export type FeatureDisposer = () => void;
/** A connection-owned transport usable from browsers or other feature clients. */
export type FeatureTransport = {
  readonly pluginId: string;
  readonly signal: AbortSignal;
  readonly connection: {
    connected: boolean;
  };
  request: <T = unknown>(method: string, params?: Record<string, unknown>) => Promise<T>;
  onEvent: (event: string, listener: (payload: unknown) => void) => FeatureDisposer;
  subscribe: (listener: () => void) => FeatureDisposer;
};
export type FeatureOperation = {
  kind: "query" | "action";
  description: string;
  input: TSchema;
  output: TSchema;
  tool?: {
    name: string;
    label?: string;
    optional?: boolean;
  };
};
export type FeatureContract = {
  pluginId: string;
  operations: Readonly<Record<string, FeatureOperation>>;
  events: Readonly<Record<string, TSchema>>;
};
export type FeatureOperationName<C extends FeatureContract> = keyof C["operations"] & string;
export type FeatureEventName<C extends FeatureContract> = keyof C["events"] & string;
export type FeatureInput<C extends FeatureContract, K extends FeatureOperationName<C>> = Static<C["operations"][K]["input"]>;
export type FeatureOutput<C extends FeatureContract, K extends FeatureOperationName<C>> = Static<C["operations"][K]["output"]>;
export type FeatureEvent<C extends FeatureContract, K extends FeatureEventName<C>> = Static<C["events"][K]>;
export type FeatureQueryName<C extends FeatureContract> = { [K in FeatureOperationName<C>]: C["operations"][K]["kind"] extends "query" ? K : never; }[FeatureOperationName<C>];
export type FeatureRequestOptions = {
  sessionKey?: string;
  agentId?: string;
};
export declare function defineFeatureContract<const C extends FeatureContract>(contract: C): C;
export type FeatureClient<C extends FeatureContract> = {
  invoke: <K extends FeatureOperationName<C>>(operation: K, input: FeatureInput<C, K>, options?: FeatureRequestOptions) => Promise<FeatureOutput<C, K>>;
  on: <K extends FeatureEventName<C>>(event: K, listener: (payload: FeatureEvent<C, K>) => void) => FeatureDisposer;
  watch: <K extends FeatureQueryName<C>>(operation: K, input: FeatureInput<C, K>, options: FeatureRequestOptions & {
    events: readonly FeatureEventName<C>[];
    onChange: (output: FeatureOutput<C, K>) => void;
    onError: (error: Error) => void;
  }) => FeatureDisposer;
};
/** Uses only the current browser connection; it does not mint scopes or a backend client. */
export declare function createFeatureClient<C extends FeatureContract>(contract: C, host: FeatureTransport): FeatureClient<C>;
//#endregion