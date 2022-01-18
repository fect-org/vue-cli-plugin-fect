
import { createApp } from 'vue'
import App from './App.vue'

<%_ if (options.importType !== 'full') { _%>
import '@fect-ui/themes';
<%_ } _%>

<%_ if (options.importType === 'full') { _%>
import '@fect-ui/vue/lib/main.css';
import FectUI from '@fect-ui/vue';
<%_ } _%>

<%_ if (options.partialImportType === 'manual') { _%>
import { Button } from '@fect-ui/vue';
import '@fect-ui/vue/es/button/style/index';
<%_ } _%>

<%_ if (options.importType === 'full' && options.useFectIcon) { _%>
import FectIcon from '@fect-ui/vue-icons';
<%_ } _%>

<%_ if (options.partialImportType === 'manual' && options.useFectIcon) { _%>
import { Github } from '@fect-ui/vue-icons';
<%_ } _%>

createApp(App).mount('#app')
