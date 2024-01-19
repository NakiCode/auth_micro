import toobusy from "toobusy-js";

const toobusyMiddleware = (req, res, next) => {
    if (!toobusy()) {
        next();
    } else {
        res.status(503).json({
            statusCode: 503,
            message: "Too many requests, please try again later.",
        });
    }
};

export default toobusyMiddleware