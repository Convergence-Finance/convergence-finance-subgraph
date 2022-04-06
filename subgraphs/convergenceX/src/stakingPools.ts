import {
  Staked as StakedEvent,
  Unstaked as UnstakedEvent,
  RewardRedeemed as RewardRedeemedEvent,
  PoolCreated as PoolCreatedEvent,
  PoolRewardRateChanged as PoolRewardRateChangedEvent,
  PoolEndBlockExtended as PoolEndBlockExtendedEvent,
  PoolMigrated as PoolMigratedEvent,
  PoolEndBlockExtended,
  PoolMigrated,
} from "../generated/StakingPools/StakingPools";
import { SwapPair } from "../generated/StakingPools/SwapPair";
import { TokenVested as TokenVestedEvent } from "../generated/StakingPoolRewarder/StakingPoolRewarder";

import {
  StakingPair,
  Pool,
  Stake,
  UnStaked,
  RewardRedeemed,
  UserReward,
  UserPoolData,
  UserPoolDataSnapshot,
  PoolInfoAndDataSnapshot,
  Pair,
} from "../generated/schema";

import {
  stakingpools_address,
  subgraphMode,
  SUBGRAPH_MODE,
} from "../../common/envVars";

import {
  BigInt,
  Address,
  BigDecimal,
  ethereum,
  Bytes,
} from "@graphprotocol/graph-ts";

// import { fetchTokenSymbol, fetchTokenDecimals } from "../src/swapFactory";
import {
  BI_18,
  convertTokenToDecimal,
  ZERO_BD,
  ADDRESS_ZERO,
} from "../../common";
import {
  getTokenSymbol,
  getTokenDecimals,
  getTokenAddressesFromPair,
} from "../../common/tokenProperties";
import {
  fetchTokenAddressesFromPair,
  fetchTokenDecimals,
  fetchTokenSymbol,
} from "./swapFactory";

let stakingpoolsAddress = stakingpools_address;
let ACCU_REWARD_MULTIPLIER = BigInt.fromI32(1000000000)
  .times(BigInt.fromI32(1000000000))
  .times(BigInt.fromI32(100));

