
export class HttpError extends Error {
  public status?: number;
  public payload?: any;

  constructor(message: string, status?: number, payload?: any) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    first_name: string;
    [k: string]: unknown;
  };
}


import { z } from "zod";

export const QuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  email: z.string().email().optional()
});

export type QueryParams = z.infer<typeof QuerySchema>;