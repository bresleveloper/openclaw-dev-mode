import { c as resolveRetryConfig, d as sleepWithAbort } from "../src-Bzfi3cQM.mjs";
import { t as retryAsync } from "../retry-DwDRpCWu.mjs";
import { n as isTransientNetworkError } from "../retryable-network-errors-D2gJmBqw.mjs";
import { t as parseRetryAfterHeaderSeconds } from "../retry-after-CxjQxTZn.mjs";
import { i as createRateLimitRetryRunner, n as CHANNEL_API_RETRY_DEFAULTS, r as createChannelApiRetryRunner, t as classifyTransientNetworkErrorCode } from "../retry-runtime-CUY_Gz8_.mjs";
export { CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS, classifyTransientNetworkErrorCode, createChannelApiRetryRunner, createChannelApiRetryRunner as createTelegramRetryRunner, createRateLimitRetryRunner, isTransientNetworkError, parseRetryAfterHeaderSeconds, resolveRetryConfig, retryAsync, sleepWithAbort };
