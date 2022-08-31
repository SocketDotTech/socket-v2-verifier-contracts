import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { SocketV2Verifier } from "../src/types/SocketV2Verifier";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    verifier: SocketV2Verifier;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
