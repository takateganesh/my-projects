<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card flat height="40"></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col cols="12" sm="8">
        <OrganizationFormWidget
          v-bind:appId="appId"
          @canceled="toOps"
          @submitted="toOps"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <OrganizationEssentialWidget :one="one" :inProgress="inProgress" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import OrganizationFormWidget from "@/components/org/OrganizationFormWidget";
import OrganizationEssentialWidget from "@/components/org/OrganizationEssentialWidget";
import { mapState } from "vuex";

export default {
  name: "OrganizationEditPage",
  components: {
    OrganizationFormWidget,
    OrganizationEssentialWidget,
  },
  computed: {
    ...mapState({
      one: (state) => state.organizationOne.one,
      inProgress: (state) => state.organizationOne.inProgress,
    }),
    appId: function () {
      return this.$route.params.appId;
    },
    organizationId: function () {
      return this.$route.params.organizationId;
    },
  },
  created() {
    let organizationId = this.$route.params.organizationId;
    if ("new" == organizationId) {
      this.$store.dispatch("organizationOne/new", {
        appId: this.appId,
        recursive: true,
      });
    } else {
      this.$store.dispatch("organizationOne/fetchOne", {
        organizationId: organizationId,
        recursive: true,
      });
    }
  },
  methods: {
    toOps(id) {
      console.log("toOps:", id);
      if(id)
      {
      this.$router.push({
        name: "OrganizationOpsPage",
        params: { organizationId: id },
      });
      }
      else{
       this.$router.push({
        name: "Organizations"
      });
      }
    },
  },
};
</script>