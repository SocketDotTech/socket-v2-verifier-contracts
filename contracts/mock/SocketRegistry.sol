// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "../interfaces/ISocketRegistry.sol";

contract SocketRegistry is ISocketRegistry {
    // solhint-disable-next-line no-empty-blocks
    function routes() external view returns (RouteData[] memory) {}

    // solhint-disable-next-line no-empty-blocks
    function outboundTransferTo(UserRequest calldata _userRequest) external payable {}
}
