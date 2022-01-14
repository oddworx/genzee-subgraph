import { Transfer } from "../generated/Genzee/Genzee";
import { GenzeeToken } from "../generated/schema";
import { loadOrCreateUser } from "./common";

export function handleTransfer(event: Transfer): void {
  let token = GenzeeToken.load(event.params.tokenId.toString());
  if (!token) {
    token = new GenzeeToken(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
  }

  token.owner = event.params.to.toHexString();
  token.save();

  let userTo = loadOrCreateUser(event.params.to.toHexString());
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
  userFrom.save();
}
