import { Approval as ApprovalEvent } from "../generated/templates/ERC20/ERC20";
import {
  Sync as SyncEvent,
  Swap as SwapEvent,
  Approval as PairApprovalEvent,
  Mint as MintEvent,
  Burn as BurnEvent,
  Transfer as TransferEvent,
  Freeze as FreezeEvent,
  SwapPair,
} from "../generated/templates/SwapPair/SwapPair";
import { SwapFactory as SwapFactoryContract } from "../generated/templates/SwapPair/SwapFactory";
import { ERC20 } from "../generated/templates/SwapPair/ERC20";
import {
  fetchConvPairTokenAddress,
  fetchUsdtPairTokenAddress,
} from "../src/swapFactory";

import {
  Pair,
  Token,
  TotalLiquidityInSymbolByDay,
  Approval,
  PairApproval,
  Swap,
  PairPricesLast,
  PairPricesMinuter,
  PairPricesHour,
  PairPricesDay,
  PairPricesEvery,
  PairVolumeMinuter,
  PairVolumeHour,
  PairVolumeDay,
  TokenVolumeHour,
  TokenUSDPriceHour,
  TotalVolumeInSymbolByDay,
  TotalVolumeInSymbolByHour,
  Transaction,
  SwapPairFeeInfoByLast,
  SwapPairFeeInfoByHour,
  Mint,
  Burn,
  FreezePair,
  TotalToken,
} from "../generated/schema";

import {
  log,
  BigInt,
  BigDecimal,
  ethereum,
  Address,
  store,
} from "@graphprotocol/graph-ts";
import {
  erc20_usdt_address,
  swapfactory_address,
  swaprouter_address,
  conv_usdt_pair_address,
  stakingpools_address,
  conv_address,
  weth_address,
  receive_fee_address,
  conv_usdt_pair_address_str,
  subgraphMode,
  SUBGRAPH_MODE,
} from "../../common/envVars";
import {
  ZERO_BD,
  ONE,
  ONEDAY,
  ONEHOURS,
  ONEMINUTE,
  BI_18,
  convertTokenToDecimal,
  exponentToBigDecimal,
  ADDRESS_ZERO,
  sqrt,
  ZERO,
} from "../../common";

import {
  getConvPairTokenAddress,
  getUSDTPairTokenAddress,
  ERC_20_TOKEN_ADDRESS_INDEX,
} from "../../common/tokenProperties";

export function handleApproval(event: ApprovalEvent): void {
  //过滤掉路由的 Approval
  if (
    event.transaction.to == swaprouter_address ||
    event.transaction.to == stakingpools_address
  ) {
    return;
  }

  // Not by swapRouter / stakingpools => Not handle
  if (
    event.params.spender != swaprouter_address &&
    event.params.spender != stakingpools_address
  ) {
    return;
  }

  let approval = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  let token = Token.load(event.address.toHex());
  approval.source = token.symbol;
  approval.sourceAddress = event.address;
  approval.transactionHash = event.transaction.hash;
  approval.owner = event.params.owner;
  approval.spender = event.params.spender;
  approval.value = convertTokenToDecimal(event.params.value, token.decimals);
  approval.timestamp = event.block.timestamp;
  approval.block = event.block.number;
  approval.save();
}

export function handlePairApproval(event: PairApprovalEvent): void {
  if (
    event.transaction.to == swaprouter_address ||
    event.transaction.to == stakingpools_address
  ) {
    return;
  }

  // $ Not by swapRouter / stakingpools => Not handle
  if (
    event.params.spender != swaprouter_address &&
    event.params.spender != stakingpools_address
  ) {
    return;
  }

  let pairApproval = new PairApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  pairApproval.pair = event.address.toHex();
  pairApproval.transactionHash = event.transaction.hash;
  pairApproval.owner = event.params.owner;
  pairApproval.spender = event.params.spender;
  pairApproval.value = convertTokenToDecimal(event.params.value, BI_18);
  pairApproval.timestamp = event.block.timestamp;
  pairApproval.block = event.block.number;
  pairApproval.save();
}

