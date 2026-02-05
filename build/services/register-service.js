"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminService = exports.registerUserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const server_1 = require("../server");
const cpf_validation_1 = require("../utils/cpf-validation");
const registerUserService = async (data) => {
    try {
        const cleanCpf = data.cpf.replace(/\D/g, '');
        if (!(0, cpf_validation_1.cpfValidation)(cleanCpf)) {
            throw new Error("Cpf inválido");
        }
        const existingCpf = await server_1.prisma.users.findUnique({
            where: { cpf: cleanCpf }
        });
        if (existingCpf) {
            throw new Error("CPF já cadastrado");
        }
        const passwordHashed = await bcrypt.hash(data.password, 10);
        const user = await server_1.prisma.users.create({
            data: {
                cpf: data.cpf,
                name: data.name,
                phone: data.phone,
                password_hash: passwordHashed,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw new Error("Erro ao registrar usuário");
    }
};
exports.registerUserService = registerUserService;
const registerAdminService = async (data) => {
    try {
        const cleanCpf = data.cpf.replace(/\D/g, '');
        if (!(0, cpf_validation_1.cpfValidation)(cleanCpf)) {
            throw new Error("Cpf inválido");
        }
        const existingCpf = await server_1.prisma.users.findUnique({
            where: { cpf: cleanCpf }
        });
        if (existingCpf) {
            throw new Error("CPF já cadastrado");
        }
        const passwordHashed = await bcrypt.hash(data.password, 10);
        const admin = await server_1.prisma.users.create({
            data: {
                cpf: data.cpf,
                password_hash: passwordHashed,
                phone: data.phone,
                Admin: true,
            },
        });
        return admin;
    }
    catch (error) {
        console.error("Erro ao registrar admin:", error);
        throw new Error("Erro ao registrar admin");
    }
};
exports.registerAdminService = registerAdminService;
