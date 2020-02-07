const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Templates Endpoints', function() {
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

    describe(`GET /api/templates`, () => {
        context(`Given no templates`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/templates')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            })
        })

        context('Given there are templates in the database', () => {
            beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it('responds with 200 and all of the templates for the user', () => {
                const expectedTemplates = testTemplates.filter(template => template.user_id === testUsers[1].id)
                return supertest(app)
                    .get('/api/templates')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(200, expectedTemplates)
            })
        })
    })
})