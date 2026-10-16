//#region src/state/openclaw-state-lease-heartbeat-shared.ts
const LEASE_HEARTBEAT_START_TIMEOUT_MS = 6e4;
const LEASE_CONTENTION_RETRY_TIMEOUT_MS = 2e3;
const leaseHeartbeatState = {
	status: 0,
	request: 1,
	ack: 2,
	expiresAt: 3,
	lastRenewedAt: 4,
	startupPhase: 5,
	starting: 0n,
	ready: 1n,
	closed: 2n,
	lost: 3n
};
const leaseHeartbeatStartupPhase = {
	"entry-not-observed": 0n,
	"body-entry": 1n,
	"open-complete": 2n,
	"initial-renew-start": 3n,
	"initial-renew-returned": 4n
};
//#endregion
export { leaseHeartbeatState as i, LEASE_HEARTBEAT_START_TIMEOUT_MS as n, leaseHeartbeatStartupPhase as r, LEASE_CONTENTION_RETRY_TIMEOUT_MS as t };
