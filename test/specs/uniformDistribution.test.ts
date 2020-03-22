import { expect } from 'chai';
import { RandomGenerator } from '../../src/randomGenerator';
import { ChiSquaredTest } from '../utils/chiSquaredTest';
import { windowMock } from '../utils/windowMock';

describe('Generated values should follow a uniform distribution', (): void => {
    // Setting unique = true would not really have a meaning here, since the output would be biased.
    const unique = false;

    let randomGeneratorInstance: RandomGenerator;

    before((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = windowMock();
    });

    after((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = undefined;
    });

    beforeEach((): void => {
        randomGeneratorInstance = new RandomGenerator();
    });

    describe('alphabetLength = 2', (): void => {
        const alphabetLength = 2;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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

    describe('alphabetLength = 10', (): void => {
        const alphabetLength = 10;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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

    describe('alphabetLength = 62', (): void => {
        const alphabetLength = 62;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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

    describe('alphabetLength = 100', (): void => {
        const alphabetLength = 100;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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

    describe('alphabetLength = 10000', (): void => {
        const alphabetLength = 10000;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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

    describe('alphabetLength = 1000000', (): void => {
        const alphabetLength = 1000000;

        it('howMany = 10', async (): Promise<void> => {
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

        it('howMany = 100', async (): Promise<void> => {
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

        it('howMany = 1000', async (): Promise<void> => {
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

        it('howMany = 100000', async (): Promise<void> => {
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
