import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import campaignRoutes from "./routes/campaignRoutes";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;
