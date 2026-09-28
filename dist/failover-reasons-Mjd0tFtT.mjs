//#region packages/gateway-protocol/src/failover-reasons.ts
const FAILOVER_REASONS = [
	"auth",
	"auth_permanent",
	"format",
	"rate_limit",
	"overloaded",
	"billing",
	"server_error",
	"timeout",
	"tls_certificate",
	"context_overflow",
	"model_not_found",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
];
//#endregion
export { FAILOVER_REASONS as t };
