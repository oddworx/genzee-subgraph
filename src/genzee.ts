import { Transfer } from "../generated/Genzee/Genzee";
import {
  loadGenzeeStats,
  loadOrCreateGenzee,
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

  let token = loadOrCreateGenzee(event.params.tokenId);
  token.owner = event.params.to.toHexString();
  token.save();

  let stats = loadGenzeeStats();

  let userTo = loadOrCreateUser(event.params.to.toHexString());

  if (userTo.genzeeBalance == 0) {
    stats.totalGenzeeOwners++;
    stats.save();
  }

  userTo.genzeeBalance++;
  userTo.save();

  if (
    event.params.from.toHexString() ==
    "0x0000000000000000000000000000000000000000"
  ) {
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
