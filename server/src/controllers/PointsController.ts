import {Request, Response} from 'express'
import knex from '../Database/connection'

class PointsController {

    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;

        console.log(city, uf, items);

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        
        const serializedPoints = points.map(point => {
            return { ...point, image_url: `http://192.168.0.4:3333/uploads/points/${point.image}`}
        });

        return response.json(serializedPoints);
    }
    
    async show (request: Request, response: Response) {
        const { id } = request.params; // id = request.params.id

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({ message: 'Point not found.'});
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', point.id)
            .select('name');

        const serializedPoint = {
            ...point, 
            image_url: `http://192.168.0.4:3333/uploads/points/${point.image}`
        }

        return response.json({ point: serializedPoint, items });
    }

    async create (request: Request, response: Response) { 
        //notação para popular todas as variaveis de uma só vez
        const {
            nome,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = request.body;
    
        //Se der pau em qualquer query, rollback em todas
        const trx = await knex.transaction(); 

        const point = {
            image: request.file.filename,
            nome,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        };
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map( (item: string) => Number(item.trim()) )
            .map( (item_id: number) => {
            return {
                item_id, 
                point_id
            };
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ... point
        });
    }
}

export default PointsController;