export function handleSwap(event: SwapEvent): void {
  let pair = Pair.load(event.address.toHexString());
  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  let amount0In = convertTokenToDecimal(
    event.params.amount0In,
    token0.decimals
  );
  let amount1In = convertTokenToDecimal(
    event.params.amount1In,
    token1.decimals
  );
  let amount0Out = convertTokenToDecimal(
    event.params.amount0Out,
    token0.decimals
  );
  let amount1Out = convertTokenToDecimal(
    event.params.amount1Out,
    token1.decimals
  );

  let pay = pair.token1;
  let receive = pair.token0;
  let payAmount = ZERO_BD;
  let receiveAmount = ZERO_BD;

  if (amount0In.equals(ZERO_BD)) {
    pay = pair.token1;
    receive = pair.token0;

    payAmount = amount1In.minus(amount1Out);
    receiveAmount = amount0Out.minus(amount0In);
  } else if (amount1In.equals(ZERO_BD)) {
    pay = pair.token0;
    receive = pair.token1;

    payAmount = amount0In.minus(amount0Out);
    receiveAmount = amount1Out.minus(amount1In);
  } else {
    payAmount = amount0Out.minus(amount0In);
    receiveAmount = amount1Out.minus(amount1In);
  }

  let swap = Swap.load(event.transaction.hash.toHex());
  if (swap == null) {
    swap = new Swap(event.transaction.hash.toHex());
    swap.transactionHash = event.transaction.hash;
    swap.sender = event.params.sender;
    swap.from = event.transaction.from;
    swap.pair = pair.id;
    swap.pay = pay;
    swap.receive = receive;
    swap.payAmount = payAmount;
    swap.receiveAmount = receiveAmount;
    swap.amount0In = amount0In;
    swap.amount1In = amount1In;
    swap.amount0Out = amount0Out;
    swap.amount1Out = amount1Out;
    swap.to = event.params.to;
    swap.timestamp = event.block.timestamp;
    swap.block = event.block.number;
  } else {
    swap.receive = receive;
    swap.receiveAmount = receiveAmount;
  }

  swap.save();

  let totalAmount0 = ZERO_BD;
  let totalAmount1 = ZERO_BD;
  if (amount0In.equals(ZERO_BD)) {
    totalAmount0 = amount0In.plus(amount0Out);
    totalAmount1 = amount1In.minus(amount1Out);
  } else if (amount1In.equals(ZERO_BD)) {
    totalAmount0 = amount0In.minus(amount0Out);
    totalAmount1 = amount1In.plus(amount1Out);
  } else {
    totalAmount0 = amount0In.minus(amount0Out);
    totalAmount1 = amount1In.minus(amount1Out);
  }

  let totalVolumeUSD = ZERO_BD;
  let token0VolumeUSD = ZERO_BD;
  let token1VolumeUSD = ZERO_BD;
  if (Address.fromString(token0.id) == erc20_usdt_address) {
    token0VolumeUSD = totalAmount0;
    token1VolumeUSD = totalAmount1.div(pair.token1Price);
    totalVolumeUSD = totalAmount0.plus(token1VolumeUSD);
  } else if (Address.fromString(token1.id) == erc20_usdt_address) {
    token0VolumeUSD = totalAmount0.div(pair.token0Price);
    token1VolumeUSD = totalAmount1;
    totalVolumeUSD = totalAmount1.plus(token0VolumeUSD);
  } else {
    token0VolumeUSD = getTokenAmountUSD(totalAmount0, token0 as Token);
    token1VolumeUSD = getTokenAmountUSD(totalAmount1, token1 as Token);
    totalVolumeUSD = token0VolumeUSD.plus(token1VolumeUSD);
  }

  let token0Volume = totalAmount0.plus(totalAmount1.div(pair.token1Price));
  let token1Volume = totalAmount1.plus(totalAmount0.div(pair.token0Price));
  pairVolumeUpdated(
    token0Volume,
    token1Volume,
    totalVolumeUSD,
    pair as Pair,
    event
  );

  TokenVolumeUpdated(
    totalAmount0,
    totalAmount1,
    token0VolumeUSD,
    token1VolumeUSD,
    pair as Pair,
    event
  );

  pairFeeUpdated(pair as Pair, event);
}

function getTokenAmountUSD(amount: BigDecimal, token: Token): BigDecimal {
  if (Address.fromString(token.id) == erc20_usdt_address) {
    return amount;
  }

  let price = getTokenUSDPrice(token);
  return amount.times(price);
}

function getTokenUSDPrice(token: Token): BigDecimal {
  if (Address.fromString(token.id) == erc20_usdt_address) {
    return BigDecimal.fromString("1");
  }

  if (Address.fromString(token.id) != conv_address) {
    let usdtPairId =
      subgraphMode == SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
        ? getUSDTPairTokenAddress(Address.fromString(token.id))
        : fetchUsdtPairTokenAddress(Address.fromString(token.id));
    let usdtPair = Pair.load(usdtPairId.toHexString());
    if (usdtPair != null) {
      if (Address.fromString(usdtPair.token0) == erc20_usdt_address) {
        return usdtPair.token0Price;
      } else {
        return usdtPair.token1Price;
      }
    }
  }

  let convPrice = ZERO_BD;
  let convPair = Pair.load(conv_usdt_pair_address_str);
  if (Address.fromString(convPair.token0) == erc20_usdt_address) {
    convPrice = convPair.token0Price;
  } else {
    convPrice = convPair.token1Price;
  }

  if (Address.fromString(token.id) == conv_address) {
    return convPrice;
  }

  let pairId =
    subgraphMode == SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL
      ? getConvPairTokenAddress(Address.fromString(token.id))
      : fetchConvPairTokenAddress(Address.fromString(token.id));
  let pair = Pair.load(pairId.toHexString());
  if (Address.fromString(pair.token0) == conv_address) {
    return pair.token0Price.times(convPrice);
  } else {
    return pair.token1Price.times(convPrice);
  }
}

