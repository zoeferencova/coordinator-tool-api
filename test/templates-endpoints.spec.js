const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Templates Endpoints', function() {
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

    describe(`POST /api/templates`, () => {
        beforeEach('insert users', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                )
            )
        it(`creates a template, responding with 201 and the new template`, function() {
            const newTemplate = {
                template_name: 'Test Template',
                template_subject: 'Test Subject',
                template_content: 'Test Content',
            }
            
            return supertest(app)
                .post('/api/templates')
                .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                .send(newTemplate)
                .expect(201)
                .expect(res => {
                    expect(res.body.template_name).to.eql(newTemplate.template_name)
                    expect(res.body.template_subject).to.eql(newTemplate.template_subject)
                    expect(res.body.template_content).to.eql(newTemplate.template_content)
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_id).to.eql(testUsers[1].id)
                })
                
        })
        const requiredFields = ['template_name', 'template_subject', 'template_content']

        requiredFields.forEach(field => {
            const newTemplate = {
                template_name: 'Test Template',
                template_subject: 'Test Subject',
                template_content: 'Test Content',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newTemplate[field]

                return supertest(app)
                    .post('/api/templates')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .send(newTemplate)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })
})