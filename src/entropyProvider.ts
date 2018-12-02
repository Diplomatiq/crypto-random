export class EntropyProvider {
    /**
     * The crypto implementation. The window.crypto object is used.
     */
    private static readonly cryptoImpl: Crypto = window.crypto;

    /**
     * According to the standard, there is a 2 ** 16 bytes quota for requesting entropy.
     */
    private static readonly ENTROPY_QUOTA_BYTES = 65536;

    /**
     * Puts random values into the given @param typedArray parameter.
     * If the array's length is greater than the general @member ENTROPY_QUOTA_BYTES,
     * it is divided into chunks, and filled chunk-by-chunk.
     */
    public static async getRandomValues<
        T extends Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array
    >(array: T): Promise<void> {
        if (array.byteLength <= this.ENTROPY_QUOTA_BYTES) {
            this.cryptoImpl.getRandomValues(array);
            return;
        }

        let remainingBytes = array.byteLength;
        while (remainingBytes > 0) {
            const availableEntropyBytes = Math.min(remainingBytes, this.ENTROPY_QUOTA_BYTES);
            const chunkStart = array.byteLength - remainingBytes;
            const chunkLength = availableEntropyBytes / array.BYTES_PER_ELEMENT;
            const chunkEnd = chunkStart + chunkLength;
            const chunkToFill = array.subarray(chunkStart, chunkEnd);
            this.cryptoImpl.getRandomValues(chunkToFill);
            remainingBytes -= availableEntropyBytes;
        }
    }
}
