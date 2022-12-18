import axios from 'axios';
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_URL } from '../utils/env';
import { OrdersResponseDTO } from '../types/types';

const getOrdersQuery = (first: number, after?: string) => `query {
  orders(first:${first}${after ? `, after: "${after}"` : ''}) {
		pageInfo {
			hasNextPage,
			endCursor,
		}
    edges {
      node {
        id
        name
        email
        test
        fullyPaid
        shippingAddress {
          name
          formatted 
        }
        lineItems(first: 20) {
          nodes {
            id
            quantity
            customAttributes{
              key
              value
            }
            product {
              id
              handle
            }
						variant {
							id
							displayName
						}
          }
        }
        cancelledAt
      }
    }
  }
}`;

export const getOrders = async (first: number, after?: string) =>
  await axios.post<OrdersResponseDTO>(
    `https://${SHOPIFY_URL}/admin/api/2022-10/graphql.json`,
    getOrdersQuery(first, after),
    {
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
    }
  );
