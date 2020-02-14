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
    getTimespanData(db, userId, span) {
            return db
                .from('coordinator_list_items')
                .where('coordinator_list_items.date_created', '>', span.start)
                .where('coordinator_list_items.date_created', '<', span.end)
                .where('coordinator_list_items.user_id', '=', userId)
                .count(`coordinator_list_items AS item_count`)
                .then(data => data[0])
        

        // return db.transaction(function(trx) {
        //     db
        //         .from('coordinator_list_items')
        //         .transacting(trx)
        //         .then(function() {
        //             timeSpans.forEach((span, i) => {
        //                  db
        //                     .from('coordinator_list_items')
        //                     .where('coordinator_list_items.date_created', '>', span.start)
        //                     .where('coordinator_list_items.date_created', '<', span.end)
        //                     .where('coordinator_list_items.user_id', '=', userId)
        //                     .count(`coordinator_list_items AS day${i}`)
        //         })
        //         .then(trx.commit)
        //         .catch(trx.rollback)
            
        //     })
        //     .then(function(response) {
        //         console.log(response)
        //     })
        //     .catch(function(error) {
        //         console.log(error)
        //     })
        // })

            
    }
}

module.exports = DataService;