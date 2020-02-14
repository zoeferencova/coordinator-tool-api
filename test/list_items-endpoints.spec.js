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

        context(`Given an XSS attack article`, () => {
            beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                )
            )
            const maliciousListItem = {
                id: 911,
                user_id: testUsers[0].id,
                status: 'none',
                project: 'Malicious project <script>alert("xss");</script>',
                advisor: 'Bad advisor',
                pm_id: testPms[0].id,
                date_created: new Date(),
                notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">.`,
            }

            beforeEach('insert malicious item', () => {
                return db
                    .into('coordinator_list_items')
                    .insert(maliciousListItem)
            })

            const expectedListItem = helpers.makeExpectedListItem(maliciousListItem, testPms)
            expectedListItem.title = 'Malicious project &lt;script&gt;alert(\"xss\");&lt;/script&gt;';
            expectedListItem.notes = `Bad image <img src="https://url.to.file.which/does-not.exist">.`;
            
            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/list`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => res.body).to.eql(expectedListItem)
            })
        })
    })
    describe(`POST /list`, () => {
        beforeEach('insert list items', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPms,
                )
            )
        it(`creates a list item, responding with 201 and the new item`, function() {
            const newItem = {
                project: 'New Project',
                project_url: 'http://www.projecturltest.com',
                advisor: 'New Advisor',
                advisor_url: 'http://www.advisorurltest.com',
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
                    expect(res.body.advisor).to.eql(newItem.advisor)
                    expect(res.body.advisor_url).to.eql(newItem.advisor_url)
                    expect(res.body.pm_name).to.eql(foundPm.pm_name)
                    expect(res.body.pm_email).to.eql(foundPm.pm_email)
                    expect(res.body.notes).to.eql(newItem.notes)
                    expect(res.body).to.have.property('id')
                    const expected = new Date(res.body.date_published)
                    const actual = new Date(res.body.date_published)
                    expect(expected).to.eql(actual)
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
                const expectedListItems = helpers.makeExpectedListItems(filteredItems, testUsers[1], testPms)
                return supertest(app)
                    .delete(`/api/list/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/list')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                            .expect(200, expectedListItems)
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
                    advisor: 'Updated Advisor',
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

            it.skip(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/api/list/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'project', 'advisor', 'pm_id', 'notes' or 'status'`
                        }
                    })
            })

            it.skip(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 3;
                const updateItem = {
                    project: 'Updated Project Name'
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
                    .send({
                        ...updateItem,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/list/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })
        })
    })
})