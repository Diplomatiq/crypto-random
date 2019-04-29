/**
 * Store for simple values with configurable uniqueness.
 */
export class ConfigurableUniquenessStore<T> {
    private readonly uniqueStore: Set<T> = new Set();
    private readonly nonUniqueStore: T[] = [];

    public constructor(private readonly unique: boolean) {}

    public add(value: T): void {
        this.unique ? this.uniqueStore.add(value) : this.nonUniqueStore.push(value);
    }

    public size(): number {
        return this.unique ? this.uniqueStore.size : this.nonUniqueStore.length;
    }

    public all(): T[] {
        return this.unique ? Array.from(this.uniqueStore) : this.nonUniqueStore;
    }
}
