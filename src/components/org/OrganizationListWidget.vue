<template>
  <div>
    <v-row class="mb-12">
      <v-col cols="12">
        <widget
          customHeader
          :name="`Organization List Page`"
          title="<h3><span class='font-weight-bold'>Organizations</span></h3>"
        >
          <div cols="12" slot="body" class="pt-2">
             <v-row>
               <slot name="toolbar"></slot>
             </v-row>
            <v-row>
              <v-col class="mt-4 mb-2">
                <v-text-field
                  outlined
                  v-model="search.name"
                  dense
                  placeholder="Search by Name"
                  @input="onSearch"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              v-model="selectedRec"
              :headers="headers"
              :items="list"
              item-key="name"
              class="elevation-1"
              :loading="fetchInProgress"
              show-select
              single-select
              hide-default-footer
              :page.sync="page"
              :items-per-page="itemsPerPage"
              @page-count="pageCount = $event"
              @item-selected="itemSelected"
            >
               <template v-slot:footer>
                <v-divider></v-divider>
                <v-row align="center">
                  <v-col cols="2" class="px-4">
                    <v-select
                      :value="itemsPerPage"
                      :items="perPageRecordsOptions"
                      label="Items per page"
                      @change="itemsPerPage = parseInt($event, 10)"
                    ></v-select>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="8" class="px-4">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </template>
            </v-data-table>
          </div>
        </widget>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Widget from "@/components/gate/Widget";

export default {
  name: "OrganizationsPage",
  components: { Widget },
   data() {
    return {
      selectedRec: [],
      search: { name: "" },
      page: 1,
      itemsPerPage: 10,
      perPageRecordsOptions: [5, 10, 50, 100, 500],
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name"
        },
         {
          text: "Short Name",
          align: "center",
          sortable: false,
          value: "shortName"
        },
        {
          text: "Address",
          align: "center",
          sortable: true,
          filterable: true,
          value: "address"
        },
        {
          text: "Post Code",
          align: "center",
          sortable: true,
          value: "postCode"
        },
        {
          text: "Country",
          align: "center",
          sortable: true,
          value: "country"
        }
      ]
    };
  },
  computed: {
    appId: function() {
      return this.$route.params.appId;
    },
    fetchInProgress: function() {
      return this.$store.state.organizationList.inProgress;
    },
    list: function() {
      return this.$store.state.organizationList.list;
    },
    pageCount: {
      get: function() {
        return Math.ceil(
          this.$store.state.organizationList.recordsCount / this.itemsPerPage
        );
      },
      set: function() {}
    }
  },
  watch: {
    page: function() {
      if (this.search.name) {
        this.onSearch();
      } else {
        this.$store.dispatch("organizationList/fetchList", {
          nameLike: this.search.name,
          appId: this.appId,
          recursive: true,
          pageNumber: this.page,
          limit: this.itemsPerPage
        });
      }
    },
    itemsPerPage: function() {
      if (this.page == 1) {
        if (this.search.name) {
          this.onSearch();
        } else {
          this.$store.dispatch("organizationList/fetchList", {
            nameLike: this.search.name,  
            appId: this.appId,
            recursive: true,
            pageNumber: this.page,
            limit: this.itemsPerPage
          });
        }
      }
      this.page = 1;
    }
  },
  methods: {
       changePageCount(e){
     // this.$emit("changePageCount", e);
      this.pageCount = e
    },
    paginationChanged(e){
      //this.$emit("paginationChanged", e);
      this.itemsPerPage = parseInt(e, 10)
    },
    setSelected(row) {
      this.selectedRec = row;
    },
     itemSelected(e) {
      //console.log('e:',e)
      this.$emit('itemSelected', e)
    },
    onSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(
        function() {
          this.$store.dispatch("organizationList/fetchList", {
            appId: this.appId,
            nameLike: this.search.name,
            pageNumber: this.page,
            limit: this.itemsPerPage
          });
        }.bind(this),
        200
      );
    }
  },
  created() {
    //this.$store.dispatch("organizationList/fetchList", this.appId);
    this.$store.dispatch("organizationList/fetchList", {
      nameLike: this.search.name, 
      appId: this.appId,
      recursive: true,
     pageNumber: this.page,
      limit: this.itemsPerPage
    });
    //if (!this.appOne.id) this.$store.dispatch("appOne/fetchOne", this.appId);
  }
};
</script>
