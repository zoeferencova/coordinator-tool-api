const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
        id: 1,
        full_name: 'Test user 1',
        email: 'testuser1@gmail.com',
        password: 'password',
    },
    {
        id: 2,
        full_name: 'Test user 2',
        email: 'testuser2@gmail.com',
        password: 'password',
    },
    {
        id: 3,
        full_name: 'Test user 3',
        email: 'testuser3@gmail.com',
        password: 'password',
    },
    {
        id: 4,
        full_name: 'Test user 4',
        email: 'testuser4@gmail.com',
        password: 'password',
    },
  ]
}

function makeListItemsArray(users, pms) {
  return [
    {
        id: 1,
        user_id: users[0].id,
        status: 'completed',
        project: 'First test project',
        advisor: 'Test Advisor',
        pm_id: pms[0].id,
        date: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 2,
        user_id: users[1].id,
        status: 'none',
        project: 'Second test project',
        advisor: 'Test Advisor',
        pm_id: pms[1].id,
        date: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 3,
        user_id: users[2].id,
        status: 'reached',
        project: 'Third test project',
        advisor: 'Test Advisor',
        pm_id: pms[2].id,
        date: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 4,
        user_id: users[3].id,
        status: 'completed',
        project: 'Fourth test project',
        advisor: 'Test Advisor',
        pm_id: pms[3].id,
        date: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
  ]
}

function makeTemplatesArray(users) {
  return [
    {
        id: 1,
        user_id: users[0].id,
        template_name: 'First test template!',
        template_subject: 'Template Subject',
        template_content: 'Hello, this is a test template. Thanks. Best, Zoe',
    },
    {
        id: 2,
        user_id: users[1].id,
        template_name: 'Second test template!',
        template_subject: 'Template Subject',
        template_content: 'Hello, this is a test template. Thanks. Best, Zoe',
    },
    {
        id: 3,
        user_id: users[2].id,
        template_name: 'Third test template!',
        template_subject: 'Template Subject',
        template_content: 'Hello, this is a test template. Thanks. Best, Zoe',
    },
    {
        id: 4,
        user_id: users[3].id,
        template_name: 'Fourth test template!',
        template_subject: 'Template Subject',
        template_content: 'Hello, this is a test template. Thanks. Best, Zoe',
    },
  ];
}

function makePmsArray(users) {
    return [
      {
        id: 1,
        user_id: users[0].id,
        pm_name: 'Test PM',
        pm_email: 'test@gmail.com',
      },
      {
        id: 2,
        user_id: users[1].id,
        pm_name: 'Test PM',
        pm_email: 'test@gmail.com',
      },
      {
        id: 3,
        user_id: users[2].id,
        pm_name: 'Test PM',
        pm_email: 'test@gmail.com',
      },
      {
        id: 4,
        user_id: users[3].id,
        pm_name: 'Test PM',
        pm_email: 'test@gmail.com',
      },
    ];
  }

function makeExpectedListItem(users, list_item, pms) {
  const user = users
    .find(user => user.id === list_item.user_id)

  const pm = pms
    .find(pm => pm.id === list_item.pm_id)

  return {
    id: list_item.id,
    user_id: user.id,
    status: list_item.status,
    project: list_item.project,
    advisor: list_item.advisor,
    pm: pm.pm_name,
    date: list_item.date.toISOString(),
    notes: list_item.notes,
  }
}

function makeExpectedTemplate(users, template) {
  const user = users
    .find(user => user.id === template.user_id)

    return {
        id: template.id,
        user_id: user.id,
        template_name: template.template_name,
        template_subject: template.template_subject,
        template_content: template.template_content,
    }
}

function makeMaliciousListItem(user, pm) {
  const maliciousListItem = {
    id: 911,
    user_id: user.id,
    status: 'none',
    project: 'Malicious project <script>alert("xss");</script>',
    advisor: 'Bad advisor',
    pm: pm.name,
    date: new Date(),
    notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">.`,
  }
  const expectedListItem = {
    ...makeExpectedListItem([user], [pm], maliciousListItem),
    title: 'Malicious project &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">.`,
  }
  return {
    maliciousListItem,
    expectedListItem,
  }
}

function makeMaliciousTemplate(user) {
    const maliciousTemplate = {
      id: 911,
      user_id: user.id,
      template_name: 'Bad template',
      template_subject: 'Malicious template <script>alert("xss");</script>',
      template_content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">.`,
    }
    const expectedTemplate = {
      ...makeExpectedTemplate([user], maliciousTemplate),
      title: 'Malicious template &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">.`,
    }
    return {
      maliciousTemplate,
      expectedTemplate,
    }
  }

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testPms = makePmsArray(testUsers)
  const testTemplates = makeTemplatesArray(testUsers)
  const testListItems = makeListItemsArray(testUsers, testPms)
  
  return { testUsers, testPms, testTemplates, testListItems }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        coordinator_list_items,
        coordinator_pms,
        coordinator_templates,
        coordinator_users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE coordinator_list_items_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE coordinator_pms_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE coordinator_templates_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE coordinator_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('coordinator_list_items_id_seq', 0)`),
        trx.raw(`SELECT setval('coordinator_pms_id_seq', 0)`),
        trx.raw(`SELECT setval('coordinator_templates_id_seq', 0)`),
        trx.raw(`SELECT setval('coordinator_users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('coordinator_users').insert(preppedUsers)
    .then(() => 
      db.raw(
        `SELECT setval('coordinator_users_id_seq', ?)`, 
        [users[users.length - 1].id],
      )
    )
}

function seedTables(db, users, list_items, pms, templates) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('coordinator_list_items').insert(list_items)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('coordinator_list_items_id_seq', ?)`,
      [list_items[list_items.length - 1].id]
    )
    // only insert comments if there are some, also update the sequence counter
    await trx.into('coordinator_pms').insert(pms)
    await trx.raw(
    `SELECT setval('coordinator_pms_id_seq', ?)`,
    [pms[pms.length - 1].id],
    )

    await trx.into('coordinator_templates').insert(templates)
    await trx.raw(
    `SELECT setval('coordinator_templates_id_seq', ?)`,
    [templates[templates.length - 1].id],
    )
  })
}

function seedMaliciousListItem(db, user, list_item) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('coordinator_list_items')
        .insert([list_item])
    )
}

function seedMaliciousTemplate(db, user, template) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('coordinator_templates')
          .insert([template])
      )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeListItemsArray,
  makeTemplatesArray,
  makePmsArray,
  makeMaliciousArticle,
  makeMaliciousTemplate,

  makeFixtures,
  cleanTables,
  seedTables,
  seedMaliciousListItem,
  seedMaliciousTemplate,
  makeAuthHeader,
  seedUsers,
}
