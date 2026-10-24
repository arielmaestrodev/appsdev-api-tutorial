import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "@/middlewares/auth-middleware";
import { verifyRefreshToken } from "@/lib/jwt";
import { validateRequest, csrfSessionCookieName, csrfTokenCookieName } from "@/lib/csrf";

// Middleware that protects requests against Cross-Site Request Forgery (CSRF).
export class CsrfMiddleware {
  // Skip CSRF validation if AuthMiddleware has already verified Bearer authentication.
  public execute = (req: Request, res: Response, next: NextFunction) => {
    // Check if the request was authenticated using a Bearer token.
    if ((req as AuthenticatedRequest).authMethod === "bearer") {
      return next();
    }

    // Otherwise, proceed with CSRF validation.
    return this.validate(req, res, next);
  };

  // Determine whether signup/login requests need CSRF validation.
  public auth = (req: Request, res: Response, next: NextFunction) => {
    // Check for browser-related headers or authentication/CSRF cookies.
    const browserRequest = req.get("origin") || req.get("referer") || req.get("sec-fetch-site")
      || req.cookies?.accessToken || req.cookies?.refreshToken
      || req.cookies?.[csrfSessionCookieName] || req.cookies?.[csrfTokenCookieName];

    // Skip CSRF validation if no browser indicators are found and the request uses JSON.
    if (!browserRequest && req.is("application/json")) {
      return next();
    }

    // Otherwise, proceed with CSRF validation.
    return this.validate(req, res, next);
  };

  // Determine whether refresh token requests need CSRF validation.
  public refreshToken = (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the refresh token from the request body.
    const token = req.body?.refreshToken;

    // Skip CSRF validation if no auth cookies exist and the body contains a valid refresh token.
    if (!req.cookies?.accessToken && !req.cookies?.refreshToken && typeof token === "string" && verifyRefreshToken(token)) {
      return next();
    }

    // Otherwise, proceed with CSRF validation.
    return this.validate(req, res, next);
  };

  // Validate CSRF protection and reject requests that fail validation.
  private validate(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF validation for safe HTTP methods that should not modify data.
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    // Allow the request to continue if CSRF validation succeeds.
    if (validateRequest(req)) {
      return next();
    }

    // Reject the request with HTTP 403 if the CSRF token is missing or invalid.
    return res.status(403).json({ code: 403, status: "error", message: "Invalid or missing CSRF token" });
  }
}