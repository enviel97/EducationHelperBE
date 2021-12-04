import { response, Response } from "express";

export function error(message: string) {
  return {
    INVALID: (res: Response) => res.status(404).json({ error: message }),
    UNAUTHORIZED: (res: Response) => res.status(401).json({ error: message }),
    UNKNOWN: (res: Response) => res.status(400).json({ error: message }),
    CONFLICT: (res: Response) => res.status(409).json({ error: message }),
  };
}

export function success(data: any) {
  return {
    OK: (res: Response) => res.status(200).json({ data }),
    CREATED: (res: Response) => res.status(201).json({ data }),
    ACCEPTED: (res: Response) => res.status(202).json({ data }),
    NOCONTENT: (res: Response) => res.status(202).json({ data }),
  };
}
