const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('List Items Endpoints', function() {
    let db;

    const {
        testUsers,
        testPms,
        testListItems,
        testTemplates
    } = helpers.makeFixtures();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/list`, () => {
        context(`Given no list items`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/list')
                    .expect(200, [])
            })
        })

        context('Given there are list items in the database', () => {
            beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it('responds with 200 and all of the list items', () => {
                const expectedListItems = testListItems.map(item =>
                    helpers.makeExpectedListItem(
                        testUsers,
                        item,
                        testPms
                    )
                )
                return supertest(app)
                    .get('/api/list')
                    .expect(200, expectedListItems)
            })
        })
    })
})