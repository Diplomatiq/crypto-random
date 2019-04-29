import { expect } from 'chai';
import { ConfigurableUniquenessStore } from '../src/configurableUniquenessStore';

describe('ConfigurableUniquenessStore', () => {
    let configurableUniquenessStore: ConfigurableUniquenessStore<string>;

    describe('with unique = false', () => {
        beforeEach(() => {
            configurableUniquenessStore = new ConfigurableUniquenessStore(false);
        });

        it('should add non-unique values', () => {
            configurableUniquenessStore.add('test');
            configurableUniquenessStore.add('test');
            expect(configurableUniquenessStore.size()).to.equal(2);
            expect(configurableUniquenessStore.all()).to.deep.equal(['test', 'test']);
        });

        it('should add unique values', () => {
            configurableUniquenessStore.add('abc');
            configurableUniquenessStore.add('def');
            expect(configurableUniquenessStore.size()).to.equal(2);
            expect(configurableUniquenessStore.all()).to.deep.equal(['abc', 'def']);
        });
    });

    describe('with unique = true', () => {
        beforeEach(() => {
            configurableUniquenessStore = new ConfigurableUniquenessStore(true);
        });

        it('should not add non-unique values', () => {
            configurableUniquenessStore.add('test');
            configurableUniquenessStore.add('test');
            expect(configurableUniquenessStore.size()).to.equal(1);
            expect(configurableUniquenessStore.all()).to.deep.equal(['test']);
        });

        it('should add unique values', () => {
            configurableUniquenessStore.add('abc');
            configurableUniquenessStore.add('def');
            expect(configurableUniquenessStore.size()).to.equal(2);
            expect(configurableUniquenessStore.all()).to.deep.equal(['abc', 'def']);
        });
    });
});
