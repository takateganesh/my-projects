<template>
  <Widget
    :name="`Organization Essentials`"
    title="<h3><span class='font-weight-bold'>Organization</span></h3>"
    customHeader
  >
    <div slot="body">
      <v-container v-if="inProgress">
        <v-row class="text-center">
          <v-col cols="12">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <div v-else>
        <div>
          <p>{{one.name}}</p>
          <p>
            &nbsp;
            <v-icon>mdi-map-marker</v-icon>
            {{one.address}}, {{one.postcode}}
          </p>
          <p>{{one.city}}, {{one.country}}</p>
        </div>
        <p>Operational notes for this organization</p>

        <v-footer>
          <ul class="post-links">
            <li>
              <a href="#" class="text-decoration-none">1 hour</a>
            </li>
            <li>
              <a href="#" class="text-decoration-none">
                <v-icon color="red" small>mdi-heart</v-icon>Like
              </a>
            </li>
            <li>
              <a href="#" class="text-decoration-none">Comment</a>
            </li>
          </ul>
        </v-footer>
      </div>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/gate/Widget";



export default {
  name: "OrganizationEssentialWidget",
  components: { Widget },
  props:["one","inProgress"]
};
</script>
