<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card flat height="40"></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col cols="12" sm="6">
        <OrganizationProfileWidget
          :one="one"
          @changeAvtarDialog="changeAvtarDialog"
          @editItem="toEditPage"
          :inProgress="inProgress"
        ></OrganizationProfileWidget>
        <VueCropperDialog
          ref="vueCropperDialog"
          v-if="showAvtarDialog"
          @closeAvtarDialogAction="closeAvtarDialog"
          :showAvtarDialog="showAvtarDialog"
          @submitAvtarChangeAction="submitAvtarChangeAction"
        ></VueCropperDialog>
      </v-col>
      <v-col cols="12" sm="6">
        <OrganizationTeamsListWidget
          v-bind:organizationId="organizationId"
          @itemSelected="onItemSelected"
        >
          <template v-slot:toolbar>
            <v-hover v-slot:default="{ hover }">
              <v-btn
                v-if="isAppAdmin"
                :outlined="hover ? false : true"
                :color="hover ? 'primary' : 'primary'"
                class="mb-2 mr-2"
                :to="{
                  name: 'OrganizationTeamMembershipEditPage',
                  params: { appId, organizationId, teamMembershipId: 'new' },
                }"
                tile
                >New</v-btn
              >
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <v-btn
                v-if="isAppAdmin"
                :outlined="hover ? false : true"
                :color="hover ? 'primary' : 'primary'"
                :disabled="selectedItem == null"
                class="mb-2 mr-2"
                :to="{
                  name: 'OrganizationTeamMembershipEditPage',
                  params: {
                    appId,
                    organizationId,
                    userId: selectedItem ? selectedItem.userId : 'none',
                    teamMembershipId: selectedItem ? selectedItem.id : 'none',
                  },
                }"
                tile
                >Edit</v-btn
              >
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <v-btn
                v-if="isAppAdmin"
                :disabled="selectedItem == null"
                :outlined="hover ? false : true"
                :color="hover ? 'primary' : 'primary'"
                class="mb-2 mr-2"
                @click="revokeOne()"
                tile
                >Revoke</v-btn
              >
            </v-hover>
            <v-hover v-slot:default="{ hover }">
              <v-btn
                v-if="isAppAdmin || isManager"
                :outlined="hover ? false : true"
                :color="hover ? 'primary' : 'primary'"
                class="mb-2 mr-2"
                :to="{
                  name: 'OrganizationTeamInviteEditPage',
                  params: { appId, organizationId, teamMembershipId: 'new' },
                }"
                tile
                >Invite</v-btn
              >
            </v-hover>
          </template>
        </OrganizationTeamsListWidget>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { createHelpers } from "vuex-map-fields";
import OrganizationProfileWidget from "@/components/org/OrganizationProfileWidget";
import OrganizationTeamsListWidget from "@/components/org/OrganizationTeamsListWidget";
import VueCropperDialog from "@/components/common/VueCropperDialog";
import { mapState } from "vuex";
const oakCdnImageUrl = process.env.VUE_APP_OAK_CDN_URL;

const { mapFields } = createHelpers({
  getterType: "organizationOne/getField",
  mutationType: "organizationOne/updateField",
});

export default {
  name: "OrganizationOps",
  components: {
    OrganizationProfileWidget,
    OrganizationTeamsListWidget,
    VueCropperDialog,
  },
  data() {
    return {
      showAvtarDialog: false,
      selectedItem: null,
    };
  },
  computed: {
    ...mapState({
      one: (state) => state.organizationOne.one,
      inProgress: (state) => state.organizationOne.inProgress,
    }),
    organizationId: function () {
      return this.$route.params.organizationId;
    },
    appId: function () {
      return this.$route.params.appId;
    },
    ...mapFields(["one.avatarUrl"]),
    isAppAdmin: function () {
      let grants = this.$store.state.dashboard.grants;
      if (
        grants &&
        (grants.includes(`${this.appId.replace(/\s+/g, "")}_admin`) ||
          grants.includes("oak_admin"))
      )
        return true;
      else return false;
    },
    isManager: function () {
      let grants = this.$store.state.dashboard.grants;
      if (grants && grants.includes("manager")) return true;
      else return false;
    },
  },
  created() {
    this.$store.dispatch("organizationOne/fetchOne", {
      organizationId: this.organizationId,
      recursive: true,
    });
  },
  methods: {
    onItemSelected(selectionEvent) {
      this.selectedItem = selectionEvent.id ? selectionEvent : null;
    },
    closeAvtarDialog() {
      this.showAvtarDialog = false;
    },
    changeAvtarDialog() {
      this.showAvtarDialog = true;
    },
    toEditPage(id) {
      console.log("to edit page:", id);
      this.$router.push({
        name: "OrganizationEditPage",
        params: { organizationId: id },
      });
    },
    async revokeOne() {
      try {
        this.$store
          .dispatch("teamMembershipOne/revokeOne", {
            team: this.selectedItem,
            appId: this.appId,
          })
          .then(() => {
            this.$snotify.success("Revoked Selected User", {
              position: "rightTop",
              showProgressBar: false,
            });
            this.selectedItem = null;
            this.$store.dispatch("teamMembershipList/fetchForOrganization", {
              appId: this.appId,
              resourceId: this.organizationId,
              filter: {},
            });
          });
      } catch (error) {
        /* eslint-disable no-alert, no-console ,  no-debugger */
        console.log("error in revoking user", error);
        this.$snotify.success("error in revoking user", {
          position: "rightTop",
          showProgressBar: false,
        });
      }
    },
    submitAvtarChangeAction() {
      const me = this;
      const imgName = "images/" + new Date().getTime() + ".png";
      this.$refs.vueCropperDialog.$refs.cropper.getCropBlob((data) => {
        me.$store
          .dispatch("dashboard/uploadToS3", {
            name: imgName,
            type: "image/png",
            data: data,
            bucket: "cdn.treelet.net",
            region: "eu-central-1",
          })
          .then(async () => {
            me.avatarUrl = oakCdnImageUrl + "/" + imgName;
            await me.$store.dispatch("organizationOne/update");
            me.showAvtarDialog = false;
            let message = "Image uploaded succesfully.";
            me.$snotify.success(message, {
              position: "rightTop",
              showProgressBar: false,
            });
            me.$store.dispatch("organizationOne/fetchOne", {
              organizationId: this.organizationId,
              recursive: true,
            });
          })
          .catch((error) => {
            me.$snotify.error(error, {
              position: "rightTop",
              showProgressBar: false,
            });
          });
      });
      this.showAvtarDialog = false;
    },
  },
};
</script>