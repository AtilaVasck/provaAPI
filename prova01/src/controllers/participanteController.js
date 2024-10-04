import conn from "../config/connectionDB.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

//helpers
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

export const registerParticipante = (request, response) => {
    const { nome, email } = request.body;
    if (!nome) {
        return response.status(400).json({ error: "O campo nome é obrigatório" });
    }
    if (!email) {
        return response.status(400).json({ error: "O campo email é obrigatório" });
    }
    const participante_id = uuidv4();
    const insertSql = `INSERT INTO participante (participante_id, nome, email) VALUES (?, ?, ?)`;
    conn.query(insertSql, [participante_id, nome, email ], (err) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ error: "Erro ao cadastrar participante" });
        }
        return response.status(201).json({ message: "participante cadastrado com sucesso!" });
    });
};

export const checkParticipante = async (request, response) => {

    let participanteAtual = null;

    if (request.headers.authorization) {
        const token = getToken(request);
        if (!token) {
            return response.status(401).json({ error: "Token não fornecido" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "SENHASUPERSEGURA");
            console.log(decoded);
            const participanteId = decoded.id;
            const selectSql = `SELECT nome, expertise FROM participante WHERE participante_id = ?`;
            const selectSqlData = [participanteId];
            conn.query(selectSql, selectSqlData, (err, data) => {
                if (err) {
                    console.error(err);
                    return response.status(500).json({ error: "Erro ao verificar Participante" });
                }
                if (data.length > 0) {
                    participanteAtual = data[0];
                    return response.status(200).json(participanteAtual);
                } else {
                    return response.status(404).json({ error: "participante não encontrado" });
                }
            });
        } catch (error) {
            console.error(error);
            return response.status(401).json({ error: "Token inválido ou expirado" });
        }
    } else {
        return response.status(401).json({ error: "Token de autenticação não fornecido" });
    }
};
//listar todos os eventos dos participantes
export const listarAllEventsParticipante = async ( request, response ) => {
    const id = request.params.id
    const palestranteId = /*sql*/` SELECT palestrante_id, nome, expertise FROM palestrante WHERE ?? = ?`
    const checkPalestranteId = ["palestrante_id", id];
    const eventoId = /*sql*/` SELECT evento_id, titulo, datas FROM evento WHERE ?? = ?`
    const checkEventoId = ["evento_id", id];
    const listaPalestrante = palestranteId += eventoId;
    conn.query(palestranteId, checkPalestranteId, eventoId, checkEventoId, (err, data) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ error: 'Erro ao buscar Palestrante' })
        }
        if (data.length === 0) {
            return response.status(404).json({ message: 'Palestrante não encontrado' })
        }

        const listaAll = listaPalestrante + data[0]
        response.status(200).json(...listaAll)
    })
};

export const participanteMaisAtivo = ( request, response ) => {

};