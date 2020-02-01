const UsersService = {
    getAllUsers(db) {
        return db
            .from('coordinator_users AS users')
            .select(
                'users.id',
                'users.full_name',
                'users.email',
                'users.password'
            )
    }
}

module.exports = UsersService;