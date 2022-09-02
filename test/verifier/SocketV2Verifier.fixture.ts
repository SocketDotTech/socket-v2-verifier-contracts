import { smock } from "@defi-wonderland/smock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { use as chaiUse } from "chai";
import { ethers } from "hardhat";

import type { SocketRegistry, SocketRegistry__factory } from "../../src/types";
import type { SocketV2Verifier } from "../../src/types/SocketV2Verifier";
import type { SocketV2Verifier__factory } from "../../src/types/factories/SocketV2Verifier__factory";

chaiUse(smock.matchers);

const SOCKET_REGISTRY_ADDRESS = "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0";

async function deployVerifierFixture() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const verifierFactory: SocketV2Verifier__factory = <SocketV2Verifier__factory>(
    await ethers.getContractFactory("SocketV2Verifier")
  );
  const verifier: SocketV2Verifier = <SocketV2Verifier>await verifierFactory.connect(admin).deploy();
  await verifier.deployed();

  return { verifier, admin };
}

async function deployVerifierWithMockedRegistryFixture() {
  const { verifier, admin } = await deployVerifierFixture();
  const SocketRegistryFactory: SocketRegistry__factory = <SocketRegistry__factory>(
    await ethers.getContractFactory("SocketRegistry")
  );
  const socketRegistry = await smock.fake<SocketRegistry>(SocketRegistryFactory, {
    address: SOCKET_REGISTRY_ADDRESS,
  });
  return { verifier, socketRegistry, admin };
}

export { deployVerifierFixture, deployVerifierWithMockedRegistryFixture, SOCKET_REGISTRY_ADDRESS };
