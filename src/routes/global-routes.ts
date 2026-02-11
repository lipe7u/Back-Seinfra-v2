import { FastifyInstance } from "fastify";
import { registerAdmin } from "../controllers/register-adm-controller";
import { register } from "../controllers/register-controller";
import { login } from "../controllers/login-controller";
import {
  CreateRequests,
  ListRequests,
} from "../controllers/solicitacoes-controller";
import { generateRequestsPdf } from "../controllers/pdfController";
import { cancelOrder, changeStatusOrder } from "../controllers/orders-list-controller";
import { requestOrdersInfo } from "../controllers/orders-list-controller";
import { loginAdmin } from "../controllers/login-admin-controller";
import { me } from "../controllers/me-controller";

export default async function GlobalRoutes(app: FastifyInstance) {
  app.get("/me", me)
  app.post("/registro", register);
  app.post("/login", login);
  app.post("/registro-admin", registerAdmin);
  app.post("/novaSolicitacao", CreateRequests);
  app.get("/minhas-solicitacoes", ListRequests);
  app.get("/gerarPdfSolicitacoes", generateRequestsPdf);
  app.get("/solicitarOrdens", requestOrdersInfo);
  app.post("/cancelarOrdem", cancelOrder);
  app.post("/alterarStatusOrdem", changeStatusOrder)
  app.post("/login-admin", loginAdmin);
}
