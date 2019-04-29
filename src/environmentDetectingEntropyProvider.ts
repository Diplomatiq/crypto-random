import { EntropyProvider } from './entropyProvider';

export class EnvironmentDetectingEntropyProvider implements EntropyProvider {
    /**
     * The crypto implementation used in the browser. The window.crypto object is used.
     */
    private readonly browserCrypto: Crypto | undefined;

    /**
     * The crypto implementation used in Node.js environments. This will be provided by the "crypto" module of Node.
     */
    private readonly nodeCrypto: any;

    /**
     * According to the Web Crypto standard, there is a 2 ** 16 bytes quota for requesting entropy.
     */
    private static readonly BROWSER_ENTROPY_QUOTA_BYTES = 65536;

    /**
     * The environment in which the package is run.
     */
    private readonly environment: 'browser' | 'node';

    constructor() {
        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            this.environment = 'browser';
            if (typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues !== 'undefined') {
                this.browserCrypto = window.crypto;
            } else {
                throw new Error('window.crypto.getRandomValues not available');
            }
        } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
            this.environment = 'node';
            try {
                this.nodeCrypto = require('crypto');
            } catch (e) {
                throw new Error('NodeJS.crypto not available');
            }
        } else {
            throw new Error('Unexpected environment: neither browser nor node');
        }
    }

    /**
     * Puts random values into the given @param array, and returns the array.
     */
    public async getRandomValues<T extends Uint8Array | Uint16Array | Uint32Array>(array: T): Promise<T> {
        switch (this.environment) {
            case 'browser':
                return await this.getRandomValuesBrowser(array);
            case 'node':
                return await this.getRandomValuesNode(array);
        }
    }

    /**
     * Puts random values into the given @param array in a browser environment, and returns the array.
     * If the array's length is greater than the general @member BROWSER_ENTROPY_QUOTA_BYTES,
     * it is divided into chunks, and filled chunk-by-chunk.
     * Can be only called, if @member environment is 'browser'.
     */
    private async getRandomValuesBrowser<T extends Uint8Array | Uint16Array | Uint32Array>(array: T): Promise<T> {
        if (this.environment !== 'browser') {
            throw new Error('not in browser environment');
        }

        if (array.byteLength <= EnvironmentDetectingEntropyProvider.BROWSER_ENTROPY_QUOTA_BYTES) {
            return this.browserCrypto!.getRandomValues(array);
        }

        let remainingBytes = array.byteLength;
        while (remainingBytes > 0) {
            const availableEntropyBytes = Math.min(
                remainingBytes,
                EnvironmentDetectingEntropyProvider.BROWSER_ENTROPY_QUOTA_BYTES,
            );
            const chunkStart = array.byteLength - remainingBytes;
            const chunkLength = availableEntropyBytes / array.BYTES_PER_ELEMENT;
            const chunkEnd = chunkStart + chunkLength;
            const chunkToFill = array.subarray(chunkStart, chunkEnd);
            this.browserCrypto!.getRandomValues(chunkToFill);
            remainingBytes -= availableEntropyBytes;
        }

        return array;
    }

    /**
     * Puts random values into the given @param array in a Node.js environment, and returns the array.
     * Can be only called, if @member environment is 'node'.
     */
    private async getRandomValuesNode<T extends Uint8Array | Uint16Array | Uint32Array>(array: T): Promise<T> {
        if (this.environment !== 'node') {
            throw new Error('not in node environment');
        }

        return new Promise<T>((resolve, reject) => {
            this.nodeCrypto.randomFill(array, (error: Error | null, array: T) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(array);
            });
        });
    }
}
