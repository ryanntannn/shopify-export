import { readFile, readFileSync, writeFileSync } from "fs";

export const storeData = (data: any, path: string) => {
  try {
    writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

export async function readData<T>(path: string) {
  return (await JSON.parse(await readFileSync(path, "utf-8"))) as T;
}
