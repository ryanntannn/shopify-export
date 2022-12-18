type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type CustomAttribute = {
  key: string;
  value: string;
};

export type ShopifyResponse<T> = {
  data: T;
  extensions: DeepPartial<{
    cost: {
      requestedQueryCost: string;
      actualQueryCost: string;
      throttleStatus: {
        maximumAvailable: string;
        currentlyAvailable: string;
        restoreRate: string;
      };
    };
  }>;
};

export type OrdersResponseDTO = ShopifyResponse<{
  orders: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Order[];
  };
}>;

export type Order = {
  node: {
    id: string;
    name: string;
    email: string;
    test: boolean;
    fullyPaid: boolean;
    shippingAddress: {
      name: string;
      formatted: string;
    };
    lineItems: {
      nodes: {
        id: string;
        quantity: number;
        customAttributes: CustomAttribute[];
        product: {
          id: string;
          handle: string;
        };
        variant: {
          id: string;
          title: string;
        };
      }[];
    };
    cancelledAt: string | null;
  };
};
