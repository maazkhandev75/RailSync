const express = require('express');
const router=express.Router();
var sql=require('mssql');

 
// const reqFilter =(req,resp,next)=>{
//    if(!req){
//      alert("Please Select A Date!");
//    }
//   { 
//     console.log("in middele ware");
//     next();
//   }
// }
module.exports = function(pool) {
  
 // router.use(reqFilter);
    router.post('/',(req,res)=>{
    var St1=req.body.fromCity;
    var St2=req.body.toCity;
    var tripDate=req.body.journeyDate;
    if(!journeyDate) {
      alert("Please Select A date");
    return 0;
   }
    const request= new sql.Request(pool);
    request.input('SearchDate',sql.DateTime,tripDate);
    request.input('fromStation',sql.NVarChar,St1);
    request.input('toStation',sql.NVarChar,St2);
    var Trains=0;
    var TrainsWithStops=0;
    request.execute('SearchForTrains',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
         Trains=result.recordset;
        console.log(Trains);
      }
    })
    
    const CTErequest= new sql.Request(pool);
    CTErequest.input('SearchDate',sql.DateTime,tripDate);
    CTErequest.input('Search_from_Station',sql.NVarChar,St1);
    CTErequest.input('Search_to_Station',sql.NVarChar,St2);
    CTErequest.execute('SearchTrainWithStops',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
        var TrainsWithStops=result.recordset;
        console.log(TrainsWithStops);
      }
      
      res.render("TrainResult", { Trains,TrainsWithStops});
    })
  });
  return router;
};