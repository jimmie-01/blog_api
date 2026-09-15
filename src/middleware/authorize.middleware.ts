import { Request, Response, NextFunction } from "express";
import type { UserRole } from "../generated/prisma/enums.js";
import { ForbiddenError } from "../errors/forbidden-error.js";

export const authorize = (...allowedRoles: UserRole[]) => 
{
	return (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.user) {
			return next(
				new ForbiddenError("Access denied")
			);
		}

		if (!allowedRoles.includes(req.user.role)) {
			return next(
				new ForbiddenError("Access denied")
			);
		}
		next();
	}
}