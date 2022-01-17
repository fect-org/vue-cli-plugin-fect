<template>
  <div>
    <img src="./assets/logo.png" />
    <div>
      <p>
        If Fect UI is successfully added to this project, you'll see an
        <code v-text="'<fe-button>'"></code>
        below
      </p>
      <%_ if (options.useFectIcon) { _%>
      <fe-button>
        <template #icon>
          <Github />
        </template>
        fe-button
      </fe-button>
      <%_ } _%> 
      <%_ if (!options.useFectIcon) { _%>
      <fe-button>fe-button</fe-button>
      <%_ } _%>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
<%_ if (options.importType === 'partial' && options.partialImportType === 'babel') { _%>
import { Button } from '@fect-ui/vue'
<%_ } _%>
<%_ if (options.partialImportType === 'babel' && options.useFectIcon) { _%>
import { Github } from '@fect-ui/vue-icons';
<%_ } _%>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    <%_ if (options.importType === 'partial' && options.partialImportType === 'babel') { _%>
    [Button.name]: Button,
    <%_ } _%>
     <%_ if (options.partialImportType === 'babel' && options.useFectIcon) { _%>
    Github,
    <%_ } _%>
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
