"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const logout = async (request, reply) => {
    reply.clearCookie("token", {
        path: "/",
        domain: ".seinfra.com.br",
    });
    return reply.send({ success: true });
};
exports.logout = logout;
