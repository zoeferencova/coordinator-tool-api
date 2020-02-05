const ListItemsService = {
    getAllListItems(db, userId) {
        return db
            .from('coordinator_list_items AS item')
            .select(
                'item.id',
                'item.user_id',
                'item.status',
                'item.project',
                'item.advisor',
                'item.pm_id',
                'item.date_created',
                'item.notes'
            )
            .where({ user_id: userId })
    }
}

module.exports = ListItemsService;