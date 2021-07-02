<template>
  <div class="main-body">
    <v-card tile>
      <v-navigation-drawer
        v-model="showMenu"
        :clipped="$vuetify.breakpoint.mdAndUp"
        app
        color="teal darken-3"
        class="white--text"
        :mini-variant="mini"
        :permanent="$vuetify.breakpoint.mdAndUp"
      >
        <v-list class="background-transparent">
          <router-link
            class="sidebar-router-link d-block text-decoration-none my-1" to="#"
          >
            <v-list-item class="px-4">
              <v-icon class="white--text">mdi-shopping</v-icon>
              <v-list-item-title class="ml-3 white--text">OAK</v-list-item-title>
            </v-list-item>
          </router-link>

          <div>
            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'HubsPage'}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-router-network</v-icon>
                  <v-list-item-title class="ml-3 white--text">Hubs</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>
          </div>

          <div>
            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'AppsPage'}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-application-cog</v-icon>
                  <v-list-item-title class="ml-3 white--text">Apps</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>
          </div>

          <div v-if="appOne && appOne.id">
            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'AppViewPage', params: { appId: appOne.id }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-newspaper</v-icon>
                  <v-list-item-title class="ml-3 white--text">{{appOne.name}}</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'Organizations', params: { appId: appOne.id }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-sitemap</v-icon>
                  <v-list-item-title class="ml-3 white--text">Organizations</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>
            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'ImagesPage', params: { appId: appOne.id }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-file-image</v-icon>
                  <v-list-item-title class="ml-3 white--text">Images</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>
            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'UsersPage', params: { appId: appOne.id }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-account</v-icon>
                  <v-list-item-title class="ml-3 white--text">Users</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'TeamsPage', params: { appId: appOne.id }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-account-multiple</v-icon>
                  <v-list-item-title class="ml-3 white--text">Teams</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <router-link
                class="sidebar-router-link d-block text-decoration-none my-1"
                :to="{ name: 'EmailTemplates', params: { appId: appOne.id  }}"
              >
                <v-list-item
                  class="px-4"
                  :class="hover ? ' background-purple-light' : 'white--text'"
                >
                  <v-icon class="white--text">mdi-email</v-icon>
                  <v-list-item-title class="ml-3 white--text">Email Templates</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-hover>
            <AdminUrlHubList :appId="appId"/>
          </div>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    <GtHeader @actionMenu="onAction" />

    <v-content class="fill-height">
      <v-col cols="12" class="fill-height pa-3">
        <router-view></router-view>
        <vue-snotify />
      </v-col>
    </v-content>
  </div>
</template>

<script>
import GtHeader from "./GtHeader";
import AdminUrlHubList from "@/components/org/AdminUrlHubList";

export default {
  name: "GtLayout",
  components: {
    GtHeader,
    AdminUrlHubList
  },
  data: () => ({
    showMenu: false,
    mini: localStorage.getItem(`sidebar-close-status`)=="false" ? false:true,
  }),
  methods: {
    onAction() { 
          let ss = localStorage.getItem(`sidebar-close-status`);
          if (ss == "false") this.mini = false;
          else this.mini = true;

          if (this.$vuetify.breakpoint.smAndDown) {
            this.showMenu = !this.showMenu;
            this.mini = false;         
          }
    },
  },
  computed: {
    appOne: function() {
      return this.$store.state.appOne.one.id
        ? this.$store.state.appOne.one
        : null;
    },
    appId: function() {
      return this.$route.params&&this.$route.params.appId?this.$route.params.appId: null;
    },
    organizationOne: function() {
      return this.$store.state.organizationOne.one
        ? this.$store.state.organizationOne.one
        : null;
    },
  },
  created() {
    if (this.$store.state.auth.userAuth) {
      this.$store.dispatch(
        "dashboard/fetchUserState",
        this.$store.state.auth.userAuth.id
      );
    }
  //   window.addEventListener("resize", this.handleResize);
  //   this.handleResize();
  // },
  //  destroyed() {
  //   window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style src="./GtLayout.scss" lang="scss" />
