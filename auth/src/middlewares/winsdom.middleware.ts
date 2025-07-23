import expressWinston from "express-winston";
import { logger } from "../utilities/winsdom";

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    expressFormat: true,
    colorize: true,
  })
);
