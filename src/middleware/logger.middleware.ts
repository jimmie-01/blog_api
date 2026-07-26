import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction): void => {
	console.log("===========Incoming Request=============");

	console.log(`${req.method} ${req.originalUrl}`);

	console.log("=========================================");

	next();
};