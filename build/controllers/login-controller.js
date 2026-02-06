"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const login_service_1 = require("../services/login-service");
const login = async (request, reply) => {
    try {
        const token = await (0, login_service_1.loginUserService)(reply.server, request.body);
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "none",
            path: "/"
        }).send({ success: true });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro de login de usuário";
        reply.code(401).send({ error: errorMessage });
    }
};
exports.login = login;