function getPairTokenPrice(pair: Pair): BigDecimal {
  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);

  let token0USDprice = ZERO_BD;
  let token1USDprice = ZERO_BD;
  if (Address.fromString(token0.id) == erc20_usdt_address) {
    token0USDprice = BigDecimal.fromString("1");
    token1USDprice = pair.token0Price;
  } else if (Address.fromString(token1.id) == erc20_usdt_address) {
    token0USDprice = pair.token1Price;
    token1USDprice = BigDecimal.fromString("1");
  } else {
    token0USDprice = getTokenUSDPrice(token0 as Token);
    token1USDprice = getTokenUSDPrice(token1 as Token);
  }

  let pairTotalValue = token0USDprice
    .times(pair.reserve0)
    .plus(token1USDprice.times(pair.reserve1));
  return pairTotalValue.div(pair.supply);
}

export function handleSync(event: SyncEvent): void {
  let pair = Pair.load(event.address.toHex());
  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  let reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals);
  let reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals);

  let change = ZERO_BD;
  if (pair.reserve0.ge(reserve0)) {
    change = pair.reserve0.minus(reserve0);
    token0.liquidity = token0.liquidity.minus(change);
  } else {
    change = reserve0.minus(pair.reserve0);
    token0.liquidity = token0.liquidity.plus(change);
  }

  if (pair.reserve1.ge(reserve1)) {
    change = pair.reserve1.minus(reserve1);
    token1.liquidity = token1.liquidity.minus(change);
  } else {
    change = reserve1.minus(pair.reserve1);
    token1.liquidity = token1.liquidity.plus(change);
  }

  token0.save();
  token1.save();

  pairPricesUpdated(reserve0, reserve1, pair as Pair, event);
  tokenUsdPriceUpdated(token0 as Token, token1 as Token, event);
  totalLiquidityUpdated(event);
}

function pairFeeUpdated(pair: Pair, event: ethereum.Event): void {
  let timestamp = event.block.timestamp;
  let timeHour = timestamp.div(ONEHOURS);
  let convPair = Pair.load(conv_usdt_pair_address_str);
  let convPrice = ZERO_BD;

  if (Address.fromString(convPair.token0) == erc20_usdt_address) {
    convPrice = convPair.token0Price;
  } else {
    convPrice = convPair.token1Price;
  }

  let swapPairFeeInfoByLast = SwapPairFeeInfoByLast.load(pair.id);
  let k1 = swapPairFeeInfoByLast.lastK;
  let k2 = swapPairFeeInfoByLast.nowk;

  let nowFree = BigDecimal.fromString("5")
    .times(sqrt(k2).minus(sqrt(k1)))
    .div(BigDecimal.fromString("5").times(sqrt(k2).plus(sqrt(k1))))
    .times(sqrt(k1));

  swapPairFeeInfoByLast.totalFeeValue = swapPairFeeInfoByLast.totalFeeValue.plus(
    nowFree.times(convPrice)
  );

  swapPairFeeInfoByLast.totalFeeTokenValue = swapPairFeeInfoByLast.totalFeeTokenValue.plus(
    nowFree
  );
  swapPairFeeInfoByLast.convPirce = convPrice;
  swapPairFeeInfoByLast.timestamp = timestamp;
  swapPairFeeInfoByLast.block = event.block.number;
  swapPairFeeInfoByLast.save();

  //FreeHour
  let HourId = timeHour.toString() + "-" + pair.id;
  let swapPairFeeInfoByHour = SwapPairFeeInfoByHour.load(HourId);
  if (swapPairFeeInfoByHour == null) {
    swapPairFeeInfoByHour = new SwapPairFeeInfoByHour(HourId);
    swapPairFeeInfoByHour.pair = pair.id;
  }

  swapPairFeeInfoByHour.k = k2;
  swapPairFeeInfoByHour.totalFeeValue = swapPairFeeInfoByLast.totalFeeValue;
  swapPairFeeInfoByHour.timestampHour = timeHour;
  swapPairFeeInfoByHour.timestamp = timestamp;
  swapPairFeeInfoByHour.block = event.block.number;
  swapPairFeeInfoByHour.save();
}

function tokenUsdPriceUpdated(
  token0: Token,
  token1: Token,
  event: ethereum.Event
): void {
  let token0UsdPrice = getTokenUSDPrice(token0);
  let token1UsdPrice = getTokenUSDPrice(token1);
  token0.usdPrice = token0UsdPrice;
  token0.liquidityInUsd = token0UsdPrice.times(token0.liquidity);
  token1.usdPrice = token1UsdPrice;
  token1.liquidityInUsd = token1UsdPrice.times(token1.liquidity);

  token0.save();
  token1.save();

  let timestamp = event.block.timestamp;
  let blockNumber = event.block.number;
  let timeHour = timestamp.div(ONEHOURS);

  //tokken0 price Hour
  let token0HourId = timeHour.toString() + "-" + token0.id;
  let token0USDPriceHour = TokenUSDPriceHour.load(token0HourId);
  if (token0USDPriceHour == null) {
    token0USDPriceHour = new TokenUSDPriceHour(token0HourId);
    token0USDPriceHour.token = token0.id;
  }
  token0USDPriceHour.timestampHour = timeHour;
  token0USDPriceHour.timestamp = timestamp;
  token0USDPriceHour.price = token0UsdPrice;
  token0USDPriceHour.block = blockNumber;
  token0USDPriceHour.save();

  //tokken1 price Hour
  let token1HourId = timeHour.toString() + "-" + token1.id;
  let token1USDPriceHour = TokenUSDPriceHour.load(token1HourId);
  if (token1USDPriceHour == null) {
    token1USDPriceHour = new TokenUSDPriceHour(token1HourId);
    token1USDPriceHour.token = token1.id;
  }
  token1USDPriceHour.timestampHour = timeHour;
  token1USDPriceHour.timestamp = timestamp;
  token1USDPriceHour.price = token1UsdPrice;
  token1USDPriceHour.block = blockNumber;
  token1USDPriceHour.save();
}

