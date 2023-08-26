const jwt = require("jsonwebtoken");

exports.createJsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be none empty object");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secret key must be string");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to sign up to jwt ", error);
  }
};
