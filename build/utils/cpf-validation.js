"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cpfValidation = cpfValidation;
function cpfValidation(cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(cleanCpf))
        return false;
    let sum = 0;
    let rest;
    for (let i = 0; i < 9; i++) {
        sum += Number(cleanCpf[i]) * (10 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11)
        rest = 0;
    if (rest !== Number(cleanCpf[9]))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += Number(cleanCpf[i]) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11)
        rest = 0;
    if (rest !== Number(cleanCpf[10]))
        return false;
    return true;
}
