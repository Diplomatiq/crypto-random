import { UnsignedTypedArray } from './unsignedTypedArray';

export interface EntropyProvider {
    getRandomValues<T extends UnsignedTypedArray>(array: T): T | Promise<T>;
}
