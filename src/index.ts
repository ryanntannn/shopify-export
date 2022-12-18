import { getOrders } from './calls/calls';
import { Order } from './types/types';
import { delay } from './utils/delay';
import { storeData } from './utils/store-data';

async function main() {
  const response = await getOrders(5);
  const firstOrders = response.data.data.orders;

  const orders = await recursivelyGetOrders(firstOrders.pageInfo.endCursor, [
    ...firstOrders.edges,
  ]);

  storeData(orders, 'output.json');

  console.log('[Orders] Orders retrived:' + orders.length);
}

async function recursivelyGetOrders(
  endCursor: string,
  prev: Order[]
): Promise<Order[]> {
  const response = await getOrders(5, endCursor);
  console.log('[Orders] retrieving orders: ' + endCursor);

  console.log(JSON.stringify(response.data, null, 4));

  const orders = response.data.data.orders;

  if (!orders.pageInfo.hasNextPage) {
    return [...prev, ...orders.edges];
  }

  const cost = parseInt(
    response.data.extensions.cost?.throttleStatus?.currentlyAvailable ?? '1000'
  );

  if (cost < 422) {
    console.log(
      '[Orders] Cooldown reached! waiting for 6.5 seconds, throttle: ' + cost
    );
    await delay(6500);
  }

  return await recursivelyGetOrders(orders.pageInfo.endCursor, [
    ...prev,
    ...orders.edges,
  ]);
}

main().finally(() => console.log('terminated'));
