package tools;

import java.util.Random;

public class Randomizer {

    private final static Random RANDOMIZE = new Random();
    private final static Randomizer INSTANCE = new Randomizer();

    public static Randomizer getInstance() {
        return INSTANCE;
    }

    public static int nextInt() {
        return RANDOMIZE.nextInt();
    }

    public static int nextInt(final int arg0) {
        return RANDOMIZE.nextInt(arg0);
    }

    public static void nextBytes(final byte[] bytes) {
        RANDOMIZE.nextBytes(bytes);
    }

    public static boolean nextBoolean() {
        return RANDOMIZE.nextBoolean();
    }

    public static double nextDouble() {
        return RANDOMIZE.nextDouble();
    }

    public static float nextFloat() {
        return RANDOMIZE.nextFloat();
    }

    public static long nextLong() {
        return RANDOMIZE.nextLong();
    }

    public static int rand(final int lbound, final int ubound) {
        return (int) ((RANDOMIZE.nextDouble() * (ubound - lbound + 1)) + lbound);
    }
}
