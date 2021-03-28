<p align="center">
  <img src="logo.png" width="500px">
</p>

TypeScript library for generating cryptographically strong, uniformly distributed random integers from custom intervals, strings from custom character sets, and boolean values.

<p>
<a href="https://github.com/Diplomatiq/crypto-random/actions?query=workflow%3ACI" target="_blank" style="text-decoration: none;">
  <img src="https://github.com/Diplomatiq/crypto-random/workflows/CI/badge.svg" alt="build status">
</a>

<a href="https://github.com/Diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
  <img src="https://img.shields.io/github/languages/top/Diplomatiq/crypto-random.svg" alt="languages used">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
  <img src="https://img.shields.io/npm/dt/@diplomatiq/crypto-random.svg" alt="downloads from npm">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/crypto-random" target="_blank" style="text-decoration: none;">
  <img src="https://img.shields.io/npm/v/@diplomatiq/crypto-random.svg" alt="latest released version on npm">
</a>

<a href="https://github.com/Diplomatiq/crypto-random/blob/main/LICENSE" target="_blank" style="text-decoration: none;">
  <img src="https://img.shields.io/npm/l/@diplomatiq/crypto-random.svg" alt="license">
</a>

<a href="https://github.com/Diplomatiq/crypto-random/pulls" target="_blank" style="text-decoration: none;">
  <img src="https://api.dependabot.com/badges/status?host=github&repo=Diplomatiq/crypto-random" alt="Dependabot">
</a>
</p>

---

## Installation

Being an npm package, you can install crypto-random with the following command:

```bash
npm install -P @diplomatiq/crypto-random
```

## Testing

Run tests with the following:

```bash
npm test
```

Besides basic input-output and format tests, the core generation logic is also tested if it correctly produces its output following a uniform distribution. These tests can fail with a minimal probability, and that's fine. The underlying default PRNGs are always considered to be cryptographically secure, so the actual randomness of the output is not tested.

## Usage

_Note: This package is built as an ES6 package. You will not be able to use `require()`._

After installation, import the `RandomGenerator` class into your project, and use its async API after instantiation:

```typescript
import { RandomGenerator } from '@diplomatiq/crypto-random';

// …

async function main() {
    const randomGenerator = new RandomGenerator();
    const randomString = await randomGenerator.alphanumeric(32);
    // randomString will contain a 32-character-long alphanumeric string
}
```

From version 2.0, only browser environments are supported out of the box (the default entropy source being `window.crypto.getRandomValues`). But with minimal additional work, you can inject any other entropy source (e.g. for using crypto-random in a Node.js environment). For more information, see the [Using other entropy sources](#using-other-entropy-sources) section below.

## API

All the API methods return Promises.

The below referenced `MAX_ALPHABET_LEN` value determines the maximum number of elements of an alphabet used for generating random values: `MAX_ALPHABET_LEN = 4294967296`.

### bytes(byteCount: number): Promise\<Uint8Array>;

```typescript
/**
 * Returns an array of @param byteCount length filled with cryptographically strong random bytes.
 */
bytes(byteCount: number): Promise<Uint8Array>;
```

### integer(min: number, max: number, howMany = 1, unique = false): Promise\<number[]>;

```typescript
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
integer(min: number, max: number, howMany = 1, unique = false): Promise<number[]>;
```

### string(alphabet: string, desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated string value with a @param desiredLength length
 * from a given @param alphabet.
 *
 * If generating with @param unique = true, the characters in the string will be unique.
 */
string(alphabet: string, desiredLength: number, unique = false): Promise<string>;
```

### lowercase(desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated string with lowercase letters only.
 */
lowercase(desiredLength: number, unique = false): Promise<string>;
```

### uppercase(desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated string with uppercase letters only.
 */
uppercase(desiredLength: number, unique = false): Promise<string>;
```

### numeric(desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated string with numeric characters only.
 */
numeric(desiredLength: number, unique = false): Promise<string>;
```

### alphabetic(desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated string with lower- and uppercase letters only.
 */
alphabetic(desiredLength: number, unique = false): Promise<string>;
```

### alphanumeric(desiredLength: number, unique = false): Promise\<string>;

```typescript
/**
 * Returns a cryptographically strong randomly generated alphanumeric string.
 */
alphanumeric(desiredLength: number, unique = false): Promise<string>;
```

### boolean(): Promise\<boolean>;

```typescript
/**
 * Returns a cryptographically strong randomly generated boolean value.
 */
boolean(): Promise<boolean>;
```

## Entropy sources

### Default entropy source

Providing no arguments in the constructor, the `RandomGenerator` is instantiated using the default `BrowserEntropyProvider` as its entropy source. This will look for `window.crypto.getRandomValues`.

```typescript
type UnsignedTypedArray = Uint8Array | Uint16Array | Uint32Array;
```

```typescript
interface EntropyProvider {
    getRandomValues<T extends UnsignedTypedArray>(array: T): T | Promise<T>;
}
```

```typescript
class RandomGenerator {
    /**
     * Provides entropy in the form of random-filled typed arrays.
     */
    private readonly entropyProvider: EntropyProvider;

    constructor(entropyProvider: EntropyProvider = new BrowserEntropyProvider()) {
        this.entropyProvider = entropyProvider;
    }

    // …
}
```

### Using other entropy sources

You can inject any entropy source into the `RandomGenerator` as long as it implements the required `EntropyProvider` interface specified above.

E.g. in your Node.js application, you can create `nodeJsEntropyProvider.ts`:

```typescript
import { EntropyProvider, UnsignedTypedArray } from '@diplomatiq/crypto-random';
import { randomFill } from 'crypto';

export class NodeJsEntropyProvider implements EntropyProvider {
    public async getRandomValues<T extends UnsignedTypedArray>(array: T): Promise<T> {
        return new Promise<T>((resolve, reject): void => {
            randomFill(array, (error: Error | null, array: T): void => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(array);
            });
        });
    }
}
```

And then (still in your Node.js application) use `RandomGenerator` as follows:

```typescript
import { RandomGenerator } from '@diplomatiq/crypto-random';
import { NodeJsEntropyProvider } from './nodeJsEntropyProvider';

// …

async function main() {
    const entropyProvider = new NodeJsEntropyProvider();
    const randomGenerator = new RandomGenerator(entropyProvider);
    const randomString = await randomGenerator.alphanumeric(32);
    // randomString will contain a 32-character-long alphanumeric string
}
```

### Using a custom entropy source

**WARNING!** Unless you are a seasoned cryptography expert possessing comprehensive knowledge about random/pseudo-random value generation, **DO NOT use any custom entropy source implementation other than the default**, or found in well-tested, popular _cryptographic_ libraries survived many years under public scrutiny. Cryptography — and mostly random generation — can be messed up very easily. If you use anything else than a CSPRNG/TRNG for gathering entropy, the values you generate using that entropy source will not be random in the cryptographic meaning, and thus will NOT be suitable for being used as passwords/keys/nonces/etc.

## Discrete uniform distribution

In this library's context, discrete uniform distribution means that any character from a given alphabet will be chosen with equal probability into the generated random value. At generating any kind of cryptographic keys (passwords, authentication tokens, nonces), uniform distribution is crucial: in every other case the size of the key space decreases in some degree (thus finding the key is easier).

This library generates its random values following a discrete uniform distribution.

## Development

See [CONTRIBUTING.md](https://github.com/Diplomatiq/crypto-random/blob/develop/CONTRIBUTING.md) for details.

---

Copyright (c) 2018 Diplomatiq
