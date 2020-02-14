const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('PMs Endpoints', function() {
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

    describe(`GET /api/pms`, () => {
        context(`Given no pms`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/pms')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            })
        })

        context('Given there are PMs in the database', () => {
            beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it('responds with 200 and all of the PMs for the user', () => {
                const expectedPms = testPms.filter(pm => pm.user_id === testUsers[1].id)
                return supertest(app)
                    .get('/api/pms')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(200, expectedPms)
            })
        })
    })

    describe(`POST /api/pms`, () => {
        beforeEach('insert users', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )
        it(`creates a pm, responding with 201 and the new pm`, function() {
            const newPm = {
                pm_name: 'Test PM',
                pm_email: 'test@pm.com',
            }
            
            return supertest(app)
                .post('/api/pms')
                .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                .send(newPm)
                .expect(201)
                .expect(res => {
                    expect(res.body.pm_name).to.eql(newPm.pm_name)
                    expect(res.body.pm_email).to.eql(newPm.pm_email)
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_id).to.eql(testUsers[1].id)
                })
                
        })
        const requiredFields = ['pm_name', 'pm_email']

        requiredFields.forEach(field => {
            const newPm = {
                pm_name: 'Test PM',
                pm_email: 'test@pm.com',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newPm[field]

                return supertest(app)
                    .post('/api/pms')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .send(newPm)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe(`DELETE /pm/:id`, () => {
        context('Given no PMs', () => {
            it('responds with 404', () => {
                const pmId = 12345;
                return supertest(app)
                    .delete(`/api/pms/${pmId}`)
                    .expect(404, { error: { message: `PM doesn't exist` } })
            })
        })
        context(`Given there are PMs in the database`, () => {
            beforeEach('insert items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it(`responds with 204 and removes the PM`, () => {
                const idToRemove = 2;
                const filteredPms = testPms.filter(pm => pm.id !== idToRemove)
                const expectedPms = helpers.makeExpectedPms(testUsers[1].id, filteredPms)
                return supertest(app)
                    .delete(`/api/pms/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/pms')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                            .expect(200, expectedPms)
                    })
            })
        })

        
    })


})