import { BigInt } from "@graphprotocol/graph-ts";
import { GenzeeStats, User } from "../generated/schema";

export const loadGenzeeStats: () => GenzeeStats = () => {
  let stats = GenzeeStats.load("v1");
  if (!stats) {
    stats = new GenzeeStats("v1");
    stats.totalGenzeesStaked = 0;
  }
  return stats;
};

export const loadOrCreateUser: (id: string) => User = (id) => {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.genzeeBalance = 0;
    user.oddxBalance = BigInt.zero();
  }

  return user;
};
