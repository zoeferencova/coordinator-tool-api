const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        user_id: users[1].id,
        status: 'completed',
        project: 'First test project',
        project_url: 'http://www.fakeproject.com',
        advisor: 'Test Advisor',
        advisor_url: 'http://www.fakeadv.com',
        pm_id: 1,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_completed: new Date('2029-01-26T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 2,
        user_id: users[1].id,
        status: 'none',
        project: 'Second test project',
        project_url: 'http://www.fakeproject.com',
        advisor: 'Test Advisor',
        advisor_url: '',
        pm_id: 2,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 3,
        user_id: users[2].id,
        status: 'reached',
        project: 'Third test project',
        project_url: 'http://www.fakeproject.com',
        advisor: 'Test Advisor',
        advisor_url: '',
        pm_id: 1,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
        id: 4,
        user_id: users[3].id,
        status: 'completed',
        project: 'Fourth test project',
        project_url: 'http://www.fakeproject.com',
        advisor: 'Test Advisor',
        advisor_url: 'http://www.fakeadv.com',
        pm_id: 2,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_completed: new Date('2029-01-24T16:28:32.615Z'),
        notes: 'Lorem ipsum dolor sit amet',
    },
    {
      id: 5,
      user_id: users[2].id,
      status: 'none',
      project: 'Fourth test project',
      project_url: '',
      advisor: 'Test Advisor',
      advisor_url: 'http://www.fakeadv.com',
      pm_id: 3,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      notes: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 6,
    user_id: users[1].id,
    status: 'reached',
    project: 'Fourth test project',
    project_url: '',
    advisor: 'Test Advisor',
    advisor_url: '',
    pm_id: 2,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
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
        user_id: users[2].id,
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
        user_id: users[2].id,
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
        user_id: users[1].id,
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

function makeExpectedListItems(list, user, pms) {
    const filteredList = list.filter(item => 
      item.user_id === user.id && item.status !== 'completed'
    ) 
    
    const expectedList = filteredList.map(item => { 
      const pm = pms.find(pm => pm.id === item.pm_id)
      const expected = {...item, pm_name: pm.pm_name, pm_email: pm.pm_email, date_created: item.date_created.toISOString() }
      delete expected['pm_id']
      delete expected['user_id']
      return expected;
    }) 
    
    return expectedList;
}

function makeExpectedListItem(item, pms) {
  const pm = pms.find(pm => pm.id === item.pm_id)
  const expected = {...item, pm_name: pm.pm_name, pm_email: pm.pm_email, date_created: item.date_created.toISOString() }
  delete expected['pm_id']
  delete expected['user_id']
  return expected
}

function makeExpectedTemplate(template, userId) {
    return {
        id: template.id,
        user_id: userId,
        template_name: template.template_name,
        template_subject: template.template_subject,
        template_content: template.template_content,
    }
}

function makeExpectedTemplates(userId, templates) {
  const usersTemplates = templates.filter(template => template.user_id === userId)
  const expectedTemplates = usersTemplates.map(template => {
    return {...template, user_id: userId}
  })
  
  return expectedTemplates;
}

function makeExpectedPms(userId, pms) {
  const usersPms = pms.filter(pm => pm.user_id === userId)
  const expectedPms = usersPms.map(pm => {
    return {...pm, user_id: userId}
  })
  
  return expectedPms;
}

function makeExpectedUserInformation(user) {
  return {
    full_name: user.full_name,
    email: user.email
  }
}

function makeMaliciousListItem(user, pm) {
  const maliciousListItem = {
    id: 911,
    user_id: user.id,
    status: 'none',
    project: 'Malicious project <script>alert("xss");</script>',
    advisor: 'Bad advisor',
    pm_id: pm.id,
    date_created: new Date(),
    notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">.`,
  }
  const expectedListItem = {
    ...makeExpectedListItem(maliciousListItem, [pm]),
    title: 'Malicious project &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">.`,
  }
  return expectedListItem
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

function seedTables(db, users, pms, list_items, templates) {
  
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    
    await trx.into('coordinator_users').insert(users)
    await trx.into('coordinator_pms').insert(pms)
    await trx.into('coordinator_list_items').insert(list_items)
    await trx.into('coordinator_templates').insert(templates)
   

    await Promise.all([
      trx.raw(
        `SELECT setval('coordinator_users_id_seq', ?)`,
        [users[users.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('coordinator_pms_id_seq', ?)`,
        [pms[pms.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('coordinator_templates_id_seq', ?)`,
        [templates[templates.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('coordinator_list_items_id_seq', ?)`,
        [list_items[list_items.length - 1].id],
      ),
    ])
  })
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
  makeMaliciousListItem,
  makeMaliciousTemplate,
  makeExpectedTemplate,
  makeExpectedTemplates,
  makeExpectedListItems,
  makeExpectedListItem,
  makeExpectedUserInformation,
  makeExpectedPms,

  makeFixtures,
  cleanTables,
  seedTables,
  makeAuthHeader,
  seedUsers,
}
