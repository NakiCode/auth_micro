import jwt from 'jsonwebtoken';
import errConstructor from '../../middleware/err/err.js';

const signAccessToken = (payload) => {
  return jwt.sign(
    { _id: payload._id, type: "access", role: payload.role, tokenId: payload.tokenId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const signRefreshToken = (payload) => {
  return jwt.sign(
    { _id: payload._id, type: "refresh", role: payload.role, tokenId: payload.tokenId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

const signApiKey = (payload) => {
  return jwt.sign(
    { apiKey: payload.signature, type: "api", role: payload.role },
    process.env.API_KEY_SECRET,
    { expiresIn: process.env.API_KEY_EXPIRES_IN }
  );
};

const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const verifyAccessToken = async (accessToken) => {
  const decoded = await verifyToken(accessToken, process.env.JWT_SECRET);
    if (decoded.type !== "access") {
        throw new errConstructor("JwtError","Access Invalid token type", 400);
    }
    if (isTokenExpired(decoded.exp)) {
        throw new errConstructor("JwtError", "Access token has expired", 400);
    }
    return decoded;
};

export const verifyRefreshToken = async (refreshToken) => {
  const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== "refresh") {
        throw new errConstructor("JwtError","Refresh Invalid token type", 400);
    }
    if (isTokenExpired(decoded.exp)) {
        throw new errConstructor("JwtError", "Refresh token has expired", 400);
    }
    return decoded;
};

export const verifyApiKey = async (apiKey) => {
  const decoded = await verifyToken(apiKey, process.env.API_KEY_SECRET);
    if (decoded.type !== "api") {
        throw new errConstructor("JwtError", "ApiKey Invalid token type", 400);
    }
    if (isTokenExpired(decoded.exp)) {
        throw new errConstructor("JwtError", "API key has expired", 400);
    }
    return decoded;
};

export const attachTokensToUser = (payload) => {
  const access = signAccessToken(payload);
  const refresh = signRefreshToken(payload);
  const apiKey = signApiKey(payload);
  return { access, refresh, apiKey, user:payload };
};

const isTokenExpired = (expirationTime) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > expirationTime;
};