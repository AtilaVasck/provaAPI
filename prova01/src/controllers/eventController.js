import conn from "../config/connectionDB.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

//helpers
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import { request, response } from "express";

export const criarEvent = async ( request, response ) => {
    const { titulo, datas, palestrante_id } = request.body;
    const token = getToken(request);
    const palestrante = await getUserByToken(token);

    if (!titulo) {
        return response.status(400).json({ message: "O título do evento é obrigatório" });
    }
    if (!datas) {
        return response.status(400).json({ message: "A data do evento é obrigatória" });
    }
    if (!palestrante_id) {
        return response.status(400).json({ message: "O palestrante é obrigatório" });
    }

    const evento_id = uuidv4();
    const palestrantesId = palestrante.palestrante_id;

    const eventoSql = `INSERT INTO evento (evento_id, titulo, datas, palestrante_id) VALUES (?, ?, ?, ?)`;

    const eventoValues = [evento_id, titulo, datas, palestrantesId];

    conn.query(eventoSql, eventoValues, (err) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ message: "Erro ao adicionar evento" });
        }
        return response.status(201).json({ message: "Evento criado com sucesso!" });
    });
};

export const inscreverEvent = async ( request, response ) => {
    const { evento_id, participante_id } = request.body;

    if (!evento_id) {
        return response.status(400).json({ message: "O evento é obrigatório" });
    }
    if (!participante_id) {
        return response.status(400).json({ message: "O participante é obrigatório" });
    }

    const eventoSql = `SELECT * FROM evento WHERE evento_id = ?`;
    conn.query(eventoSql, [evento_id], (err, eventoData) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ err: "Erro ao verificar o evento" });
        }
        if (eventoData.length === 0) {
            return response.status(404).json({ message: "Evento não encontrado." });
        }

        const inscricaoSql = `SELECT * FROM inscricoes WHERE evento_id = ? AND participante_id = ?`;
        conn.query(inscricaoSql, [evento_id, participante_id], (err, inscricaoData) => {
            if (err) {
                console.error(err);
                return response.status(500).json({ err: "Erro ao verificar a inscrição" });
            }
            if (inscricaoData.length > 0) {
                return response.status(400).json({ message: "Participante já inscrito no evento." });
            }

            const inscreverSql = `INSERT INTO inscricoes (inscricao_id, evento_id, participante_id) VALUES (?, ?, ?)`;
            const inscricao_id = uuidv4();
            conn.query(inscreverSql, [inscricao_id, evento_id, participante_id], (err) => {
                if (err) {
                    console.error(err);
                    return response.status(500).json({ err: "Erro ao inscrever participante no evento" });
                }
                return response.status(201).json({ message: "Inscrição realizada com sucesso!" });
            });
        });
    });
};
export const agenda = ( request, response ) => {
    const id = request.params.id

    const eventoId = /*sql*/` SELECT evento_id, titulo, datas FROM evento WHERE ?? = ?`
    const checkEventoId = ["evento_id", id];

    conn.query(eventoId, checkEventoId, (err, data) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ error: 'Erro ao buscar evento' })
        }

        if (data.length === 0) {
            return response.status(404).json({ message: 'Evento não encontrado' })
        }

        const evento = data[0]
        response.status(200).json(evento)
    })
    const Id = request.params.id

    const palestranteId = /*sql*/` SELECT palestrante_id, nome, expertise FROM palestrante WHERE ?? = ?`
    const checkPalestranteId = ["Palestrante_id", Id];

    conn.query(palestranteId, checkPalestranteId, (err, data) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ error: 'Erro ao buscar palestrante' })
        }

        if (data.length === 0) {
            return response.status(404).json({ message: 'Palestrante não encontrado' })
        }

        const palestrante = data[0]
        response.status(200).json(palestrante)
    })
};

/*- **Rota para enviar feedback de um evento por um participante:**
    - POST `/eventos/feedback`
    - Dados: `{ "participanteId": 2, "eventoId": 1, "nota": 5, "comentario": "Excelente evento!" }` */
export const feedbackEvent = ( request, response ) => {

};
/*- **Rota para retornar o evento com mais participantes:**
    - GET `/eventos/mais-popular`*/
    export const popularEvent = ( request, response ) => {

};

/*- **Rota para editar os detalhes de um evento:**
    - PUT `/eventos/editar`
    - Dados: `{ "eventoId": 1, "titulo": "Novo Título", "data": "2024-08-20", "palestrantesId": [2] }` */
export const editarEvent = ( request, response ) => {
    const { id } = request.params
    const { titulo, datas, palestrante_id } = request.body

    if (!titulo) {
        return response.status(400).json({ message: "O nome é obrigatório." })
    }
    if (!datas) {
        return response.status(400).json({ message: "O email é obrigatório." })
    }
    if (!palestrante_id) {
        return response.status(400).json({ message: "O cargo é obrigatório." })
    }
    //1° verificar se evento existe
    const checkSql = /*sql*/` SELECT * FROM evento WHERE evento_id = "${id}"`
    connection.query(checkSql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "Erro ao procurar eventos" })
            return
        }
        if (data.length === 0) {
            response.status(404).json({ err: "Evento não encontrado" })
        }
        response.status(200).json({ message: "Evento atualizado com sucesso" })
    });
};

export const cancelarEvent = ( request, response ) => {
    const id = request.params.id
    const sql = /*sql*/`DELETE FROM evento WHERE evento_id = "${id}"`
    connection.query(sql, (err, info) => {
        if (err) {
            console.error(err);
            response.status(500).json({ err: "Erro ao deletar evento." })
            return
        }
        if (info.affectedRows) {
            response.status(404).json({ message: "Evento não encontrado" })
        }
        response.status(200).json({ message: "Evento deletado com sucesso" })
    })
};