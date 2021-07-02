<template>
  <Widget
    :name="`Operational Notes`"
    title="<h3><span class='font-weight-bold'>Operational Notes</span><h3>"
    customHeader
    class="mt-4"
  >
    <div slot="header-controls">
      <v-btn v-on:click="handleClickedSettings" icon class="float-right">
        <v-icon>mdi mdi-settings</v-icon>
      </v-btn>
    </div>
    <div slot="body">
      <div v-if="!note">
        <v-row class="text-center">
          <v-col cols="12" v-if="inProgress">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <!--  <vue-markdown :show="true" :source="note.body"></vue-markdown> -->
        <ul>
          <li v-for="item in one" v-bind:key="item.ownerId">{{ item.body }}</li>
        </ul>
      </div>

      <v-dialog v-model="dialog" ref="notesModalRef" max-width="600px">
        <v-card flat tile>
          <v-form ref="form">
            <v-card-title>
              <v-row no-gutters>
                <v-col cols="11">
                  <p class="mb-1">Edit notes</p>
                </v-col>
                <v-col cols="1" class="text-right">
                  <router-link to class="text-decoration-none black--text">
                    <div @click="dialog=false">X</div>
                  </router-link>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-2">
              <v-row v-if="note">
                <v-col cols="12" sm="6">
                  <v-textarea
                    :rows="8"
                    id="default-textarea"
                    name="body"
                    outlined
                    v-model="body"
                    :rules="commonValidationRules.requiredRules"
                    placeholder="... add your notes here ..."
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                   <vue-markdown :show="true" :source="body"></vue-markdown> 
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="px-2 py-3">
              <v-row no-gutters>
                <v-col cols="12" class="text-right">
                  <v-btn class="ma-2" tile @click="dialog=false">Cancel</v-btn>
                  <v-btn
                    class="text-uppercase ma-2"
                    color="primary"
                    tile                  
                    @click="modalHandleOk"
                  >OK</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/gate/Widget";
import { commonValidationRules } from "@/services/util.service";
import { createHelpers } from "vuex-map-fields";
import VueMarkdown from "vue-markdown-v2";

const { mapFields } = createHelpers({
  getterType: "opnotesOne/getField",
  mutationType: "opnotesOne/updateField"
});

export default {
  name: "OperationalNotesWidget",
  components: {
    Widget,
    VueMarkdown,
  },
  data() {
    return {
      commonValidationRules: commonValidationRules,
      dialog: false
    };
  },
  props: ["ownerId", "ownerType"],

  computed: {
    userId: function() {
      return this.$route.params.userId;
    },
    ...mapFields(["one", "note.body", "note", "inProgress"])
  },
  created() {
    let ownerId = this.ownerId;
    let ownerType = this.ownerType;

    this.$store.dispatch("opnotesOne/getOrCreate", { ownerId, ownerType });
  },
  methods: {
    handleClickedSettings() {
      //this.$refs.notesModalRef.show();
      this.dialog = true;
    },
    async modalHandleOk(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("opnotesOne/saveNotes")
          .then(data => {
            let message = null;
            if (data.new == true) message = "Note Inserted successfully";
            else message = "Note Updated successfully";
            this.$snotify.success(message, {
              position: "rightTop",
              showProgressBar: false
            });
            let ownerId = this.ownerId;
            let ownerType = this.ownerType;
            this.$store.dispatch("opnotesOne/getOrCreate", {
              ownerId,
              ownerType
            });
            this.dialog = false;
          })
          .catch(error => {
            this.$snotify.error(error, {
              position: "rightTop",
              showProgressBar: false
            });
            this.dialog = false;
          });
      }
    },
    modalHandleCancel() {}
  }
};
</script>

<style src="./OperationalNotesWidget.scss" lang="scss" scoped />