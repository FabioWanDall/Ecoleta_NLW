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

        return response.json(points);
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

        return response.json({ point, items });
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
            image: 'https://images.unsplash.com/photo-1477141970786-c4258cdd87ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
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
    
        const pointItems = items.map( (item_id: number) => {
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