
const userDataService = {
    getAllUserData(db, userId) {
        const data = []
        return db.transaction(trx => {
            const listQuery = db('coordinator_list_items')
                .select(
                    'coordinator_list_items.id',
                    'coordinator_list_items.status',
                    'coordinator_list_items.project',
                    'coordinator_list_items.project_url',
                    'coordinator_list_items.advisor',
                    'coordinator_list_items.advisor_url',
                    'coordinator_list_items.date_created',
                    'coordinator_list_items.notes'
                )
                .where('coordinator_list_items.user_id', '=', userId)
                .whereNot('coordinator_list_items.status', '=', 'completed')
                .select(
                    'coordinator_pms.pm_name',
                    'coordinator_pms.pm_email'
                )
                .where('coordinator_pms.user_id', '=', userId)
                .join('coordinator_pms', {'coordinator_list_items.pm_id': 'coordinator_pms.id'})  
                .orderBy('coordinator_list_items.date_created', 'asc')
                .transacting(trx)
                data.push(listQuery)
                
    
            const pmQuery = db('coordinator_pms')
                .select(
                    'coordinator_pms.id',
                    'coordinator_pms.user_id',
                    'coordinator_pms.pm_name',
                    'coordinator_pms.pm_email'
                )
                .where({ user_id: userId })
                .transacting(trx)
                data.push(pmQuery)
    
            const templateQuery = db('coordinator_templates')
                .select(
                    'coordinator_templates.id',
                    'coordinator_templates.user_id',
                    'coordinator_templates.template_name',
                    'coordinator_templates.template_subject',
                    'coordinator_templates.template_content'
                )
                .where({ user_id: userId })
                .transacting(trx)
                data.push(templateQuery)
    
            const completedQuery = db('coordinator_list_items')
                .select(
                    'coordinator_list_items.id',
                    'coordinator_list_items.status',
                    'coordinator_list_items.project',
                    'coordinator_list_items.project_url',
                    'coordinator_list_items.advisor',
                    'coordinator_list_items.advisor_url',
                    'coordinator_list_items.date_created',
                    'coordinator_list_items.date_completed',
                    'coordinator_list_items.notes'
                )
                .where('coordinator_list_items.user_id', '=', userId)
                .where('coordinator_list_items.status', '=', 'completed')
                .select(
                    'coordinator_pms.pm_name',
                    'coordinator_pms.pm_email'
                )
                .where('coordinator_pms.user_id', '=', userId)
                .join('coordinator_pms', {'coordinator_list_items.pm_id': 'coordinator_pms.id'})  
                .orderBy('coordinator_list_items.date_completed', 'desc') 
                .transacting(trx)
                data.push(completedQuery)
    
            const userQuery = db('coordinator_users')
                .select(
                    'coordinator_users.full_name',
                    'coordinator_users.email'
                )
                .where('coordinator_users.id', '=', userId)
                .first()
                .transacting(trx)
                data.push(userQuery)
    
    
            Promise.all(data)
                .then(trx.commit)
                .catch(trx.rollback)
        })
    }
}

module.exports = userDataService;
