const jwt = require("jsonwebtoken")

exports.createJsonWebToken = (payload, secretKey, expiresIn) => {

    if (typeof payload !== "object" || !payload) {
        throw new Error("Payload must be an non-empty object")
    }
    if (typeof secretKey !== "string" || secretKey === "") {
        throw new Error("Secrete key must be and string")
    }

    try {

        const token = jwt.sign(payload, secretKey, {
            expiresIn
        });
        return token

    } catch (error) {
        console.error("failed to sign in to JWT", error)
        throw error
    }
}