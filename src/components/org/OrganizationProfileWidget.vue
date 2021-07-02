<template>
  <Widget
    :name="`Organization Profile`"
    customHeader
    title="<h3><span class='font-weight-bold'>Organization Profile</span></h3>"
    customControls="true"
  >
    <div slot="header-controls">
      <div v-on:click.stop="show = !show">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" class="float-right">
              <v-icon color="black">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-on:click="onEditItem()">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item v-on:click="handleChangeAvatar">
              <v-list-item-title>Avatar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div slot="body">
      <v-container v-if="!one">
        <v-row class="text-center">
          <v-col cols="12" v-if="inProgress">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else class="pa-0">
        <v-row>
          <v-col md="5" cols="12">
            <v-row no-gutters justify="center">
              <v-col cols="4" md="2"></v-col>
              <v-col cols="4" md="8" class="text-center">
                <v-img
                  class="profileAvatar"
                  max-width="100%"
                  v-if="one.avatarUrl != null"
                  :src="one.avatarUrl"
                  alt="..."
                ></v-img>
              </v-col>
              <v-col cols="4" md="2"></v-col>
              <h3 class="my-3">{{ one.name }}</h3>
            </v-row>
            <h4 class="text-center font-weight-light mb-3">{{ one.shortName }}</h4>
            <v-divider></v-divider>
            <v-row no-gutters justify="center" class="my-1 mt-3">
              <v-col cols="6" class="text-center">
                <v-icon class="mr-2 ml-md-0" small>mdi mdi-phone</v-icon>
              </v-col>
              <v-col cols="6" class="text-center">{{
                one.phoneNumber ? one.phoneNumber : "N/A"
              }}</v-col>
            </v-row>
            <v-row no-gutters justify="center" class="my-1">
              <v-col cols="6" class="text-center">
                <v-icon small class="mr-2 ml-md-0">mdi mdi-email</v-icon>
              </v-col>
              <v-col cols="6" class="text-center">{{ one.email }}</v-col>
            </v-row>
          </v-col>

          <v-col md="7" cols="12">
            <v-row>
              <v-col md="5" cols="6" class="text-center">
                <p class="text-semibold mb-0">1</p>
                <v-chip label color="warning" small>Teams</v-chip>
              </v-col>

              <v-col md="7" cols="6" class="pl-0 text-center">
                <p class="text-semibold mb-0">0</p>
                <v-chip label color="warning" small>Notifications</v-chip>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row class="my-1 mt-3" no-gutters>
              <v-col cols="6" md="5" class="text-center">
                <v-icon small class="mr-2">mdi-calendar</v-icon>
              </v-col>
              <v-col cols="6" md="7" class="text-center">{{
                one.birthDate ? one.birthDate : "N/A"
              }}</v-col>
            </v-row>
            <v-row class="my-1" no-gutters>
              <v-col cols="6" md="5" class="text-center">
                <v-icon small class="mr-2">mdi-home</v-icon>
              </v-col>
              <v-col cols="6" md="7" class="text-center">{{
                one.address ? one.address : "N/A"
              }}</v-col>
            </v-row>
            <v-row class="my-1" no-gutters>
              <v-col cols="6" md="5" class="text-center">
                <v-icon small class="mr-2">mdi-map-marker</v-icon>
              </v-col>
              <v-col cols="6" md="7" class="text-center">{{
                one.city ? one.city : "N/A"
              }}</v-col>
            </v-row>
            <v-row class="my-1" no-gutters>
              <v-col cols="6" md="5" class="text-center">
                <v-icon small class="mr-2">mdi-earth</v-icon>
              </v-col>
              <v-col cols="6" md="7" class="text-center">{{
                one.country ? one.country : "N/A"
              }}</v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider></v-divider>
      </v-container>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/gate/Widget";

export default {
  name: "OrganizationProfileWidget",
  components: { Widget },
  computed: {
    avatar_url: {
      get() {
        if (this.$store.state.organizationOne.one.avatarUrl) {
          return this.$store.state.organizationOne.one.avatarUrl;
        } else {
          return "https://cdn.popmetrics.ai/images/avatar.jpg";
        }
      },
    },
  },
 props: ["one", "inProgress"],
  methods: {
    handleChangeAvatar() {
      this.$emit('changeAvtarDialog')
    },
    onEditItem() {
     // console.log('onEditItem:', e);
      this.$emit('editItem', this.one.id)
    }
  }
};
</script>

<style src="./OrganizationProfileWidget.scss" lang="scss" scoped />