import { readFile } from "fs/promises";
import Config from "./Config";

const readConfigFile = async (path: string): Promise<Config> =>
  readFile(path)
    .then((data) => data.toString())
    .then((data) => JSON.parse(data))
    .then((config) => {
      const portStr = config.PORT;
      if (!portStr) {
        return Promise.reject(new Error("No PORT in config file"));
      }
      const port = parseInt(portStr);
      if (!Number.isInteger(port)) {
        return Promise.reject(new Error("PORT is not an integer"));
      }
      const databaseHost = config.DB_HOST;
      if (!databaseHost) {
        return Promise.reject(new Error("No DB_HOST in config file"));
      }
      return { port, databaseHost };
    });
export default readConfigFile;
