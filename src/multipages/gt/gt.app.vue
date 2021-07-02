<template>
  <v-app color="white">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  created() {
    // const currentPath = this.$router.history.current.path;
    // if (window.localStorage.getItem('authenticated') === 'false') {
    //   this.$router.push('/login');
    // }
    //
    // if (currentPath === '/' || currentPath === '/app') {
    //   this.$router.push('/app/main/analytics');
    // }
  },
  computed: {}
};
</script>

 <style src="../../styles/_app.scss" lang="scss" /> 
