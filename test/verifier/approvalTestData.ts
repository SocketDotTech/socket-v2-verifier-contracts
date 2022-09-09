import { cloneDeep, merge } from "lodash";

import { ISocketRegistry } from "../../src/types";

const USDC_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const NOT_USDC_TOKEN = "0xD9c6d58eC4b6045067190042999351889fd27Eb7";

interface TestData {
  description: string;
  target: string;
  data: string;
  expected: {
    target: string;
    route: ISocketRegistry.RouteDataStruct;
    amount: string;
  };
}

interface InvalidTestData extends TestData {
  error: string;
}

const validApprovalTests: TestData[] = [
  {
    description: "usdc",
    target: USDC_TOKEN,
    data: "0x095ea7b3000000000000000000000000a7649aa944b7dce781859c18913c2dc8a97f03e400000000000000000000000000000000000000000000000000000000997701a0",
    expected: {
      target: USDC_TOKEN,
      route: {
        route: "0xa7649aa944b7dce781859c18913c2dc8a97f03e4",
        isEnabled: true,
        isMiddleware: false,
      },
      amount: "2574713248",
    },
  },
];

const BASE_INVALID_TEST = {
  data: "0x095ea7b3000000000000000000000000a7649aa944b7dce781859c18913c2dc8a97f03e400000000000000000000000000000000000000000000000000000000997701a0",
  target: USDC_TOKEN,
  expected: {
    target: USDC_TOKEN,
    route: {
      route: "0xa7649aa944b7dce781859c18913c2dc8a97f03e4",
      isEnabled: true,
      isMiddleware: false,
    },
    amount: "2574713248",
  },
};

const invalidTestPermutations = [
  {
    description: "invalid target",
    difference: { target: NOT_USDC_TOKEN },
    error: "INVALID_TARGET",
  },
  {
    description: "invalid amount",
    difference: { amount: "2000000000000" },
    error: "INVALID_AMOUNT",
  },
  {
    description: "route disabled",
    difference: { route: { isEnabled: false } },
    error: "INVALID_ROUTE",
  },
  {
    description: "invalid spender",
    difference: { route: { route: "0x00000000006c3852cbef3e08e8df289169ede581" } },
    error: "INVALID_SPENDER",
  },
];

const invalidApprovalTests: InvalidTestData[] = invalidTestPermutations.map(perm => ({
  description: perm.description,
  target: BASE_INVALID_TEST.target,
  data: BASE_INVALID_TEST.data,
  error: perm.error,
  expected: merge(cloneDeep(BASE_INVALID_TEST.expected), perm.difference),
}));

export { validApprovalTests, invalidApprovalTests };
