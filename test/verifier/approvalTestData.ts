import { cloneDeep, merge } from "lodash";

import { ISocketRegistry } from "../../src/types";

interface TestData {
  description: string;
  data: string;
  route: ISocketRegistry.RouteDataStruct;
  expectedAmount: string;
}

interface InvalidTestData extends TestData {
  error: string;
}

const validApprovalTests: TestData[] = [
  {
    description: "usdt",
    data: "0x095ea7b3000000000000000000000000a7649aa944b7dce781859c18913c2dc8a97f03e400000000000000000000000000000000000000000000000000000000997701a0",
    route: {
      route: "0xa7649aa944b7dce781859c18913c2dc8a97f03e4",
      isEnabled: true,
      isMiddleware: false,
    },
    expectedAmount: "2574713248",
  },
];

const BASE_INVALID_TEST = {
  data: "0x095ea7b3000000000000000000000000a7649aa944b7dce781859c18913c2dc8a97f03e400000000000000000000000000000000000000000000000000000000997701a0",
  route: {
    route: "0xa7649aa944b7dce781859c18913c2dc8a97f03e4",
    isEnabled: true,
    isMiddleware: false,
  },
  expectedAmount: "2574713248",
};

const invalidTestPermutations = [
  {
    description: "invalid amount",
    difference: { expectedAmount: "2000000000000" },
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

const invalidApprovalTests: InvalidTestData[] = invalidTestPermutations.map(perm =>
  merge(cloneDeep(BASE_INVALID_TEST), {
    description: perm.description,
    error: perm.error,
    ...perm.difference,
  }),
);

export { validApprovalTests, invalidApprovalTests };
