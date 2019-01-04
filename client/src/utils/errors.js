// reference: https://stackoverflow.com/a/27724419

export var MissingWeb3Error = function(message) {
  this.message = message;
   // Use V8's native method if available, otherwise fallback
  if ("captureStackTrace" in Error) {
    Error.captureStackTrace(this, MissingWeb3Error);
  } else {
    this.stack = (new Error()).stack;
  }
}

MissingWeb3Error.prototype = Object.create(Error.prototype);
MissingWeb3Error.prototype.name = "MissingWeb3Error";
MissingWeb3Error.prototype.constructor = MissingWeb3Error;

export default MissingWeb3Error;
