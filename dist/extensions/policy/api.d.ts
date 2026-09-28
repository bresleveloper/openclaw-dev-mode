import "../../types.openclaw-BGrO5JfP.js";
import { t as HealthCheck } from "../../health-C0P8Bic_.js";
import "../../resolve-route-DuMTxF_9.js";
import "../../provider-credential-values-nrrMbx8B.js";
import { z } from "zod";
//#region extensions/policy/src/doctor/register.d.ts
type PolicyDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
export declare function registerPolicyDoctorChecks(host?: PolicyDoctorRegistrationHost): void;
//#endregion