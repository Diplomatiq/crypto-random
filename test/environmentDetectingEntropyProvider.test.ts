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
            // @ts-ignore
            expect(entropyProvider.environment).to.equal('browser');
        });

        it('should work', async () => {
            const array = new Uint8Array(10);
            expect(array.every(v => v === 0)).to.be.true;
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v !== 0)).to.be.true;
        });

        it('should work for arrays larger than 65536 bytes', async () => {
            const array = new Uint8Array(100000);
            expect(array.every(v => v === 0)).to.be.true;
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v !== 0)).to.be.true;
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

        it('should throw if calling the node method', async () => {
            try {
                // @ts-ignore
                await entropyProvider.getRandomValuesNode(new Uint8Array());
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('not in node environment');
            }
        });
    });

    describe('in Node.js environment', () => {
        beforeEach(() => {
            entropyProvider = new EnvironmentDetectingEntropyProvider();
        });

        it('should detect node environment if global.window is not, but global.process is defined', () => {
            // @ts-ignore
            expect(entropyProvider.environment).to.equal('node');
        });

        it('should work', async () => {
            const array = new Uint8Array(10);
            expect(array.every(v => v === 0)).to.be.true;
            const sameArray = await entropyProvider.getRandomValues(array);
            expect(array).to.deep.equal(sameArray);
            expect(array.some(v => v !== 0)).to.be.true;
        });

        it('should throw if randomFill throws sync error', async () => {
            try {
                // @ts-ignore
                await entropyProvider.getRandomValues(5);
                expect.fail('did not throw');
            } catch (e) {
                expect(e.code).to.equal('ERR_INVALID_ARG_TYPE');
            }
        });

        it('should throw if randomFill throws async error', async () => {
            const simulatedErrorMessage = 'SimulatedError';

            const Module = require('module');
            const originalRequire = Module.prototype.require;
            Module.prototype.require = (requiredModuleName: string) => {
                if (requiredModuleName === 'crypto') {
                    return {
                        randomFill: <T extends Uint8Array | Uint16Array | Uint32Array>(
                            array: T,
                            callback: (error: Error, array: T) => void,
                        ) => {
                            callback(new Error(simulatedErrorMessage), array);
                        },
                    };
                }

                return originalRequire(requiredModuleName);
            };

            try {
                const entropyProviderWithOverriddenNodeRequire = new EnvironmentDetectingEntropyProvider();
                await entropyProviderWithOverriddenNodeRequire.getRandomValues(new Uint8Array());
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal(simulatedErrorMessage);
            }

            Module.prototype.require = originalRequire;
        });

        it('should throw if NodeJS.crypto is not available', () => {
            const Module = require('module');
            const originalRequire = Module.prototype.require;
            Module.prototype.require = (requiredModuleName: string) => {
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

            Module.prototype.require = originalRequire;
        });

        it('should throw if calling the browser method', async () => {
            try {
                // @ts-ignore
                await entropyProvider.getRandomValuesBrowser();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('not in browser environment');
            }
        });
    });

    describe('in unexpected environment', () => {
        let process: NodeJS.Process;

        before(() => {
            process = global.process;
            // @ts-ignore
            global.window = undefined;
            // @ts-ignore
            global.process = undefined;
        });

        after(() => {
            global.process = process;
        });

        it('should throw', () => {
            try {
                new EnvironmentDetectingEntropyProvider();
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.equal('Unexpected environment: neither browser nor node');
            }
        });
    });
});
