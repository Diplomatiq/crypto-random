import { EntropyProvider } from './entropyProvider';
import { EnvironmentDetectingEntropyProvider } from './environmentDetectingEntropyProvider';
import { Alphabets } from './alphabets';

export class RandomGenerator {
    /**
     * The maximal alphabet length is determined by the maximal value of an Uint32, which is 0xffffffff:
     * 0xffffffff + 0x00000001  = 0x100000000.
     */
    private static readonly MAX_ALPHABET_LEN = 0x100000000;

    /**
     * Provides entropy in the form of random-filled typed arrays.
     */
    private readonly entropyProvider: EntropyProvider;

    constructor(entropyProvider: EntropyProvider = new EnvironmentDetectingEntropyProvider()) {
        this.entropyProvider = entropyProvider;
    }

    /**
     * Returns an array with @param desiredRandomLength length containing random values based on the
     * @param alphabetLength. If the alphabet is not longer than 256 characters, then Uint8 values are enough for
     * remainder construction. If the alphabet is not longer than 65536 characters, then Uint16 values are enough.
     */
    private async getRandomArrayForAlphabet(
        alphabetLength: number,
        desiredRandomLength: number,
    ): Promise<Uint8Array | Uint16Array | Uint32Array> {
        if (alphabetLength <= 0) {
            throw new Error('alphabetLength must be greater than 0');
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(`alphabetLength must be less than or equal to ${RandomGenerator.MAX_ALPHABET_LEN}`);
        }

        if (desiredRandomLength <= 0) {
            throw new Error('desiredRandomLength must be greater than 0');
        }

        let typedArray: Uint8Array | Uint16Array | Uint32Array;
        try {
            if (alphabetLength <= 0x100) {
                typedArray = new Uint8Array(desiredRandomLength);
            } else if (alphabetLength <= 0x10000) {
                typedArray = new Uint16Array(desiredRandomLength);
            } else {
                typedArray = new Uint32Array(desiredRandomLength);
            }
        } catch (e) {
            throw new Error('TypedArray allocation failed, requested random too big');
        }

        return await this.entropyProvider.getRandomValues(typedArray);
    }

    /**
     * To be able to generate uniformly distributed character sets, we need the remainder of an alphabet, based on the
     * random-target source intervals.
     * If the alphabet contains at most 256 characters, then Uint8 values are generated, so we need the modulo 256 of
     * the @param alphabetLength, and so on.
     */
    private async getRemainderForAlphabet(alphabetLength: number): Promise<number> {
        if (alphabetLength <= 0) {
            throw new Error('alphabetLength must be greater than 0');
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(`alphabetLength must be less than or equal to ${RandomGenerator.MAX_ALPHABET_LEN}`);
        }

        if (alphabetLength <= 0x100) {
            return 0x100 % alphabetLength;
        }

        if (alphabetLength <= 0x10000) {
            return 0x10000 % alphabetLength;
        }

        return RandomGenerator.MAX_ALPHABET_LEN % alphabetLength;
    }

    /**
     * This method returns an array of numbers. Each number of the returned array identifies a character in the
     * alphabet: the number is the index of the character in the alphabet.
     */
    private async getUniformlyDistributedRandomCharIndexesOfAlphabet(
        alphabetLength: number,
        howMany: number,
    ): Promise<number[]> {
        if (alphabetLength <= 0) {
            throw new Error('alphabetLength must be greater than 0');
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(`alphabetLength must be less than or equal to ${RandomGenerator.MAX_ALPHABET_LEN}`);
        }

        if (howMany <= 0) {
            throw new Error('howMany must be greater than 0');
        }

        const remainder = await this.getRemainderForAlphabet(alphabetLength);
        const charIndexes: number[] = [];

        while (charIndexes.length < howMany) {
            const remainingCount = howMany - charIndexes.length;
            const random = await this.getRandomArrayForAlphabet(alphabetLength, remainingCount);
            for (let i = 0; i < random.length; i++) {
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
    public async bytes(byteCount: number): Promise<Uint8Array> {
        if (byteCount <= 0) {
            throw new Error('byteCount must be greater than 0');
        }

        try {
            return await this.entropyProvider.getRandomValues(new Uint8Array(byteCount));
        } catch (e) {
            throw new Error('TypedArray allocation failed, requested random too big');
        }
    }

    /**
     * Returns a cryptographically strong randomly generated positive integer between @param min and @param max,
     * inclusive.
     * The lowest possible value of @param min is 0.
     * The highest possible value of @param max is @var Number.MAX_SAFE_INTEGER.
     * The @param max - @param min + 1 <= @member MAX_ALPHABET_LEN inequality must be kept true.
     */
    public async integer(min: number, max: number): Promise<number> {
        if (min < 0) {
            throw new Error('min must be greater than or equal to 0');
        }

        if (min > Number.MAX_SAFE_INTEGER) {
            throw new Error(`min must be less than or equal to ${Number.MAX_SAFE_INTEGER}`);
        }

        if (max < 0) {
            throw new Error('max must be greater than or equal to 0');
        }

        if (max > Number.MAX_SAFE_INTEGER) {
            throw new Error(`max must be less than or equal to ${Number.MAX_SAFE_INTEGER}`);
        }

        if (max <= min) {
            throw new Error('max must be greater than min');
        }

        const alphabetLength = max - min + 1;
        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(`max - min + 1 must be less than or equal to ${RandomGenerator.MAX_ALPHABET_LEN}`);
        }

        const [numberIndex] = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(alphabetLength, 1);
        return min + numberIndex;
    }

    /**
     * Returns a cryptographically strong randomly generated string value with a @param desiredLength length
     * from a given @param alphabet.
     */
    public async string(alphabet: string, desiredLength: number): Promise<string> {
        if (alphabet.length === 0) {
            throw new Error('alphabet must not be empty');
        }

        if (alphabet.length > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(`alphabet must have maximum ${RandomGenerator.MAX_ALPHABET_LEN} characters`);
        }

        if (desiredLength <= 0) {
            throw new Error('desiredLength must be greater than 0');
        }

        const charIndexes = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(
            alphabet.length,
            desiredLength,
        );
        return charIndexes.map(i => alphabet.charAt(i)).join('');
    }

    /**
     * Returns a cryptographically strong randomly generated string with lowercase letters only.
     */
    public async lowercase(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.LOWERCASE, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with uppercase letters only.
     */
    public async uppercase(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.UPPERCASE, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with numeric characters only.
     */
    public async numeric(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.NUMERIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated string with lower- and uppercase letters only.
     */
    public async alphabetic(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.ALPHABETIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated alphanumeric string.
     */
    public async alphanumeric(desiredLength: number): Promise<string> {
        return await this.string(Alphabets.ALPHANUMERIC, desiredLength);
    }

    /**
     * Returns a cryptographically strong randomly generated boolean value.
     */
    public async boolean(): Promise<boolean> {
        const numericBoolean = await this.integer(0, 1);
        return numericBoolean === 1;
    }
}
