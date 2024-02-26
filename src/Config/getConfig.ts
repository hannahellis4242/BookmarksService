import { join } from "path";
import getEnvConfig from "./getEnvConfig";
import readConfigFile from "./readConfigFile";
import Config from "./Config";

const getConfig = async () =>
  getEnvConfig().catch<Config>((reason) => {
    console.log(
      "attempted to use environment config, falling back on config file",
    );
    return readConfigFile(join(__dirname, "..", "..", "config.json"));
  });

export default getConfig;
