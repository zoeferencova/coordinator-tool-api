const PmsService = {
    getAllPms(db, userId) {
        return db
            .from('coordinator_pms AS pm')
            .select(
                'pm.id',
                'pm.user_id',
                'pm.pm_name',
                'pm.pm_email'
            )
            .where({ user_id: userId })
    },
    getById(db, pmId) {
        return db 
        .from('coordinator_pms')
        .select(
            'coordinator_pms.id',
            'coordinator_pms.pm_name',
            'coordinator_pms.pm_email',
            'coordinator_pms.user_id',
        )
        .where('coordinator_pms.id', '=', pmId)
        .first()
    },
    insertPm(db, newPm) {
        return db
            .insert(newPm)
            .into('coordinator_pms')
            .returning('*')
            .then(([pm]) => pm)
            .then(pm => PmsService.getById(db, pm.id))
    },
}

module.exports = PmsService;