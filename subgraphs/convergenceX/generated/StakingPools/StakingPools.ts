// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class MigratorChangeProposed extends ethereum.Event {
  get params(): MigratorChangeProposed__Params {
    return new MigratorChangeProposed__Params(this);
  }
}

export class MigratorChangeProposed__Params {
  _event: MigratorChangeProposed;

  constructor(event: MigratorChangeProposed) {
    this._event = event;
  }

  get newMigrator(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class MigratorChanged extends ethereum.Event {
  get params(): MigratorChanged__Params {
    return new MigratorChanged__Params(this);
  }
}

export class MigratorChanged__Params {
  _event: MigratorChanged;

  constructor(event: MigratorChanged) {
    this._event = event;
  }

  get oldMigrator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newMigrator(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PoolCreated extends ethereum.Event {
  get params(): PoolCreated__Params {
    return new PoolCreated__Params(this);
  }
}

export class PoolCreated__Params {
  _event: PoolCreated;

  constructor(event: PoolCreated) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get startBlock(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get endBlock(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get migrationBlock(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get rewardPerBlock(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class PoolEndBlockExtended extends ethereum.Event {
  get params(): PoolEndBlockExtended__Params {
    return new PoolEndBlockExtended__Params(this);
  }
}

export class PoolEndBlockExtended__Params {
  _event: PoolEndBlockExtended;

  constructor(event: PoolEndBlockExtended) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get oldEndBlock(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get newEndBlock(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class PoolMigrated extends ethereum.Event {
  get params(): PoolMigrated__Params {
    return new PoolMigrated__Params(this);
  }
}

export class PoolMigrated__Params {
  _event: PoolMigrated;

  constructor(event: PoolMigrated) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get oldToken(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newToken(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class PoolMigrationBlockExtended extends ethereum.Event {
  get params(): PoolMigrationBlockExtended__Params {
    return new PoolMigrationBlockExtended__Params(this);
  }
}

export class PoolMigrationBlockExtended__Params {
  _event: PoolMigrationBlockExtended;

  constructor(event: PoolMigrationBlockExtended) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get oldMigrationBlock(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get newMigrationBlock(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class PoolRewardRateChanged extends ethereum.Event {
  get params(): PoolRewardRateChanged__Params {
    return new PoolRewardRateChanged__Params(this);
  }
}

export class PoolRewardRateChanged__Params {
  _event: PoolRewardRateChanged;

  constructor(event: PoolRewardRateChanged) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get oldRewardPerBlock(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get newRewardPerBlock(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class RewardRedeemed extends ethereum.Event {
  get params(): RewardRedeemed__Params {
    return new RewardRedeemed__Params(this);
  }
}

export class RewardRedeemed__Params {
  _event: RewardRedeemed;

  constructor(event: RewardRedeemed) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get staker(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rewarder(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class RewarderChanged extends ethereum.Event {
  get params(): RewarderChanged__Params {
    return new RewarderChanged__Params(this);
  }
}

export class RewarderChanged__Params {
  _event: RewarderChanged;

  constructor(event: RewarderChanged) {
    this._event = event;
  }

  get oldRewarder(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newRewarder(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Staked extends ethereum.Event {
  get params(): Staked__Params {
    return new Staked__Params(this);
  }
}

export class Staked__Params {
  _event: Staked;

  constructor(event: Staked) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get staker(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Unstaked extends ethereum.Event {
  get params(): Unstaked__Params {
    return new Unstaked__Params(this);
  }
}

export class Unstaked__Params {
  _event: Unstaked;

  constructor(event: Unstaked) {
    this._event = event;
  }

  get poolId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get staker(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class StakingPools__pendingMigratorResult {
  value0: BigInt;
  value1: Address;

  constructor(value0: BigInt, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }
}

export class StakingPools__poolDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }
}

export class StakingPools__poolInfosResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: Address;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    return map;
  }
}

export class StakingPools__userDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }
}

export class StakingPools extends ethereum.SmartContract {
  static bind(address: Address): StakingPools {
    return new StakingPools("StakingPools", address);
  }

  getReward(poolId: BigInt, staker: Address): BigInt {
    let result = super.call(
      "getReward",
      "getReward(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(poolId),
        ethereum.Value.fromAddress(staker)
      ]
    );

    return result[0].toBigInt();
  }

  try_getReward(poolId: BigInt, staker: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getReward",
      "getReward(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(poolId),
        ethereum.Value.fromAddress(staker)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  lastPoolId(): BigInt {
    let result = super.call("lastPoolId", "lastPoolId():(uint256)", []);

    return result[0].toBigInt();
  }

  try_lastPoolId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("lastPoolId", "lastPoolId():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  migrator(): Address {
    let result = super.call("migrator", "migrator():(address)", []);

    return result[0].toAddress();
  }

  try_migrator(): ethereum.CallResult<Address> {
    let result = super.tryCall("migrator", "migrator():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  migratorSetterDelay(): BigInt {
    let result = super.call(
      "migratorSetterDelay",
      "migratorSetterDelay():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_migratorSetterDelay(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "migratorSetterDelay",
      "migratorSetterDelay():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  pendingMigrator(): StakingPools__pendingMigratorResult {
    let result = super.call(
      "pendingMigrator",
      "pendingMigrator():(uint64,address)",
      []
    );

    return new StakingPools__pendingMigratorResult(
      result[0].toBigInt(),
      result[1].toAddress()
    );
  }

  try_pendingMigrator(): ethereum.CallResult<
    StakingPools__pendingMigratorResult
  > {
    let result = super.tryCall(
      "pendingMigrator",
      "pendingMigrator():(uint64,address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new StakingPools__pendingMigratorResult(
        value[0].toBigInt(),
        value[1].toAddress()
      )
    );
  }

  poolData(param0: BigInt): StakingPools__poolDataResult {
    let result = super.call(
      "poolData",
      "poolData(uint256):(uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new StakingPools__poolDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_poolData(
    param0: BigInt
  ): ethereum.CallResult<StakingPools__poolDataResult> {
    let result = super.tryCall(
      "poolData",
      "poolData(uint256):(uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new StakingPools__poolDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  poolInfos(param0: BigInt): StakingPools__poolInfosResult {
    let result = super.call(
      "poolInfos",
      "poolInfos(uint256):(uint256,uint256,uint256,uint256,address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new StakingPools__poolInfosResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toAddress()
    );
  }

  try_poolInfos(
    param0: BigInt
  ): ethereum.CallResult<StakingPools__poolInfosResult> {
    let result = super.tryCall(
      "poolInfos",
      "poolInfos(uint256):(uint256,uint256,uint256,uint256,address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new StakingPools__poolInfosResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toAddress()
      )
    );
  }

  rewarder(): Address {
    let result = super.call("rewarder", "rewarder():(address)", []);

    return result[0].toAddress();
  }

  try_rewarder(): ethereum.CallResult<Address> {
    let result = super.tryCall("rewarder", "rewarder():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  userData(param0: BigInt, param1: Address): StakingPools__userDataResult {
    let result = super.call(
      "userData",
      "userData(uint256,address):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return new StakingPools__userDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_userData(
    param0: BigInt,
    param1: Address
  ): ethereum.CallResult<StakingPools__userDataResult> {
    let result = super.tryCall(
      "userData",
      "userData(uint256,address):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new StakingPools__userDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _migratorSetterDelay(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreatePoolCall extends ethereum.Call {
  get inputs(): CreatePoolCall__Inputs {
    return new CreatePoolCall__Inputs(this);
  }

  get outputs(): CreatePoolCall__Outputs {
    return new CreatePoolCall__Outputs(this);
  }
}

export class CreatePoolCall__Inputs {
  _call: CreatePoolCall;

  constructor(call: CreatePoolCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get startBlock(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get endBlock(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get migrationBlock(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get rewardPerBlock(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class CreatePoolCall__Outputs {
  _call: CreatePoolCall;

  constructor(call: CreatePoolCall) {
    this._call = call;
  }
}

export class EmergencyUnstakeCall extends ethereum.Call {
  get inputs(): EmergencyUnstakeCall__Inputs {
    return new EmergencyUnstakeCall__Inputs(this);
  }

  get outputs(): EmergencyUnstakeCall__Outputs {
    return new EmergencyUnstakeCall__Outputs(this);
  }
}

export class EmergencyUnstakeCall__Inputs {
  _call: EmergencyUnstakeCall;

  constructor(call: EmergencyUnstakeCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class EmergencyUnstakeCall__Outputs {
  _call: EmergencyUnstakeCall;

  constructor(call: EmergencyUnstakeCall) {
    this._call = call;
  }
}

export class ExecuteMigratorChangeCall extends ethereum.Call {
  get inputs(): ExecuteMigratorChangeCall__Inputs {
    return new ExecuteMigratorChangeCall__Inputs(this);
  }

  get outputs(): ExecuteMigratorChangeCall__Outputs {
    return new ExecuteMigratorChangeCall__Outputs(this);
  }
}

export class ExecuteMigratorChangeCall__Inputs {
  _call: ExecuteMigratorChangeCall;

  constructor(call: ExecuteMigratorChangeCall) {
    this._call = call;
  }
}

export class ExecuteMigratorChangeCall__Outputs {
  _call: ExecuteMigratorChangeCall;

  constructor(call: ExecuteMigratorChangeCall) {
    this._call = call;
  }
}

export class ExtendEndBlockCall extends ethereum.Call {
  get inputs(): ExtendEndBlockCall__Inputs {
    return new ExtendEndBlockCall__Inputs(this);
  }

  get outputs(): ExtendEndBlockCall__Outputs {
    return new ExtendEndBlockCall__Outputs(this);
  }
}

export class ExtendEndBlockCall__Inputs {
  _call: ExtendEndBlockCall;

  constructor(call: ExtendEndBlockCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get newEndBlock(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ExtendEndBlockCall__Outputs {
  _call: ExtendEndBlockCall;

  constructor(call: ExtendEndBlockCall) {
    this._call = call;
  }
}

export class ExtendMigrationBlockCall extends ethereum.Call {
  get inputs(): ExtendMigrationBlockCall__Inputs {
    return new ExtendMigrationBlockCall__Inputs(this);
  }

  get outputs(): ExtendMigrationBlockCall__Outputs {
    return new ExtendMigrationBlockCall__Outputs(this);
  }
}

export class ExtendMigrationBlockCall__Inputs {
  _call: ExtendMigrationBlockCall;

  constructor(call: ExtendMigrationBlockCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get newMigrationBlock(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ExtendMigrationBlockCall__Outputs {
  _call: ExtendMigrationBlockCall;

  constructor(call: ExtendMigrationBlockCall) {
    this._call = call;
  }
}

export class MigratePoolCall extends ethereum.Call {
  get inputs(): MigratePoolCall__Inputs {
    return new MigratePoolCall__Inputs(this);
  }

  get outputs(): MigratePoolCall__Outputs {
    return new MigratePoolCall__Outputs(this);
  }
}

export class MigratePoolCall__Inputs {
  _call: MigratePoolCall;

  constructor(call: MigratePoolCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class MigratePoolCall__Outputs {
  _call: MigratePoolCall;

  constructor(call: MigratePoolCall) {
    this._call = call;
  }
}

export class ProposeMigratorChangeCall extends ethereum.Call {
  get inputs(): ProposeMigratorChangeCall__Inputs {
    return new ProposeMigratorChangeCall__Inputs(this);
  }

  get outputs(): ProposeMigratorChangeCall__Outputs {
    return new ProposeMigratorChangeCall__Outputs(this);
  }
}

export class ProposeMigratorChangeCall__Inputs {
  _call: ProposeMigratorChangeCall;

  constructor(call: ProposeMigratorChangeCall) {
    this._call = call;
  }

  get newMigrator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ProposeMigratorChangeCall__Outputs {
  _call: ProposeMigratorChangeCall;

  constructor(call: ProposeMigratorChangeCall) {
    this._call = call;
  }
}

export class RedeemRewardsCall extends ethereum.Call {
  get inputs(): RedeemRewardsCall__Inputs {
    return new RedeemRewardsCall__Inputs(this);
  }

  get outputs(): RedeemRewardsCall__Outputs {
    return new RedeemRewardsCall__Outputs(this);
  }
}

export class RedeemRewardsCall__Inputs {
  _call: RedeemRewardsCall;

  constructor(call: RedeemRewardsCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class RedeemRewardsCall__Outputs {
  _call: RedeemRewardsCall;

  constructor(call: RedeemRewardsCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetPoolRewardCall extends ethereum.Call {
  get inputs(): SetPoolRewardCall__Inputs {
    return new SetPoolRewardCall__Inputs(this);
  }

  get outputs(): SetPoolRewardCall__Outputs {
    return new SetPoolRewardCall__Outputs(this);
  }
}

export class SetPoolRewardCall__Inputs {
  _call: SetPoolRewardCall;

  constructor(call: SetPoolRewardCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get newRewardPerBlock(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetPoolRewardCall__Outputs {
  _call: SetPoolRewardCall;

  constructor(call: SetPoolRewardCall) {
    this._call = call;
  }
}

export class SetRewarderCall extends ethereum.Call {
  get inputs(): SetRewarderCall__Inputs {
    return new SetRewarderCall__Inputs(this);
  }

  get outputs(): SetRewarderCall__Outputs {
    return new SetRewarderCall__Outputs(this);
  }
}

export class SetRewarderCall__Inputs {
  _call: SetRewarderCall;

  constructor(call: SetRewarderCall) {
    this._call = call;
  }

  get newRewarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetRewarderCall__Outputs {
  _call: SetRewarderCall;

  constructor(call: SetRewarderCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UnstakeCall extends ethereum.Call {
  get inputs(): UnstakeCall__Inputs {
    return new UnstakeCall__Inputs(this);
  }

  get outputs(): UnstakeCall__Outputs {
    return new UnstakeCall__Outputs(this);
  }
}

export class UnstakeCall__Inputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }

  get poolId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UnstakeCall__Outputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }
}
