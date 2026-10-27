const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/auth");

function rejectUnauthorized(res, message, description) {
  const challenge = description
    ? `Bearer error="invalid_token", error_description="${description}"`
    : "Bearer";

  return res
    .set("WWW-Authenticate", challenge)
    .status(401)
    .json({ error: { message } });
}

function authenticateToken(req, res, next) {
  const authorization = req.get("Authorization");
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);

  if (!match) {
    return rejectUnauthorized(res, "Un jeton Bearer valide est obligatoire.");
  }

  let jwtSecret;
  try {
    jwtSecret = getJwtSecret();
  } catch (error) {
    return next(error);
  }

  return jwt.verify(
    match[1],
    jwtSecret,
    { algorithms: ["HS256"] },
    (error, payload) => {
      if (error || typeof payload?.sub !== "string") {
        const expired = error?.name === "TokenExpiredError";
        return rejectUnauthorized(
          res,
          expired ? "Le jeton a expire." : "Le jeton est invalide.",
          expired ? "The access token expired" : "The access token is invalid",
        );
      }

      req.auth = { userId: payload.sub };
      return next();
    },
  );
}

module.exports = authenticateToken;
