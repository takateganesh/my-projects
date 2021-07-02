<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card flat height="40"></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col sm="8" cols="12">
        <OrganizationTeamMembershipFormWidget
          form-label="Team membership"
          @canceled="toOps"
          @submitted="toOps"
        />
      </v-col>
      <v-col sm="4" cols="12">
        <OrganizationEssentialWidget :one="one" :inProgress="inProgress" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { createHelpers } from "vuex-map-fields";
import { mapState } from "vuex";
import OrganizationEssentialWidget from "@/components/org/OrganizationEssentialWidget";
import OrganizationTeamMembershipFormWidget from "@/components/org/OrganizationTeamMembershipFormWidget";
const { mapFields } = createHelpers({
  getterType: "organizationOne/getField",
  mutationType: "organizationOne/updateField",
});

export default {
  name: "OrganizationTeamMembershipEditPage",
  components: {
    OrganizationTeamMembershipFormWidget,
    OrganizationEssentialWidget,
  },
  computed: {
    ...mapState({
      one: (state) => state.organizationOne.one,
      inProgress: (state) => state.organizationOne.inProgress,
    }),
    ...mapFields(["one", "inProgress"]),
    appId: function () {
      return this.$route.params.appId;
    },
  },
  created() {
    this.$store.dispatch("teamList/fetchList", { appId: this.appId});
    let organizationId = this.$route.params.organizationId;
    this.$store.dispatch("organizationOne/fetchOne", {
      organizationId: organizationId,
      recursive: true,
    });

    let teamMembershipId = this.$route.params.teamMembershipId;

    if ("new" == teamMembershipId) {
      this.$store.dispatch("teamMembershipOne/newInvite", { organizationId });
    } else {
      this.$store.dispatch("teamMembershipOne/fetchOne", {
        id: teamMembershipId,
        //organizationId: organizationId,
        //userId: "",
        //recursive: true
      });
    }
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
};
</script>