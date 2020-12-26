require('dotenv').config()
const { expect } = require("chai")
const knex = require('knex')
const ArticlesService = require('../src/articles-service')

describe(`Articles service object`, function() {
    let db
    let testArticles = [
        {
            title: 'First test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        }, 
        {
            title: 'Second test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        }, 
        {
            title: 'Third test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        } 
    ]
    
    before(() => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
    })

    before(() => {
        return db
            .into('blogful_articles')
            .insert(testArticles)
        })

    after(() => db.destroy())

    describe(`getAllArticles()`, () => {
        it(`resolves all articles from 'blogful_articles' table`, () => {
            //test that ArticlesService.getAllArticles gets data from table
            return ArticlesService.getAllArticles()
                .then(actual => {
                    expect(actual).to.eql(testArticles)
                })
        })
    })
})