import {z} from 'zod'
import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'

export async function AppRoutes(server: FastifyInstance) {
    server.get('/mensagens', async () => {
        const mensagens = await prisma.mensagem.findMany()
        return mensagens
    })

    server.get('/mensagem/:id', async (request) => {
        const idParam = z.object({
            id: z.string().uuid()
        })
        const {id} = idParam.parse(request.params) 
        const mensagem = prisma.mensagem.findFirst({
            where: {
                id
            }
        })
        return mensagem
    })

    server.post('/mensagem', async (request) => {
        const mensagemBody = z.object({
            titulo: z.string(),
            conteudo: z.string(),
            publicado: z.boolean(),
            qtdeLikes: z.number(),
        })
        const {titulo, conteudo, publicado, qtdeLikes} = mensagemBody.parse(request.body) 
        const newmensagem = prisma.mensagem.create({
            data: {
                titulo: titulo,
                conteudo: conteudo,
                publicado: publicado,
                qtdeLikes: qtdeLikes,
                created_at: new Date()
            }
        })
        return newmensagem 
    })

    server.patch('/mensagem/like', async (request) => {
        const likeBody = z.object({
        id: z.string().uuid(),
        qtdeLikes: z.number()
        })
    const {id, qtdeLikes} = likeBody.parse(request.body)
 
    const mensagemUpdated = await prisma.mensagem.update({
        where: {
            id: id
        },
        data: {
            qtdeLikes: {
                increment: qtdeLikes
            }
        }
        })
        return mensagemUpdated
    })

    server.patch('/mensagem/dlike', async (request) => {
        const dlikeBody = z.object({
            id: z.string().uuid(),
            qtdeLikes: z.number()
        })
        const {id, qtdeLikes} = dlikeBody.parse(request.body)
        const resp = await prisma.mensagem.updateMany({
            where: {
                id: id, 
                qtdeLikes: {
                    gte: qtdeLikes 
                }
            },
            data: {
                qtdeLikes: {
                    decrement: qtdeLikes 
                }
            }
        })
        if (resp.count >= 1){
            let aux = {
                "status": "Diminui o número de likes"
            }
            return aux
        }
        else {
            let aux = {
                "status": "Quantidade de likes insuficiente"
            }
            return aux
        }
    })

    server.put('/mensagem/id/:id', async (request) => {
        const idParam = z.object({
            id: z.string().uuid()
        })
        const putBody = z.object ({
            titulo: z.string (),
            conteudo: z.string(),
            publicado: z.boolean(),
            qtdeLikes: z.number()            
        })
        const {id} = idParam.parse(request.params)
        const {titulo, conteudo, qtdeLikes, publicado} = putBody.parse(request.body)
        const mensagemUpdated = await prisma.mensagem.update({ 
            where: {
                id: id
            },
            data: {
                titulo,
                conteudo,
                publicado,
                qtdeLikes                
            }
        })
        return mensagemUpdated
    })
    //deletar
    server.delete('/mensagem/id/:id', async (request) => {
        const idParam = z.object({
            id: z.string().uuid()
        })
        const {id} = idParam.parse(request.params)
        const mensagemRemoved = await prisma.mensagem.delete({
            where: {
                id
            }
        })
        return mensagemRemoved
    })
}