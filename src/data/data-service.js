const moment = require('moment')

function generateTimeSpans() {
    const timeSpans = [
        {
            start: moment().startOf('day').toISOString(),
            end: moment().toISOString(),
            formattedSpan: 'Today',
            unit: 'days',
            number: 0
        },
        {
            start: moment().startOf('week').toISOString(),
            end: moment().toISOString(),
            formattedSpan: 'This Week',
            unit: 'weeks',
            number: 0
        },
        {
            start: moment().startOf('month').toISOString(),
            end: moment().toISOString(),
            formattedSpan: 'This Month',
            unit: 'months',
            number: 0
        },
    ]

    const units = {
        days: 6,
        weeks: 3,
        months: 5
    }

    makeFormattedSpan = (unit, i) => {
        if (unit === 'days') {
            return `${moment().startOf(`${unit}`).subtract(i+1, `${unit}`).format('MMM D')}`
        } else if (unit === 'weeks') {
            return `${moment().startOf(`${unit}`).subtract(i+1, `${unit}`).format('MMM D')} - ${moment().startOf(`${unit}`).subtract(i, `${unit}`).format('MMM D')}`
        } else if (unit === 'months') {
            return `${moment().startOf(`${unit}`).subtract(i+1, `${unit}`).format('MMMM')}`
        }
    }

    for (let [key, value] of Object.entries(units)) {
        const unit = key;
        const number = value;

        for (let i=0; i < number; i++) {
            timeSpans.push({
                start: moment().startOf(`${unit}`).subtract(i+1, `${unit}`).toISOString(),
                end: moment().startOf(`${unit}`).subtract(i, `${unit}`).toISOString(),
                formattedSpan: makeFormattedSpan(unit, i),
                unit,
                number: i,
            })
        }
    }
    return timeSpans;
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
    getCompletedTimespanData(db, userId) {
        const data = []
        const timeSpans = generateTimeSpans()
            return db.transaction(trx => {
                timeSpans.forEach((span, i) => {
                    const query = db('coordinator_list_items')
                    .where('coordinator_list_items.status', '=', 'completed')
                    .where('coordinator_list_items.date_completed', '>', span.start)
                    .where('coordinator_list_items.date_completed', '<', span.end)
                    .where('coordinator_list_items.user_id', '=', userId)
                    .count(`coordinator_list_items AS ${span.unit}_${span.formattedSpan}`)
                    .transacting(trx)
                    data.push(query)
                })
                
                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })       
    },
    getCreatedTimespanData(db, userId) {
        const data = []
        const timeSpans = generateTimeSpans()
            return db.transaction(trx => {
                timeSpans.forEach((span, i) => {
                    const query = db('coordinator_list_items')
                    .where('coordinator_list_items.date_created', '>', span.start)
                    .where('coordinator_list_items.date_created', '<', span.end)
                    .where('coordinator_list_items.user_id', '=', userId)
                    .count(`coordinator_list_items AS ${span.unit}_${span.formattedSpan}`)
                    .transacting(trx)
                    data.push(query)
                })

                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })       
    },
    getTimeData(db, userId) {
        const data = []
            return db.transaction(trx => {
                const timeQuery = db('coordinator_list_items')
                .select(db.raw(`coordinator_list_items.date_completed - coordinator_list_items.date_created AS difference`))
                .where('coordinator_list_items.date_completed', '>', moment().startOf('week').toISOString())
                .where('coordinator_list_items.date_completed', '<', moment().toISOString())
                .where('coordinator_list_items.status', '=', 'completed')
                .where('coordinator_list_items.user_id', '=', userId)
                .transacting(trx)
                data.push(timeQuery)
                
                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })  
    },
    getDashboardData(db, userId) {
        const data = []
            return db.transaction(trx => {
                const pendingQuery = db('coordinator_list_items')
                .where('coordinator_list_items.status', '!=', 'completed')
                .where('coordinator_list_items.user_id', '=', userId)
                .count('coordinator_list_items as pending')
                .transacting(trx)
                data.push(pendingQuery)

                const allCreatedQuery = db('coordinator_list_items')
                .where('coordinator_list_items.date_created', '>', moment().startOf('week').toISOString())
                .where('coordinator_list_items.date_created', '<', moment().toISOString())
                .where('coordinator_list_items.user_id', '=', userId)
                .count('coordinator_list_items as created')
                .transacting(trx)
                data.push(allCreatedQuery)

                const allCompletedQuery = db('coordinator_list_items')
                .where('coordinator_list_items.date_created', '>', moment().startOf('week').toISOString())
                .where('coordinator_list_items.date_created', '<', moment().toISOString())
                .where('status', '=', 'completed')
                .where('coordinator_list_items.user_id', '=', userId)
                .count('coordinator_list_items as completed')
                .transacting(trx)
                data.push(allCompletedQuery)

                Promise.all(data)
                    .then(trx.commit)
                    .catch(trx.rollback)
            })
    }
}

module.exports = DataService;