function totalLiquidityUpdated(event: ethereum.Event): void {
  let totalValue = ZERO_BD;
  for (let i = 0; i < ERC_20_TOKEN_ADDRESS_INDEX.length; i++) {
    let token = Token.load(ERC_20_TOKEN_ADDRESS_INDEX[i]);
    if (token != null) {
      totalValue = totalValue.plus(token.liquidityInUsd);
    }
  }

  let timestamp = event.block.timestamp;
  let timeDay = timestamp.div(ONEDAY);

  let showTime = timeDay.times(ONEDAY);
  let periodOfDay = BigInt.fromI32(57600);
  let interval = timestamp.minus(showTime);
  if (interval.ge(periodOfDay)) {
    timeDay = timeDay.plus(ONE);
  }

  let DayId = timeDay.toString() + "-USD";
  let totalLiquidityInSymbolByDay = TotalLiquidityInSymbolByDay.load(DayId);
  if (totalLiquidityInSymbolByDay == null) {
    totalLiquidityInSymbolByDay = new TotalLiquidityInSymbolByDay(DayId);
    totalLiquidityInSymbolByDay.symbol = "USD";
    totalLiquidityInSymbolByDay.timestampDay = timeDay;
  }

  totalLiquidityInSymbolByDay.totalValue = totalValue;
  totalLiquidityInSymbolByDay.timestamp = event.block.timestamp;
  totalLiquidityInSymbolByDay.block = event.block.number;
  totalLiquidityInSymbolByDay.save();
}

