export interface EntropyProvider {
    getRandomValues<T extends Uint8Array | Uint16Array | Uint32Array>(array: T): Promise<T>;
}
