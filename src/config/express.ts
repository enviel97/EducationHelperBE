import express, {
  json,
  Router,
  urlencoded,
  RequestHandler,
  Express as NExpress,
} from "express";
import { apiKey } from "../helper/dotenv";
import { error, success } from "../helper/https";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export interface RouteType {
  name: string;
  validate?: RequestHandler;
  value: Router;
}

let app: NExpress = express();
const routers: RouteType[] = [];

const createRouter = (route: RouteType) => {
  if (!!route.validate) {
    app.use(`/${route.name}`, route.validate, route.value);
    return;
  }
  app.use(`/${route.name}`, route.value);
};

const apiChecker = () => {
  app.use((req, res, next) => {
    const key = req.headers["api-key"] || req.query.apiKey;
    if (!!key && key === apiKey) next();
    else error(res).UNAUTHORIZED("Invalid api key");
  });
};

const config = (): NExpress => {
  // config secure
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());

  // config extends
  app.use(json());
  app.use(urlencoded({ extended: false }));
  // validated key api
  apiChecker();
  app.get("/", (_, res) =>
    success(res).NOCONTENT({ messenger: "Welcome to backend application" })
  );
  routers.forEach((route) => createRouter(route));
  app.use((_, res) => error(res).NOTFOUND("Redirect not found"));
  return app;
};

const inject = (router: RouteType) => {
  console.log(router.name);
  routers.push(router);
};
const RExpress = {
  config: () => {
    delete (RExpress as any)["config"];
    return config();
  },
  inject,
};

export default RExpress;