function pairPricesUpdated(
  reserve0: BigDecimal,
  reserve1: BigDecimal,
  pair: Pair,
  event: ethereum.Event
): void {
  let timestamp = event.block.timestamp;
  let blockNumber = event.block.number;
  let timeDay = timestamp.div(ONEDAY);
  let timeHour = timestamp.div(ONEHOURS);
  let timeMinute = timestamp.div(ONEMINUTE);

  let token0Price = ZERO_BD;
  let token1Price = ZERO_BD;
  if (reserve1.notEqual(ZERO_BD)) token0Price = reserve0.div(reserve1);
  if (reserve0.notEqual(ZERO_BD)) token1Price = reserve1.div(reserve0);

  pair.reserve0 = reserve0;
  pair.reserve1 = reserve1;
  pair.token0Price = token0Price;
  pair.token1Price = token1Price;
  pair.save();

  let k = pair.reserve0.times(pair.reserve1);
  let swapPairFeeInfoByLast = SwapPairFeeInfoByLast.load(pair.id);
  if (swapPairFeeInfoByLast == null) {
    swapPairFeeInfoByLast = new SwapPairFeeInfoByLast(pair.id);
    swapPairFeeInfoByLast.pair = pair.id;
    swapPairFeeInfoByLast.totalFeeValue = ZERO_BD;
    swapPairFeeInfoByLast.totalFeeTokenValue = ZERO_BD;
    swapPairFeeInfoByLast.convPirce = ZERO_BD;
    swapPairFeeInfoByLast.nowk = k;
    swapPairFeeInfoByLast.lastK = k;

    swapPairFeeInfoByLast.nowToken0Price = token0Price;
    swapPairFeeInfoByLast.nowToken1Price = token1Price;
    swapPairFeeInfoByLast.lastToken0Price = token0Price;
    swapPairFeeInfoByLast.lastToken1Price = token1Price;
  } else {
    let lastK = swapPairFeeInfoByLast.nowk;
    swapPairFeeInfoByLast.lastK = lastK;
    swapPairFeeInfoByLast.nowk = k;

    let lastToken0Price = swapPairFeeInfoByLast.nowToken0Price;
    let lastToken1Price = swapPairFeeInfoByLast.nowToken1Price;
    swapPairFeeInfoByLast.lastToken0Price = lastToken0Price;
    swapPairFeeInfoByLast.lastToken1Price = lastToken1Price;
    swapPairFeeInfoByLast.nowToken0Price = token0Price;
    swapPairFeeInfoByLast.nowToken1Price = token1Price;
  }

  swapPairFeeInfoByLast.timestamp = timestamp;
  swapPairFeeInfoByLast.block = event.block.number;
  swapPairFeeInfoByLast.save();

  //pairPricesDay
  let showTime = timeDay.times(ONEDAY);
  let periodOfDay = BigInt.fromI32(57600);
  let interval = timestamp.minus(showTime);
  if (interval.ge(periodOfDay)) {
    timeDay = timeDay.plus(ONE);
  }

  let DayId = timeDay.toString() + "-" + pair.id;
  let pairPricesDay = PairPricesDay.load(DayId);
  if (pairPricesDay == null) {
    pairPricesDay = new PairPricesDay(DayId);
    pairPricesDay.pair = pair.id;
    pairPricesDay.token0high = token0Price;
    pairPricesDay.token1high = token1Price;
    pairPricesDay.token0low = token0Price;
    pairPricesDay.token1low = token1Price;
  } else {
    if (pairPricesDay.token0low.gt(token0Price)) {
      pairPricesDay.token0low = token0Price;
    } else if (pairPricesDay.token0high.lt(token0Price)) {
      pairPricesDay.token0high = token0Price;
    }

    if (pairPricesDay.token1low.gt(token1Price)) {
      pairPricesDay.token1low = token1Price;
    } else if (pairPricesDay.token1high.lt(token1Price)) {
      pairPricesDay.token1high = token1Price;
    }
  }

  pairPricesDay.timestampDay = timeDay;
  pairPricesDay.timestamp = timestamp;
  pairPricesDay.reserve0 = reserve0;
  pairPricesDay.reserve1 = reserve1;
  pairPricesDay.token0Price = token0Price;
  pairPricesDay.token1Price = token1Price;
  pairPricesDay.block = blockNumber;
  pairPricesDay.save();

  //PricesHour
  let HourId = timeHour.toString() + "-" + pair.id;
  let pairPricesHour = PairPricesHour.load(HourId);
  if (pairPricesHour == null) {
    pairPricesHour = new PairPricesHour(HourId);
    pairPricesHour.pair = pair.id;
    pairPricesHour.token0high = token0Price;
    pairPricesHour.token1high = token1Price;
    pairPricesHour.token0low = token0Price;
    pairPricesHour.token1low = token1Price;
  } else {
    if (pairPricesHour.token0low.gt(token0Price)) {
      pairPricesHour.token0low = token0Price;
    } else if (pairPricesHour.token0high.lt(token0Price)) {
      pairPricesHour.token0high = token0Price;
    }

    if (pairPricesHour.token1low.gt(token1Price)) {
      pairPricesHour.token1low = token1Price;
    } else if (pairPricesHour.token1high.lt(token1Price)) {
      pairPricesHour.token1high = token1Price;
    }
  }

  pairPricesHour.timestampHour = timeHour;
  pairPricesHour.timestamp = timestamp;
  pairPricesHour.reserve0 = reserve0;
  pairPricesHour.reserve1 = reserve1;
  pairPricesHour.token0Price = token0Price;
  pairPricesHour.token1Price = token1Price;
  pairPricesHour.block = blockNumber;
  pairPricesHour.save();

  //PricesMinuter
  let MinuterId = timeMinute.toString() + "-" + pair.id;
  let pairPricesMinuter = PairPricesMinuter.load(MinuterId);
  if (pairPricesMinuter == null) {
    pairPricesMinuter = new PairPricesMinuter(MinuterId);
    pairPricesMinuter.pair = pair.id;
    pairPricesMinuter.token0high = token0Price;
    pairPricesMinuter.token1high = token1Price;
    pairPricesMinuter.token0low = token0Price;
    pairPricesMinuter.token1low = token1Price;
  } else {
    if (pairPricesMinuter.token0low.gt(token0Price)) {
      pairPricesMinuter.token0low = token0Price;
    } else if (pairPricesMinuter.token0high.lt(token0Price)) {
      pairPricesMinuter.token0high = token0Price;
    }

    if (pairPricesMinuter.token1low.gt(token1Price)) {
      pairPricesMinuter.token1low = token1Price;
    } else if (pairPricesMinuter.token1high.lt(token1Price)) {
      pairPricesMinuter.token1high = token1Price;
    }
  }

  pairPricesMinuter.timestampMinuter = timeMinute;
  pairPricesMinuter.timestamp = timestamp;
  pairPricesMinuter.reserve0 = reserve0;
  pairPricesMinuter.reserve1 = reserve1;
  pairPricesMinuter.token0Price = token0Price;
  pairPricesMinuter.token1Price = token1Price;
  pairPricesMinuter.block = blockNumber;
  pairPricesMinuter.save();

  //PricesLast
  let pairPricesLast = PairPricesLast.load(pair.id);
  if (pairPricesLast == null) {
    pairPricesLast = new PairPricesLast(pair.id);
    pairPricesLast.pair = pair.id;
    pairPricesLast.token0Pricelow = token0Price;
    pairPricesLast.token1Pricelow = token1Price;
    pairPricesLast.token0Pricehigh = token0Price;
    pairPricesLast.token1Pricehigh = token1Price;

    pairPricesLast.token0PriceLowTimestamp = timestamp;
    pairPricesLast.token1PriceLowTimestamp = timestamp;
    pairPricesLast.token0PriceHighTimestamp = timestamp;
    pairPricesLast.token1PriceHighTimestamp = timestamp;
  } else {
    if (pairPricesLast.token0Pricelow.gt(token0Price)) {
      pairPricesLast.token0Pricelow = token0Price;
      pairPricesLast.token0PriceLowTimestamp = timestamp;
    } else if (pairPricesLast.token0Pricehigh.lt(token0Price)) {
      pairPricesLast.token0Pricehigh = token0Price;
      pairPricesLast.token0PriceHighTimestamp = timestamp;
    }

    if (pairPricesLast.token1Pricelow.gt(token1Price)) {
      pairPricesLast.token1Pricelow = token1Price;
      pairPricesLast.token1PriceLowTimestamp = timestamp;
    } else if (pairPricesLast.token1Pricehigh.lt(token1Price)) {
      pairPricesLast.token1Pricehigh = token1Price;
      pairPricesLast.token1PriceHighTimestamp = timestamp;
    }
  }

  pairPricesLast.timestamp = timestamp;
  pairPricesLast.reserve0 = reserve0;
  pairPricesLast.reserve1 = reserve1;
  pairPricesLast.token0Price = token0Price;
  pairPricesLast.token1Price = token1Price;
  pairPricesLast.block = blockNumber;
  pairPricesLast.save();

  //pairPricesEvery
  let timestampId = timestamp.toString() + "-" + pair.id;
  let pairPricesEvery = new PairPricesEvery(timestampId);
  pairPricesEvery.pair = pair.id;
  pairPricesEvery.timestamp = timestamp;
  pairPricesEvery.reserve0 = reserve0;
  pairPricesEvery.reserve1 = reserve1;
  pairPricesEvery.token0Price = token0Price;
  pairPricesEvery.token1Price = token1Price;
  pairPricesEvery.block = blockNumber;
  pairPricesEvery.save();
}

