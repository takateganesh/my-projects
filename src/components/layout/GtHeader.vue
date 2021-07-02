  <template>
  <v-app-bar flat :clipped-left="$vuetify.breakpoint.mdAndUp" app color="teal darken-3" dark>
    <v-app-bar-nav-icon @click="menuAction()" />
    <breadcrumb class="d-none d-md-flex white--text"></breadcrumb>
    <v-spacer></v-spacer>

    <div v-on:click.stop="show=!show">
      <v-menu offset-y>
        <template v-slot:activator="{ on, value }">
          <v-btn large color="white--text" dark v-on="on" text :icon="$vuetify.breakpoint.xsOnly">
            <span class="d-none d-sm-flex">{{userEmail}}</span>
            <v-icon v-if="!value">mdi mdi-chevron-down</v-icon>
            <v-icon v-else>mdi mdi-chevron-up</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="background-blue-dark mt-n2">
            <v-list-item-icon>
              <div class="list-account-avatar account-avatar">{{getAbbrName}}</div>
            </v-list-item-icon>
            <v-list-item-title class="white--text">{{userEmail}}</v-list-item-title>
          </v-list-item>
          <v-list-item href="mailto:help@popmetrics.ai" target="_top">
            <v-list-item-icon>
              <v-icon>mdi mdi-help-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>mdi mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="account-avatar ml-2">{{getAbbrName}}</div>
  </v-app-bar>
</template>
<script>
import { oakOptions } from "@/_helpers/oak-options";
import Breadcrumb from "./Breadcrumb";
//import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "layout/getField",
  mutationType: "layout/updateField"
});

export default {
  name: "OakHeader",
  components: { Breadcrumb },
  computed: {
    ...mapFields(["sidebarClose"]),
    userEmail: {
      get() {
        return this.$store.state.auth.userAuth
          ? this.$store.state.auth.userAuth.email
          : "N/A";
      }
    },
    getAbbrName: {
      get() {
        let email = this.$store.state.auth.userAuth
          ? this.$store.state.auth.userAuth.email
          : null;
        if (email) return `${email[0]}${email[email.indexOf("@") + 1]}`;
        else return "N/A";
      }
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    menuAction: function() {
      let ss = localStorage.getItem(`sidebar-close-status`);
      if (ss == "false") ss = true;
      else ss = false;

      const ws = `sidebar-close-status`;
      localStorage.setItem(ws, ss);
      this.$emit("actionMenu");
    },
    logout() {
      window.localStorage.setItem("authenticated", false);
      this.$store.dispatch("auth/logout");
      window.location.href = oakOptions.login_url;
    }
  },
  created() {
  }
};
</script>
<style src="./GtHeader.scss" lang="scss" />