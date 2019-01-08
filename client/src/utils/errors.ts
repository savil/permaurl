// reference: https://stackoverflow.com/a/27724419

export class MissingWeb3Error extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore
  }
}
