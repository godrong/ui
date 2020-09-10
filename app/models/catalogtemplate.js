import { inject as service } from '@ember/service';
import Resource from '@rancher/ember-api-store/models/resource';
import { parseExternalId } from 'ui/utils/parse-externalid';
import C from 'ui/utils/constants';
import { computed } from '@ember/object';

export default Resource.extend({
  catalog: service(),

  type: 'catalogTemplate',

  externalId: computed('templateVersionId', 'templateId', function() {
    let id = this.get('templateVersionId') || this.get('templateId');

    if ( id ) {
      return C.EXTERNAL_ID.KIND_CATALOG + C.EXTERNAL_ID.KIND_SEPARATOR + id;
    }
  }),

  externalIdInfo: computed('externalId', function() {
    return parseExternalId(this.get('externalId'));
  }),

  // These only works if the templates have already been loaded elsewhere...
  catalogTemplate: computed('externalIdInfo.templateId', function() {
    return this.get('catalog').getTemplateFromCache(this.get('externalIdInfo.templateId'));
  }),

  icon: computed('catalogTemplate', function() {
    let tpl = this.get('catalogTemplate');

    if ( tpl ) {
      return tpl.linkFor('icon');
    }
  }),

  categories: computed('catalogTemplate.categories', function() {
    let tpl = this.get('catalogTemplate');

    if ( tpl ) {
      return tpl.get('categories') || [];
    }

    return [];
  }),
});
