const PmsService = {
    getAllPms(db) {
        return db
            .from('coordinator_pms AS pm')
            .select(
                'pm.id',
                'pm.user_id',
                'pm.pm_name',
                'pm.pm_email'
            )
    }
}

module.exports = PmsService;