import {
  conv_address,
  erc20_usdt_address,
  weth_address,
  eth_conv_lp_address,
  usdt_conv_lp_address,
  usdt_eth_lp_address,
  usdt_conv_uni_v2_address,
  eth_conv_uni_v2_address,
  flith_token_address,
  flith_conv_lp_address,
  flike_token_address,
  conv_flike_lp_address,
  flith_token_address_str,
  flike_token_address_str,
  conv_address_str,
  erc20_usdt_address_str,
  weth_address_str,
  eth_conv_lp_address_str,
  usdt_conv_lp_address_str,
  flith_conv_lp_address_str,
  conv_flike_lp_address_str,
  usdt_eth_lp_address_str,
  usdt_conv_uni_v2_address_str,
  eth_conv_uni_v2_address_str,
  fmatic_token_address_str,
  fmatic_token_address,
  conv_fmatic_lp_address,
  conv_fmatic_lp_address_str,
} from "./envVars";
import { BigInt, Address, log } from "@graphprotocol/graph-ts";

class erc20TokenProperty {
  Symbol: string;
  Name: string;
  Address: Address;
  Decimals: BigInt;
}

class pairTokenProperty {
  Symbol: string;
  Name: string;
  Address: Address;
  Decimals: BigInt;
  Token0: Address;
  Token1: Address;
}

// Ordering of ERC_20_TOKEN_ADDRESS_INDEX and ERC_20_TOKEN_SYMBOL_INDEX must align with ERC_20_TOKEN_PROPERTY
export let ERC_20_TOKEN_ADDRESS_INDEX: string[] = [
  conv_address_str,
  erc20_usdt_address_str,
  weth_address_str,
  flith_token_address_str,
  flike_token_address_str,
  fmatic_token_address_str,
];

let ERC_20_TOKEN_PROPERTY: erc20TokenProperty[] = [
  {
    Symbol: "CONV",
    Name: "Convergence",
    Address: conv_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
  },
  {
    Symbol: "USDT",
    Name: "Tether USD",
    Address: erc20_usdt_address, // Address
    Decimals: BigInt.fromI32(6), // BigInt
  },
  {
    Symbol: "WETH",
    Name: "Wrapped Ether",
    Address: weth_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
  },
  {
    Symbol: "fLITH",
    Name: "Future Lithium",
    Address: flith_token_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
  },
  {
    Symbol: "fLIKE",
    Name: "Future Like",
    Address: flike_token_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
  },
  {
    Symbol: "fMATIC",
    Name: "Future Matic",
    Address: fmatic_token_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
  },
];

let PAIR_TOKEN_ADDRESS_INDEX: string[] = [
  eth_conv_lp_address_str,
  usdt_conv_lp_address_str,
  flith_conv_lp_address_str,
  conv_flike_lp_address_str,
  conv_fmatic_lp_address_str,
  usdt_eth_lp_address_str,
  usdt_conv_uni_v2_address_str,
  eth_conv_uni_v2_address_str,
];

let PAIR_TOKEN_CONV_PAIR_INDEX: string[] = [
  weth_address_str,
  erc20_usdt_address_str,
  flith_token_address_str,
  flike_token_address_str,
  fmatic_token_address_str,
];

let PAIR_TOKEN_PROPERTY: pairTokenProperty[] = [
  {
    Symbol: "CLP",
    Name: "CONV-ETH LP",
    Address: eth_conv_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: weth_address,
    Token1: conv_address,
  },
  {
    Symbol: "CLP",
    Name: "CONV-USDT LP",
    Address: usdt_conv_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: conv_address,
    Token1: erc20_usdt_address,
  },
  {
    Symbol: "CLP",
    Name: "CONV-FLITH LP",
    Address: flith_conv_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: flith_token_address,
    Token1: conv_address,
  },
  {
    Symbol: "CLP",
    Name: "CONV-FLIKE LP",
    Address: conv_flike_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: flike_token_address,
    Token1: conv_address,
  },
  {
    Symbol: "CLP",
    Name: "CONV-FMATIC LP",
    Address: conv_fmatic_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: fmatic_token_address,
    Token1: conv_address,
  },
  {
    Symbol: "CLP",
    Name: "ETH-USDT LP",
    Address: usdt_eth_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: weth_address,
    Token1: erc20_usdt_address,
  },
  {
    Symbol: "UNI-V2",
    Name: "CONV-USDT UNI LP",
    Address: usdt_conv_uni_v2_address,
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: erc20_usdt_address,
    Token1: conv_address,
  },
  {
    Symbol: "UNI-V2",
    Name: "CONV-ETH UNI LP",
    Address: eth_conv_uni_v2_address,
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: conv_address,
    Token1: weth_address,
  },
];

let PAIR_TOKEN_USDT_PAIR_INDEX: string[] = [weth_address_str];

let USDT_PAIR_TOKEN_PROPERTY: pairTokenProperty[] = [
  {
    Symbol: "CLP",
    Name: "ETH-USDT LP",
    Address: usdt_eth_lp_address, // Address
    Decimals: BigInt.fromI32(18), // BigInt
    Token0: weth_address,
    Token1: erc20_usdt_address,
  },
];

export function getTokenSymbol(address: Address): string {
  let ercTokenIdx = ERC_20_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  if (ercTokenIdx >= 0) return ERC_20_TOKEN_PROPERTY[ercTokenIdx].Symbol;
  let pairTokenIdx = PAIR_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  return pairTokenIdx >= 0 ? PAIR_TOKEN_PROPERTY[pairTokenIdx].Symbol : "";
}

export function getTokenName(address: Address): string {
  let tokenIdx = ERC_20_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  return tokenIdx >= 0 ? ERC_20_TOKEN_PROPERTY[tokenIdx].Name : "";
}

export function getTokenDecimals(address: Address): BigInt {
  let ercTokenIdx = ERC_20_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  if (ercTokenIdx >= 0) return ERC_20_TOKEN_PROPERTY[ercTokenIdx].Decimals;
  let pairTokenIdx = PAIR_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  return pairTokenIdx >= 0
    ? PAIR_TOKEN_PROPERTY[pairTokenIdx].Decimals
    : BigInt.fromI32(0);
}

export function getConvPairTokenAddress(address: Address): Address {
  let pairTokenIdx = PAIR_TOKEN_CONV_PAIR_INDEX.indexOf(address.toHexString());
  return pairTokenIdx >= 0
    ? PAIR_TOKEN_PROPERTY[pairTokenIdx].Address
    : Address.fromString("0x0000000000000000000000000000000000000000");
}

export function getUSDTPairTokenAddress(address: Address): Address {
  let pairTokenIdx = PAIR_TOKEN_USDT_PAIR_INDEX.indexOf(address.toHexString());
  return pairTokenIdx >= 0
    ? USDT_PAIR_TOKEN_PROPERTY[pairTokenIdx].Address
    : Address.fromString("0x0000000000000000000000000000000000000000");
}

export function getTokenAddressesFromPair(address: Address): Address[] {
  let pairTokenIdx = PAIR_TOKEN_ADDRESS_INDEX.indexOf(address.toHexString());
  return pairTokenIdx >= 0
    ? [
        PAIR_TOKEN_PROPERTY[pairTokenIdx].Token0,
        PAIR_TOKEN_PROPERTY[pairTokenIdx].Token1,
      ]
    : [
        Address.fromString("0x0000000000000000000000000000000000000000"),
        Address.fromString("0x0000000000000000000000000000000000000000"),
      ];
}
