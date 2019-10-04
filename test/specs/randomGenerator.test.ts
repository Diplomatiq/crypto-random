import { expect } from 'chai';
import { SinonSpy, spy } from 'sinon';
import { BrowserEntropyProvider } from '../../src/browserEntropyProvider';
import { EntropyProvider } from '../../src/entropyProvider';
import { RandomGenerator } from '../../src/randomGenerator';
import { UnsignedTypedArray } from '../../src/unsignedTypedArray';
import { windowMock } from '../utils/windowMock';

describe('RandomGenerator', () => {
    let entropyProvider: EntropyProvider;
    let getRandomValuesSpy: SinonSpy<[UnsignedTypedArray]>;
    let randomGeneratorInstance: RandomGenerator;

    before(() => {
        // @ts-ignore
        global.window = windowMock();
    });

    after(() => {
        // @ts-ignore
        global.window = undefined;
    });

    beforeEach(() => {
        entropyProvider = new BrowserEntropyProvider();
        getRandomValuesSpy = spy(entropyProvider, 'getRandomValues');
        randomGeneratorInstance = new RandomGenerator(entropyProvider);
    });

    describe('public methods', () => {
        describe('bytes', () => {
            it('should return a byteCount-long Uint8Array (byteCount = 1)', async () => {
                const byteCount = 1;
                const random = await randomGeneratorInstance.bytes(byteCount);

                const getRandomValuesResult = await getRandomValuesSpy.firstCall.returnValue;

                expect(random.length).to.equal(byteCount);
                expect(random.byteLength).to.equal(byteCount);
                expect(random).to.deep.equal(getRandomValuesResult);
            });

            it('should return a byteCount-long Uint8Array (byteCount = 32)', async () => {
                const byteCount = 32;
                const random = await randomGeneratorInstance.bytes(byteCount);

                const getRandomValuesResult = await getRandomValuesSpy.firstCall.returnValue;

                expect(random.length).to.equal(byteCount);
                expect(random.byteLength).to.equal(byteCount);
                expect(random).to.deep.equal(getRandomValuesResult);
            });

            it('should return a byteCount-long Uint8Array (byteCount = 10000000)', async () => {
                const byteCount = 10000000;
                const random = await randomGeneratorInstance.bytes(byteCount);

                const getRandomValuesResult = await getRandomValuesSpy.firstCall.returnValue;

                expect(random.length).to.equal(byteCount);
                expect(random.byteLength).to.equal(byteCount);
                expect(random).to.deep.equal(getRandomValuesResult);
            });

            it('should throw if byteCount = 0', async () => {
                try {
                    await randomGeneratorInstance.bytes(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('byteCount must be greater than 0');
                }
            });

            it('should throw if byteCount < 0', async () => {
                try {
                    await randomGeneratorInstance.bytes(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('byteCount must be greater than 0');
                }
            });

            it('should throw if allocating too much', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.bytes(10 ** 100);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('TypedArray allocation failed, requested random too big');
                }
            });
        });

        describe('integer', () => {
            it('should return an array of integers with one element (min = 0, max = 100)', async () => {
                const min = 0;
                const max = 100;
                const [random] = await randomGeneratorInstance.integer(min, max);

                const getRandomValuesResult = await getRandomValuesSpy.lastCall.returnValue;

                const alphabetLength = max - min + 1;
                const randomNumber = getRandomValuesResult[0] % alphabetLength;

                expect(random).to.equal(randomNumber);
                expect(random)
                    .to.be.at.least(min)
                    .and.to.be.at.most(max);
            });

            it('should return an array of integers with 5 elements (min = 0, max = 100, howMany = 5)', async () => {
                const min = 0;
                const max = 100;
                const howMany = 5;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 256 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should return an array of integers with 15 elements (min = 0, max = 500, howMany = 15)', async () => {
                const min = 0;
                const max = 500;
                const howMany = 15;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint16ArrayArrays: Uint16Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint16Count = fetchedUint16ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint16Values = new Uint16Array(fetchedRandomUint16Count);
                let cursor = 0;
                for (const currentRandom of fetchedUint16ArrayArrays) {
                    fetchedRandomUint16Values.set(currentRandom, cursor);
                    cursor += currentRandom.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 65536 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint16Values.length; i++) {
                    if (fetchedRandomUint16Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint16Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should return an array of integers with 25 elements (min = 0, max = 100000, howMany = 25)', async () => {
                const min = 0;
                const max = 100000;
                const howMany = 25;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentRandom of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentRandom, cursor);
                    cursor += currentRandom.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 4294967296 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should return an array of integers with 2 elements (min = 0, max = 4294967295, howMany = 2)', async () => {
                const min = 0;
                const max = 4294967295;
                const howMany = 2;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentRandom of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentRandom, cursor);
                    cursor += currentRandom.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 4294967296 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should return an array of integers with 10000 elements (min = 0, max = 4294967295, howMany = 10000)', async () => {
                const min = 0;
                const max = 4294967295;
                const howMany = 10000;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentRandom of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentRandom, cursor);
                    cursor += currentRandom.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 4294967296 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should return an array of integers with 50000 elements (min = 0, max = 4294967295, howMany = 50000)', async () => {
                const min = 0;
                const max = 4294967295;
                const howMany = 50000;
                const random = await randomGeneratorInstance.integer(min, max, howMany);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentRandom of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentRandom, cursor);
                    cursor += currentRandom.length;
                }

                const alphabetLength = max - min + 1;
                const remainder = 4294967296 % alphabetLength;
                const randomNumberIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomNumberIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomNumbers = randomNumberIndexes.map(i => min + i);

                expect(random).to.deep.equal(randomNumbers);
                for (const randomNumber of random) {
                    expect(randomNumber)
                        .to.be.at.least(min)
                        .and.to.be.at.most(max);
                }
            });

            it('should throw if min < 0', async () => {
                try {
                    await randomGeneratorInstance.integer(-1, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('min must be greater than or equal to 0');
                }
            });

            it('should throw if min > Number.MAX_SAFE_INTEGER', async () => {
                try {
                    await randomGeneratorInstance.integer(Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER + 2);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('min must be less than or equal to Number.MAX_SAFE_INTEGER');
                }
            });

            it('should throw if max < 0', async () => {
                try {
                    await randomGeneratorInstance.integer(0, -1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('max must be greater than or equal to 0');
                }
            });

            it('should throw if max > Number.MAX_SAFE_INTEGER', async () => {
                try {
                    await randomGeneratorInstance.integer(0, Number.MAX_SAFE_INTEGER + 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('max must be less than or equal to Number.MAX_SAFE_INTEGER');
                }
            });

            it('should throw if howMany = 0', async () => {
                try {
                    await randomGeneratorInstance.integer(0, 100, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('howMany must be greater than 0');
                }
            });

            it('should throw if howMany < 0', async () => {
                try {
                    await randomGeneratorInstance.integer(0, 100, -1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('howMany must be greater than 0');
                }
            });

            it('should throw if max = min', async () => {
                try {
                    await randomGeneratorInstance.integer(0, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('max must be greater than min');
                }
            });

            it('should throw if max < min', async () => {
                try {
                    await randomGeneratorInstance.integer(1, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('max must be greater than min');
                }
            });

            it('should throw if max - min + 1 > 4294967296', async () => {
                try {
                    await randomGeneratorInstance.integer(0, 4294967296);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'max - min + 1 must be less than or equal to RandomGenerator.MAX_ALPHABET_LEN',
                    );
                }
            });

            it('should throw if unique = true && howMany > alphabetLength', async () => {
                try {
                    await randomGeneratorInstance.integer(0, 1, 3, true);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('if unique = true, howMany must be less than or equal to max - min + 1');
                }
            });
        });

        describe('string', () => {
            it('should return a string with 20 characters from the given alphabet (alphabetLength = 3)', async () => {
                const desiredLength = 20;
                const alphabet = 'abc';
                const random = await randomGeneratorInstance.string(alphabet, desiredLength);

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                for (const c of random.split('')) {
                    expect(alphabet.includes(c)).to.be.true;
                }
            });

            it('should return a string with 20 characters from the given alphabet (alphabetLength = 310)', async () => {
                const desiredLength = 20;
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(5);
                const random = await randomGeneratorInstance.string(alphabet, desiredLength);

                const fetchedUint16ArrayArrays: Uint16Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint16Count = fetchedUint16ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint16Values = new Uint16Array(fetchedRandomUint16Count);
                let cursor = 0;
                for (const currentUint16Array of fetchedUint16ArrayArrays) {
                    fetchedRandomUint16Values.set(currentUint16Array, cursor);
                    cursor += currentUint16Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 65536 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint16Values.length; i++) {
                    if (fetchedRandomUint16Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint16Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                for (const c of random.split('')) {
                    expect(alphabet.includes(c)).to.be.true;
                }
            });

            it('should return a string with 20 characters from the given alphabet (alphabetLength = 65720)', async () => {
                const desiredLength = 20;
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(1060);
                const random = await randomGeneratorInstance.string(alphabet, desiredLength);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentUint32Array of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentUint32Array, cursor);
                    cursor += currentUint32Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 4294967296 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                for (const c of random.split('')) {
                    expect(alphabet.includes(c)).to.be.true;
                }
            });

            it('should return a string with 100000 characters from the given alphabet (alphabetLength = 310000)', async () => {
                const desiredLength = 100000;
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(5000);
                const random = await randomGeneratorInstance.string(alphabet, desiredLength);

                const fetchedUint32ArrayArrays: Uint32Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint32Count = fetchedUint32ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint32Values = new Uint32Array(fetchedRandomUint32Count);
                let cursor = 0;
                for (const currentUint32Array of fetchedUint32ArrayArrays) {
                    fetchedRandomUint32Values.set(currentUint32Array, cursor);
                    cursor += currentUint32Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 4294967296 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint32Values.length; i++) {
                    if (fetchedRandomUint32Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint32Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                for (const c of random.split('')) {
                    expect(alphabet.includes(c)).to.be.true;
                }
            });

            it('should throw for an empty alphabet', async () => {
                try {
                    await randomGeneratorInstance.string('', 5);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabet must not be empty');
                }
            });

            it('should throw if the alphabet has more than 4294967296 characters', async () => {
                // Unable to construct a string with 4294967296 + 1 characters.
                const fakeString = {
                    length: 4294967296 + 1,
                };

                try {
                    await randomGeneratorInstance.string((fakeString as any) as string, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'alphabet must have maximum RandomGenerator.MAX_ALPHABET_LEN characters',
                    );
                }
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.string('abc', 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.string('abc', -1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if unique = true && desiredLength > alphabet.length', async () => {
                try {
                    await randomGeneratorInstance.string('abc', 4, true);
                } catch (e) {
                    expect(e.message).to.equal(
                        "if unique = true, desiredLength must be less than or equal to the alphabet's length",
                    );
                }
            });
        });

        describe('lowercase', () => {
            it('should return a string with 20 lowercase letters (desiredLength = 20)', async () => {
                const random = await randomGeneratorInstance.lowercase(20);
                const alphabet = 'abcdefghijklmnopqrstuvwxyz';

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                expect(/^[a-z]{20}$/.test(random)).to.be.true;
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.lowercase(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.lowercase(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });
        });

        describe('uppercase', () => {
            it('should return a string with 20 uppercase letters (desiredLength = 20)', async () => {
                const random = await randomGeneratorInstance.uppercase(20);
                const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                expect(/^[A-Z]{20}$/.test(random)).to.be.true;
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.uppercase(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.uppercase(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });
        });

        describe('numeric', () => {
            it('should return a string with 20 numeric characters (desiredLength = 20)', async () => {
                const random = await randomGeneratorInstance.numeric(20);
                const alphabet = '0123456789';

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                expect(/^[0-9]{20}$/.test(random)).to.be.true;
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.numeric(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.numeric(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });
        });

        describe('alphabetic', () => {
            it('should return a string with 20 alphabetic characters (desiredLength = 20)', async () => {
                const random = await randomGeneratorInstance.alphabetic(20);
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                expect(/^[a-zA-Z]{20}$/.test(random)).to.be.true;
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.alphabetic(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.alphabetic(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });
        });

        describe('alphanumeric', () => {
            it('should return a string with 20 alphanumeric characters (desiredLength = 20)', async () => {
                const random = await randomGeneratorInstance.alphanumeric(20);
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

                const fetchedUint8ArrayArrays: Uint8Array[] = await Promise.all(
                    getRandomValuesSpy.getCalls().map(async c => await c.returnValue),
                );

                const fetchedRandomUint8Count = fetchedUint8ArrayArrays
                    .map(a => a.length)
                    .reduce((acc, curr) => (acc += curr));
                const fetchedRandomUint8Values = new Uint8Array(fetchedRandomUint8Count);
                let cursor = 0;
                for (const currentUint8Array of fetchedUint8ArrayArrays) {
                    fetchedRandomUint8Values.set(currentUint8Array, cursor);
                    cursor += currentUint8Array.length;
                }

                const alphabetLength = alphabet.length;
                const remainder = 256 % alphabetLength;
                const randomCharIndexes = [];
                for (let i = 0; i < fetchedRandomUint8Values.length; i++) {
                    if (fetchedRandomUint8Values[i] >= remainder) {
                        randomCharIndexes.push(fetchedRandomUint8Values[i] % alphabetLength);
                    }
                }
                const randomChars = randomCharIndexes.map(i => alphabet.charAt(i)).join('');

                expect(random).to.deep.equal(randomChars);
                expect(/^[a-zA-Z0-9]{20}$/.test(random)).to.be.true;
            });

            it('should throw if desiredLength = 0', async () => {
                try {
                    await randomGeneratorInstance.alphanumeric(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });

            it('should throw if desiredLength < 0', async () => {
                try {
                    await randomGeneratorInstance.alphanumeric(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredLength must be greater than 0');
                }
            });
        });

        describe('boolean', () => {
            it('should return a boolean', async () => {
                const random = await randomGeneratorInstance.boolean();

                const getRandomValuesResult = await getRandomValuesSpy.lastCall.returnValue;

                const alphabetLength = 2; // 0 or 1 (false or true)
                const randomNumber = getRandomValuesResult[0] % alphabetLength;
                const randomBoolean = randomNumber === 1;

                expect(random).to.equal(randomBoolean);
                expect(random === true || random === false).to.be.true;
            });
        });
    });

    describe('instantiated without constructor parameter', () => {
        it('should still work', async () => {
            const randomGeneratorInstance = new RandomGenerator();
            const randomBoolean = await randomGeneratorInstance.boolean();
            expect(randomBoolean === true || randomBoolean === false).to.be.true;
        });
    });

    describe('code coverage supplementary tests', () => {
        describe('getRandomArrayForAlphabet', () => {
            it('should throw if alphabetLength = 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(0, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength < 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(-1, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength > 4294967296', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(4294967296 + 1, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'alphabetLength must be less than or equal to RandomGenerator.MAX_ALPHABET_LEN',
                    );
                }
            });

            it('should throw if desiredRandomLength = 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(1, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredRandomLength must be greater than 0');
                }
            });

            it('should throw if desiredRandomLength < 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(1, -1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('desiredRandomLength must be greater than 0');
                }
            });

            it('should throw if allocating too much', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getRandomArrayForAlphabet(65537, 10 ** 100);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('TypedArray allocation failed, requested random too big');
                }
            });
        });

        describe('getRemainderForAlphabet', () => {
            it('should throw if alphabetLength = 0', async () => {
                try {
                    // @ts-ignore
                    randomGeneratorInstance.getRemainderForAlphabet(0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength < 0', async () => {
                try {
                    // @ts-ignore
                    randomGeneratorInstance.getRemainderForAlphabet(-1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength > 4294967296', async () => {
                try {
                    // @ts-ignore
                    randomGeneratorInstance.getRemainderForAlphabet(4294967296 + 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'alphabetLength must be less than or equal to RandomGenerator.MAX_ALPHABET_LEN',
                    );
                }
            });
        });

        describe('getUniformlyDistributedRandomCharIndexesOfAlphabet', () => {
            it('should throw if alphabetLength = 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(0, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength < 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(-1, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('alphabetLength must be greater than 0');
                }
            });

            it('should throw if alphabetLength > 4294967296', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(4294967296 + 1, 1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'alphabetLength must be less than or equal to RandomGenerator.MAX_ALPHABET_LEN',
                    );
                }
            });

            it('should throw if howMany = 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(1, 0);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('howMany must be greater than 0');
                }
            });

            it('should throw if howMany < 0', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(1, -1);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal('howMany must be greater than 0');
                }
            });

            it('should throw if unique = true && howMany > alphabetLength', async () => {
                try {
                    // @ts-ignore
                    await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(1, 2, true);
                    expect.fail('did not throw');
                } catch (e) {
                    expect(e.message).to.equal(
                        'if unique = true, howMany must be less than or equal to alphabetLength',
                    );
                }
            });
        });
    });
});
