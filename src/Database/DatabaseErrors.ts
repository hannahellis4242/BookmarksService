const DatabaseErrors = {
  NotFound: "NotFound",
  NotImpl: "NotImpl",
  TooMany: "TooMany",
  DBError: "DBError",
  AlreadyExists: "AlreadyExists",
} as const;

type DatabaseErrors = (typeof DatabaseErrors)[keyof typeof DatabaseErrors];
export default DatabaseErrors;
