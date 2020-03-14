import { expect } from 'chai';
import { RandomGenerator } from '../../src/randomGenerator';
import { ChiSquaredTest } from '../utils/chiSquaredTest';
import { windowMock } from '../utils/windowMock';

describe('Generated values should follow a uniform distribution', () => {
    // Setting unique = true would not really have a meaning here, since the output would be biased.
    const unique = false;

    let randomGeneratorInstance: RandomGenerator;

    before(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = windowMock();
    });

    after(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = undefined;
    });

    beforeEach(() => {
        randomGeneratorInstance = new RandomGenerator();
    });

    describe('alphabetLength = 2', () => {
        const alphabetLength = 2;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });

    describe('alphabetLength = 10', () => {
        const alphabetLength = 10;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });

    describe('alphabetLength = 62', () => {
        const alphabetLength = 62;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });

    describe('alphabetLength = 100', () => {
        const alphabetLength = 100;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });

    describe('alphabetLength = 10000', () => {
        const alphabetLength = 10000;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });

    describe('alphabetLength = 1000000', () => {
        const alphabetLength = 1000000;

        it('howMany = 10', async () => {
            const howMany = 10;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100', async () => {
            const howMany = 100;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 1000', async () => {
            const howMany = 1000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });

        it('howMany = 100000', async () => {
            const howMany = 100000;

            const generatedValues: number[][] = [];
            for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const random = await randomGeneratorInstance.getUniformlyDistributedRandomCharIndexesOfAlphabet(
                    alphabetLength,
                    howMany,
                    unique,
                );
                generatedValues.push(random);
            }

            const result = ChiSquaredTest.test(generatedValues, alphabetLength);
            expect(result).to.be.true;
        });
    });
});
