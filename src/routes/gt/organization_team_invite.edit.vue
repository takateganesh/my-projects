<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card flat height="40"></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col sm="8" cols="12">
        <OrganizationTeamInviteFormWidget form-label="Team invite"  @canceled="toOps"
          @submitted="toOps" />
      </v-col>
      <v-col sm="4" cols="12">
        <OrganizationEssentialWidget :one="one" :inProgress="inProgress" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OrganizationEssentialWidget from "@/components/org/OrganizationEssentialWidget";
import OrganizationTeamInviteFormWidget from "@/components/org/OrganizationTeamInviteFormWidget";
import { mapState } from "vuex";

export default {
  name: "OrganizationTeamMembershipEditPage",
  components: {
    OrganizationTeamInviteFormWidget,
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
  },
  methods: {
    toOps() {
      let organizationId = this.$route.params.organizationId;
      this.$router.push({
        name: "OrganizationOpsPage",
        params: { organizationId: organizationId },
      });
    },
  },
  created() {
    this.$store.dispatch("teamList/fetchList", { appId: this.appId });
    let organizationId = this.$route.params.organizationId;
    this.$store.dispatch("organizationOne/fetchOne", {
      organizationId: organizationId,
      recursive: true,
    });

    this.$store.dispatch("teamInviteOne/newInvite", {
      organizationId: organizationId,
      appId: this.$route.params.appId,
    });
  },
};
</script>