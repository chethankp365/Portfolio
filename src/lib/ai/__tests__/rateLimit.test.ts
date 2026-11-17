import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rateLimit";

describe("Rate Limiting", () => {
  it("permits initial requests for a new IP", async () => {
    const ip = "192.168.1.100";
    const result = await checkRateLimit(ip);
    expect(result.success).toBe(true);
    expect(result.remainingMinute).toBe(11);
  });

  it("blocks requests when minute limit (12) is exceeded", async () => {
    const ip = "192.168.1.101";

    for (let i = 0; i < 12; i++) {
      const res = await checkRateLimit(ip);
      expect(res.success).toBe(true);
    }

    // 13th request should be rejected
    const blocked = await checkRateLimit(ip);
    expect(blocked.success).toBe(false);
    expect(blocked.remainingMinute).toBe(0);
    expect(blocked.retryAfterSeconds).toBeDefined();
  });

  it("tracks different IPs separately", async () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    const resA = await checkRateLimit(ipA);
    const resB = await checkRateLimit(ipB);

    expect(resA.success).toBe(true);
    expect(resB.success).toBe(true);
  });
});
