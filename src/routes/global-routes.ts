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
import { logout } from "../controllers/logout-controller";
import { me } from "../controllers/me-controller";
import { RegisterAdminB } from "../interface/auth-interfaces";


export default async function GlobalRoutes(app: FastifyInstance) {
  app.get("/me", me)
  app.post("/registro", register);
  app.post("/login", login);
  app.post("/login-admin", loginAdmin);
  app.post("/logout", logout)
  
  app.post("/novaSolicitacao", CreateRequests);
  app.get("/minhas-solicitacoes", ListRequests);
  
  app.post<{Body: RegisterAdminB}>("/registro-admin", { preHandler: [app.verifyAdmin] }, registerAdmin);
  app.get("/gerarPdfSolicitacoes", { preHandler: [app.verifyAdmin] }, generateRequestsPdf);
  app.get("/solicitarOrdens",{ preHandler: [app.verifyAdmin] }, requestOrdersInfo);
  app.post("/cancelarOrdem", { preHandler: [app.verifyAdmin] }, cancelOrder);
  app.post("/alterarStatusOrdem", { preHandler: [app.verifyAdmin] }, changeStatusOrder)
}
