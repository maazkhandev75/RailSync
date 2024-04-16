const express = require('express');
const router=express.Router();
var sql=require('mssql');

module.exports = function(pool) {
    router.post('/',(req,res)=>{
    var St1=req.body.fromCity;
    var St2=req.body.toCity;
    var tripDate=req.body.journeyDate;
    //console.log(tripDate);
    const request= new sql.Request(pool);
    request.input('SearchDate',sql.DateTime,tripDate);
    request.input('fromStation',sql.NVarChar,St1);
    request.input('toStation',sql.NVarChar,St2);
    request.execute('SearchForTrains',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
        var isSubmitted=true;
        var Trains=result.recordset;
        console.log(Trains);
        // res.render("TrainResult",{Trains},(err)=>{
        //   if (err) throw err;
        // });
        res.render("TrainResult", { Trains});
      }
    })
  });
  return router;
};