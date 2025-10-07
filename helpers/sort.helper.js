module.exports.sortObject = (obj) => {
  // Check if the input is an actual object
  if (typeof obj !== "object" || obj === null) {
    throw new TypeError("Input must be an object");
  }

  let sorted = {};
  let str = [];
  let key;

  // Loop over keys of the object
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(key);
    }
  }

  // Sort keys
  str.sort();

  // Build the sorted object
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }

  return sorted;
};
