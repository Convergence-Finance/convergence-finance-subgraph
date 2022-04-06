import { Address } from "@graphprotocol/graph-ts";

let ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export enum SUBGRAPH_MODE {
  GET_TOKEN_DETAIL_FROM_CONTRACT = 0,
  GET_TOKEN_DETAIL_FROM_LOCAL = 1,
}

let var_subgraph_mode: string = "${VARS_SUBGRAPH_MODE}";
export let subgraphMode: SUBGRAPH_MODE =
  var_subgraph_mode == "0"
    ? SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_CONTRACT
    : SUBGRAPH_MODE.GET_TOKEN_DETAIL_FROM_LOCAL;

//staking
export const usdt_conv_lp_address_str: string = "${VARS_USDT_CONV_LP_ADDRESS}";
export const eth_conv_lp_address_str: string = "${VARS_ETH_CONV_LP_ADDRESS}";

export let usdt_conv_lp_address =
  usdt_conv_lp_address_str != ""
    ? Address.fromString(usdt_conv_lp_address_str)
    : ADDRESS_ZERO;
export let eth_conv_lp_address =
  eth_conv_lp_address_str != ""
    ? Address.fromString(eth_conv_lp_address_str)
    : ADDRESS_ZERO;

//conv-x 部分
export const erc20_usdt_address_str: string = "${VARS_ERC20_USDT_ADDRESS}";
export const swapfactory_address_str: string = "${VARS_SWAPFACTORY_ADDRESS}";
export const swaprouter_address_str: string = "${VARS_SWAPROUTER_ADDRESS}";
export const stakingpools_address_str: string = "${VARS_STAKINGPOOLS_ADDRESS}";
export const conv_usdt_pair_address_str: string =
  "${VARS_USDT_CONV_LP_ADDRESS}";
export const conv_address_str: string = "${VARS_CONV_ADDRESS}";
export const usdt_conv_uni_v2_address_str: string =
  "${VARS_USDT_CONV_UNI_V2_ADDRESS}";
export const eth_conv_uni_v2_address_str: string =
  "${VARS_ETH_CONV_UNI_V2_ADDRESS}";
export const receive_fee_address_str: string = "${VARS_RECEIVE_FEE_ADDRESS}";
export const weth_address_str: string = "${VARS_WETH_ADDRESS}";
export const usdt_eth_lp_address_str: string = "${VARS_USDT_ETH_LP_ADDRESS}";
export const flith_conv_lp_address_str: string =
  "${VARS_FLITH_CONV_LP_ADDRESS}";
export const conv_flike_lp_address_str: string =
  "${VARS_CONV_FLIKE_LP_ADDRESS}";
export const conv_fmatic_lp_address_str: string =
  "${VARS_CONV_FMATIC_LP_ADDRESS}";

export let erc20_usdt_address =
  erc20_usdt_address_str != ""
    ? Address.fromString(erc20_usdt_address_str)
    : ADDRESS_ZERO;
export let swapfactory_address =
  swapfactory_address_str != ""
    ? Address.fromString(swapfactory_address_str)
    : ADDRESS_ZERO;
export let swaprouter_address =
  swaprouter_address_str != ""
    ? Address.fromString(swaprouter_address_str)
    : ADDRESS_ZERO;
export let stakingpools_address =
  stakingpools_address_str != ""
    ? Address.fromString(stakingpools_address_str)
    : ADDRESS_ZERO;
export let conv_usdt_pair_address =
  conv_usdt_pair_address_str != ""
    ? Address.fromString(conv_usdt_pair_address_str)
    : ADDRESS_ZERO;
export let conv_address =
  conv_address_str != "" ? Address.fromString(conv_address_str) : ADDRESS_ZERO;
export let usdt_conv_uni_v2_address =
  usdt_conv_uni_v2_address_str != ""
    ? Address.fromString(usdt_conv_uni_v2_address_str)
    : ADDRESS_ZERO;
export let eth_conv_uni_v2_address =
  eth_conv_uni_v2_address_str != ""
    ? Address.fromString(eth_conv_uni_v2_address_str)
    : ADDRESS_ZERO;
export let receive_fee_address =
  receive_fee_address_str != ""
    ? Address.fromString(receive_fee_address_str)
    : ADDRESS_ZERO;
export let weth_address =
  weth_address_str != "" ? Address.fromString(weth_address_str) : ADDRESS_ZERO;
export let usdt_eth_lp_address =
  usdt_eth_lp_address_str != ""
    ? Address.fromString(usdt_eth_lp_address_str)
    : ADDRESS_ZERO;
export let flith_conv_lp_address =
  flith_conv_lp_address_str != ""
    ? Address.fromString(flith_conv_lp_address_str)
    : ADDRESS_ZERO;
export let conv_flike_lp_address =
  conv_flike_lp_address_str != ""
    ? Address.fromString(conv_flike_lp_address_str)
    : ADDRESS_ZERO;
export let conv_fmatic_lp_address =
  conv_fmatic_lp_address_str != ""
    ? Address.fromString(conv_fmatic_lp_address_str)
    : ADDRESS_ZERO;

//conv-o 部分
export const flith_token_address_str: string = "${VARS_FLITH_TOKEN_ADDRESS}";
export const flith_prenium_address_str: string =
  "${VARS_FLITH_PRENIUM_ADDRESS}";
export const flith_normal_address_str: string = "${VARS_FLITH_NORMAL_ADDRESS}";
export const flike_token_address_str: string = "${VARS_FLIKE_TOKEN_ADDRESS}";
export const flike_prenium_address_str: string =
  "${VARS_FLIKE_PRENIUM_ADDRESS}";
export const flike_normal_address_str: string = "${VARS_FLIKE_NORMAL_ADDRESS}";
export const fmatic_token_address_str: string = "${VARS_FMATIC_TOKEN_ADDRESS}";
export const fmatic_prenium_address_str: string =
  "${VARS_FMATIC_PRENIUM_ADDRESS}";
export const fmatic_normal_address_str: string =
  "${VARS_FMATIC_NORMAL_ADDRESS}";

export let flith_token_address =
  flith_token_address_str != ""
    ? Address.fromString(flith_token_address_str)
    : ADDRESS_ZERO;
export let flith_prenium_address =
  flith_prenium_address_str != ""
    ? Address.fromString(flith_prenium_address_str)
    : ADDRESS_ZERO;
export let flith_normal_address =
  flith_normal_address_str != ""
    ? Address.fromString(flith_normal_address_str)
    : ADDRESS_ZERO;
export let flike_token_address =
  flike_token_address_str != ""
    ? Address.fromString(flike_token_address_str)
    : ADDRESS_ZERO;
export let flike_prenium_address =
  flike_prenium_address_str != ""
    ? Address.fromString(flike_prenium_address_str)
    : ADDRESS_ZERO;
export let flike_normal_address =
  flike_normal_address_str != ""
    ? Address.fromString(flike_normal_address_str)
    : ADDRESS_ZERO;
export let fmatic_token_address =
  fmatic_token_address_str != ""
    ? Address.fromString(fmatic_token_address_str)
    : ADDRESS_ZERO;
export let fmatic_prenium_address =
  fmatic_prenium_address_str != ""
    ? Address.fromString(fmatic_prenium_address_str)
    : ADDRESS_ZERO;
export let fmatic_normal_address =
  fmatic_normal_address_str != ""
    ? Address.fromString(fmatic_normal_address_str)
    : ADDRESS_ZERO;
