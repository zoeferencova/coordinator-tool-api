const xss = require('xss')

const ListItemsService = {
    getById(db, itemId) {
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
            'coordinator_list_items.pm_id',
            'coordinator_list_items.notes'
        )
        .where('coordinator_list_items.id', '=', itemId)
        .first()
        .select(
            'coordinator_pms.pm_name',
            'coordinator_pms.pm_email'
        )
        .join('coordinator_pms', {'coordinator_list_items.pm_id': 'coordinator_pms.id'})
    },
    getAllListItems(db, userId) {
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
            
    },
    insertItem(db, newItem) {
        return db
            .insert(newItem)
            .into('coordinator_list_items')
            .returning('*')
            .then(([item]) => item)
            .then(item => ListItemsService.getById(db, item.id, item.pm_id))
    },
    deleteItem(db, itemId) {
        return db
            .from('coordinator_list_items')
            .where({ id: Number(itemId)})
            .del()
    },
    updateItem(db, itemId, newItemFields) {
        return db
            .from('coordinator_list_items')
            .where({ id: Number(itemId) })
            .update(newItemFields)

    }
}

module.exports = ListItemsService;