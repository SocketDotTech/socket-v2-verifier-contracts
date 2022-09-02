import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import {
  SOCKET_REGISTRY_ADDRESS,
  deployVerifierFixture,
  deployVerifierWithMockedRegistryFixture,
} from "./SocketV2Verifier.fixture";

const nativeTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("SocketV2Verifier verify calldata", function () {
    it("verify call with bridge succeeds", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      expect(
        await verifier.verifyCallData(
          "0xa44bbb150000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b7d8c49945144ec82605ed877a5e0dc4bfbb7f63000000000000000000000000000000000000000000000000000000000000a4b100000000000000000000000000000000000000000000000017979cfe362a000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000b8901acb165ed027e32754e0ffe830802919727f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001778cc610af9d4ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000182f8daf77d0000000000000000000000000000000000000000000000000000000000000001",
          {
            receiverAddress: "0xb7d8c49945144ec82605ed877a5e0dc4bfbb7f63",
            toChainId: 42161,
            amount: "1700000000000000000",
            bridgeRequest: {
              id: 18,
              optionalNativeAmount: 0,
              inputToken: nativeTokenAddress,
              data: "0x",
            },
            middlewareRequest: {
              id: 0,
              optionalNativeAmount: 0,
              inputToken: nativeTokenAddress,
              data: "0x",
            },
          },
        ),
      ).to.not.throw;
    });
  });

  describe("SocketV2Verifier verify approve", function () {
    it("verify approval succeeds", async function () {
      const { verifier, socketRegistry } = await loadFixture(deployVerifierWithMockedRegistryFixture);
      const data =
        "0x095ea7b3000000000000000000000000a7649aa944b7dce781859c18913c2dc8a97f03e400000000000000000000000000000000000000000000000000000000997701a0";

      socketRegistry.routes.returns([
        {
          route: "0xa7649aa944b7dce781859c18913c2dc8a97f03e4",
          isEnabled: true,
          isMiddleware: false,
        },
      ]);
      expect(await verifier.verifyApprovalData(data, SOCKET_REGISTRY_ADDRESS, 0, 2574713248)).to.not.throw;
    });
  });
});
