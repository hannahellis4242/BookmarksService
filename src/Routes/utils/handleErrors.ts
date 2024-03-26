import { StatusCodes } from "http-status-codes";
import ServiceErrors from "../../Service/ServiceErrors";
import { Response } from "express";

export const Errors = {
  NoLink: "NoLink",
  NoLabel: "NoLabel",
  NoLabelParam: "NoLabelParam",
} as const;

export type Errors = ServiceErrors | (typeof Errors)[keyof typeof Errors];

const handleError = (res: Response) => (e: Errors) => {
  switch (e) {
    case Errors.NoLink:
      return res.status(StatusCodes.BAD_REQUEST).send("Link url required");
    case Errors.NoLabel:
    case Errors.NoLabelParam:
      return res.status(StatusCodes.BAD_REQUEST).send("Label required");
    case ServiceErrors.AlreadyExists:
      return res.sendStatus(StatusCodes.CONFLICT);
    case ServiceErrors.NotFound:
      return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  console.error("Error not handled : ", e);
  throw Error("unhandled error");
};

export default handleError;
