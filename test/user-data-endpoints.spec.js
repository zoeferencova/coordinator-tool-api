const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('User Data Endpoints', function() {
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
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/user-data`, () => {
        context(`Given no user data`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 200, empty arrays for all user data, and the user information`, () => {
                const userData = testUsers[0]
                const expectedUserData = {...userData}
                delete expectedUserData.id;
                delete expectedUserData.password;
                const expected = [[], [], [], [], expectedUserData]
                return supertest(app)
                    .get('/api/user-data')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expected)
            })
        })

        context('Given there is user data in the database', () => {
            beforeEach('insert list items', () =>
            
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it('responds with 200 and all of the user data for the user', () => {
                const expectedListItems = helpers.makeExpectedListItems(testListItems, testUsers[0], testPms)
                const completedItems = testListItems.filter(item => item.user_id === testUsers[0].id && item.status === 'completed')
                const expectedCompletedItems = helpers.makeExpectedListItems(completedItems, testUsers[0], testPms)
                const expectedPms = testPms.filter(pm => pm.user_id === testUsers[0].id)
                const expectedTemplates = testTemplates.filter(template => template.user_id === testUsers[0].id)
                const expectedUserData = {...testUsers[0]}
                delete expectedUserData.id;
                delete expectedUserData.password;

                const expected = [expectedListItems, expectedPms, expectedTemplates, expectedCompletedItems, expectedUserData]

                return supertest(app)
                    .get('/api/user-data')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expected)
            })
        })

    })
})