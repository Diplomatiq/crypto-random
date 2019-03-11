import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { EnvironmentDetectingEntropyProvider } from '../src/environmentDetectingEntropyProvider';
import { randomFillSync } from 'crypto';

describe('EnvironmentDetectingEntropyProvider', () => {
    let entropyProvider: EnvironmentDetectingEntropyProvider;

    describe('in browser environment', () => {
        beforeEach(() => {
            // @ts-ignore
            global.window = {
                document: {},
                crypto: {
                    getRandomValues: (array: Uint8Array) => randomFillSync(array),
                },
            };
            entropyProvider = new EnvironmentDetectingEntropyProvider();
        });

        after(() => {
            // @ts-ignore
            global.window = undefined;
        });

        it('should detect browser environment if global.window is defined', () => {
            expect(entropyProvider.getEnvironment()).to.equal('browser');
        });

        it('should work', async () => {
            const array = new Uint8Array(10);
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v > 0)).to.be.true;
        });

        it('should work for arrays larger than 65536 bytes', async () => {
            const array = new Uint8Array(100000);
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v > 0)).to.be.true;
        });

        it('should throw if window.crypto is not available', () => {
            // @ts-ignore
            global.window.crypto = undefined;

            try {
                new EnvironmentDetectingEntropyProvider();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('window.crypto.getRandomValues not available');
            }
        });

        it('should throw if window.crypto.getRandomValues is not available', () => {
            // @ts-ignore
            global.window.crypto.getRandomValues = undefined;

            try {
                new EnvironmentDetectingEntropyProvider();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('window.crypto.getRandomValues not available');
            }
        });
    });

    describe('in Node.js environment', () => {
        beforeEach(() => {
            entropyProvider = new EnvironmentDetectingEntropyProvider();
        });

        it('should detect node environment if global.window is not, but global.process is defined', () => {
            expect(entropyProvider.getEnvironment()).to.equal('node');
        });

        it('should work', async () => {
            const array = new Uint8Array(10);
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v > 0)).to.be.true;
        });

        it('should throw if the randomFill errs', async () => {
            try {
                // @ts-ignore
                await entropyProvider.getRandomValues(5);
                expect.fail('did not throw');
            } catch (e) {
                expect(e.code).to.equal('ERR_INVALID_ARG_TYPE');
            }
        });

        it('should throw if NodeJS.crypto is not available', () => {
            const originalRequire = require('module').prototype.require;
            require('module').prototype.require = (requiredModuleName: string) => {
                if (requiredModuleName === 'crypto') {
                    throw new Error();
                }
            };

            try {
                new EnvironmentDetectingEntropyProvider();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('NodeJS.crypto not available');
            }

            originalRequire('module').prototype.require = originalRequire;
        });
    });

    describe('in unexpected environment', () => {
        it('should throw', () => {
            const process = global.process;
            // @ts-ignore
            global.window = undefined;
            // @ts-ignore
            global.process = undefined;

            try {
                new EnvironmentDetectingEntropyProvider();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('Unexpected environment: neither browser nor node');
            }

            global.process = process;
        });
    });
});
