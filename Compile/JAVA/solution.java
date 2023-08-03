import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class q {

    public static int result;
    public static int[] cost, plan;

    public static void backTracking(int depth, int pay) {
        if (depth == 12) {
            result = Math.min(result, pay);
            return;
        }
        backTracking(depth + 1, pay + plan[depth]);
        if (depth < 10)
            backTracking(depth + 3, pay + cost[2]);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine());
        for (int t = 0; t < T; t++) {
            cost = new int[4];
            plan = new int[12];
            StringTokenizer st = new StringTokenizer(br.readLine());
            for (int i = 0; i < 4; i++)
                cost[i] = Integer.parseInt(st.nextToken());
            st = new StringTokenizer(br.readLine());
            for (int i = 0; i < 12; i++)
                plan[i] = Integer.parseInt(st.nextToken());

            result = Integer.MAX_VALUE;
            result = Math.min(result, cost[3]);
            for (int i = 0; i < 12; i++)
                plan[i] = plan[i] * cost[0];
            for (int i = 0; i < 12; i++)
                if (plan[i] > cost[1])
                    plan[i] = cost[1];
            backTracking(0, 0);
            System.out.printf("#%d %d\n", t + 1, result);
        }
    }
}