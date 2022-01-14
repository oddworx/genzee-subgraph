import {
  Transfer,
  StakedNft,
  UnstakedNft,
  UserClaimedNftRewards,
} from "../generated/Oddworx/Oddworx";
import { loadGenzeeStats, loadOrCreateUser } from "./common";
import { GenzeeToken } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let userTo = loadOrCreateUser(event.params.to.toHexString());
  userTo.oddxBalance = userTo.oddxBalance.plus(event.params.amount);
  userTo.save();

  if (
    event.params.from.toHexString() ==
    "0x0000000000000000000000000000000000000000"
  ) {
    return;
  }

  let userFrom = loadOrCreateUser(event.params.from.toHexString());
  userFrom.oddxBalance = userFrom.oddxBalance.minus(event.params.amount);
  userFrom.save();
}

export function handleStake(event: StakedNft): void {
  let token = GenzeeToken.load(event.params.genzee.toString());
  token!.stakedAt = event.block.timestamp;
  token!.save();

  let stats = loadGenzeeStats();
  stats.totalGenzeesStaked++;
  stats.save();
}

export function handleUnstake(event: UnstakedNft): void {
  let token = GenzeeToken.load(event.params.genzee.toString());
  token!.stakedAt = null;
  token!.latestUnstakedClaim = event.block.timestamp;
  token!.save();

  let stats = loadGenzeeStats();
  stats.totalGenzeesStaked--;
  stats.save();
}

export function handleClaim(event: UserClaimedNftRewards): void {
  let stats = loadGenzeeStats();
  stats.totalOddxClaimed = stats.totalOddxClaimed.plus(event.params.amount);
  stats.save();

  let user = loadOrCreateUser(event.params.user.toHexString());
  user.oddxClaimed = user.oddxClaimed.plus(event.params.amount);
  user.save();

  let token = GenzeeToken.load(event.params.genzee.toString());
  token!.oddxClaimed = token!.oddxClaimed.plus(event.params.amount);
  if (!token!.stakedAt) {
    token!.latestUnstakedClaim = event.block.timestamp;
  } else {
    token!.stakedAt = event.block.timestamp;
  }
  token!.save();
}
