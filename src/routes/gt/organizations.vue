<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card flat height="40"></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col cols="12" sm="8">
        <OrganizationListWidget @itemSelected="onItemSelected">
           <template v-slot:toolbar>
            
            <v-hover v-slot:default="{ hover }">
              <v-btn
                :outlined="hover ? false:true"
                :color="hover ? 'primary' : 'primary'"
                class="mb-2 mr-2"
                :to="{name:'OrganizationEditPage', params: { appId, organizationId: 'new' }}"
                tile
              >New</v-btn>
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <v-btn
                :outlined="hover ? false:true"
                :color="hover ? 'primary' : 'primary'"
                :disabled="selectedItem == null"
                class="mb-2 mr-2"
                :to="{name:'OrganizationOpsPage', params: { appId, organizationId: selectedItem?selectedItem.id: 'none' }}"
                tile
              >View</v-btn>
            </v-hover>

            <v-hover v-slot:default="{ hover }">
              <v-btn
                :disabled="selectedItem == null"
                :outlined="hover ? false:true"
                :color="hover ? 'primary' : 'primary'"
                class="mb-2 mr-2"
                :to="{name:'OrganizationEditPage', params: { appId, organizationId: selectedItem?selectedItem.id: 'none' }}"
                tile
              >Edit</v-btn>
            </v-hover>
          </template>
        </OrganizationListWidget>
      </v-col>
      <v-col cols="12" sm="4" class="font-weight-bold">
        <Widget
          customHeader
          :name="`Organization Management`"
          title="<h3><span class='font-weight-bold'>Organization management</span></h3>"
        ></Widget>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Widget from "@/components/gate/Widget";
import OrganizationListWidget from "@/components/org/OrganizationListWidget";

export default {
  name: "OrganizationsPage",
  components: { Widget,OrganizationListWidget },
  computed: {
    appId: function() {
      return this.$route.params.appId;
    },
  },
 
  data() {
    return {
      selectedItem:null 
    };
  },
  methods: {
   onItemSelected(selectionEvent) {
      this.selectedItem = selectionEvent.value ? selectionEvent.item: null
    },
    deleteSelected() {
      let sel = this.getSelection();
      if (sel.length == 0) {
        let message = null;
        message = "You need to select an item first.";
        this.$snotify.error(message, {
          position: "rightTop",
          showProgressBar: false
        });
      } else {
        this.$store
          .dispatch("organizationList/deleteSelected", sel)
          .then(() => {
            this.$snotify.success(
              "Selected organizations deleted successfully",
              {
                position: "rightTop",
                showProgressBar: false
              }
            );
          })
          .catch(error => {
            this.$snotify.error(error);
          });
      }
    },
  },
};
</script>
