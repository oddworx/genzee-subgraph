import { Transfer } from "../generated/Genzee/Genzee";
import {
  blackhole,
  genzeeContractAddress,
  loadOrCreateContractStats,
  loadOrCreateNft,
  loadOrCreateUser,
  oddxContractAddress,
  oddxStakingContractAddress,
} from "./common";

const ignoreTransfer: (event: Transfer) => bool = (event) => {
  return (
    event.params.from.toHexString() == oddxContractAddress.toLowerCase() ||
    event.params.from.toHexString() ==
      oddxStakingContractAddress.toLowerCase() ||
    event.params.to.toHexString() == oddxContractAddress.toLowerCase() ||
    event.params.to.toHexString() == oddxStakingContractAddress.toLowerCase()
  );
};

export function handleTransfer(event: Transfer): void {
  // Skip this fn if transfering from or to ODDX.
  // This means it's unstaking or staking which is handled on oddworx.ts
  if (ignoreTransfer(event)) {
    return;
  }

  let token = loadOrCreateNft(
    event.params.tokenId,
    genzeeContractAddress,
    event.params.to.toHexString()
  );
  token.owner = event.params.to.toHexString();
  token.save();

  let stats = loadOrCreateContractStats(genzeeContractAddress);

  let userTo = loadOrCreateUser(event.params.to.toHexString());

  if (userTo.genzeeBalance == 0) {
    stats.totalOwners++;
    stats.save();
  }

  userTo.genzeeBalance++;
  userTo.save();

  if (event.params.from.toHexString() == blackhole) {
    return;
  }

  let userFrom = loadOrCreateUser(event.params.from.toHexString());
  userFrom.genzeeBalance--;

  if (userFrom.genzeeBalance == 0) {
    stats.totalOwners--;
    stats.save();
  }

  userFrom.save();
}
