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

    describe(`DELETE /api/templates/:id`, () => {
        context('Given no templates', () => {
            it('responds with 404', () => {
                const templateId = 12345;
                return supertest(app)
                    .delete(`/api/templates/${templateId}`)
                    .expect(404, { error: { message: `Template doesn't exist` } })
            })
        })
        context(`Given there are templates in the database`, () => {
            beforeEach('insert table info', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it(`responds with 204 and removes the list item`, () => {
                const idToRemove = 3;
                const filteredTemplates = testTemplates.filter(template => template.id !== idToRemove)
                const expectedTemplates = helpers.makeExpectedTemplates(testUsers[2].id, filteredTemplates)
                console.log(filteredTemplates)
                return supertest(app)
                    .delete(`/api/templates/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/templates')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                            .expect(200, expectedTemplates)
                    })
            })
        })

        
    })

    describe(`PATCH /api/templates/:id`, () => {
        context(`Given no templates`, () => {
            it(`responds with 404`, () => {
                const templateId = 123456;
                return supertest(app)
                    .patch(`/api/templates/${templateId}`)
                    .expect(404, { error: { message: `Template doesn't exist` } })
            })
        })

        context('Given there are templates in the database', () => {
            beforeEach('insert templates', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it(`responds with 204 and updates the template`, () => {
                const idToUpdate = 3;
                const updateTemplate = {
                    template_name: 'Updated Name',
                    template_subject: 'Updated Subject',
                    template_content: 'Updated Content',
                }

                const formattedTemplate = helpers.makeExpectedTemplate(testTemplates[idToUpdate - 1], testUsers[2].id)

                const expectedTemplate = {
                    ...formattedTemplate,
                    ...updateTemplate
                }

                return supertest(app)
                    .patch(`/api/templates/${idToUpdate}`)
                    .send(updateTemplate)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/templates/${idToUpdate}`)
                            .expect(expectedTemplate)    
                    )
            })

            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/api/templates/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'template_name', 'template_subject' or 'template_content'`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 3;
                const updateTemplate = {
                    template_name: 'Updated Template Name'
                }
                const formattedTemplate = helpers.makeExpectedTemplate(testTemplates[idToUpdate - 1], testUsers[2].id)

                const expectedTemplate = {
                    ...formattedTemplate,
                    ...updateTemplate
                }

                return supertest(app)
                    .patch(`/api/templates/${idToUpdate}`)
                    .send({
                        ...updateTemplate,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/templates/${idToUpdate}`)
                            .expect(expectedTemplate)    
                    )
            })
        })
    })
})