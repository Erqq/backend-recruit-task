const { tables } = require('../constants');
exports.up = knex => {
    return knex.schema.table(tables.USER_TABLE, table => {
        table.string('password').defaultTo('change password').notNullable()
    })

    
}

exports.down= knex => {
    return knex.schema.table(tables.USER_TABLE, table => {
        table.dropColumn('password')
    })
}