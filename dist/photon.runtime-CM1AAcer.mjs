import photon from "@silvia-odwyer/photon-node";
//#region src/media/photon.runtime.ts
/** Decode validated BMP bytes only after Rastermill rejects the format. */
function convertBmpToPngWithPhoton(buffer) {
	let image;
	try {
		image = photon.PhotonImage.new_from_byteslice(buffer);
		const bytes = image.get_bytes();
		return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	} finally {
		image?.free();
	}
}
//#endregion
export { convertBmpToPngWithPhoton };
