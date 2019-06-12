import { Alphabets } from './alphabets';
import { ConfigurableUniquenessStore } from './configurableUniquenessStore';
import { EntropyProvider } from './entropyProvider';
import { EnvironmentDetectingEntropyProvider } from './environmentDetectingEntropyProvider';
import { RandomGeneratorErrorCodes } from './randomGeneratorErrorCodes';
import { UnsignedTypedArray } from './unsignedTypedArray';

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
     * Returns an array of @param byteCount length filled with cryptographically strong random bytes.
     */
    public async bytes(byteCount: number): Promise<Uint8Array> {
        if (byteCount <= 0) {
            throw new Error(RandomGeneratorErrorCodes.BYTE_COUNT_GT_ZERO);
        }

        try {
            return this.entropyProvider.getRandomValues(new Uint8Array(byteCount));
        } catch (e) {
            throw new Error(RandomGeneratorErrorCodes.TYPED_ARRAY_ALLOCATION_FAILED);
        }
    }

    /**
     * Returns a cryptographically strong randomly generated positive integer between @param min and @param max,
     * inclusive.
     * The lowest possible value of @param min is 0.
     * The highest possible value of @param max is @var Number.MAX_SAFE_INTEGER.
     * The @param max - @param min + 1 <= @member MAX_ALPHABET_LEN inequality must be kept true.
     *
     * If needing more than one integer at once from a given interval, use @param howMany. This will reduce the number
     * of times calling the crypto API, making the execution faster.
     *
     * If generating more than one integers with @param unique = true,
     * the generated integers will be unique in the returned set.
     */
    public async integer(min: number, max: number, howMany = 1, unique = false): Promise<number[]> {
        if (min < 0) {
            throw new Error(RandomGeneratorErrorCodes.MIN_GTE_ZERO);
        }

        if (min > Number.MAX_SAFE_INTEGER) {
            throw new Error(RandomGeneratorErrorCodes.MIN_LTE_MAX_SAFE_INTEGER);
        }

        if (max < 0) {
            throw new Error(RandomGeneratorErrorCodes.MAX_GTE_ZERO);
        }

        if (max > Number.MAX_SAFE_INTEGER) {
            throw new Error(RandomGeneratorErrorCodes.MAX_LTE_MAX_SAFE_INTEGER);
        }

        if (howMany <= 0) {
            throw new Error(RandomGeneratorErrorCodes.HOW_MANY_GT_ZERO);
        }

        if (max <= min) {
            throw new Error(RandomGeneratorErrorCodes.MAX_GT_MIN);
        }

        const alphabetLength = max - min + 1;
        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(RandomGeneratorErrorCodes.MAX_MINUS_MIN_PLUS_1_LTE_MAX_ALPHABET_LENGTH);
        }

        if (unique && howMany > alphabetLength) {
            throw new Error(RandomGeneratorErrorCodes.IF_UNIQUE_TRUE_THEN_HOW_MANY_LTE_ALPHABET_LENGTH);
        }

        const numberIndexes = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(
            alphabetLength,
            howMany,
            unique,
        );
        return numberIndexes.map(i => min + i);
    }

    /**
     * Returns a cryptographically strong randomly generated string value with a @param desiredLength length
     * from a given @param alphabet.
     *
     * If generating with @param unique = true, the characters in the string will be unique.
     */
    public async string(alphabet: string, desiredLength: number, unique = false): Promise<string> {
        if (alphabet.length === 0) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_NOT_EMPTY);
        }

        if (alphabet.length > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_MAX_MAX_ALPHABET_LEN_CHARACTERS);
        }

        if (desiredLength <= 0) {
            throw new Error(RandomGeneratorErrorCodes.DESIRED_LENGTH_GT_ZERO);
        }

        if (unique && desiredLength > alphabet.length) {
            throw new Error(RandomGeneratorErrorCodes.IF_UNIQUE_TRUE_THEN_DESIRED_LENGTH_LTE_ALPHABET_LENGTH);
        }

        const charIndexes = await this.getUniformlyDistributedRandomCharIndexesOfAlphabet(
            alphabet.length,
            desiredLength,
            unique,
        );
        return charIndexes.map(i => alphabet.charAt(i)).join('');
    }

    /**
     * Returns a cryptographically strong randomly generated string with lowercase letters only.
     */
    public async lowercase(desiredLength: number, unique = false): Promise<string> {
        return this.string(Alphabets.LOWERCASE, desiredLength, unique);
    }

    /**
     * Returns a cryptographically strong randomly generated string with uppercase letters only.
     */
    public async uppercase(desiredLength: number, unique = false): Promise<string> {
        return this.string(Alphabets.UPPERCASE, desiredLength, unique);
    }

    /**
     * Returns a cryptographically strong randomly generated string with numeric characters only.
     */
    public async numeric(desiredLength: number, unique = false): Promise<string> {
        return this.string(Alphabets.NUMERIC, desiredLength, unique);
    }

    /**
     * Returns a cryptographically strong randomly generated string with lower- and uppercase letters only.
     */
    public async alphabetic(desiredLength: number, unique = false): Promise<string> {
        return this.string(Alphabets.ALPHABETIC, desiredLength, unique);
    }

    /**
     * Returns a cryptographically strong randomly generated alphanumeric string.
     */
    public async alphanumeric(desiredLength: number, unique = false): Promise<string> {
        return this.string(Alphabets.ALPHANUMERIC, desiredLength, unique);
    }

    /**
     * Returns a cryptographically strong randomly generated boolean value.
     */
    public async boolean(): Promise<boolean> {
        const [numericBoolean] = await this.integer(0, 1);
        return numericBoolean === 1;
    }

    /**
     * Returns an array with @param desiredRandomLength length containing random values based on the
     * @param alphabetLength. If the alphabet is not longer than 256 characters, then Uint8 values are enough for
     * remainder construction. If the alphabet is not longer than 65536 characters, then Uint16 values are enough.
     */
    private async getRandomArrayForAlphabet(
        alphabetLength: number,
        desiredRandomLength: number,
    ): Promise<UnsignedTypedArray> {
        if (alphabetLength <= 0) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_GT_ZERO);
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_LTE_MAX_ALPHABET_LENGTH);
        }

        if (desiredRandomLength <= 0) {
            throw new Error(RandomGeneratorErrorCodes.DESIRED_RANDOM_LENGTH_GT_ZERO);
        }

        let typedArray: UnsignedTypedArray;
        try {
            if (alphabetLength <= 0x100) {
                typedArray = new Uint8Array(desiredRandomLength);
            } else if (alphabetLength <= 0x10000) {
                typedArray = new Uint16Array(desiredRandomLength);
            } else {
                typedArray = new Uint32Array(desiredRandomLength);
            }
        } catch (e) {
            throw new Error(RandomGeneratorErrorCodes.TYPED_ARRAY_ALLOCATION_FAILED);
        }

        return this.entropyProvider.getRandomValues(typedArray);
    }

    /**
     * To be able to generate uniformly distributed character sets, we need the remainder of an alphabet, based on the
     * random-target source intervals.
     * If the alphabet contains at most 256 characters, then Uint8 values are generated, so we need the modulo 256 of
     * the @param alphabetLength, and so on.
     */
    private async getRemainderForAlphabet(alphabetLength: number): Promise<number> {
        if (alphabetLength <= 0) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_GT_ZERO);
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_LTE_MAX_ALPHABET_LENGTH);
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
        unique: boolean,
    ): Promise<number[]> {
        if (alphabetLength <= 0) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_GT_ZERO);
        }

        if (alphabetLength > RandomGenerator.MAX_ALPHABET_LEN) {
            throw new Error(RandomGeneratorErrorCodes.ALPHABET_LENGTH_LTE_MAX_ALPHABET_LENGTH);
        }

        if (howMany <= 0) {
            throw new Error(RandomGeneratorErrorCodes.HOW_MANY_GT_ZERO);
        }

        const remainder = await this.getRemainderForAlphabet(alphabetLength);
        const charIndexes = new ConfigurableUniquenessStore<number>(unique);

        while (charIndexes.size() < howMany) {
            const remainingCount = howMany - charIndexes.size();
            const random = await this.getRandomArrayForAlphabet(alphabetLength, remainingCount);
            for (const randomNumber of random) {
                // discrete uniform distribution does not include values smaller than the remainder
                if (randomNumber >= remainder) {
                    charIndexes.add(randomNumber % alphabetLength);
                }
            }
        }

        return charIndexes.all();
    }
}
