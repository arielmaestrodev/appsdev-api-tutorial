import { Router } from "express";
import { SchemaMiddleware } from "@/middlewares/schema-middleware";
import { AuthController } from "@/controllers/auth-controller";
import { signupSchema, loginSchema, refreshTokenSchema } from "@/schema/auth-schema";

const router = Router();
const schemaMiddleware = new SchemaMiddleware();
const authController = new AuthController();

router.post("/v1/signup", schemaMiddleware.validate(signupSchema), authController.signup);
router.post("/v1/login", schemaMiddleware.validate(loginSchema), authController.login);
router.post("/v1/refresh-token", schemaMiddleware.validate(refreshTokenSchema), authController.refreshToken);
router.post("/v1/logout", schemaMiddleware.validate(refreshTokenSchema), authController.logout);

export default router;