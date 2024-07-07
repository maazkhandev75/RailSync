const express = require('express');
const router=express.Router();
var sql=require('mssql');

const sessionChecker = (req, res, next) => {
  if (req.session && req.session.user) {
      // If session exists and user is authenticated
      next();
  } else {
      // If session doesn't exist or user is not authenticated
      res.redirect('errorOfSession');
  }
};

module.exports = function(pool) {
  
    var Trains=[];
    var TrainsWithStops=[];

    router.post('/',(req,res)=>{
    //console.log(req.body);
    var St1=req.body.fromCity;
    var St2=req.body.toCity;
    var tripDate=req.body.journeyDate;
   // let temp=tripDate.toISOString().split('T');
  //  console.log(temp);
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
         Trains=result.recordset;
         //console.log("NON STOP TRAIN FOUND :");
        //console.log(Trains);
      }
    
    const CTErequest= new sql.Request(pool);
    CTErequest.input('SearchDate',sql.DateTime,tripDate);
    CTErequest.input('Search_from_Station',sql.NVarChar,St1);
    CTErequest.input('Search_to_Station',sql.NVarChar,St2);
    CTErequest.execute('SearchTrainWithOneStop',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
         TrainsWithStops=result.recordset;
         //console.log("STOP TRAIN FOUND :");
        //console.log(result);
      
         res.render("USER/TrainResult", { Trains, TrainsWithStops });
      }
      });
    });
  });


router.post('/PrintTicketNonStop', (req, res) => {
  //console.log(req.body);
  const userName = req.session.userDetails.username;
  //console.log(userName);
  const InputTrackId=req.body.TrackID;
  var inputClassType=req.body.selectedClass;
  if(req.body.selectedClass==="Economy") inputClassType="E";
  else if(req.body.selectedClass==="Business") inputClassType="B";    //after spending 1/2 hour I finally found out instead of writing business some fellow wrote bussiness and because of that no seats available was shown :p
  else if(req.body.selectedClass==="First Class") inputClassType="F";

  const request= new sql.Request(pool);
  request.input('TrainId',sql.NVarChar(30),req.body.selectedTrainID);
  request.input('TrackId',sql.NVarChar(30),req.body.TrackID);
  request.input('Class',sql.NVarChar(30),inputClassType);
  var TicketAvailInfo="";
  request.execute('BookTicket',(err,result)=>{   
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else{
        TicketAvailInfo=result.recordset[0];
        //console.log(TicketAvailInfo);
        // console.log("testing123");
        if(TicketAvailInfo != undefined)    //ticket avail info comes to ourselft undefine so it goes to else part and prints no seats available
        {
          const TicketInfoReq= new sql.Request(pool);
        TicketInfoReq.input('FoundCarriage',sql.NVarChar(30),TicketAvailInfo.CarriageId);
        TicketInfoReq.input('TrainId',sql.NVarChar(30),req.body.selectedTrainID);
        TicketInfoReq.input('FoundSeat',sql.Int,TicketAvailInfo.SeatNo);
        TicketInfoReq.input('TrackId',sql.NVarChar(30),InputTrackId);
        //console.log(InputTrackId);
        TicketInfoReq.execute('GetTicketInfo',(err,result2)=>{

        if(err){
          console.error(err);
          res.status(500).send('Internel Server Error');
        }
        else{
          //console.log("seat details are: ");
          //console.log(result2);
        }

        var TicketInfo=result2.recordset;
        res.render('USER/Ticket',{TicketInfo,inputClassType,userName});
      });
    }
    else
    {
        //  res.send("No Seat Available");
        res.render('USER/noSeatsAvailable');
    }
  }
})
});


router.post('/ConfirmNonStopTicket',(req,res)=>{
  
  //console.log(req.body);
  let AddTicket= new sql.Request(pool);
  AddTicket.input('Seat',sql.Int,req.body.SeatNo);
  AddTicket.input('Carriageid',sql.NVarChar,req.body.CarriageId);
  AddTicket.input('TrainId',sql.NVarChar,req.body.TrainId);
  AddTicket.input('TrackId',sql.NVarChar,req.body.trackId);
  AddTicket.input('CNIC',sql.NVarChar, req.session.userDetails.cnic);
  AddTicket.execute('insertTicket',(err,result)=>{
    if(err) {
      res.json({status:false});
      }
    else{
     //console.log("Ticket Booked ");  
    res.json({status:true});
    }
  });

});

return router;
};