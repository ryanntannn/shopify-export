import { writeFileSync } from 'fs';

export const storeData = (data: any, path: string) => {
  try {
    writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};
