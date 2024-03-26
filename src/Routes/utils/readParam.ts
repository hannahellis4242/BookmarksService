import { Request } from "express";

const readParam = <Error>(
  req: Request,
  keyName: string,
  error: Error
): Promise<string> => {
  const value = req.params[keyName];
  return value ? Promise.resolve(value.toString()) : Promise.reject(error);
};

export default readParam;
