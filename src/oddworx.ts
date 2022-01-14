import {
  Transfer,
  StakedNft,
  UnstakedNft,
  UserClaimedNftRewards,
} from "../generated/Oddworx/Oddworx";
import { GenzeeToken, User } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let userTo = User.load(event.params.to.toHexString());

  if (!userTo) {
    userTo = new User(event.params.to.toHexString());
  }

  userTo.oddxBalance = userTo.oddxBalance.plus(event.params.amount);
  userTo.save();

  if (
    event.params.from.toHexString() ==
    "0x0000000000000000000000000000000000000000"
  ) {
    return;
  }

  let userFrom = User.load(event.params.from.toHexString());
  if (!userFrom) {
    userFrom = new User(event.params.from.toHexString());
  }

  userFrom.oddxBalance = userFrom.oddxBalance.minus(event.params.amount);
  userFrom.save();
}

export function handleStake(event: StakedNft): void {
  let token = GenzeeToken.load(event.params.genzee.toString());
  token!.stakedAt = event.block.timestamp;
  token!.save();
}

export function handleUnstake(event: UnstakedNft): void {
  let token = GenzeeToken.load(event.params.genzee.toString());
  token!.stakedAt = null;
  token!.save();
}

export function handleClaim(event: UserClaimedNftRewards): void {}