export function handleStaked(event: StakedEvent): void {
  updatePoolAccuReward(event.params.poolId, event);
  updateUserReward(event.params.poolId, event.params.staker, event);
  let stake = new Stake(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  let pool = Pool.load(event.params.poolId.toString());

  stake.stakingPair = pool.stakingPair;
  stake.transactionHash = event.transaction.hash;
  stake.token = event.params.token;
  stake.staker = event.params.staker;
  stake.amount = convertTokenToDecimal(event.params.amount, pool.decimals);
  stake.timestamp = event.block.timestamp;
  stake.block = event.block.number;
  stake.save();

  pool.totalStakeAmount = pool.totalStakeAmount.plus(event.params.amount);
  pool.save();

  let userPoolData = UserPoolData.load(
    event.params.poolId.toString() + "-" + event.params.staker.toHexString()
  );
  userPoolData.stakeAmount = userPoolData.stakeAmount.plus(event.params.amount);
  userPoolData.save();

  snapshotUserPoolData(
    event.params.poolId,
    event.params.staker,
    Address.fromString(pool.token.toHexString()),
    event
  );
  snapshotPoolInfoAndData(
    event.params.poolId,
    Address.fromString(pool.token.toHexString()),
    event
  );
}

export function handleUnstaked(event: UnstakedEvent): void {
  updatePoolAccuReward(event.params.poolId, event);
  updateUserReward(event.params.poolId, event.params.staker, event);
  let unStaked = new UnStaked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  let pool = Pool.load(event.params.poolId.toString());

  unStaked.stakingPair = pool.stakingPair;
  unStaked.transactionHash = event.transaction.hash;
  unStaked.token = event.params.token;
  unStaked.staker = event.params.staker;
  unStaked.amount = convertTokenToDecimal(event.params.amount, pool.decimals);
  unStaked.timestamp = event.block.timestamp;
  unStaked.block = event.block.number;
  unStaked.save();

  pool.totalStakeAmount = pool.totalStakeAmount.minus(event.params.amount);
  pool.save();

  let userPoolData = UserPoolData.load(
    event.params.poolId.toString() + "-" + event.params.staker.toHexString()
  );
  userPoolData.stakeAmount = userPoolData.stakeAmount.minus(
    event.params.amount
  );
  userPoolData.save();

  snapshotUserPoolData(
    event.params.poolId,
    event.params.staker,
    Address.fromString(pool.token.toHexString()),
    event
  );
  snapshotPoolInfoAndData(
    event.params.poolId,
    Address.fromString(pool.token.toHexString()),
    event
  );
}

//后续增加的reward 计算的部分
export function handleTokenVested(event: TokenVestedEvent): void {
  let rewardRedeemed = new RewardRedeemed(event.transaction.hash.toHex());

  let amount = convertTokenToDecimal(event.params.amount, BI_18);

  saveRewardInfo(
    rewardRedeemed as RewardRedeemed,
    amount,
    event.params.poolId,
    event.transaction.hash,
    event.params.user,
    event.address,
    event
  );
}

export function handleRewardRedeemed(event: RewardRedeemedEvent): void {
  let rewardRedeemed = RewardRedeemed.load(event.transaction.hash.toHex());

  //当handleTokenVested 出现时候就不需要这部分的监听了
  if (rewardRedeemed == null) {
    rewardRedeemed = new RewardRedeemed(event.transaction.hash.toHex());
  } else {
    return;
  }

  let amount = convertTokenToDecimal(event.params.amount, BI_18).times(
    BigDecimal.fromString("0.04")
  );

  saveRewardInfo(
    rewardRedeemed as RewardRedeemed,
    amount,
    event.params.poolId,
    event.transaction.hash,
    event.params.staker,
    event.params.rewarder,
    event
  );
}

function saveRewardInfo(
  rewardRedeemed: RewardRedeemed,
  amount: BigDecimal,
  poolId: BigInt,
  transactionHash: Bytes,
  staker: Address,
  rewarder: Address,
  event: ethereum.Event
): void {
  updatePoolAccuReward(poolId, event);
  updateUserReward(poolId, staker, event);
  let pool = Pool.load(poolId.toString());

  rewardRedeemed.amount = amount;
  rewardRedeemed.stakingPair = pool.stakingPair;
  rewardRedeemed.transactionHash = transactionHash;
  rewardRedeemed.token = pool.token;
  rewardRedeemed.staker = staker;
  rewardRedeemed.rewarder = rewarder;
  rewardRedeemed.timestamp = event.block.timestamp;
  rewardRedeemed.block = event.block.number;
  rewardRedeemed.save();

  let userReward = UserReward.load(
    poolId.toString() + "-" + staker.toHexString()
  );
  if (userReward == null) {
    userReward = new UserReward(poolId.toString() + "-" + staker.toHexString());
    userReward.token = pool.token;
    userReward.poolId = poolId;
    userReward.user = staker;
    userReward.redeemableRewards = ZERO_BD;
  }
  userReward.redeemableRewards = userReward.redeemableRewards.plus(
    rewardRedeemed.amount
  );
  userReward.save();

  let userPoolData = UserPoolData.load(
    poolId.toString() + "-" + staker.toHexString()
  );
  userPoolData.pendingReward = BigInt.fromI32(0);
  userPoolData.save();

  snapshotUserPoolData(
    poolId,
    staker,
    Address.fromString(pool.token.toHexString()),
    event
  );
  snapshotPoolInfoAndData(
    poolId,
    Address.fromString(pool.token.toHexString()),
    event
  );
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let pool = Pool.load(event.params.poolId.toString());
  if (pool == null) {
    pool = new Pool(event.params.poolId.toString());

    let symbol =
      subgraphMode == SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
        ? getTokenSymbol(event.params.token)
        : fetchTokenSymbol(event.params.token);
    if (symbol == "CLP" || symbol == "UNI-V2") {
      let token0 = ADDRESS_ZERO;
      let token1 = ADDRESS_ZERO;
      let pair = Pair.load(event.params.token.toString());
      if (pair == null) {
        let tokenAddrs = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
          ? getTokenAddressesFromPair(event.params.token)
          : fetchTokenAddressesFromPair(event.params.token);
        token0 = tokenAddrs[0];
        token1 = tokenAddrs[1];
      } else {
        token0 = Address.fromString(pair.token0);
        token1 = Address.fromString(pair.token1);
      }

      let stakingPair = StakingPair.load(event.params.token.toHexString());
      if (stakingPair == null) {
        stakingPair = new StakingPair(event.params.token.toHexString());
        stakingPair.token0Address = token0;
        stakingPair.token1Address = token1;
        stakingPair.token0Symbol = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
          ? getTokenSymbol(token0)
          : fetchTokenSymbol(token0);
        stakingPair.token1Symbol = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
          ? getTokenSymbol(token1)
          : fetchTokenSymbol(token1);
        stakingPair.save();
      }
      pool.stakingPair = stakingPair.id;
    }

    pool.decimals = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
      ? getTokenDecimals(event.params.token)
      : fetchTokenDecimals(event.params.token);
    pool.token = event.params.token;
    pool.startBlock = event.params.startBlock;
    pool.endBlock = event.params.endBlock;
    pool.migrationBlock = event.params.migrationBlock;
    pool.rewardPerBlock = event.params.rewardPerBlock;
    pool.totalStakeAmount = BigInt.fromI32(0);
    pool.accuRewardPerShare = BigInt.fromI32(0);
    pool.accuRewardLastUpdateBlock = event.params.startBlock;
    pool.timestamp = event.block.timestamp;
    pool.block = event.block.number;
    pool.save();
  }
}

export function handlePoolRewardRateChanged(
  event: PoolRewardRateChangedEvent
): void {
  updatePoolAccuReward(event.params.poolId, event);

  let pool = Pool.load(event.params.poolId.toString());
  pool.rewardPerBlock = event.params.newRewardPerBlock;
  pool.save();

  snapshotPoolInfoAndData(
    event.params.poolId,
    Address.fromString(pool.token.toHexString()),
    event
  );
}

export function handlePoolEndBlockExtended(
  event: PoolEndBlockExtendedEvent
): void {
  let pool = Pool.load(event.params.poolId.toString());
  pool.endBlock = event.params.newEndBlock;
  pool.save();

  snapshotPoolInfoAndData(
    event.params.poolId,
    Address.fromString(pool.token.toHexString()),
    event
  );
}

export function handlePoolMigrated(event: PoolMigratedEvent): void {
  let pool = Pool.load(event.params.poolId.toString());
  pool.token = event.params.newToken;

  let symbol = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
    ? getTokenSymbol(event.params.newToken)
    : fetchTokenSymbol(event.params.newToken);
  if (symbol == "CLP" || symbol == "UNI-V2") {
    let token0 = ADDRESS_ZERO;
    let token1 = ADDRESS_ZERO;
    let pair = Pair.load(event.params.newToken.toString());
    if (pair == null) {
      let tokenAddrs = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
        ? getTokenAddressesFromPair(event.params.newToken)
        : fetchTokenAddressesFromPair(event.params.newToken);
      token0 = tokenAddrs[0];
      token1 = tokenAddrs[1];
    } else {
      token0 = Address.fromString(pair.token0);
      token1 = Address.fromString(pair.token1);
    }

    let stakingPair = StakingPair.load(event.params.newToken.toHexString());
    if (stakingPair == null) {
      stakingPair = new StakingPair(event.params.newToken.toHexString());
      stakingPair.token0Address = token0;
      stakingPair.token1Address = token1;
      stakingPair.token0Symbol = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
        ? getTokenSymbol(token0)
        : fetchTokenSymbol(token0);
      stakingPair.token1Symbol = SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
        ? getTokenSymbol(token1)
        : fetchTokenSymbol(token1);
      stakingPair.save();
    }
    pool.stakingPair = stakingPair.id;
  }

  pool.save();

  snapshotPoolInfoAndData(event.params.poolId, event.params.newToken, event);
}

// Update Pool Accu Reward Data
function updatePoolAccuReward(poolId: BigInt, event: ethereum.Event): void {
  let pool = Pool.load(poolId.toString());
  let blockToBeUpdated = event.block.number.ge(pool.endBlock)
    ? pool.endBlock
    : event.block.number;
  let durationInBlocks = blockToBeUpdated.minus(pool.accuRewardLastUpdateBlock);

  if (durationInBlocks.gt(BigInt.fromI32(0))) {
    if (pool.totalStakeAmount.gt(BigInt.fromI32(0))) {
      pool.accuRewardPerShare = pool.accuRewardPerShare.plus(
        durationInBlocks
          .times(pool.rewardPerBlock)
          .times(ACCU_REWARD_MULTIPLIER)
          .div(pool.totalStakeAmount)
      );
    }
    pool.accuRewardLastUpdateBlock = blockToBeUpdated;
    pool.save();
  }
}

// Update user reward data
function updateUserReward(
  poolId: BigInt,
  staker: Address,
  event: ethereum.Event
): void {
  let userPoolData = UserPoolData.load(
    poolId.toString() + "-" + staker.toHexString()
  );
  let pool = Pool.load(poolId.toString());

  if (userPoolData == null) {
    // Create new record when user stake to the pool for the first time
    userPoolData = new UserPoolData(
      poolId.toString() + "-" + staker.toHexString()
    );
    userPoolData.user = staker;
    userPoolData.poolId = poolId;
    userPoolData.stakeAmount = BigInt.fromI32(0);
    userPoolData.pendingReward = BigInt.fromI32(0);
  } else {
    let userStakeAmount = userPoolData.stakeAmount;
    let rateDifference = pool.accuRewardPerShare.minus(
      userPoolData.entryAccuRewardPerShare
    );
    if (rateDifference.gt(BigInt.fromI32(0))) {
      userPoolData.pendingReward = userPoolData.pendingReward.plus(
        userStakeAmount.times(rateDifference).div(ACCU_REWARD_MULTIPLIER)
      );
    }
  }
  userPoolData.entryAccuRewardPerShare = pool.accuRewardPerShare;
  userPoolData.save();
}

// Take snapshot of UserPoolData
function snapshotUserPoolData(
  poolId: BigInt,
  staker: Address,
  token: Address,
  event: ethereum.Event
): void {
  let userPoolData = UserPoolData.load(
    poolId.toString() + "-" + staker.toHexString()
  );

  let userPoolDataSnapshot = new UserPoolDataSnapshot(
    staker
      .toHexString()
      .concat("-")
      .concat(poolId.toString())
      .concat("-")
      .concat(event.block.timestamp.toString())
  );

  let userReward = UserReward.load(staker.toHexString());
  if (userReward == null) {
    userPoolDataSnapshot.redeemedRewards = ZERO_BD;
  } else {
    userPoolDataSnapshot.redeemedRewards = userReward.redeemableRewards;
  }
  userPoolDataSnapshot.staker = staker;
  userPoolDataSnapshot.token = token;
  userPoolDataSnapshot.poolId = poolId;
  userPoolDataSnapshot.stakeAmount = userPoolData.stakeAmount;
  userPoolDataSnapshot.pendingReward = userPoolData.pendingReward;
  userPoolDataSnapshot.entryAccuRewardPerShare =
    userPoolData.entryAccuRewardPerShare;
  userPoolDataSnapshot.timestamp = event.block.timestamp;
  userPoolDataSnapshot.block = event.block.number;
  userPoolDataSnapshot.save();
}

// Take snapshot of Pool Info and Data
function snapshotPoolInfoAndData(
  poolId: BigInt,
  token: Address,
  event: ethereum.Event
): void {
  let poolInfoAndData = Pool.load(poolId.toString());

  let poolInfoAndDataSnapshot = new PoolInfoAndDataSnapshot(
    poolId.toString().concat("-").concat(event.block.timestamp.toString())
  );

  poolInfoAndDataSnapshot.poolId = poolId;
  poolInfoAndDataSnapshot.poolToken = token;
  poolInfoAndDataSnapshot.totalStakeAmount = poolInfoAndData.totalStakeAmount;
  poolInfoAndDataSnapshot.accuRewardPerShare =
    poolInfoAndData.accuRewardPerShare;
  poolInfoAndDataSnapshot.accuRewardLastUpdateBlock =
    poolInfoAndData.accuRewardLastUpdateBlock;
  poolInfoAndDataSnapshot.startBlock = poolInfoAndData.startBlock;
  poolInfoAndDataSnapshot.endBlock = poolInfoAndData.endBlock;
  poolInfoAndDataSnapshot.rewardPerBlock = poolInfoAndData.rewardPerBlock;
  poolInfoAndDataSnapshot.poolToken = poolInfoAndData.token;
  poolInfoAndDataSnapshot.timestamp = event.block.timestamp;
  poolInfoAndDataSnapshot.block = event.block.number;
  poolInfoAndDataSnapshot.save();
}
