"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalRoutes;
const register_adm_controller_1 = require("../controllers/register-adm-controller");
const register_controller_1 = require("../controllers/register-controller");
const login_controller_1 = require("../controllers/login-controller");
const solicitacoes_controller_1 = require("../controllers/solicitacoes-controller");
const pdfController_1 = require("../controllers/pdfController");
const orders_list_controller_1 = require("../controllers/orders-list-controller");
const orders_list_controller_2 = require("../controllers/orders-list-controller");
const login_admin_controller_1 = require("../controllers/login-admin-controller");
const logout_controller_1 = require("../controllers/logout-controller");
const me_controller_1 = require("../controllers/me-controller");
async function GlobalRoutes(app) {
    app.get("/me", me_controller_1.me);
    app.post("/registro", register_controller_1.register);
    app.post("/login", login_controller_1.login);
    app.post("/login-admin", login_admin_controller_1.loginAdmin);
    app.post("/logout", logout_controller_1.logout);
    app.post("/novaSolicitacao", solicitacoes_controller_1.CreateRequests);
    app.get("/minhas-solicitacoes", solicitacoes_controller_1.ListRequests);
    app.post("/registro-admin", { preHandler: [app.verifyAdmin] }, register_adm_controller_1.registerAdmin);
    app.get("/gerarPdfSolicitacoes", { preHandler: [app.verifyAdmin] }, pdfController_1.generateRequestsPdf);
    app.get("/solicitarOrdens", { preHandler: [app.verifyAdmin] }, orders_list_controller_2.requestOrdersInfo);
    app.post("/cancelarOrdem", { preHandler: [app.verifyAdmin] }, orders_list_controller_1.cancelOrder);
    app.post("/alterarStatusOrdem", { preHandler: [app.verifyAdmin] }, orders_list_controller_1.changeStatusOrder);
}
