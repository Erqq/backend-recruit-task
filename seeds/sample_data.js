const {USER_TABLE, TODO_TABLE,TODOLIST_TABLE} = require('./../constants/tables')

const TODO_LIST = [
  {
    title: "Buy bread"
  }, {
    title: "Pay rent"
  }, {
    title: "Take the dog for a walk"
  }
];

const TODOLIST_LIST = [
  {
    name: "Pentti's list"
  }, {
    name: "Milla's list"
  }, {
    name: "Kaija's list"
  }
];

const USER_LIST = [
  {
    username: "pentti",
    name: "Pentti",
    lastName: "Placeholder"
  }, {
    username: "milla",
    name: "Milla",
    lastName: "Mallikas"
  }, {
    username: "kaija",
    name: "Kaija",
    lastName: "Koodari"
  }
];

exports.seed = async function (knex) {
  await knex(USER_TABLE).insert(USER_LIST);
  const users = await knex(USER_TABLE).select('*')

  users.map((user, index)=>{
    TODOLIST_LIST[index].userId = user.id 
    
  })

  await knex(TODOLIST_TABLE).insert(TODOLIST_LIST)
  const lists = await knex(TODOLIST_TABLE).select('*')
  
  const promises = lists.map( (list, index)=> {

    const userTodos = TODO_LIST.map(baseItem => {

      const userTodoDetails = {
        todolistId: list.id,
        description: `${users[index].name} remember: ${baseItem.title}`
      }
      return Object.assign(userTodoDetails, baseItem)
    })
    return knex(TODO_TABLE).insert(userTodos)
  });
  await Promise.all(promises)
  console.log('seed done')
};
