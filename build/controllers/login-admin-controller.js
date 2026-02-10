"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const login_service_1 = require("../services/login-service");
const loginAdmin = async (request, reply) => {
    try {
        const token = await (0, login_service_1.loginAdminService)(reply.server, request.body);
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 60 * 60 * 1000,
            domain: ".seinfra.com.br",
            sameSite: "none",
            path: "/"
        }).send({ success: true });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro no login";
        reply.code(401).send({ error: message });
    }
};
exports.loginAdmin = loginAdmin;
