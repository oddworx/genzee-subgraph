import { BigInt } from "@graphprotocol/graph-ts";
import { GenzeeInfo, User } from "../generated/schema";

export const genzeeContractAddress =
  "0x201675fBFAAAC3A51371E4C31FF73Ac14ceE2A5A";
export const oddxContractAddress = "0x4095547F958593B5431C0306e81df4293991d5B3";

export const loadGenzeeStats: () => GenzeeInfo = () => {
  let stats = GenzeeInfo.load("v1");
  if (!stats) {
    stats = new GenzeeInfo("v1");
    stats.totalGenzeesStaked = 0;
    stats.totalGenzeeOwners = 0;
    stats.totalOddxClaimed = BigInt.zero();
  }
  return stats;
};

export const loadOrCreateUser: (id: string) => User = (id) => {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.genzeeBalance = 0;
    user.oddxBalance = BigInt.zero();
    user.oddxClaimed = BigInt.zero();
  }

  return user;
};
