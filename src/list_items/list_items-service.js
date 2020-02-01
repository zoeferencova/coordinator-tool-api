const ListItemsService = {
    getAllItems(db) {
        return db
            .from('coordinator_list_items AS item')
            .select(
                'item.id',
                'item.userId',
                'item.status',
                'item.project',
                'item.advisor',
                'item.pmId',
                'item.date',
                'item.notes'
            )
    }
}

module.exports = ListItemsService;