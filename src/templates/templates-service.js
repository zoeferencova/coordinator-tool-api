const TemplatesService = {
    getAllTemplates(db, userId) {
        return db
            .from('coordinator_templates AS template')
            .select(
                'template.id',
                'template.user_id',
                'template.template_name',
                'template.template_subject',
                'template.template_content'
            )
            .where({ user_id: userId })
    }
}

module.exports = TemplatesService;