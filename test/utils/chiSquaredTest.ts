/**
 * Most of this code is the semantically equivalent version of the https://www.fourmilab.ch/random/
 * software's chi-squared test.
 */
export class ChiSquaredTest {
    public static readonly TEST_TRIES = 20;

    private static readonly TEST_TRESHOLD = 0.01;
    private static readonly TEST_ALLOWED_FAILS = 10;

    private static readonly Z_MAX = 6.0;
    private static readonly LOG_SQRT_PI = 0.5723649429247000870717135;
    private static readonly I_SQRT_PI = 0.5641895835477562869480795;
    private static readonly BIGX = 20.0;

    public static test(generatedValues: number[][], alphabetLength: number): boolean {
        if (generatedValues.length !== ChiSquaredTest.TEST_TRIES) {
            throw new Error('generatedValues.length must be equal to ChiSquaredTest.TEST_TRIES');
        }

        const df = alphabetLength - 1;
        const expectedFrequency = generatedValues[0].length / alphabetLength;

        let failCount = 0;

        for (let i = 0; i < ChiSquaredTest.TEST_TRIES; i++) {
            const random = generatedValues[i];

            const observationCountByValues = Array(alphabetLength).fill(0);
            for (const v of random) {
                observationCountByValues[v]++;
            }

            let test = 0;
            for (let i = 0; i < alphabetLength; i++) {
                test += (observationCountByValues[i] - expectedFrequency) ** 2 / expectedFrequency;
            }

            const p = ChiSquaredTest.pochisq(test, df);
            if (p < ChiSquaredTest.TEST_TRESHOLD || p > 1 - ChiSquaredTest.TEST_TRESHOLD) {
                failCount++;
            }
        }

        return failCount <= ChiSquaredTest.TEST_ALLOWED_FAILS;
    }

    private static pochisq(ax: number, df: number): number {
        let x = ax;
        let s: number;
        let e: number, c: number, z: number;

        if (x <= 0.0 || df < 1) {
            return 1.0;
        }

        const a = 0.5 * x;
        const even = df % 2 === 0;
        const y = df > 1 ? ChiSquaredTest.ex(-a) : 0;
        s = even ? y : 2.0 * ChiSquaredTest.poz(-Math.sqrt(x));
        if (df > 2) {
            x = 0.5 * (df - 1.0);
            z = even ? 1.0 : 0.5;
            if (a > ChiSquaredTest.BIGX) {
                e = even ? 0.0 : ChiSquaredTest.LOG_SQRT_PI;
                c = Math.log(a);
                while (z <= x) {
                    e = Math.log(z) + e;
                    s += ChiSquaredTest.ex(c * z - a - e);
                    z += 1.0;
                }

                return s;
            }

            e = even ? 1.0 : ChiSquaredTest.I_SQRT_PI / Math.sqrt(a);
            c = 0.0;
            while (z <= x) {
                e = e * (a / z);
                c = c + e;
                z += 1.0;
            }

            return c * y + s;
        }

        return s;
    }

    private static ex(x: number): number {
        return x < -ChiSquaredTest.BIGX ? 0.0 : Math.exp(x);
    }

    private static poz(z: number): number {
        let y: number, x: number, w: number;

        if (z === 0.0) {
            x = 0.0;
        } else {
            y = 0.5 * Math.abs(z);
            if (y >= ChiSquaredTest.Z_MAX * 0.5) {
                x = 1.0;
            } else if (y < 1.0) {
                w = y * y;
                x =
                    ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w - 0.019198292004) * w +
                        0.059054035642) *
                        w -
                        0.151968751364) *
                        w +
                        0.319152932694) *
                        w -
                        0.5319230073) *
                        w +
                        0.797884560593) *
                    y *
                    2.0;
            } else {
                y -= 2.0;
                x =
                    (((((((((((((-0.000045255659 * y + 0.00015252929) * y - 0.000019538132) * y - 0.000676904986) * y +
                        0.001390604284) *
                        y -
                        0.00079462082) *
                        y -
                        0.002034254874) *
                        y +
                        0.006549791214) *
                        y -
                        0.010557625006) *
                        y +
                        0.011630447319) *
                        y -
                        0.009279453341) *
                        y +
                        0.005353579108) *
                        y -
                        0.002141268741) *
                        y +
                        0.000535310849) *
                        y +
                    0.999936657524;
            }
        }
        return z > 0.0 ? (x + 1.0) * 0.5 : (1.0 - x) * 0.5;
    }
}
