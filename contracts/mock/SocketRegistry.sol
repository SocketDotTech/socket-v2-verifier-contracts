import "../interfaces/ISocketRegistry.sol";

// SPDX-License-Identifier: UNLICENSED
contract SocketRegistry is ISocketRegistry {
    function routes() external view returns (RouteData[] memory) {}

    function outboundTransferTo(UserRequest calldata _userRequest) external payable {}
}
