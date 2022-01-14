import { GenzeeStats } from "../generated/schema";

export const loadGenzeeStats: () => GenzeeStats = () => {
  let stats = GenzeeStats.load("v1");
  if (!stats) {
    stats = new GenzeeStats("v1");
    stats.totalGenzeesStaked = 0;
  }
  return stats;
};
