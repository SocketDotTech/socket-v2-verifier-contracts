import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { SocketV2Verifier } from "../../src/types/SocketV2Verifier";
import type { SocketV2Verifier__factory } from "../../src/types/factories/SocketV2Verifier__factory";

task("deploy:SocketV2Verifier").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const verifierFactory: SocketV2Verifier__factory = <SocketV2Verifier__factory>(
    await ethers.getContractFactory("SocketV2Verifier")
  );
  const verifier: SocketV2Verifier = <SocketV2Verifier>await verifierFactory.connect(signers[0]).deploy();
  await verifier.deployed();
  console.log("SocketV2Verifier deployed to: ", verifier.address);
});
