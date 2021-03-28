import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { BrowserEntropyProvider } from '../../src/browserEntropyProvider';
import { EntropyProvider } from '../../src/entropyProvider';
import { windowMock } from '../utils/windowMock';

describe('BrowserEntropyProvider', (): void => {
    let entropyProvider: EntropyProvider;

    before((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = windowMock();
    });

    after((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = undefined;
    });

    beforeEach((): void => {
        entropyProvider = new BrowserEntropyProvider();
    });

    it('should work', async (): Promise<void> => {
        const array = new Uint8Array(10);
        expect(array.every((v): boolean => v === 0)).to.be.true;
        const sameArray = await entropyProvider.getRandomValues(array);
        expect(array).to.deep.equal(sameArray);
        expect(array.some((v): boolean => v !== 0)).to.be.true;
    });

    it('should work for arrays larger than 65536 bytes', async (): Promise<void> => {
        const array = new Uint8Array(100000);
        expect(array.every((v): boolean => v === 0)).to.be.true;
        const sameArray = await entropyProvider.getRandomValues(array);
        expect(array).to.deep.equal(sameArray);
        expect(array.some((v): boolean => v !== 0)).to.be.true;
        expect(array.subarray(80000, 90000).some((v): boolean => v !== 0)).to.be.true;
    });

    it('should throw if window is not available', (): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal('window.crypto.getRandomValues is not available');
            } else {
                expect.fail('exception is not of type Error');
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if window.crypto is not available', (): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window.crypto = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal('window.crypto.getRandomValues is not available');
            } else {
                expect.fail('exception is not of type Error');
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if window.crypto.getRandomValues is not available', (): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window.crypto.getRandomValues = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal('window.crypto.getRandomValues is not available');
            } else {
                expect.fail('exception is not of type Error');
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if browserCrypto is undefined', async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        entropyProvider.crypto = undefined;

        try {
            await entropyProvider.getRandomValues(new Uint8Array(1));
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal('AssertError: no crypto');
            } else {
                expect.fail('exception is not of type Error');
            }
        }
    });
});
