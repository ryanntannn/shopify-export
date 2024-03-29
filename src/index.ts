import { json } from "stream/consumers";
import { getOrders } from "./calls/calls";
import { Order } from "./types/types";
import { delay } from "./utils/delay";
import { readData, storeData } from "./utils/store-data";
import { parse } from "json2csv";

async function main() {
  const response = await getOrders(5);
  const firstOrders = response.data.data.orders;

  const orders = await recursivelyGetOrders(firstOrders.pageInfo.endCursor, [
    ...firstOrders.edges,
  ]);

  // storeData(orders, "output.json");

  // const orders = await readData<Order[]>("output.json");

  const cleanedOrders = orders.flatMap((order) => [
    ...order.node.lineItems.nodes.map((lineItem) => ({
      id: order.node.id,
      name: order.node.name,
      email: order.node.email,
      test: order.node.test,
      fullyPaid: order.node.fullyPaid,
      shippingAddress: JSON.stringify(
        order.node.shippingAddress?.formatted ?? ""
      ),
      itemProductId: lineItem.product.id,
      itemProductHandle: lineItem.product.handle,
      itemVariantId: lineItem.variant.id,
      itemVariantTitle: lineItem.variant.displayName,
      itemQty: lineItem.quantity,
      itemAttributes: JSON.stringify(lineItem.customAttributes),
    })),
  ]);

  console.log(orders);

  getCounts(orders);

  const opts = {
    fields: [
      "id",
      "name",
      "email",
      "test",
      "fullyPaid",
      "shippingAddress",
      "itemProductId",
      "itemProductHandle",
      "itemVariantId",
      "itemVariantTitle",
      "itemQty",
      "itemAttributes",
    ],
  };

  const csv = parse(cleanedOrders, opts);

  storeData(csv, "output.csv", true);
}

async function getCounts(orders: Order[]) {
  const idCounts = new Map<string, number>();
  const attributeCounts = new Map<string, number>();
  const attributePairCounts = new Map<string, number>();

  orders
    .filter((order) => !order.node.test)
    .forEach((order) => {
      order.node.lineItems.nodes.forEach((lineItem) => {
        const productId = lineItem.product.id;
        idCounts.set(productId, (idCounts.get(productId) ?? 0) + 1);

        if (productId === "gid://shopify/Product/8069881266495") {
          lineItem.customAttributes.forEach((attribute) => {
            const cid = `${attribute.key}-${attribute.value}`;
            attributeCounts.set(cid, (attributeCounts.get(cid) ?? 0) + 1);
          });

          const attributePair = `${
            lineItem.customAttributes.find((atr) => atr.key === "top-frame")
              ?.value
          }-${
            lineItem.customAttributes.find((atr) => atr.key === "bottom-frame")
              ?.value
          }`;

          attributePairCounts.set(
            attributePair,
            (attributePairCounts.get(attributePair) ?? 0) + 1
          );

          console.log("");
        }
      });
    });

  console.log(idCounts, attributeCounts, attributePairCounts);

  console.log("[Orders] Orders retrived:" + orders.length);
}

async function recursivelyGetOrders(
  endCursor: string,
  prev: Order[]
): Promise<Order[]> {
  const response = await getOrders(5, endCursor);
  console.log("[Orders] retrieving orders: " + endCursor);

  console.log(JSON.stringify(response.data, null, 4));

  const orders = response.data.data.orders;

  if (!orders.pageInfo.hasNextPage) {
    return [...prev, ...orders.edges];
  }

  const cost = parseInt(
    response.data.extensions.cost?.throttleStatus?.currentlyAvailable ?? "1000"
  );

  if (cost < 422) {
    console.log(
      "[Orders] Cooldown reached! waiting for 6.5 seconds, throttle: " + cost
    );
    await delay(6500);
  }

  return await recursivelyGetOrders(orders.pageInfo.endCursor, [
    ...prev,
    ...orders.edges,
  ]);
}

main().finally(() => console.log("terminated"));
