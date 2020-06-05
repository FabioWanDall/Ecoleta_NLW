import Knex from 'knex'

export async function seed(knex: Knex) {
    await knex('items').insert([
        { name: 'Lâmpada', image: 'lampadas.svg'},
        { name: 'Pilhas e Baterias', image: 'baterias.svg'},
        { name: 'Papéis e papelão', image: 'papeis-papelao.svg'},
        { name: 'Residuos Eletrônicos', image: 'eletronicos.svg'},
        { name: 'Óleo de Cozinha', image: 'oleo.svg'},
        { name: 'Residuos Organicos', image: 'organicos.svg'},
    ]);
}