const { tables } = require('../constants');
exports.up = knex => {
    return knex.schema.createTable(tables.TODOLIST_TABLE, table => {
        table.increments('id').primary();
        table.string('name');  
        table.bigInteger('createdAt').notNullable().defaultTo(knex.fn.now());
        table.bigInteger('updatedAt').notNullable().defaultTo(knex.fn.now());
        table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    })
    .table(tables.TODO_TABLE, table => {
        table.renameColumn('userId', 'todolistId')
    })
    

    
}

exports.down= knex => {
    return knex.schema.table(tables.TODOLIST_TABLE, table => {
        table.dropTableIfExists(tables.TODOLIST_TABLE)

    }) .table(tables.TODO_TABLE, table => {
        table.renameColumn('todolistId', 'userId')
    })
}