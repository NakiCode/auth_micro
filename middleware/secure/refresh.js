import * as jwtToken from "../../middleware/jwt/token.js";
import * as jwtCookie from "../../middleware/jwt/cookies.js";
import catchAsync from "../../middleware/catch/catchAsync.js";
import { tbl_User } from "../../models/UserModel.js";

export const refresh = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.jwt_refresh) {
    if (jwtCookie.isCookiesExpired(req.cookies.jwt_refresh)) {
      // Gérer l'expiration des cookies de rafraîchissement JWT
      return handleUnauthorized(res, "Veuillez vous connecter");
    }
    token = req.cookies.jwt_refresh;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return handleUnauthorized(res, "Veuillez vous connecter");
  }
  const verifyRefreshToken = await jwtToken.verifyRefreshToken(token);
  if (!verifyRefreshToken) {
    return handleUnauthorized(res, "Veuillez vous connecter");
  }
  const user = await tbl_User.findById(verifyRefreshToken._id).select('+tokenId');
  if (!user) {
    return handleNotFound(res, "Utilisateur non trouvé");
  }
  const attach = jwtToken.attachTokensToUser(user);
  jwtCookie.attachCookies(attach.access, attach.refresh, res);
  const respo = response(200, true, attach, "Connexion réussie");
  return res.status(200).json(respo);
});

// Fonction utilitaire pour gérer les réponses d'erreur
function handleUnauthorized(res, message) {
  const respo = response(401, false, [], message);
  return res.status(401).json(respo);
}

// Fonction utilitaire pour gérer les réponses de ressource non trouvée
function handleNotFound(res, message) {
  const respo = response(404, false, [], message);
  return res.status(404).json(respo);
}

// Fonction utilitaire pour générer une réponse JSON standardisée
function response(status, success, data, message) {
  return { status, success, data, message };
}

export default refresh;