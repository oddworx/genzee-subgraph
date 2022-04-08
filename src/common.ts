import { BigInt } from "@graphprotocol/graph-ts";
import { ContractInfo, Nft, User } from "../generated/schema";
import {
  GenzeeAddress,
  OddworxAddress,
  OddworxStakingAddress,
} from "../generated/addresses";

export const blackhole = "0x0000000000000000000000000000000000000000";
export const genzeeContractAddress = GenzeeAddress.toLowerCase();
export const oddxContractAddress = OddworxAddress.toLowerCase();
export const oddxStakingContractAddress = OddworxStakingAddress.toLowerCase();

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
    token.legacyStake = false;
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
