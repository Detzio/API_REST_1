function notFound(req, res) {
  res.status(404).json({ error: { message: "Route introuvable." } });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ error: { message: "Le JSON envoyé est invalide." } });
  }

  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ error: { message: "Identifiant produit invalide." } });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ error: { message: messages.join(" ") } });
  }

  console.error(error);
  return res
    .status(500)
    .json({ error: { message: "Une erreur interne est survenue." } });
}

module.exports = { notFound, errorHandler };
