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
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/list')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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

            it('responds with 200 and all of the list items for the user that do not have the status completed', () => {
                const expectedListItems = helpers.makeExpectedListItems(testListItems, testUsers[1], testPms)
                return supertest(app)
                    .get('/api/list')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(200, expectedListItems)
            })
        })
    })
    describe.only(`POST /list`, () => {
        beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )
        it(`creates a list item, responding with 201 and the new item`, function() {
            const newItem = {
                project: 'New Project',
                advisor: 'New Advisor',
                pm_id: 1,
                notes: 'Notes'
            }

            const foundPm = testPms.find(pm => pm.id === newItem.pm_id)
            
            return supertest(app)
                .post('/api/list')
                .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.project).to.eql(newItem.project)
                    expect(res.body.advisor).to.eql(newItem.advisor)
                    expect(res.body.pm_name).to.eql(foundPm.pm_name)
                    expect(res.body.pm_email).to.eql(foundPm.pm_email)
                    expect(res.body.notes).to.eql(newItem.notes)
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('date_created')
                })
                
        })
        const requiredFields = ['project', 'advisor', 'pm_id']

        requiredFields.forEach(field => {
            const newItem = {
                project: 'New Project',
                advisor: 'New Advisor',
                pm_id: 1,
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newItem[field]

                return supertest(app)
                    .post('/api/list')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .send(newItem)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })
})