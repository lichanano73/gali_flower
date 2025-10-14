
export class HttpError extends Error {
  public status?: number;
  public payload?: any;

  constructor(message: string, status?: number, payload?: any) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}