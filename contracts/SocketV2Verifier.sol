// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";

contract SocketV2Verifier {
    /// @param id route id of middleware to be used
    /// @param optionalNativeAmount is the amount of native asset that the route requires
    /// @param inputToken token address which will be swapped to BridgeRequest inputToken
    /// @param data to be used by middleware
    struct MiddlewareRequest {
        uint256 id;
        uint256 optionalNativeAmount;
        address inputToken;
        bytes data;
    }

    /// @param id route id of bridge to be used
    /// @param optionalNativeAmount optinal native amount, to be used when bridge needs native token along with ERC20
    /// @param inputToken token addresss which will be bridged
    /// @param data bridgeData to be used by bridge
    struct BridgeRequest {
        uint256 id;
        uint256 optionalNativeAmount;
        address inputToken;
        bytes data;
    }

    /// @param receiverAddress Recipient address to recieve funds on destination chain
    /// @param toChainId Destination ChainId
    /// @param amount amount to be swapped if middlewareId is 0  it will be
    /// the amount to be bridged
    /// @param middlewareRequest middleware Requestdata
    /// @param bridgeRequest bridge request data
    struct UserRequest {
        address receiverAddress;
        uint256 toChainId;
        uint256 amount;
        MiddlewareRequest middlewareRequest;
        BridgeRequest bridgeRequest;
    }

    /// @notice Decode the socket v2 calldata
    /// @param data Socket V2 outboundTransferTo call data
    /// @return userRequest socket UserRequest
    function decodeCallData(bytes calldata data) internal pure returns (UserRequest memory userRequest) {
        (userRequest) = abi.decode(data[4:], (UserRequest));
    }

    /// @notice Verify the bridge request
    /// @param request Bridge request
    /// @param expectedRequest Bridge request that is expected
    function verifyBridgeRequest(BridgeRequest calldata request, BridgeRequest calldata expectedRequest) public pure {
        require(request.id == expectedRequest.id, "bridge id invalid");
        require(
            request.optionalNativeAmount == expectedRequest.optionalNativeAmount,
            "bridge optionalNativeAmount invalid"
        );
        require(request.inputToken == expectedRequest.inputToken, "bridge inputToken invalid");
        if (expectedRequest.data.length > 0) {
            require(keccak256(request.data) == keccak256(expectedRequest.data), "bridge data invalid");
        }
    }

    /// @notice Verify the middleware request if it is specified
    /// @param request Middleware request
    /// @param expectedRequest Middleware request that is expected
    function verifyMiddlewareRequest(MiddlewareRequest calldata request, MiddlewareRequest calldata expectedRequest)
        public
        pure
    {
        if (request.id == 0) {
            // If middleware request ID is 0, middleware verification is not required
            return;
        }
        require(request.id == expectedRequest.id, "middleware id invalid");
        require(
            request.optionalNativeAmount == expectedRequest.optionalNativeAmount,
            "middleware optionalNativeAmount invalid"
        );
        require(request.inputToken == expectedRequest.inputToken, "middleware inputToken invalid");
        if (expectedRequest.data.length > 0) {
            require(keccak256(request.data) == keccak256(expectedRequest.data), "middleware data invalid");
        }
    }

    /// @notice Verify the calldata to V2 with a given expected UserRequest
    /// @param data Socket V2 call data
    /// @param expected Middleware request that is expected
    function verifyCallData(bytes calldata data, UserRequest calldata expected) public view {
        UserRequest memory userRequest = decodeCallData(data);
        require(userRequest.toChainId == expected.toChainId, "invalid toChainId");
        require(userRequest.receiverAddress == expected.receiverAddress, "invalid receiverAddress");
        require(userRequest.amount == expected.amount, "invalid amount");
        this.verifyBridgeRequest(userRequest.bridgeRequest, expected.bridgeRequest);
        this.verifyMiddlewareRequest(userRequest.middlewareRequest, expected.middlewareRequest);
    }
}
