import { Transfer } from "../generated/Genzee/Genzee";
import { GenzeeToken, User } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let token = GenzeeToken.load(event.params.tokenId.toString());
  if (!token) {
    token = new GenzeeToken(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
  }

  token.owner = event.params.to.toHexString();
  token.save();

  let userTo = User.load(event.params.to.toHexString());

  if (!userTo) {
    userTo = new User(event.params.to.toHexString());
  }

  userTo.genzeeBalance++;
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

  userFrom.genzeeBalance--;
  userFrom.save();
}
