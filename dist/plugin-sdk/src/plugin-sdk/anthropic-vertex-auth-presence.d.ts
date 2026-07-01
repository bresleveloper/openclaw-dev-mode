/**
 * Return whether Anthropic Vertex can authenticate through GCP metadata or ADC credentials.
 * This is a preflight signal only; provider calls still perform their own auth validation.
 */
export declare function hasAnthropicVertexAvailableAuth(env?: NodeJS.ProcessEnv): boolean;
