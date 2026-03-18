const crypto = require("crypto");
require("dotenv").config();

// 1. Put your exact payload test data here:
const payload = {
  doc: {
    id: "payload-doc-uuid-124",
    status: "draft",
    name: "Sakura Repeat",
    description: "draft update",
    slug: "sakura-repeat",
    tags: ["floral", "japanese", "repeat"],
    designer_credit: "Aiko Tanaka"
  },
  operation: "update"
};

// 2. Fetch the secret key from your .env file
// Alternatively, hardcode it here: const secretKey = "secretkey";
const secretKey = process.env.PAYLOAD_SIGNATURE_KEY || "secretkey";

// 3. Generate the signature
const expectedSignature = crypto
  .createHmac("sha256", secretKey)

console.log("createHmac", expectedSignature)
const updateExpectedSignature = expectedSignature
  // NOTE: JSON.stringify removes all spacing, matching exactly what your server does!
  .update(JSON.stringify(payload), "utf8")
console.log("update", updateExpectedSignature)
const digestExpectedSignature = updateExpectedSignature
  .digest("base64");
console.log("digest", digestExpectedSignature)

console.log("\n=================================");
console.log("PAYLOAD JSON (Copy this into your cURL/Postman Body exactly!):");
console.log("=================================\n");
console.log(JSON.stringify(payload));

console.log("\n=================================");
console.log("x-payload-signature HEADER VALUE:");
console.log("=================================\n");
console.log(digestExpectedSignature);
console.log("\n");
