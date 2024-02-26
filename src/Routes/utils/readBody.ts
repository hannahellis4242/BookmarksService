import { Request } from "express";

const readBody = <Error>(
    req: Request,
    keyName: string,
    error: Error
  ): Promise<string> => {
    const value = req.body[keyName];
    return value ? Promise.resolve(value) : Promise.reject(error);
  };

  export default readBody;