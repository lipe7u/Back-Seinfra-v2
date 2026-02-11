"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = void 0;
const me = async (request, reply) => {
    return reply.send({ logged: true, user: request.user });
};
exports.me = me;
