import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/Genzee/Genzee";
import { GenzeeToken } from "../generated/schema";
import {
  loadGenzeeStats,
  loadOrCreateUser,
  oddxContractAddress,
} from "./common";

export function handleTransfer(event: Transfer): void {
  // Skip this fn if transfering from or to ODDX.
  // This means it's unstaking or staking which is handled on oddworx.ts
  if (
    event.params.to.toHexString().toLowerCase() ==
      oddxContractAddress.toLowerCase() ||
    event.params.from.toHexString().toLowerCase() ==
      oddxContractAddress.toLowerCase()
  ) {
    return;
  }

  let token = GenzeeToken.load(event.params.tokenId.toString());
  if (!token) {
    token = new GenzeeToken(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
    token.oddxClaimed = BigInt.zero();
  }

  token.owner = event.params.to.toHexString();
  token.save();

  let stats = loadGenzeeStats();

  let userTo = loadOrCreateUser(event.params.to.toHexString());

  if (userTo.genzeeBalance == 0) {
    stats.totalGenzeeOwners++;
  }

  userTo.genzeeBalance++;
  userTo.save();

  if (
    event.params.from.toHexString() ==
    "0x0000000000000000000000000000000000000000"
  ) {
    stats.save();
    return;
  }

  let userFrom = loadOrCreateUser(event.params.from.toHexString());
  userFrom.genzeeBalance--;

  if (userFrom.genzeeBalance == 0) {
    stats.totalGenzeeOwners--;
    stats.save();
  }

  userFrom.save();
}
