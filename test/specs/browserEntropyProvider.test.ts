import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { BrowserEntropyProvider } from '../../src/browserEntropyProvider';
import { EntropyProvider } from '../../src/entropyProvider';
import { windowMock } from '../utils/windowMock';

describe('BrowserEntropyProvider', () => {
    let entropyProvider: EntropyProvider;

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
        entropyProvider = new BrowserEntropyProvider();
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
        expect(array.subarray(80000, 90000).some(v => v !== 0)).to.be.true;
    });

    it('should throw if window is not available', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            expect(e.message).to.equal('window.crypto.getRandomValues is not available');
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if window.crypto is not available', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window.crypto = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            expect(e.message).to.equal('window.crypto.getRandomValues is not available');
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if window.crypto.getRandomValues is not available', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window.crypto.getRandomValues = undefined;

        try {
            // eslint-disable-next-line no-new
            new BrowserEntropyProvider();
            expect.fail('did not throw');
        } catch (e) {
            expect(e.message).to.equal('window.crypto.getRandomValues is not available');
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.window = windowMock();
    });

    it('should throw if browserCrypto is undefined', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        entropyProvider.crypto = undefined;

        try {
            await entropyProvider.getRandomValues(new Uint8Array(1));
        } catch (e) {
            expect(e.message).to.equal('AssertError: no crypto');
        }
    });
});
