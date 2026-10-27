function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 octets.");
  }

  return secret;
}

function validateAuthConfig() {
  const missing = ["AUTH_USERNAME", "AUTH_PASSWORD"].filter(
    (key) => !process.env[key],
  );

  if (missing.length > 0) {
    throw new Error(`Configuration manquante : ${missing.join(", ")}.`);
  }

  getJwtSecret();
}

module.exports = { getJwtSecret, validateAuthConfig };