function pairVolumeUpdated(
  token0Volume: BigDecimal,
  token1Volume: BigDecimal,
  volumeUSD: BigDecimal,
  pair: Pair,
  event: ethereum.Event
): void {
  let timestamp = event.block.timestamp;
  let blockNumber = event.block.number;
  let timeDay = timestamp.div(ONEDAY);
  let timeHour = timestamp.div(ONEHOURS);
  let timeMinute = timestamp.div(ONEMINUTE);

  pair.totalToken0Volume = pair.totalToken0Volume.plus(token0Volume);
  pair.totalToken1Volume = pair.totalToken1Volume.plus(token1Volume);
  pair.totalVolumeUSD = pair.totalVolumeUSD.plus(volumeUSD);
  pair.save();

  //pairVolumesDay
  let showTime = timeDay.times(ONEDAY);
  let periodOfDay = BigInt.fromI32(57600);
  let interval = timestamp.minus(showTime);
  if (interval.ge(periodOfDay)) {
    timeDay = timeDay.plus(ONE);
  }

  let DayId = timeDay.toString() + "-" + pair.id;
  let pairVolumeDay = PairVolumeDay.load(DayId);
  if (pairVolumeDay == null) {
    pairVolumeDay = new PairVolumeDay(DayId);
    pairVolumeDay.pair = pair.id;
    pairVolumeDay.token0Volume = ZERO_BD;
    pairVolumeDay.token1Volume = ZERO_BD;
    pairVolumeDay.volumeUSD = ZERO_BD;
  }
  pairVolumeDay.timestampDay = timeDay;
  pairVolumeDay.timestamp = timestamp;
  pairVolumeDay.token0Volume = pairVolumeDay.token0Volume.plus(token0Volume);
  pairVolumeDay.token1Volume = pairVolumeDay.token1Volume.plus(token1Volume);
  pairVolumeDay.volumeUSD = pairVolumeDay.volumeUSD.plus(volumeUSD);
  pairVolumeDay.block = blockNumber;
  pairVolumeDay.save();

  //VolumeHour
  let HourId = timeHour.toString() + "-" + pair.id;
  let pairVolumeHour = PairVolumeHour.load(HourId);
  if (pairVolumeHour == null) {
    pairVolumeHour = new PairVolumeHour(HourId);
    pairVolumeHour.pair = pair.id;
    pairVolumeHour.token0Volume = ZERO_BD;
    pairVolumeHour.token1Volume = ZERO_BD;
    pairVolumeHour.volumeUSD = ZERO_BD;
  }
  pairVolumeHour.timestampHour = timeHour;
  pairVolumeHour.timestamp = timestamp;
  pairVolumeHour.token0Volume = pairVolumeHour.token0Volume.plus(token0Volume);
  pairVolumeHour.token1Volume = pairVolumeHour.token1Volume.plus(token1Volume);
  pairVolumeHour.volumeUSD = pairVolumeHour.volumeUSD.plus(volumeUSD);
  pairVolumeHour.block = blockNumber;
  pairVolumeHour.save();

  //VolumeMinute
  let MinuteId = timeMinute.toString() + "-" + pair.id;
  let pairVolumeMinute = PairVolumeMinuter.load(MinuteId);
  if (pairVolumeMinute == null) {
    pairVolumeMinute = new PairVolumeMinuter(MinuteId);
    pairVolumeMinute.pair = pair.id;
    pairVolumeMinute.token0Volume = ZERO_BD;
    pairVolumeMinute.token1Volume = ZERO_BD;
    pairVolumeMinute.volumeUSD = ZERO_BD;
  }
  pairVolumeMinute.timestampMinuter = timeMinute;
  pairVolumeMinute.timestamp = timestamp;
  pairVolumeMinute.token0Volume = pairVolumeMinute.token0Volume.plus(
    token0Volume
  );
  pairVolumeMinute.token1Volume = pairVolumeMinute.token1Volume.plus(
    token1Volume
  );
  pairVolumeMinute.volumeUSD = pairVolumeMinute.volumeUSD.plus(volumeUSD);
  pairVolumeMinute.block = blockNumber;
  pairVolumeMinute.save();
}

