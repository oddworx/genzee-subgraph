import { BigInt } from "@graphprotocol/graph-ts";
import { ContractInfo, Nft, User } from "../generated/schema";

export const blackhole = "0x0000000000000000000000000000000000000000";

// Mainnet
export const genzeeContractAddress =
  "0x201675fBFAAAC3A51371E4C31FF73Ac14ceE2A5A".toLowerCase();
export const oddxContractAddress = "0x4095547F958593B5431C0306e81df4293991d5B3".toLowerCase();
export const oddxStakingContractAddress = "0x428b6a13277116C62D751bebbC6f47011A0Cdc11".toLowerCase();

// Rinkeby
// export const genzeeContractAddress =
//   "0x437C88DaA2C743CEa3B6337e8bEd2035405C5bdf".toLowerCase();
// export const oddxContractAddress =
//   "0x8105Ecd044887b22ae21ef9070f54171df88Cd4b".toLowerCase();
// export const oddxStakingContractAddress =
//   "0x135f1f45295d29cc869cdBB0EC2e404888633b51".toLowerCase();

export const loadOrCreateContractStats: (
  contractAddress: string
) => ContractInfo = (contractAddress) => {
  let stats = ContractInfo.load(contractAddress);
  if (!stats) {
    stats = new ContractInfo(contractAddress);
    stats.totalStaked = 0;
    stats.totalOwners = 0;
    stats.totalOddxClaimed = BigInt.zero();
  }
  return stats;
};

export const loadOrCreateNft: (
  id: BigInt,
  contractAddress: string,
  owner: string
) => Nft = (id, contractAddress, owner) => {
  const globalId = `${contractAddress}:${id.toString()}`;

  let token = Nft.load(globalId);
  if (!token) {
    token = new Nft(globalId);
    token.tokenID = id;
    token.contractAddress = contractAddress;
    token.oddxClaimed = BigInt.zero();
    token.latestUnstakedClaim = BigInt.zero();
    token.owner = owner;
  }
  return token;
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
