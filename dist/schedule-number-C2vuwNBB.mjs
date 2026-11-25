import{o as asDateTimestampMs,w as parseStrictFiniteNumber}from"./number-coercion-B3CfI447.mjs";
//!src/cron/schedule-number.ts
function coerceFiniteScheduleNumber(e){const t=parseStrictFiniteNumber(e);return asDateTimestampMs(t)}export{coerceFiniteScheduleNumber as t};