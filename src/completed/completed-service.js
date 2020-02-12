const CompletedService = {
    getCompletedItems(db, userId) {
        return db
            .from('coordinator_list_items')
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
    },
    
}

module.exports = CompletedService;