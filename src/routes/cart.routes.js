import { Router } from 'express'
import crypto from 'crypto'
import {__dirname} from '../path.js'
import { promises as fs } from 'fs'
import path from 'path'

const cartRouter = Router()
const cartsPath = path.resolve(__dirname, '../src/db/carritos.json')
const cartsData = await fs.readFile(cartsPath, 'utf-8')
const carts = JSON.parse(cartsData)

cartRouter.get('/:cid', (req,res)=>{
    const idCart = req.params.cid
    const cart = carts.find(cart => cart.id == idCart)
    if (cart) {
        res.status(200).send(cart.products)
    } else {
        res.status(404).send({message : "El carrito no existe"})
    }
})
// Crear un nuevo carrito
cartRouter.post('/', async(req,res) =>{
    const newCart = {
        id: crypto.randomBytes(5).toString('hex'),
        products: []
    }
    carts.push(newCart)
    await fs.writeFile(cartsPath, JSON.stringify(carts))
    res.status(200).send(`Carrito creado correctamente con el id ${newCart.id}`)
})

cartRouter.post('/:cid/products/:pid', async (req,res)=>{
    const idCart = req.params.cid
    const idProduct = req.params.pid
    const {quantity} = req.body
    const cart = carts.find(cart => cart.id == idCart)
    if (cart) {
        const indice = cart.products.findIndex(prod => prod.id == idProduct)
        if (indice != -1) { // Si el producto existe, piso con la nueva cantidad
            cart.products[indice].quantity = quantity
        } else {
            cart.products.push({id: idProduct, quantity: quantity})
        }
        await fs.writeFile(cartsPath, JSON.stringify(carts))
        res.status(200).send('Carrito actualizado correctamente')
    } else {
        res.status(404).send({message : "El carrito no existe"})
    }
})

export default cartRouter