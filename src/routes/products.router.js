import { Router } from 'express'
import  crypto  from 'crypto'
import {__dirname} from '../path.js'
import { promises as fs } from 'fs'
import path from 'path'

const productRouter = Router()
const productosPath = path.resolve(__dirname, '../src/db/productos.json')
const productosData = await fs.readFile(productosPath, 'utf-8')
const products = JSON.parse(productosData)

productRouter.get('/', (req,res) => {
    const { limit } = req.query
    const productos = products.slice(0, limit)
    res.status(200).send(productos)
})

productRouter.get('/:pid', (req,res)=>{
    const idProduct = req.params.pid
    const product = products.find(prod => prod.id == idProduct)
    if (product) {
        res.status(200).send(product)
    } else {
        res.status(404).send({message : "El producto no existe"})
    }
})
// Crear un producto nuevo
productRouter.post('/', async (req,res)=>{
    const {title, description, code, price, stock, category} = req.body
    const newProduct = {
        id: crypto.randomBytes(10).toString('hex'),
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category,
        status: true,
        thumbnails: []
    }
    products.push(newProduct)
    await fs.writeFile(productosPath, JSON.stringify(products))
    res.status(201).send({message: `Producto creado correctamente con el id: ${newProduct.id}`})
})

productRouter.put('/:pid', async (req,res)=>{
    const idProduct = req.params.pid
    const {title, description, code, price, stock, category, thumbnails, status} = req.body
    const indice = products.findIndex(prod => prod.id == idProduct)
    if(indice != -1) {
        products[indice].title = title
        products[indice].description = description
        products[indice].code = code
        products[indice].price = price 
        products[indice].stock = stock
        products[indice].category = category
        products[indice].status = true
        products[indice].thumbnails = []

        await fs.writeFile(productosPath, JSON.stringify(products))
        res.status(200).send({message: "Productos actualizado"})
    } else {
        res.status(404).send({message: "El producto no existe"})
    }
})

productRouter.delete('/:pid', async (req,res)=>{
    const idProduct = req.params.pid
    const indice = products.findIndex(prod => prod.id == idProduct)
    if(indice != -1){
        products.splice(indice, 1)
        await fs.writeFile(productosPath, JSON.stringify(products))
        res.status(200).send({message: 'Producto eliminado'})
    } else (
        res.status(404).send({message: "El producto no existe"})
    )
})

export default productRouter