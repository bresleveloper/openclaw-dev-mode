import { c as resolveRetryConfig, d as sleepWithAbort } from "../src-D1BHGNTj.mjs";
import { t as parseRetryAfterHeaderSeconds } from "../retry-after-D_Ri68m5.mjs";
import { t as retryAsync } from "../retry-DH6xHyXB.mjs";
import { n as isTransientNetworkError } from "../retryable-network-errors-D2gJmBqw.mjs";
import { i as createRateLimitRetryRunner, n as CHANNEL_API_RETRY_DEFAULTS, r as createChannelApiRetryRunner, t as classifyTransientNetworkErrorCode } from "../retry-runtime-CZf8_bHp.mjs";
export { CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS, classifyTransientNetworkErrorCode, createChannelApiRetryRunner, createChannelApiRetryRunner as createTelegramRetryRunner, createRateLimitRetryRunner, isTransientNetworkError, parseRetryAfterHeaderSeconds, resolveRetryConfig, retryAsync, sleepWithAbort };
