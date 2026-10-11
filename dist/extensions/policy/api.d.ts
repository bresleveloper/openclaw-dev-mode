import "../../types.openclaw-DTrzhGcB.js";
import { t as HealthCheck } from "../../health-CklxGczV.js";
import "../../resolve-route-UAjY61ss.js";
import "../../provider-credential-values-Czw0lR4-.js";
import { z } from "zod";
//#region extensions/policy/src/doctor/register.d.ts
type PolicyDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
export declare function registerPolicyDoctorChecks(host?: PolicyDoctorRegistrationHost): void;
//#endregion