const fields = ["name", "description", "price", "category"];

function validateProduct({ partial = false } = {}) {
  return (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res
        .status(400)
        .json({ error: { message: "Le corps doit être un objet JSON." } });
    }

    const keys = Object.keys(body);
    const unknownFields = keys.filter((key) => !fields.includes(key));
    if (unknownFields.length > 0) {
      return res.status(400).json({
        error: {
          message: `Champ(s) inconnu(s) : ${unknownFields.join(", ")}.`,
        },
      });
    }

    const missingFields = (partial ? [] : fields).filter(
      (field) => !Object.hasOwn(body, field),
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: {
          message: `Champ(s) obligatoire(s) : ${missingFields.join(", ")}.`,
        },
      });
    }

    if (partial && keys.length === 0) {
      return res
        .status(400)
        .json({ error: { message: "Au moins un champ est requis." } });
    }

    for (const [field, value] of Object.entries(body)) {
      if (field === "price") {
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
          return res.status(400).json({
            error: { message: "Le prix doit être un nombre positif ou nul." },
          });
        }
      } else if (typeof value !== "string" || value.trim().length === 0) {
        return res.status(400).json({
          error: {
            message: `Le champ ${field} doit être une chaîne non vide.`,
          },
        });
      }
    }

    return next();
  };
}

module.exports = validateProduct;
