<template>
  <v-breadcrumbs :items="crumbs" class="apps-breadcrumb" large divider=">"></v-breadcrumbs>
</template>
<script>
const _ = require("lodash");

export default {
  computed: {
    crumbs: function() {
      let ancestors = this.getBreadcrumbTrail(this.$route);
      let items = [];
      for (let i in ancestors) {
        let item = this.createBreadcrumbItemFromMeta(ancestors[i]);
        items.push(item);
      }
      return items;
    }
  },
  methods: {
    getBreadcrumbTrail: function(route) {
      let invTrail = [];
      this.collectAncestorsBreadcrumb(route, invTrail);
      return invTrail.reverse();
    },

    collectAncestorsBreadcrumb: function(route, invTrail) {
      let currentMeta = { label: "Missing breadcrumb meta" };
      if (route.meta && route.meta.breadcrumb)
        currentMeta = route.meta.breadcrumb;
      currentMeta.routeName = route.name;

      invTrail.push(currentMeta);
      if (currentMeta.parent) {
        let parentRoute = this.findRouteWithName(
          this.$router.options.routes,
          currentMeta.parent
        );
        if (parentRoute == null) {
          invTrail.push({
            label: `Missing route with name: ${currentMeta.parent}`
          });
        } else {
          this.collectAncestorsBreadcrumb(parentRoute, invTrail);
        }
      }
    },

    findRouteWithName: function(inArray, routeName) {
      let found = null;
      for (let i in inArray) {
        let iRoute = inArray[i];
        if (routeName == iRoute["name"]) {
          found = iRoute;
          break;
        }
        if (iRoute.children && iRoute.children.length > 0) {
          found = this.findRouteWithName(iRoute.children, routeName);
          if (found) {
            break;
          }
        }
      }
      return found;
    },

    createBreadcrumbItemFromMeta(meta) {
      let item = {};
      if (_.isString(meta.label)) {
        item.text = meta.label;
      } else if (_.isFunction(meta.label)) {
        item.text = meta.label(this.$store.state);
      }
      let rparams = {};
      if (meta.routeParams) {
        for (let param in meta.routeParams) {
          if (_.isFunction(meta.routeParams[param])) {
            rparams[param] = meta.routeParams[param](this.$store.state);
          }
        }
      }
      let resolved = this.$router.resolve({
        name: meta.routeName,
        params: rparams
      });
      if (resolved.route) {
        item.to = { name: resolved.route.name };
      }

      return item;
    }
  }
};
</script>
<style lang="scss">
.apps-breadcrumb {
  &.theme--dark.v-breadcrumbs .v-breadcrumbs__item--disabled,
  & a {
    color: white !important;
  }
  &.theme--dark.v-breadcrumbs .v-breadcrumbs__divider {
    color: #fff !important;
  }
}
</style>