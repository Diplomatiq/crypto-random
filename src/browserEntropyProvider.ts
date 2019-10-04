import { EntropyProvider } from './entropyProvider';
import { UnsignedTypedArray } from './unsignedTypedArray';

export class BrowserEntropyProvider implements EntropyProvider {
    /**
     * The crypto implementation used in the browser. The window.crypto object is used.
     */
    private readonly crypto?: Crypto;

    /**
     * According to the Web Crypto standard, there is a 2 ** 16 bytes quota for requesting entropy at once.
     */
    private static readonly BROWSER_ENTROPY_QUOTA_BYTES = 65536;

    public constructor() {
        if (
            typeof window === 'undefined' ||
            typeof window.crypto === 'undefined' ||
            typeof window.crypto.getRandomValues === 'undefined'
        ) {
            throw new Error('window.crypto.getRandomValues is not available');
        }

        this.crypto = window.crypto;
    }

    /**
     * Puts random values into the given @param array, and returns the array.
     * If the array's length is greater than the general @member BROWSER_ENTROPY_QUOTA_BYTES,
     * it is divided into chunks, and filled chunk-by-chunk.
     */
    public getRandomValues<T extends UnsignedTypedArray>(array: T): T {
        if (this.crypto === undefined) {
            throw new Error('AssertError: no crypto');
        }

        if (array.byteLength <= BrowserEntropyProvider.BROWSER_ENTROPY_QUOTA_BYTES) {
            return this.crypto.getRandomValues(array);
        }

        let remainingBytes = array.byteLength;
        while (remainingBytes > 0) {
            const availableEntropyBytes = Math.min(remainingBytes, BrowserEntropyProvider.BROWSER_ENTROPY_QUOTA_BYTES);
            const chunkStart = array.byteLength - remainingBytes;
            const chunkLength = availableEntropyBytes / array.BYTES_PER_ELEMENT;
            const chunkEnd = chunkStart + chunkLength;
            const chunkToFill = array.subarray(chunkStart, chunkEnd);
            this.crypto.getRandomValues(chunkToFill);
            remainingBytes -= availableEntropyBytes;
        }

        return array;
    }
}
