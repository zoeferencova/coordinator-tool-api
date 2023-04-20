const moment = require('moment')

const createSpans = () => (
    {
        days: [
            {
                start: moment().startOf('day').toISOString(),
                end: moment().toISOString(),
                formatted: "Today"
            },
            {
                start: moment().startOf('days').subtract(1, 'days').toISOString(),
                end: moment().startOf('days').toISOString(),
                formatted: moment().startOf('days').subtract(1, 'days').format('MMM D')
            },
            {
                start: moment().startOf('days').subtract(2, 'days').toISOString(),
                end: moment().startOf('days').subtract(1, 'days').toISOString(),
                formatted: moment().startOf('days').subtract(2, 'days').format('MMM D')
            },
            {
                start: moment().startOf('days').subtract(3, 'days').toISOString(),
                end: moment().startOf('days').subtract(2, 'days').toISOString(),
                formatted: moment().startOf('days').subtract(3, 'days').format('MMM D')
            },
            {
                start: moment().startOf('days').subtract(4, 'days').toISOString(),
                end: moment().startOf('days').subtract(3, 'days').toISOString(),
                formatted: moment().startOf('days').subtract(4, 'days').format('MMM D')
            },
            {
                start: moment().startOf('days').subtract(5, 'days').toISOString(),
                end: moment().startOf('days').subtract(4, 'days').toISOString(),
                formatted: moment().startOf('days').subtract(5, 'days').format('MMM D')
            },
            {
                start: moment().startOf('days').subtract(6, 'days').toISOString(),
                end: moment().startOf('days').subtract(5, 'days').toISOString(),
                formatted: moment().startOf('days').subtract(6, 'days').format('MMM D')
            }
        ],
        weeks: [
            {
                start: moment().startOf('week').toISOString(),
                end: moment().toISOString(),
                formatted: "This week"
            },
            {
                start: moment().startOf('weeks').subtract(1, 'weeks').toISOString(),
                end: moment().startOf('weeks').subtract(0, 'weeks').toISOString(),
                formatted: `${moment().startOf('weeks').subtract(1, 'weeks').format('MMM D')} - ${moment().startOf('weeks').subtract(0, 'weeks').format('MMM D')}`
            },
            {
                start: moment().startOf('weeks').subtract(2, 'weeks').toISOString(),
                end: moment().startOf('weeks').subtract(1, 'weeks').toISOString(),
                formatted: `${moment().startOf('weeks').subtract(2, 'weeks').format('MMM D')} - ${moment().startOf('weeks').subtract(1, 'weeks').format('MMM D')}`
            },
            {
                start: moment().startOf('weeks').subtract(3, 'weeks').toISOString(),
                end: moment().startOf('weeks').subtract(2, 'weeks').toISOString(),
                formatted: `${moment().startOf('weeks').subtract(3, 'weeks').format('MMM D')} - ${moment().startOf('weeks').subtract(2, 'weeks').format('MMM D')}`

            }
        ],
        months: [
            {
                start: moment().startOf('month').toISOString(),
                end: moment().toISOString(),
                formatted: moment().startOf('months').format('MMM')
            },
            {
                start: moment().startOf('months').subtract(1, 'months').toISOString(),
                end: moment().startOf('months').subtract(0, 'months').toISOString(),
                formatted: moment().startOf('months').subtract(1, 'months').format('MMM')
            },
            {
                start: moment().startOf('months').subtract(2, 'months').toISOString(),
                end: moment().startOf('months').subtract(1, 'months').toISOString(),
                formatted: moment().startOf('months').subtract(2, 'months').format('MMM')
            },
            {
                start: moment().startOf('months').subtract(3, 'months').toISOString(),
                end: moment().startOf('months').subtract(2, 'months').toISOString(),
                formatted: moment().startOf('months').subtract(3, 'months').format('MMM')
            },
            {
                start: moment().startOf('months').subtract(4, 'months').toISOString(),
                end: moment().startOf('months').subtract(3, 'months').toISOString(),
                formatted: moment().startOf('months').subtract(4, 'months').format('MMM')
            },
            {
                start: moment().startOf('months').subtract(5, 'months').toISOString(),
                end: moment().startOf('months').subtract(4, 'months').toISOString(),
                formatted: moment().startOf('months').subtract(5, 'months').format('MMM')
            }
        ]
    }
)

const DataService = {
    getItemCountByPm(db, userId) {
        return db
            .from('coordinator_list_items')
            .select('coordinator_list_items.pm_id')
            .where('coordinator_list_items.user_id', '=', userId)
            .select('coordinator_pms.pm_name')
            .join('coordinator_pms', { 'coordinator_list_items.pm_id': 'coordinator_pms.id' })
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
    getTimespanData(db, userId, selectedType, selectedSpan) {
        const data = []
        const timespans = createSpans()
        return db.transaction(trx => {
            timespans[selectedSpan].forEach(span => {
                const query = db('coordinator_list_items')
                    .where(`coordinator_list_items.date_${selectedType}`, '>=', span.start)
                    .where(`coordinator_list_items.date_${selectedType}`, '<=', span.end)
                    .where('coordinator_list_items.user_id', '=', userId)
                    .count(`coordinator_list_items AS ${span.formatted}`)
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