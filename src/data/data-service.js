const moment = require('moment')

const DataService = {
    getItemCountByPm(db, userId) {
        return db
            .from('coordinator_list_items')
            .select('coordinator_list_items.pm_id')
            .where('coordinator_list_items.user_id', '=', userId)
            .select('coordinator_pms.pm_name')
            .join('coordinator_pms', {'coordinator_list_items.pm_id': 'coordinator_pms.id'})
            .count()
            .groupBy('coordinator_pms.pm_name')
            .groupBy('coordinator_list_items.pm_id')
    },
    getTimespanData(db, userId, dateRanges) {
        
            return db
                .from('coordinator_list_items')
                .where('coordinator_list_items.date_created', '>', dateRanges[0].start)
                .where('coordinator_list_items.date_created', '<', dateRanges[0].end)
                .where('coordinator_list_items.user_id', '=', userId)
                .count('coordinator_list_items as day0')
    }
}

module.exports = DataService;