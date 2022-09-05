import { ISocketRegistry } from "../../src/types";

interface TestData {
  description: string;
  data: string;
  route: ISocketRegistry.RouteDataStruct;
  expectedAmount: string;
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

export { validApprovalTests };
