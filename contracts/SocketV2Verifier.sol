// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";
import "./interfaces/ISocketRegistry.sol";
import "./helpers/errors.sol";

contract SocketV2Verifier {
    /// @notice Decode the socket v2 calldata
    /// @param data Socket V2 outboundTransferTo call data
    /// @return userRequest socket UserRequest
    function decodeCallData(bytes calldata data)
        internal
        pure
        returns (ISocketRegistry.UserRequest memory userRequest)
    {
        (userRequest) = abi.decode(data[4:], (ISocketRegistry.UserRequest));
    }

    /// @notice Decode erc20 approval call
    /// @param data ERC20 apporval calldata
    /// @return spender erc20 spender
    /// @return amount erc20 amount
    function decodeApprovalData(bytes calldata data) internal pure returns (address spender, uint256 amount) {
        (spender, amount) = abi.decode(data[4:], (address, uint256));
    }

    /// @notice Verify the bridge request
    /// @param request Bridge request
    /// @param expectedRequest Bridge request that is expected
    function verifyBridgeRequest(
        ISocketRegistry.BridgeRequest calldata request,
        ISocketRegistry.BridgeRequest calldata expectedRequest
    ) public pure {
        require(request.id == expectedRequest.id, CallDataVerifyErrors.INVALID_BRIDGE_ID);
        require(
            request.optionalNativeAmount == expectedRequest.optionalNativeAmount,
            CallDataVerifyErrors.INVALID_BRIDGE_AMOUNT
        );
        require(request.inputToken == expectedRequest.inputToken, CallDataVerifyErrors.INVALID_BRIDGE_TOKEN);
    }

    /// @notice Verify the middleware request if it is specified
    /// @param request Middleware request
    /// @param expectedRequest Middleware request that is expected
    function verifyMiddlewareRequest(
        ISocketRegistry.MiddlewareRequest calldata request,
        ISocketRegistry.MiddlewareRequest calldata expectedRequest
    ) public pure {
        if (request.id == 0) {
            // If middleware request ID is 0, middleware verification is not required
            return;
        }
        require(request.id == expectedRequest.id, CallDataVerifyErrors.INVALID_MIDDLEWARE_ID);
        require(
            request.optionalNativeAmount == expectedRequest.optionalNativeAmount,
            CallDataVerifyErrors.INVALID_MIDDLEWARE_AMOUNT
        );
        require(request.inputToken == expectedRequest.inputToken, CallDataVerifyErrors.INVALID_MIDDLEWARE_TOKEN);
    }

    /// @notice Verify the calldata to V2 with a given expected UserRequest
    /// @param data Socket V2 call data
    /// @param expected Middleware request that is expected
    function verifyCallData(bytes calldata data, ISocketRegistry.UserRequest calldata expected) public view {
        ISocketRegistry.UserRequest memory userRequest = decodeCallData(data);
        require(userRequest.toChainId == expected.toChainId, CallDataVerifyErrors.INVALID_TO_CHAIN_ID);
        require(userRequest.receiverAddress == expected.receiverAddress, CallDataVerifyErrors.INVALID_RECEIVER_ADDRESS);
        require(userRequest.amount == expected.amount, CallDataVerifyErrors.INVALID_AMOUNT);
        this.verifyBridgeRequest(userRequest.bridgeRequest, expected.bridgeRequest);
        this.verifyMiddlewareRequest(userRequest.middlewareRequest, expected.middlewareRequest);
    }

    function verifyApprovalData(
        bytes calldata data,
        address registryAddress,
        uint256 routeId,
        uint256 expectedAmount
    ) public view {
        (address spender, uint256 amount) = decodeApprovalData(data);
        ISocketRegistry.RouteData memory route = ISocketRegistry(registryAddress).routes()[routeId];
        require(route.isEnabled, ApprovalVerifyErrors.INVALID_ROUTE);
        require(route.route == spender, ApprovalVerifyErrors.INVALID_SPENDER);
        require(amount == expectedAmount, ApprovalVerifyErrors.INVALID_AMOUNT);
    }
}
