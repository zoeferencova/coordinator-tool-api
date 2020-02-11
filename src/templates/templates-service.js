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
    },
    getById(db, templateId) {
        return db 
        .from('coordinator_templates')
        .select(
            'coordinator_templates.id',
            'coordinator_templates.template_name',
            'coordinator_templates.template_subject',
            'coordinator_templates.template_content',
            'coordinator_templates.user_id'
        )
        .where('coordinator_templates.id', '=', templateId)
        .first()
    },
    insertTemplate(db, newTemplate) {
        return db
            .insert(newTemplate)
            .into('coordinator_templates')
            .returning('*')
            .then(([template]) => template)
            .then(template => TemplatesService.getById(db, template.id))
    },
}

module.exports = TemplatesService;