const moment = require('moment')

const timeSpans = [
    {
        start: moment().startOf('day').toISOString(),
        end: moment().toISOString(),
        unit: 'days',
        number: 0
    },
    {
        start: moment().startOf('week').toISOString(),
        end: moment().toISOString(),
        unit: 'weeks',
        number: 0
    },
    {
        start: moment().startOf('month').toISOString(),
        end: moment().toISOString(),
        unit: 'months',
        number: 0
    },
]
const units = {
    days: 7,
    weeks: 4,
    months: 6
}

for (let [key, value] of Object.entries(units)) {
    const unit = key;
    const number = value;

    for (let i=1; i < number; i++) {
        timeSpans.push({
            start: moment().startOf(`${unit}`).subtract(i+1, `${unit}`).toISOString(),
            end: moment().startOf(`${unit}`).subtract(i, `${unit}`).toISOString(),
            unit,
            number: i,
        })
    }
}

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
    getTimespanData(db, userId) {
            return db.transaction(trx => {
                timeSpans.forEach((span, i) => {
                    const query = db('coordinator_list_items')
                    .where('coordinator_list_items.date_created', '>', span.start)
                    .where('coordinator_list_items.date_created', '<', span.end)
                    .where('coordinator_list_items.user_id', '=', userId)
                    .count(`coordinator_list_items AS ${span.unit}${span.number}`)
                    .transacting(trx)
                    data.push(query)
                })
                
                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })       
    },
    getTimeCompletedData(db, userId) {
        const data = []
            return db.transaction(trx => {
                timeSpans.forEach((span, i) => {
                    const query = db('coordinator_list_items')
                    .select(db.raw(`EXTRACT(MINUTE FROM (coordinator_list_items.date_completed - coordinator_list_items.date_created)) AS ${span.unit}_${span.number}_difference`))
                    .where('coordinator_list_items.date_created', '>', span.start)
                    .where('coordinator_list_items.date_created', '<', span.end)
                    .where('coordinator_list_items.status', '=', 'completed')
                    .where('coordinator_list_items.user_id', '=', userId)
                    .transacting(trx)
                    data.push(query)
                })
                
                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })  
    }
}

module.exports = DataService;