const TemplatesService = {
    getAllTemplates(db) {
        return db
            .from('coordinator_templates AS template')
            .select(
                'template.id',
                'template.user_id',
                'template.template_name',
                'template.template_subject',
                'template.template_content'
            )
    }
}

module.exports = TemplatesService;