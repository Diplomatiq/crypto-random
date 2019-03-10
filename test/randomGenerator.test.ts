import { expect } from 'chai';
import { RandomGenerator } from '../src/randomGenerator';

describe('RandomGenerator', () => {
    let randomGeneratorInstance: RandomGenerator;
    beforeEach(() => {
        randomGeneratorInstance = new RandomGenerator();
    });

    describe('bytes', () => {
        it('should return a byteCount-long Uint8Array (byteCount = 1)', async () => {
            const byteCount = 1;
            const random = await randomGeneratorInstance.bytes(byteCount);
            expect(random.length).to.equal(byteCount);
            expect(random.byteLength).to.equal(byteCount);
        });

        it('should return a byteCount-long Uint8Array (byteCount = 32)', async () => {
            const byteCount = 32;
            const random = await randomGeneratorInstance.bytes(byteCount);
            expect(random.length).to.equal(byteCount);
            expect(random.byteLength).to.equal(byteCount);
        });

        it('should return a byteCount-long Uint8Array (byteCount = 10000000)', async () => {
            const byteCount = 10000000;
            const random = await randomGeneratorInstance.bytes(byteCount);
            expect(random.length).to.equal(byteCount);
            expect(random.byteLength).to.equal(byteCount);
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
    });

    describe('integer', () => {
        it('should return an array of integers with one element between min and max (min = 0, max = 100)', async () => {
            const min = 0;
            const max = 100;
            const [random] = await randomGeneratorInstance.integer(min, max);
            expect(random)
                .to.be.at.least(min)
                .and.at.most(max);
        });

        it('should return an array of integers with 5 elements, all between min and max (min = 0, max = 100, howMany = 5)', async () => {
            const min = 0;
            const max = 100;
            const howMany = 5;
            const random = await randomGeneratorInstance.integer(min, max, howMany);
            expect(random.length).to.equal(howMany);

            for (const r of random) {
                expect(r)
                    .to.be.at.least(min)
                    .and.at.most(max);
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
                expect(e.message).to.equal(`min must be less than or equal to ${Number.MAX_SAFE_INTEGER}`);
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
                expect(e.message).to.equal(`max must be less than or equal to ${Number.MAX_SAFE_INTEGER}`);
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
                expect(e.message).to.equal('max - min + 1 must be less than or equal to 4294967296');
            }
        });
    });

    describe('string', () => {
        it('should return a string with 20 characters from the given alphabet', async () => {
            const desiredLength = 20;
            const alphabet = 'abc';
            const random = await randomGeneratorInstance.string(alphabet, desiredLength);
            expect(random.length).to.equal(desiredLength);

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
            // Unable to construct a string with 4294967296 characters.
            const fakeString = {
                length: 4294967296 + 1,
            };

            try {
                await randomGeneratorInstance.string((fakeString as any) as string, 1);
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('alphabet must have maximum 4294967296 characters');
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
    });

    describe('lowercase', () => {
        it('should return a string with 20 lowercase letters (desiredLength = 20)', async () => {
            const random = await randomGeneratorInstance.lowercase(20);
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
            expect(random === true || random === false).to.be.true;
        });
    });
});
