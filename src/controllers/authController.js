const { timingSafeEqual } = require("node:crypto");
const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/auth");

function safeCompare(value, expected) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

function login(req, res, next) {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== "string" ||
    username.trim().length === 0 ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return res.status(400).json({
      error: { message: "Les champs username et password sont obligatoires." },
    });
  }

  const configuredUsername = process.env.AUTH_USERNAME;
  const configuredPassword = process.env.AUTH_PASSWORD;

  if (!configuredUsername || !configuredPassword) {
    return next(
      new Error("La configuration de l'authentification est incomplete."),
    );
  }

  let jwtSecret;
  try {
    jwtSecret = getJwtSecret();
  } catch (error) {
    return next(error);
  }

  if (
    !safeCompare(username, configuredUsername) ||
    !safeCompare(password, configuredPassword)
  ) {
    return res.status(401).json({
      error: { message: "Identifiants invalides." },
    });
  }

  const accessToken = jwt.sign({ sub: configuredUsername }, jwtSecret, {
    algorithm: "HS256",
    expiresIn: 300,
  });

  return res.status(200).json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 300,
  });
}

module.exports = { login };
