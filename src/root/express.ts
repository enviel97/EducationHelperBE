import express, {
  json,
  Router,
  urlencoded,
  RequestHandler,
  Express as NExpress,
} from "express";
import { apiKey } from "../helper/dotenv";

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
    else res.status(404).json({ message: "Invaid API key" });
  });
};

const config = (): NExpress => {
  // To do config database
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // validated key api
  apiChecker();
  app.get("/", (_, res) => res.send("<h1>Welcome</h1>"));
  routers.forEach((route) => createRouter(route));
  app.use((_, res) => res.status(404).send("<h1>Not found</h1>"));
  return app;
};

const RExpress = {
  config: () => {
    delete (RExpress as any)["config"];
    return config();
  },
  inject: (router: RouteType) => {
    console.log("injected");
    routers.push(router);
  },
};

export default RExpress;
