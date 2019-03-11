# crypto-random

<p>
<a href="https://travis-ci.org/Diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/travis/Diplomatiq/crypto-random.svg" alt="build status">
</a>

<a href="https://github.com/Diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/github/languages/top/Diplomatiq/crypto-random.svg" alt="languages used">
</a>

<a href="https://codecov.io/gh/Diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/codecov/c/github/Diplomatiq/crypto-random.svg" alt="code coverage">
</a>

<a href="https://github.com/Diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/github/languages/code-size/Diplomatiq/crypto-random.svg" alt="code size">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/bundlephobia/min/@diplomatiq/crypto-random.svg" alt="minified size">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/dt/@diplomatiq/crypto-random.svg" alt="downloads from npm">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/v/@diplomatiq/crypto-random.svg" alt="latest released version on npm">
</a>

<a href="https://github.com/Diplomatiq/crypto-random/blob/master/LICENSE" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/l/@diplomatiq/crypto-random.svg" alt="license">
</a>
</p>

TypeScript/JavaScript library for generating cryptographically strong random integers from custom intervals, boolean values, strings with uniformly distributed random characters from custom character sets.

---

## Installation

Being an npm package, you can install crypto-random with the following command:

```
npm install @diplomatiq/crypto-random
```

## Testing

Run unit tests with the following:

```
npm test
```

Unit tests do not test the randomness of the output. Please inspect the implementation and the used entropy source.

## Usage

_Note: This package is built as an ES6 package. You will not be able to use `require()`._

After installation, import the `RandomGenerator` class into your project, and use its async API after instantiation:

```
import { RandomGenerator } from '@diplomatiq/crypto-random';

// …

async function main() {
	const randomGenerator = new RandomGenerator();
	const randomString = await randomGenerator.alphanumeric(32);
	// randomString will contain a 32-character-long alphanumeric string
}
```

Node.js and browser environments are both supported. For more information, see the **Entropy sources** section below.

## API

All the API methods return Promises.

The below referenced `MAX_ALPHABET_LEN` value determines the maximum number of elements of an alphabet used for generating random values: `MAX_ALPHABET_LEN = 4294967296`.

### bytes(byteCount: number): Promise\<Uint8Array>;

```
/**
 * Returns an array of @param byteCount length filled with cryptographically strong random bytes.
 */
bytes(byteCount: number): Promise<Uint8Array>;
```

### integer(min: number, max: number, howMany: number = 1): Promise\<number[]>;

```
/**
 * Returns a cryptographically strong randomly generated positive integer between @param min and @param max,
 * inclusive.
 * The lowest possible value of @param min is 0.
 * The highest possible value of @param max is @var Number.MAX_SAFE_INTEGER.
 * The @param max - @param min + 1 <= @member MAX_ALPHABET_LEN inequality must be kept true.
 *
 * If needing more than one integer at once from a given interval, use @param howMany. This will reduce the number
 * of times calling the crypto API, making the execution faster.
 */
integer(min: number, max: number, howMany: number = 1): Promise<number[]>;
```

### string(alphabet: string, desiredLength: number): Promise\<string>;

```
/**
 * Returns a cryptographically strong randomly generated string value with a @param desiredLength length
 * from a given @param alphabet.
 */
string(alphabet: string, desiredLength: number): Promise<string>;
```

### lowercase(desiredLength: number): Promise\<string>;

```
/**
 * Returns a cryptographically strong randomly generated string with lowercase letters only.
 */
lowercase(desiredLength: number): Promise<string>;
```

### uppercase(desiredLength: number): Promise<string>;

```
/**
 * Returns a cryptographically strong randomly generated string with uppercase letters only.
 */
uppercase(desiredLength: number): Promise<string>;
```

### numeric(desiredLength: number): Promise<string>;

```
/**
 * Returns a cryptographically strong randomly generated string with numeric characters only.
 */
numeric(desiredLength: number): Promise<string>;
```

### alphabetic(desiredLength: number): Promise<string>;

```
/**
 * Returns a cryptographically strong randomly generated string with lower- and uppercase letters only.
 */
alphabetic(desiredLength: number): Promise<string>;
```

### alphanumeric(desiredLength: number): Promise<string>;

```
/**
 * Returns a cryptographically strong randomly generated alphanumeric string.
 */
alphanumeric(desiredLength: number): Promise<string>;
```

### boolean(): Promise<boolean>;

```
/**
 * Returns a cryptographically strong randomly generated boolean value.
 */
boolean(): Promise<boolean>;
```

## Entropy sources

### Used entropy sources

In a web browser environment, `window.crypto.getRandomValues`, in a Node.js environment, `crypto.randomFill` is used as the underlying CSPRNG. This is automatically detected by the `RandomGenerator`.

### Using a custom entropy source

**WARNING!** Unless you are a seasoned cryptography expert possessing comprehensive knowledge about random/pseudo-random value generation, **DO NOT use any custom entropy source implementation other than the default**, or found in well-tested, popular libraries survived many years under public scrutiny. Cryptography — and mostly random generation — can be messed up very easily. If you use anything else than a CSPRNG/TRNG for gathering entropy, the values you generate using that entropy source will not be random in the cryptographic meaning, and thus will NOT be suitable for being used as passwords/keys/nonces/etc.

Providing no arguments in the constructor, the `RandomGenerator` is instantiated using the default `EnvironmentDetectingEntropyProvider` as its entropy source. This detects if the code is run in a web browser or in a Node.js process, and uses the available cryptography API on the given platform as its underlying random source. (As stated above: in a web browser, `window.crypto.getRandomValues`, in Node.js, `crypto.randomFill` is used.)

As long as it implements the `EntropyProvider` interface specified below, you can use any kind of entropy source by providing it to the constructor at instantiating the `RandomGenerator`.

```
interface EntropyProvider {
    getRandomValues<T extends Uint8Array | Uint16Array | Uint32Array>(array: T): Promise<T>;
}
```

```
class RandomGenerator {
	/**
	 * Provides entropy in the form of random-filled typed arrays.
	 */
	private readonly entropyProvider: EntropyProvider;

	constructor(entropyProvider: EntropyProvider = new EnvironmentDetectingEntropyProvider()) {
	    this.entropyProvider = entropyProvider;
	}

	// …
}
```

## Discrete uniform distribution

In this library's context, discrete uniform distribution means that any character from a given alphabet will be chosen with equal probability into the generated random value. At generating any kind of cryptographic keys (passwords, authentication tokens, nonces), uniform distribution is crucial: in every other case the size of the key space decreases in some degree (thus finding the key is easier).

This library generates its random values complying with the discrete uniform distribution.

---

Copyright (c) 2019 Diplomatiq
