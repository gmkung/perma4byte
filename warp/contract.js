export async function handle(state, action) {
  /* address of the caller is available in action.caller */
  /* warp/contract.js */
  if (action.input.function === "initialize") {
    state.author = action.caller;
    state.functionCount = 0;
    state.functionHashCount = 0;
  }
  if (action.input.function === "registerFunctions") {
    const functionStrings = action.input.functionStrings;
    const functions = state.functions;
    const invalidSignatures = [];

    // Check if functionStrings is an array and contains only strings
    if (
      Array.isArray(functionStrings) &&
      functionStrings.every((item) => typeof item === "string")
    ) {
      for (let i = 0; i < functionStrings.length; i++) {
        const textSignature = normalizeFunctionString(functionStrings[i]);
        if (isValidTextSignature(textSignature)) {
          //doing some basic checks to prevent spam
          const hexSignature = (
            await calculateHexSignature(textSignature)
          ).substring(0, 10);
          const bytesSignature = hexToByteArrayString(hexSignature);

          // Check if this hexSignature already exists
          if (functions[hexSignature]) {
            // Check if this textSignature already exists for this hexSignature
            if (
              !functions[hexSignature].some(
                (obj) => obj.text_signature === textSignature
              )
            ) {
              functions[hexSignature].push({
                text_signature: textSignature,
                hex_signature: hexSignature,
                bytes_signature: bytesSignature,
              });
              //adding the counters manually
              state.functionCount += 1;
            }
          } else {
            // If the hexSignature does not exist, create a new array
            functions[hexSignature] = [
              {
                text_signature: textSignature,
                hex_signature: hexSignature,
                bytes_signature: bytesSignature,
              },
            ];
            //adding the counters manually
            state.functionHashCount += 1;
            state.functionCount += 1;
          }
        } else {
          invalidSignatures.push(functionStrings[i]);
        }
      }
      state.functions = functions;

      // handle invalid function strings
      if (invalidSignatures.length > 0) {
        // Do something with the invalid signatures, e.g. log them or throw an error
        console.warn("Invalid function strings:", invalidSignatures);
      }
    } else {
      console.error(
        "Invalid input: functionStrings must be an array of strings"
      );
      return;
    }
  }

  return { state };
}

function isValidTextSignature(textSignature) {
  // Regular expression pattern to validate the function text signature
  const pattern = /^[_a-zA-Z$][\w$]*\(\s*([^,]+(\s*,\s*[^,]+)*)?\s*\)$/;

  return pattern.test(textSignature);
}

function normalizeFunctionString(fn) {
  // Remove whitespace and semicolons
  fn = fn.replace(/\s+/g, "").replace(/;/g, "");

  // Extract the function name and parameters
  const functionName = fn.substring(0, fn.indexOf("("));
  const parameters = fn.substring(fn.indexOf("(") + 1, fn.indexOf(")"));

  // Normalize the parameters by dropping names and extraneous whitespace
  const normalizedParameters = parameters
    .split(",")
    .map((param) => param.trim().split(" ")[0])
    .join(",");

  // Construct the normalized function string
  return `${functionName}(${normalizedParameters})`;
}

function hexToByteArrayString(hexSignature) {
  const hexString = hexSignature.slice(2);
  let byteArrayString = "r'";

  for (let i = 0; i < hexString.length; i += 2) {
    const hexByte = hexString.substr(i, 2);
    const byteValue = parseInt(hexByte, 16);
    byteArrayString += `\\x${byteValue.toString(16).padStart(2, "0")}`;
  }

  byteArrayString += "'";

  return byteArrayString;
}

async function calculateHexSignature(textSignature) {
  //const data1 = new TextEncoder().encode(textSignature)
  //const data =  new Uint8Array(13) [ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]
  const data = new Buffer.from(textSignature, "utf-8");
  //const hashBuffer = await SmartWeave.arweave.crypto.hash(data)
  const keccak256hash = await SmartWeave.extensions.ethers.utils.keccak256(
    data
  );
  //const hashBuffer=data;
  //const hashArray = Array.from(new Uint8Array(hashBuffer))
  /* const sha3Hash = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('') */

  return keccak256hash;
}
