require('dotenv').config()
const { expect } = require("chai")
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service Object`, function() {
    let db
    let testList = [
        {
            product_id: 1,
            name: 'Chia Seed Chips',
            price: '3.99',
            category: 'Snack',
            checked: false,
            date_added: new Date(),
        },
        {
            product_id: 2,
            name: 'Frozen Pineapple Pizza',
            price: '4.99',
            category: 'Main',
            checked: false,
            date_added: new Date(),
        },
        {
            product_id: 3,
            name: 'Maplewood Smoked Turkey',
            price: '8.99',
            category: 'Lunch',
            checked: false,
            date_added: new Date(),
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())
    
    context(`Given 'shopping_list' has data`, () =>{
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testList)
        })

        it(`getAllItems() resolves all items from 'shopping_list table`, () =>{
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testList)
                })
        })

        it(`getById() resovles an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItemIndex = testList[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: thirdId,
                        name: thirdTestItemIndex.name,
                        price: thirdTestItemIndex.price,
                        category: thirdTestItemIndex.category,
                        checked: thirdTestItemIndex.checked,
                        date_added: thirdTestItemIndex.date_added
                    })
                })
        })

        it(`deleteItem() removes an item from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testList.filter(item => item.product_id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'Updated Name',
                price: '99.99',
                category: 'Main',
                checked: false,
                date_added: new Date(),
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        product_id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
        })

    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
            const newItem = {
                name: 'Test new Name',
                price: '9.99',
                category: 'Lunch',
                checked: false,
                date_added: new Date()
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        checked: false,
                        date_added: newItem.date_added
                    })
                })
        })
    })

})