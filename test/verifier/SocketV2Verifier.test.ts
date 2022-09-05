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
import { validApprovalTests } from "./approvalTestData";
import { validCallDataTests } from "./callDataTestDatra";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("SocketV2Verifier verify calldata", function () {
    validCallDataTests.forEach(test =>
      it(`verify call ${test.description} succeeds`, async () => {
        const { verifier } = await loadFixture(deployVerifierFixture);

        expect(await verifier.verifyCallData(test.data, test.expected)).to.not.throw;
      }),
    );
  });

  describe("SocketV2Verifier verify approve", function () {
    validApprovalTests.forEach(test =>
      it(`verify approval ${test.description} succeeds`, async () => {
        const { verifier, socketRegistry } = await loadFixture(deployVerifierWithMockedRegistryFixture);

        socketRegistry.routes.returns([test.route]);
        expect(await verifier.verifyApprovalData(test.data, SOCKET_REGISTRY_ADDRESS, 0, test.expectedAmount)).to.not
          .throw;
      }),
    );
  });
});