function TokenVolumeUpdated(
  token0Volume: BigDecimal,
  token1Volume: BigDecimal,
  token0VolumeUSD: BigDecimal,
  token1VolumeUSD: BigDecimal,
  pair: Pair,
  event: ethereum.Event
): void {
  let timestamp = event.block.timestamp;
  let blockNumber = event.block.number;
  let timeHour = timestamp.div(ONEHOURS);
  let timeDay = timestamp.div(ONEDAY);

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);

  //token0 VolumeHour
  let token0HourId = timeHour.toString() + "-" + token0.id;
  let token0VolumeHour = TokenVolumeHour.load(token0HourId);
  if (token0VolumeHour == null) {
    token0VolumeHour = new TokenVolumeHour(token0HourId);
    token0VolumeHour.token = pair.token0;
    token0VolumeHour.volume = ZERO_BD;
    token0VolumeHour.volumeUSD = ZERO_BD;
  }
  token0VolumeHour.timestampHour = timeHour;
  token0VolumeHour.timestamp = timestamp;
  token0VolumeHour.volume = token0Volume;
  token0VolumeHour.volumeUSD = token0VolumeUSD;
  token0VolumeHour.block = blockNumber;
  token0VolumeHour.save();

  //token0 VolumeHour
  let token1HourId = timeHour.toString() + "-" + token1.id;
  let token1VolumeHour = TokenVolumeHour.load(token1HourId);
  if (token1VolumeHour == null) {
    token1VolumeHour = new TokenVolumeHour(token1HourId);
    token1VolumeHour.token = pair.token1;
    token1VolumeHour.volume = ZERO_BD;
    token1VolumeHour.volumeUSD = ZERO_BD;
  }
  token1VolumeHour.timestampHour = timeHour;
  token1VolumeHour.timestamp = timestamp;
  token1VolumeHour.volume = token1Volume;
  token1VolumeHour.volumeUSD = token1VolumeUSD;
  token1VolumeHour.block = blockNumber;
  token1VolumeHour.save();

  //TotalVolumesHour
  let HourId = timeHour.toString() + "-USD";
  let totalVolumeInSymbolByHour = TotalVolumeInSymbolByHour.load(HourId);
  if (totalVolumeInSymbolByHour == null) {
    totalVolumeInSymbolByHour = new TotalVolumeInSymbolByHour(HourId);
    totalVolumeInSymbolByHour.symbol = "USD";
    totalVolumeInSymbolByHour.totalValue = ZERO_BD;
  }
  totalVolumeInSymbolByHour.timestampHour = timeHour;
  totalVolumeInSymbolByHour.timestamp = timestamp;
  totalVolumeInSymbolByHour.totalValue = totalVolumeInSymbolByHour.totalValue
    .plus(token0VolumeUSD)
    .plus(token1VolumeUSD);
  totalVolumeInSymbolByHour.block = blockNumber;
  totalVolumeInSymbolByHour.save();

  //TotalVolumesDay
  let showTime = timeDay.times(ONEDAY);
  let periodOfDay = BigInt.fromI32(57600);
  let interval = timestamp.minus(showTime);
  if (interval.ge(periodOfDay)) {
    timeDay = timeDay.plus(ONE);
  }

  let DayId = timeDay.toString() + "-USD";
  let totalVolumeInSymbolByDay = TotalVolumeInSymbolByDay.load(DayId);
  if (totalVolumeInSymbolByDay == null) {
    totalVolumeInSymbolByDay = new TotalVolumeInSymbolByDay(DayId);
    totalVolumeInSymbolByDay.symbol = "USD";
    totalVolumeInSymbolByDay.totalValue = ZERO_BD;
  }
  totalVolumeInSymbolByDay.timestampDay = timeDay;
  totalVolumeInSymbolByDay.timestamp = timestamp;
  totalVolumeInSymbolByDay.totalValue = totalVolumeInSymbolByDay.totalValue
    .plus(token0VolumeUSD)
    .plus(token1VolumeUSD);
  totalVolumeInSymbolByDay.block = blockNumber;
  totalVolumeInSymbolByDay.save();
}

function isCompleteMint(mintId: string): boolean {
  return Mint.load(mintId).sender !== null;
}

