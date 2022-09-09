// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

library CallDataVerifyErrors {
    string internal constant INVALID_TARGET = "INVALID_TARGET";
    string internal constant INVALID_TO_CHAIN_ID = "INVALID_TO_CHAIN_ID";
    string internal constant INVALID_RECEIVER_ADDRESS = "INVALID_RECEIVER_ADDRESS";
    string internal constant INVALID_AMOUNT = "INVALID_AMOUNT";

    string internal constant INVALID_BRIDGE_ID = "INVALID_BRIDGE_ID";
    string internal constant INVALID_BRIDGE_AMOUNT = "INVALID_BRIDGE_AMOUNT";
    string internal constant INVALID_BRIDGE_TOKEN = "INVALID_BRIDGE_TOKEN";

    string internal constant INVALID_MIDDLEWARE_ID = "INVALID_MIDDLEWARE_ID";
    string internal constant INVALID_MIDDLEWARE_AMOUNT = "INVALID_MIDDLEWARE_AMOUNT";
    string internal constant INVALID_MIDDLEWARE_TOKEN = "INVALID_MIDDLEWARE_TOKEN";
}

library ApprovalVerifyErrors {
    string internal constant INVALID_TARGET = "INVALID_TARGET";
    string internal constant INVALID_ROUTE = "INVALID_ROUTE";
    string internal constant INVALID_SPENDER = "INVALID_SPENDER";
    string internal constant INVALID_AMOUNT = "INVALID_AMOUNT";
}
