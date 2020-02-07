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
    }
}

module.exports = PmsService;