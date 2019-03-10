export class Alphabets {
    public static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    public static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public static readonly NUMERIC = '0123456789';
    public static readonly ALPHABETIC = Alphabets.LOWERCASE + Alphabets.UPPERCASE;
    public static readonly ALPHANUMERIC = Alphabets.LOWERCASE + Alphabets.UPPERCASE + Alphabets.NUMERIC;
}
