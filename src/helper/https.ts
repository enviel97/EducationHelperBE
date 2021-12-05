import { Response } from "express";

export function error(res: Response) {
  return {
    NOTFOUND: (mess: string) => res.status(404).json({ error: mess }),
    UNAUTHORIZED: (mess: string) => res.status(401).json({ error: mess }),
    BADREQUEST: (mess: string) => res.status(400).json({ error: mess }),
    CONFLICT: (mess: string) => res.status(409).json({ error: mess }),
  };
}

export function success(res: Response) {
  return {
    OK: (data: any) => res.status(200).json({ data }),
    CREATED: (data: any) => res.status(201).json({ data }),
    ACCEPTED: (data: any) => res.status(202).json({ data }),
    NOCONTENT: (data: any) => res.status(202).json({ data }),
  };
}
