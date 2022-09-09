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
import { invalidApprovalTests, validApprovalTests } from "./approvalTestData";
import { invalidCallDataTests, validCallDataTests } from "./callDataTestDatra";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("SocketV2Verifier calldata succeeds", function () {
    validCallDataTests.forEach(test =>
      it(`verify call ${test.description} succeeds`, async () => {
        const { verifier } = await loadFixture(deployVerifierFixture);

        expect(await verifier.verifyCallData(test.target, test.data, test.expected)).to.not.throw;
      }),
    );
  });

  describe("SocketV2Verifier calldata fails", function () {
    invalidCallDataTests.forEach(test =>
      it(`verify call ${test.description} fails`, async () => {
        const { verifier } = await loadFixture(deployVerifierFixture);

        await expect(verifier.verifyCallData(test.target, test.data, test.expected)).to.be.revertedWith(test.error);
      }),
    );
  });

  describe("SocketV2Verifier approve succeeds", function () {
    validApprovalTests.forEach(test =>
      it(`verify approval ${test.description} succeeds`, async () => {
        const { verifier, socketRegistry } = await loadFixture(deployVerifierWithMockedRegistryFixture);

        socketRegistry.routes.returns([test.expected.route]);
        expect(
          await verifier.verifyApprovalData(test.target, test.data, SOCKET_REGISTRY_ADDRESS, {
            routeId: 0,
            amount: test.expected.amount,
            target: test.expected.target,
          }),
        ).to.not.throw;
      }),
    );
  });

  describe("SocketV2Verifier approve fails", function () {
    invalidApprovalTests.forEach(test =>
      it(`verify approve ${test.description} fails`, async () => {
        const { verifier, socketRegistry } = await loadFixture(deployVerifierWithMockedRegistryFixture);

        socketRegistry.routes.returns([test.expected.route]);

        await expect(
          verifier.verifyApprovalData(test.target, test.data, SOCKET_REGISTRY_ADDRESS, {
            routeId: 0,
            amount: test.expected.amount,
            target: test.expected.target,
          }),
        ).to.be.revertedWith(test.error);
      }),
    );
  });
});
