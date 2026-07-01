/** Gateway/device Ed25519 identity used for APNs relay and gateway authentication. */
export type DeviceIdentity = {
    deviceId: string;
    publicKeyPem: string;
    privateKeyPem: string;
};
/** Load a valid persisted identity, repair/migrate when safe, or create a new one. */
export declare function loadOrCreateDeviceIdentity(filePath?: string): DeviceIdentity;
/** Load a valid persisted device identity without creating, repairing, or migrating files. */
export declare function loadDeviceIdentityIfPresent(filePath?: string): DeviceIdentity | null;
/** Sign a UTF-8 payload with a PEM Ed25519 private key and return base64url bytes. */
export declare function signDevicePayload(privateKeyPem: string, payload: string): string;
/** Normalize PEM or raw base64/base64url public keys to canonical raw base64url bytes. */
export declare function normalizeDevicePublicKeyBase64Url(publicKey: string): string | null;
/** Derive the stable device id from PEM or raw base64/base64url public key material. */
export declare function deriveDeviceIdFromPublicKey(publicKey: string): string | null;
/** Export a PEM Ed25519 public key as canonical raw base64url bytes. */
export declare function publicKeyRawBase64UrlFromPem(publicKeyPem: string): string;
/** Verify a UTF-8 payload signature against PEM or raw base64/base64url public key material. */
export declare function verifyDeviceSignature(publicKey: string, payload: string, signatureBase64Url: string): boolean;