export function handleTransfer(event: TransferEvent): void {
  if (
    event.params.to == ADDRESS_ZERO &&
    event.params.value.equals(BigInt.fromI32(1000))
  ) {
    return;
  }

  let transactionHash = event.transaction.hash.toHexString();
  let from = event.params.from;
  let to = event.params.to;

  // get pair
  let pair = Pair.load(event.address.toHexString());
  let value = convertTokenToDecimal(event.params.value, BI_18);

  // get or create transaction
  let transaction = Transaction.load(transactionHash);
  if (transaction === null) {
    transaction = new Transaction(transactionHash);
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.mints = [];
    transaction.burns = [];
    transaction.swaps = [];
  }

  // mints
  let mints = transaction.mints;
  if (from == ADDRESS_ZERO && event.params.to != receive_fee_address) {
    if (mints.length === 0 || isCompleteMint(mints[mints.length - 1])) {
      let mint = new Mint(
        event.transaction.hash
          .toHexString()
          .concat("-")
          .concat(BigInt.fromI32(mints.length).toString())
      );
      mint.transaction = transaction.id;
      mint.pair = pair.id;
      mint.to = to;
      mint.liquidity = value;
      mint.timestamp = transaction.timestamp;
      mint.transaction = transaction.id;
      mint.save();

      // update mints in transaction
      transaction.mints = mints.concat([mint.id]);
      transaction.save();
    }

    // update the pair supply
    pair.supply = pair.supply.plus(value);
    pair.save();
  }

  if (from == ADDRESS_ZERO && to == receive_fee_address) {
    let burns = transaction.burns;
    let burn = new Burn(
      event.transaction.hash
        .toHexString()
        .concat("-")
        .concat(BigInt.fromI32(burns.length).toString())
    );
    burn.transaction = transaction.id;
    burn.pair = pair.id;
    burn.liquidity = value;
    burn.timestamp = transaction.timestamp;
    burn.to = event.params.to;
    burn.sender = event.params.from;
    burn.beComplete = true;
    burn.transaction = transaction.id;
    burn.feeTo = to;
    burn.feeLiquidity = value;
    burn.save();

    burns.push(burn.id);
    transaction.burns = burns;
    transaction.save();

    // update the pair supply
    pair.supply = pair.supply.plus(value);
    pair.save();
  }

  // burn
  if (
    event.params.to == ADDRESS_ZERO &&
    event.params.from.toHexString() == pair.id
  ) {
    // this is a new instance of a logical burn
    let burns = transaction.burns;
    let burn = new Burn(
      event.transaction.hash
        .toHexString()
        .concat("-")
        .concat(BigInt.fromI32(burns.length).toString())
    );
    burn.transaction = transaction.id;
    burn.beComplete = false;
    burn.pair = pair.id;
    burn.to = to;
    burn.liquidity = value;
    burn.sender = event.transaction.from;
    burn.transaction = transaction.id;
    burn.timestamp = transaction.timestamp;
    burn.save();

    burns.push(burn.id);
    transaction.burns = burns;
    transaction.save();

    // update the pair supply
    pair.supply = pair.supply.minus(value);
    pair.save();
  }
  transaction.save();
}

export function handleMint(event: MintEvent): void {
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    return;
  }

  let mints = transaction.mints;
  let mint = Mint.load(mints[mints.length - 1]);

  let pair = Pair.load(event.address.toHex());
  let swapPairFeeInfoByLast = SwapPairFeeInfoByLast.load(event.address.toHex());

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);

  let token0Amount = convertTokenToDecimal(
    event.params.amount0,
    token0.decimals
  );
  let token1Amount = convertTokenToDecimal(
    event.params.amount1,
    token1.decimals
  );

  mint.sender = event.params.sender;
  mint.amount0 = token0Amount as BigDecimal;
  mint.amount1 = token1Amount as BigDecimal;
  mint.token0Price = swapPairFeeInfoByLast.lastToken0Price;
  mint.token1Price = swapPairFeeInfoByLast.lastToken1Price;
  mint.save();
}

export function handleBurn(event: BurnEvent): void {
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    return;
  }

  let burns = transaction.burns;
  let burn = Burn.load(burns[burns.length - 1]);

  let pair = Pair.load(event.address.toHex());
  let swapPairFeeInfoByLast = SwapPairFeeInfoByLast.load(event.address.toHex());

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  let token0Amount = convertTokenToDecimal(
    event.params.amount0,
    token0.decimals
  );
  let token1Amount = convertTokenToDecimal(
    event.params.amount1,
    token1.decimals
  );

  burn.amount0 = token0Amount as BigDecimal;
  burn.amount1 = token1Amount as BigDecimal;
  burn.token0Price = swapPairFeeInfoByLast.lastToken0Price;
  burn.token1Price = swapPairFeeInfoByLast.lastToken1Price;
  burn.save();
}

export function handleFreeze(event: FreezeEvent): void {
  let pair = Pair.load(event.address.toHex());
  if (pair === null) {
    return;
  }

  let freezePair = FreezePair.load(event.address.toHex());
  if (freezePair === null) {
    freezePair = new FreezePair(event.address.toHex());
    freezePair.pairAddress = event.address;
    freezePair.token0 = pair.token0;
    freezePair.token1 = pair.token1;
  }

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  let token0UsdPrice = getTokenUSDPrice(token0 as Token);
  let token1UsdPrice = getTokenUSDPrice(token1 as Token);
  freezePair.token0UsdPrice = token0UsdPrice;
  freezePair.token1UsdPrice = token1UsdPrice;
  freezePair.freezer = event.params.freezer;
  freezePair.timestamp = event.block.timestamp;
  freezePair.block = event.block.number;
  freezePair.save();
}
