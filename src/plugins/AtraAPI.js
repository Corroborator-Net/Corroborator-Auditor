import Crypto from "./Crypto";
import key from "../config/env.js";

export default class AtraAPI{

  // gets the CIDs in order of most recent to oldest
  static async GetCIDs(){
    const json = await  this.GetAtraRecords();
    const CIDs =[];
    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length-1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
    }
    CIDs.push( Crypto.Decrypt(record[0],key));

    return CIDs;
  }

  static async GetAtraRecords(){
    const resp = await fetch("https://api.atra.io/prod/v1/dtables/records?tableId=b5c44420-799c-4ab9-8c0d-1045106fbd2d", {
      headers:{
        "x-api-key":"vdssu05AWO6yAG4ojL4Sv6I9RkAGCak19hBhTVpm"
      }
    });
    const json = await resp.json();
   return json;
  }

  // gets the records in order of most recent to oldest
  static async GetCIDsLocationAndDates(){
    const json = await this.GetAtraRecords();
    const CIDs = [];
    const Dates = [];
    const Locations = [];

    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length-1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
      // skip test records
      if (record[0].includes("test"))
        continue;
      CIDs.push( Crypto.Decrypt(record[0],key));
      Dates.push(Crypto.Decrypt(record[1],key));
      Locations.push(Crypto.Decrypt(record[2],key));
    }

    return [CIDs, Dates, Locations];
  }


  // How to use:
  // import AtraAPI from "../components/AtraAPI";
  // async function fillCIDsVariable() {
  //   const cids = await AtraAPI.GetCIDs();
  //   return cids;
  // }
  // const cids = await fillCIDsVariable();

}
//
// "live": [
//   {
//     "0": "0xfe3B5d6D6b2F3969a61432F8Ad10db7009690BfD",
//     "1": [
//       "CIDTest",
//       "1/1/2001",
//       "lat:0, long:0"
//     ],
//     "recordId": "0xfe3B5d6D6b2F3969a61432F8Ad10db7009690BfD",
//     "record": [
//       "CIDTest",
//       "1/1/2001",
//       "lat:0, long:0"
//     ]
//   },
