import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { SocketV2Verifier } from "../../src/types/SocketV2Verifier";
import type { SocketV2Verifier__factory } from "../../src/types/factories/SocketV2Verifier__factory";
import type { Signers } from "../types";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("SocketV2Verifier", function () {
    beforeEach(async function () {
      const verifierFactory: SocketV2Verifier__factory = <SocketV2Verifier__factory>(
        await ethers.getContractFactory("SocketV2Verifier")
      );
      const verifier: SocketV2Verifier = <SocketV2Verifier>await verifierFactory.connect(this.signers.admin).deploy();
      await verifier.deployed();

      this.verifier = verifier;
    });

    it("should return true when verify", async function () {
      expect(await this.verifier.connect(this.signers.admin).verifyCallData("0xeeee")).to.equal(true);
    });
  });
});
