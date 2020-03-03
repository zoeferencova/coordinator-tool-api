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
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));
    
    describe(`POST /list`, () => {
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
                project_url: 'http://www.projecturltest.com',
                contact: 'New Contact',
                contact_url: 'http://www.contacturltest.com',
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
                    expect(res.body.project_url).to.eql(newItem.project_url)
                    expect(res.body.contact).to.eql(newItem.contact)
                    expect(res.body.contact_url).to.eql(newItem.contact_url)
                    expect(res.body.pm_name).to.eql(foundPm.pm_name)
                    expect(res.body.pm_email).to.eql(foundPm.pm_email)
                    expect(res.body.notes).to.eql(newItem.notes)
                    expect(res.body).to.have.property('id')
                    const expected = new Date(res.body.date_published)
                    const actual = new Date(res.body.date_published)
                    expect(expected).to.eql(actual)
                })
                
        })
        const requiredFields = ['project', 'contact', 'pm_id']

        requiredFields.forEach(field => {
            const newItem = {
                project: 'New Project',
                contact: 'New Contact',
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

    describe(`DELETE /list/:id`, () => {
        context('Given no list items', () => {
            it('responds with 404', () => {
                const itemId = 12345;
                return supertest(app)
                    .delete(`/api/list/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
            })
        })
        context(`Given there are list items in the database`, () => {
            beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                    testListItems,
                    testTemplates
                )
            )

            it(`responds with 204 and removes the list item`, () => {
                const idToRemove = 1;
                const filteredItems = testListItems.filter(item => item.id !== idToRemove)
                const expectedListItems = helpers.makeExpectedListItems(filteredItems, testUsers[0], testPms)
                const completedItems = testListItems.filter(item => item.user_id === testUsers[0].id && item.status === 'completed')
                const expectedCompletedItems = helpers.makeExpectedListItems(completedItems, testUsers[0], testPms)
                const expectedPms = testPms.filter(pm => pm.user_id === testUsers[0].id)
                const expectedTemplates = testTemplates.filter(template => template.user_id === testUsers[0].id)
                const expectedUserData = {...testUsers[0]}
                delete expectedUserData.id;
                delete expectedUserData.password;

                const expected = [expectedListItems, expectedPms, expectedTemplates, expectedCompletedItems, expectedUserData]

                return supertest(app)
                    .delete(`/api/list/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/user-data')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(200, expected)
                    })
            })
        })

        
    })

    describe(`PATCH /api/list/:id`, () => {
        context(`Given no articles`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456;
                return supertest(app)
                    .patch(`/api/list/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
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
            

            it(`responds with 204 and updates the item`, () => {
                const idToUpdate = 3;
                const updateItem = {
                    project: 'Updated Project',
                    contact: 'Updated Contact',
                    pm_id: 2,
                    status: 'none'
                }

                const formattedItem = helpers.makeExpectedListItem(testListItems[idToUpdate - 1], testPms)

                const expectedItem = {
                    ...formattedItem,
                    ...updateItem
                }

                delete expectedItem.pm_id;
                delete expectedItem.user_id;

                return supertest(app)
                    .patch(`/api/list/${idToUpdate}`)
                    .send(updateItem)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/list/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })

            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/api/list/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Missing 'project' in request body`
                        }
                    })
            })
        })
    })
})