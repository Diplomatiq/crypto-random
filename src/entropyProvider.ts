import { UnsignedTypedArray } from './unsignedTypedArray';

export interface EntropyProvider {
    getRandomValues<T extends UnsignedTypedArray>(array: T): Promise<T>;
}
