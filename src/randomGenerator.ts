import { EntropyProvider } from './entropyProvider';
import { Alphabets } from './alphabets';

export class RandomGenerator {
    /**
     * The maximal alphabet length is determined by the maximal value of an Uint32, which is 0x100000000.
     */
    private static readonly MAX_ALPHABET_LEN = 0x100000000;

    /**
     * Returns an array with @param desiredRandomLength length containing random values based on the
     * @param alphabetLength. If the alphabet is not longer than 256 characters, then Uint8 values are enough for
     * remainder construction. If the alphabet is not longer than 65536 characters, then Uint16 values are enough.
     */
    private static async getRandomArrayForAlphabet(
        alphabetLength: number,
        desiredRandomLength: number,
    ): Promise<Uint8Array | Uint16Array | Uint32Array> {
        let typedArray: Uint8Array | Uint16Array | Uint32Array;
        if (alphabetLength <= 0x100) {
            typedArray = new Uint8Array(desiredRandomLength);
        } else if (alphabetLength <= 0x10000) {
            typedArray = new Uint16Array(desiredRandomLength);
        } else {
            typedArray = new Uint32Array(desiredRandomLength);
        }

        await EntropyProvider.getRandomValues(typedArray);
        return typedArray;
    }

    /**
     * To be able to generate uniformly distributed character sets, we need the remainder of an alphabet, based on the
     * source intervals, which random values will come from.
     * If the alphabet is at most 256 characters, then Uint8 values are generated, so we need the modulo 256 of the
     * @param alphabetLength, and so on.
     */
    private static async getRemainderForAlphabet(alphabetLength: number): Promise<number> {
        if (alphabetLength <= 0x100) {
            return 0x100 % alphabetLength;
        }

        if (alphabetLength <= 0x10000) {
            return 0x10000 % alphabetLength;
        }

        return 0x100000000 % alphabetLength;
    }

    /**
     * This method returns an array of numbers. Each number of the returned array identifies a character in the
     * alphabet: the number is the index of the character in the alphabet.
     */
    private static async getUniformlyDistributedRandomCharIndexesOfAlphabet(
        alphabetLength: number,
        howMany: number,
    ): Promise<number[]> {
        const remainder = await this.getRemainderForAlphabet(alphabetLength);
        const charIndexes: number[] = [];

        while (charIndexes.length < howMany) {
            const remainingCount = howMany - charIndexes.length;
            const random = await this.getRandomArrayForAlphabet(alphabetLength, remainingCount);
            for (let i = 0; i < random.length && charIndexes.length < howMany; i++) {
                // discrete uniform distribution does not include values smaller than the remainder
                if (random[i] < remainder) {
                    continue;
                }

                charIndexes.push(random[i] % alphabetLength);
            }
        }

        return charIndexes;
    }

    /**
     * Returns an array of @param byteCount length filled with cryptographically strong random bytes.
     */
    public static async bytes(byteCount: number): Promise<Uint8Array> {
        if (byteCount < 0) {
            throw new Error('byteCount must be greater than or equal to 0');
        }

        const byteArray = new Uint8Array(byteCount);
        await EntropyProvider.getRandomValues(byteArray);
        return byteArray;
    }

    /**
     * Returns a cryptographically strong randomly generated positive integer between @param min and @param max.
     * The lowest possible value of @param min is 0.
     * The highest possible value of @param max is 2 ** 32 === 4294967296 === 0x100000000.
     */
    public static async integer(min: number = 0, max: number = 0x100000000): Promise<number> {
        if (min < 0) {
            throw new Error('min must be greater than or equal to 0');
        }

        if (max > 0x100000000) {
            throw new Error('max must be smaller than or equal to 0x100000000');
        }

        if (max <= min) {
            throw new Error('max must be greater than min');
        }

        const alphabetLength = max - min + 1;
        const [numberIndex] = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(alphabetLength, 1);
        return min + numberIndex;
    }

    /**
     * Returns a cryptographically strong randomly generated string value with a @param desiredLength length
     * from a given @param alphabet.
     */
    public static async string(alphabet: string, desiredLength: number): Promise<string> {
        if (alphabet === '') {
            throw new Error('alphabet must not be empty');
        }

        if (alphabet.length > this.MAX_ALPHABET_LEN) {
            throw new Error('alphabet must have less than 4294967296 characters');
        }

        if (desiredLength <= 0) {
            throw new Error('desiredLength must be greater than 0');
        }

        const charIndexes = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(
            alphabet.length,
            desiredLength,
        );
        return charIndexes.map(n => alphabet.charAt(n)).join('');
    }

    /**
     * Returns a cryptographically strong randomly generated string with lowercase letters only.
     */
    public static async lowercase(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.LOWERCASE, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with uppercase letters only.
     */
    public static async uppercase(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.UPPERCASE, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with numeric characters only.
     */
    public static async numeric(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.NUMERIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with lower- and uppercase letters only.
     */
    public static async alphabetic(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.ALPHABETIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated alphanumeric string.
     */
    public static async alphanumeric(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.ALPHANUMERIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated boolean value.
     */
    public static async boolean(): Promise<boolean> {
        const numericBoolean = await this.integer(0, 1);
        return numericBoolean === 1;
    }
}
