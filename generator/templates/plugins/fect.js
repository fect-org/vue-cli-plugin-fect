<%_ if (options.importType === 'full') { _%>
import '@fect-ui/vue/lib/main.css';

import FectUI from '@fect-ui/vue';
<%_ } else { _%>
import '@fect-ui/themes';
<%_ if (options.partialImportType === 'manual') { _%>
import '@fect-ui/vue/es/button/style/index';

import { Button } from '@fect-ui/vue'
<%_ }} _%>

/**
 * @param {import('vue').App} app
 */
export default function createFect(app) {
// https://vue-rc.miaya.art/zh-cn/guide/quickstart
<%_ if (options.importType === 'full') { _%>
  app.use(FectUI);
<%_ } else { _%>
<%_ if (options.partialImportType === 'manual') { _%>
  app.use(Button);
<%_ }} _%>
}
