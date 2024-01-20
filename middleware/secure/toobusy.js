import toobusy from "toobusy-js";

const toobusyProtect = (req, res, next) => {
  if (toobusy()) {
    return res.status(503).json({
      statusCode: 503,
      message: "Trop de requêtes, veuillez réessayer ultérieurement.",
    });
  }

  next();
};

export default toobusyProtect;