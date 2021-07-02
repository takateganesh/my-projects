<template>
  <Widget
    :name="`Organization Form`"
    title="<h3><span class='font-weight-bold'>Organization definition</span></h3>"
    customHeader
  >
    <div slot="body">
      <v-container v-if="!one">
        <v-row class="text-center">
          <v-col cols="12" v-if="inProgress">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <v-form v-else @submit="onSubmit" ref="form">
        <v-row no-gutters>
          <v-col cols="12" sm="3">Name</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="name"
              name="name"
              type="text"
              id="name"
              :rules="commonValidationRules.requiredRules"
            ></v-text-field>
          </v-col>
           <v-col cols="12" sm="3">Short Name</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="shortName"
              name="shortName"
              type="text"
              id="shortName"
              :class="shortNameAlreadyExist?'errorMessage':''"
              :rules="orgShortNameRule"
              @input="doCheck()"
            ></v-text-field>
            <p v-if="shortNameAlreadyExist" class="text-left mt-n6 font-weight-light red--text fontsize-12">This short name already exists</p>
          </v-col>
          <v-col cols="12" sm="3">Address</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="address"
              name="address"
              type="text"
              id="address"
              :rules="commonValidationRules.minLengthTenChars"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">Postcode</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="postcode"
              name="postcode"
              type="text"
              id="postcode"
              :rules="commonValidationRules.requiredRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">City</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="city"
              name="city"
              type="text"
              id="city"
              :rules="commonValidationRules.requiredRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">Country</v-col>
          <v-col cols="12" sm="9">
            <v-select
              dense
              outlined
              id="country"
              v-model="country"
              :items="countries"     
               item-text="name"         
              :rules="commonValidationRules.requiredRules"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="3">Avatar Url</v-col>
          <v-col cols="12" sm="9">
            <v-text-field
              outlined
              dense
              v-model="avatarUrl"
              name="AvatarUrl"
              type="url"
              id="avatarUrl"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="form-action">
          <v-btn :disabled="inProgress" type="submit" color="primary" class="float-right">
            <v-progress-circular :size="20" color="primary" indeterminate v-if="inProgress"></v-progress-circular>Submit
          </v-btn>
          <v-btn type="button" v-on:click="cancel()">Cancel</v-btn>
        </div>
      </v-form>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/gate/Widget";
import { createHelpers } from "vuex-map-fields";
import { commonValidationRules } from "@/services/util.service";
import COUNTRIES from "@/services/countries";
// console.log("countries",countries);

const { mapFields } = createHelpers({
  getterType: "organizationOne/getField",
  mutationType: "organizationOne/updateField"
});

export default {
  name: "OrganizationFormWidget",
  components: { Widget },
  props: ["appId"],
  data() {
    return {
      commonValidationRules: commonValidationRules,
      countries:COUNTRIES,
      shortNameAlreadyExist:false,
      searchInput:'',
      orgShortNameRule: [
    v => !!v || "This field is required",
    v => /^[a-zA-Z0-9-_]+$/.test(v) || "Special character not allowed",
     v => (v && v.length >= 3) || "This field must be at least 3 characters"
  ],
    };
  },
  computed: {
    ...mapFields([
      "one",
      "one.name",
      "one.address",
      "one.postcode",
      "one.city",
      "one.country",
      "one.avatarUrl",
      "one.shortName",
      "inProgress"
    ]),
        shortNameList: {
get(){
  return this.$store.state.organizationList.shortNameList;
},
set(){
return'';
}
      
    },
  },
  methods: {
    doCheck() {
      if (this.shortName) {
        const searchResult = this.shortNameList.filter((data) => data.shortName? data.shortName.toLowerCase()== this.shortName.toLowerCase() && data.id.toLowerCase() !== this.one.id.toLowerCase():'')
       if(searchResult.length >= 1 ){

        return this.shortNameAlreadyExist = true
       }else{
          return this.shortNameAlreadyExist = false
       }
      } else {
        return this.shortNameAlreadyExist = false
      }
    
    },
    async onSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate() && !this.shortNameAlreadyExist) {
        const needsCreation = this.one.id === undefined || this.one.id === null || this.one.id === 'new';
        if (needsCreation) {
          await this.$store.dispatch("organizationOne/create").then(()=>{
          this.$snotify.success("Organization created successfully.", {
              position: "rightTop",
              showProgressBar: false
          });
            this.$emit('submitted', this.one.id)
          }).catch((error) => {
              this.$snotify.error(error, {
                position: "rightTop",
                showProgressBar: false,
              });
              this.$emit("canceled", this.one.id);
            });
        }
        else{
          await this.$store.dispatch("organizationOne/update").then(()=>{
            this.$snotify.success("Organization updated successfully.", {
              position: "rightTop",
              showProgressBar: false
          });
          this.$emit('submitted', this.one.id)
          }).catch((error) => {
              this.$snotify.error(error, {
                position: "rightTop",
                showProgressBar: false,
              });
          this.$emit("canceled", this.one.id);
            });
        }
      }
    },
    cancel() {
       this.$emit('canceled', this.one.id);
    }
  },
  created(){
     this.$store.dispatch("organizationList/fetchShortNameList", {
       appId: this.appId,
    });
  }
};
</script>
<style scoped>
.fontsize-12{
  font-size: 12px;
  margin-left: 10px;
}
.errorMessage.v-text-field--outlined >>> fieldset {
  border-color: #ff5252; 
  background-color: #fff;
}
</style>

