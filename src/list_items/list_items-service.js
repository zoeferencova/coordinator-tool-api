const ListItemsService = {
    getAllListItems(db) {
        return db
            .from('coordinator_list_items AS item')
            .select(
                'item.id',
                'item.user_id',
                'item.status',
                'item.project',
                'item.advisor',
                'item.pm_id',
                'item.date',
                'item.notes'
            )
    }
}

module.exports = ListItemsService;