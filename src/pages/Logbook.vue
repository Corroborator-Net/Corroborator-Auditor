<template>
  <q-page >

<!-- TABLE VIEW (STATUS_NO_IMG) -->
    <div v-if="isNoImg" class="flex flex-center">
      <q-input class="q-py-lg" style="width: 55%" dense standout="bg-primary" v-model="filter" placeholder="Search (CID, Dates, Locations, ...)">
        <template v-slot:append>
          <q-icon v-if="filter === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
        </template>
      </q-input>
      <q-table
        name="cidTable"
        row-key="cid"
        no-data-label="No Data Found. Have you selected a Log to read from?"
        loading-label="Gathering Log Data..."
        :data="tableData"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
        table-style="max-height: 67vh;"
        style="width: 80vw;"
        class="my-sticky-header-column-table"
        virtual-scroll
        :virtual-scroll-slice-size="25"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props" @click.native="selectCID(props.row.cid)">
            <div>{{ props.value }}</div>
          </q-td>
        </template>
      </q-table>
    </div>

<!-- IMAGE CARD VIEW (STATUS_IMG) -->
    <div v-if="currentCID" class="flex justify-center q-pt-xl">
        <q-card class="img-card" align="center" style="width: 90%">
        <img id="imgSelected" :src="imgURL" style="max-width: 80vh" :alt="currentCID">
        <!-- LOADING -->
        <div v-if="isLoading" class="text-center">
          <h5>loading...</h5>
        </div>
        <!-- METADATA LOADED -->
        <div v-if="metaData" class="q-pa-md">
          <q-list dense bordered padding class="rounded-borders">
            <q-item>
              <q-item-section>
                <b>Fingerprint (CID)</b>
              </q-item-section>
              <q-item-section >
                {{currentCID}}
              </q-item-section>
            </q-item>
            <q-item v-for="(value, key) in metaData">
              <q-item-section>
                <b>{{ key }}</b>
              </q-item-section>
              <q-item-section>
                {{value}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-card-actions align="around" style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)">
          <q-btn flat round color="blue-grey-9" icon="layers_clear" stacked no-caps label="Reset" @click="reset()"/>
          <q-btn flat round color="blue-grey-9" stacked no-caps label="Report" icon="image_search" @click="retrieveImageMetadata()" />
        </q-card-actions>
        </q-card>

    </div>

    <!--FAILED-->
    <div v-if="isFailed">
      <h2>Error... Fail.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Try again</a>
      </p>
    </div>

  </q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";

// TABLE DATA GENERATION
let tableData = []


// we are not going to change this array,
// so why not freeze it to avoid Vue adding overhead
// with state change detection
// Object.freeze(tableData)

export default {
  name: "Logbook",
  data: function() {
    return {
      tableData,
      currentStatus: "STATUS_NO_IMG",
      currentCID: "",
      imgURL: "",
      knownCids: [],
      knownDates: [],
      knownLocations: [],
      metaData: "",
        filter: '',
        pagination: {
          sortBy: 'logT',
          descending: false,
          page: 1,
          rowsPerPage: 10
          // rowsNumber: xx if getting data from a server
        },
        columns: [
        {
          name: 'cidTable',
          required: true,
          label: 'Fingerprint (CID)',
          field: row => row.cid,
          format: val => this.shortenCID(val),
          classes: 'ellipsis'
        },
        // { name: 'logT', label: 'Log Timestamp', field: 'logT', align: 'center', sortable: true },
        { name: 'fileT', label: 'File Timestamp', field: 'fileT', align: 'center', sortable: true },
        { name: 'location', label: 'Location (lat,long)', field: 'location', align: 'center', sortable: true },
        // { name: 'purpose', label: 'Purpose', field: 'purpose', align: 'center', sortable: true },
        // { name: 'device_model', label: 'Device Model', field: 'device_model', align: 'center', sortable: true },
        // { name: 'device_id', label: 'Device ID', field: 'device_id', align: 'center', sortable: true },
        // { name: 'department', label: 'Department', field: 'department', align: 'center', sortable: true },
        // { name: 'user_name', label: 'Logged by User', field: 'user_name', align: 'center', sortable: true }
      ]
    }
  },
  mounted: function() {
    // this.reset();
    this.getAtraRecordData();
  },
  computed: {
    isNoImg() {
      return this.currentStatus === "STATUS_NO_IMG";
    },
    isImg() {
      return this.currentStatus === "STATUS_IMG";
    },
    isLoading() {
      return this.currentStatus === "STATUS_LOADING";
    },
    isFailed() {
      return this.currentStatus === "STATUS_FAILED";
    }
  },
  methods: {

    shortenCID(val){
      let short = val.substring(0,2) + "..." + val.substring(val.length - 6, val.length);
      return short
    },

    async retrieveImageMetadata(){
      let img;
      img = document.getElementById("imgSelected");
      // Pass in image data to get metadata out
      this.currentStatus = "STATUS_LOADING";
      const jsonData =  await ImageMetadata.GetMetadata(img).then( response =>{
          // get specific information: jsonData["purpose"], etc.
          this.metaData = response;
          console.log(response);
      }
      ).catch( err=>{
          this.metaData = err;

      }
      );

      this.currentStatus = "STATUS_IMG";
    },

    async getAtraRecordData() {
      [this.knownCids, this.knownDates, this.knownLocations] = await AtraAPI.GetCIDsLocationAndDates();

        for (let i = 0; i < this.knownCids.length; i++) {
            // console.log("got the data: " + this.knownCids[i]);
            let newTableEntry =
                {
                    cid: this.knownCids[i],
                    fileT: this.knownDates[i],
                    location: this.knownLocations[i],
                };
            this.tableData.push(newTableEntry);
            // console.log(newTableEntry.cid);
        }


    },

    async selectCID(rowCID) {
      this.currentCID = rowCID;
      // NOTE: if you use a gateway you MUST enable XHR in browser else this fails silently!
      this.imgURL = 'https://gateway.pinata.cloud/ipfs/' + this.currentCID;
      this.currentStatus = "STATUS_IMG";
    },

    reset() {
      // reset form to initial state
      this.currentStatus = "STATUS_NO_IMG";
      this.currentCID = "";
      this.metaData = "";
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
img-card
    max-height: 75vh;

.my-sticky-header-column-table

  background-color: #336699

  td
    /* bg color is important for td; just specify one */
    background-color: #eee
  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #4578e3 !important

  tr th
    background: #336699 !important
    opacity: 1 !important

    position: sticky
    /* higher than z-index for td below */
    z-index: 2

  tr:first-child th
    top: 0
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
</style>