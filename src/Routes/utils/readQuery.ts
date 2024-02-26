import { Request } from "express";

const readQuery = <Error>(
    req: Request,
    keyName: string,
    error: Error
  ): Promise< string > => {
    const value = req.query[keyName];
    return value ? Promise.resolve(value.toString()) : Promise.reject(error);
  };

  export default readQuery;