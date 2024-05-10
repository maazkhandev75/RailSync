const express = require('express');
const router=express.Router();
var sql=require('mssql');
const sessionChecker = (req, res, next) => {
  if (req.session && req.session.user) {
      // If session exists and user is authenticated
      next();
  } else {
      // If session doesn't exist or user is not authenticated
      res.redirect('login'); // Redirect to login page or any other route
  }
};

module.exports = function(pool) {
  
    router.post('/',(req,res)=>{
      console.log(req.body);
    var St1=req.body.fromCity;
    var St2=req.body.toCity;
    var tripDate=req.body.journeyDate;
   // let temp=tripDate.toISOString().split('T');
  //  console.log(temp);
    const request= new sql.Request(pool);
    request.input('SearchDate',sql.DateTime,tripDate);
    request.input('fromStation',sql.NVarChar,St1);
    request.input('toStation',sql.NVarChar,St2);
    var Trains=[];
    var TrainsWithStops=[];
    request.execute('SearchForTrains',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
         Trains=result.recordset;
         console.log("NON STOP TRAIN FOUND :");
        console.log(Trains);
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
         console.log(" STOP TRAIN FOUND :");
        console.log(result);
      
    //    if(Trains.length!==0 && TrainsWithStops.length!==0)
    //    TrainsWithStops = TrainsWithStops.filter(train => !Trains.some(t => t.TrainId === train.TrainId));
      
    //   if (TrainsWithStops.length <=0){
    //     TrainsWithStops = [];
    //     res.render("TrainResult", { Trains, TrainsWithStops });
    // }
    //   else{
    //   if(TrainsWithStops[0].DeptStation ==St1 && TrainsWithStops[TrainsWithStops.length - 1].ArrivalStation==St2) 
    //     res.render("TrainResult", { Trains, TrainsWithStops });
    //   else {
    //     TrainsWithStops = [];
    //     res.render("TrainResult", { Trains, TrainsWithStops });
    //   }
         res.render("TrainResult", { Trains, TrainsWithStops });
      }
      });
    });
  });

  
//   router.post('/PrintTrainsWithStopsDetails', (req, res) => {
//   console.log(req.body);
// const userName = "";
//   var selectedClass = req.body[req.body.length-1].selectedClass;
//   console.log(userName);
//   let TicketInfo = [];
//   req.body.pop();
//   if (selectedClass === "Economy") inputClassType = "E";
//   else if (selectedClass === "Bussiness") inputClassType = "B";
//   else if (selectedClass === "First Class") inputClassType = "F";
//   req.body.forEach(i => {
//     const InputTrackId = i.TrackID;

//     const request = new sql.Request(pool);
//     request.input('TrainId', sql.NVarChar(30), i.TrainID);
//     request.input('TrackId', sql.NVarChar(30), i.TrackID);
//     request.input('Class', sql.NVarChar(30), inputClassType);
//     var TicketAvailInfo = [];
//     request.execute('BookTicket', (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       else {
//         TicketAvailInfo = result.recordset[0];
//         console.log(TicketAvailInfo);
//         if (TicketAvailInfo.length != 0) {
//           const TicketInfoReq = new sql.Request(pool);
//           TicketInfoReq.input('FoundCarriage', sql.NVarChar(30), TicketAvailInfo.CarriageId);
//           TicketInfoReq.input('TrainId', sql.NVarChar(30), i.TrainID);
//           TicketInfoReq.input('FoundSeat', sql.Int, TicketAvailInfo.SeatNo);
//           TicketInfoReq.input('TrackId', sql.NVarChar(30), InputTrackId);
//           console.log(InputTrackId);
//           TicketInfoReq.execute('GetTicketInfo', (err, result2) => {

//             if (err) {
//               console.error(err);
//               res.status(500).send('Internal Server Error');
//             }
//             else {
//               console.log("seat details are: ");
//               console.log(result2);

//               TicketInfo.push(result2.recordset);

//             }
//           });
//         }
//       }
//     });
//   });
//   console.log(TicketInfo);
//   res.render('Ticket.ejs', { TicketInfo, inputClassType, userName });
// });

router.post('/PrintTicketNonStop', (req, res) => {
  console.log(req.body);
    const userName = req.session.userDetails.username;
    console.log(userName);
  const InputTrackId=req.body.TrackID;
  var inputClassType=req.body.selectedClass;
  if(req.body.selectedClass==="Economy") inputClassType="E";
  else if(req.body.selectedClass==="Bussiness") inputClassType="B";
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
        console.log(TicketAvailInfo);
        if(TicketAvailInfo != undefined){
          const TicketInfoReq= new sql.Request(pool);
        TicketInfoReq.input('FoundCarriage',sql.NVarChar(30),TicketAvailInfo.CarriageId);
        TicketInfoReq.input('TrainId',sql.NVarChar(30),req.body.selectedTrainID);
        TicketInfoReq.input('FoundSeat',sql.Int,TicketAvailInfo.SeatNo);
        TicketInfoReq.input('TrackId',sql.NVarChar(30),InputTrackId);
        console.log(InputTrackId);
        TicketInfoReq.execute('GetTicketInfo',(err,result2)=>{

        if(err){
          console.error(err);
          res.status(500).send('Internel Server Error');
        }
        else{
          console.log("seat details are: ");
          console.log(result2);
        }

        var TicketInfo=result2.recordset;
        res.render('Ticket',{TicketInfo,inputClassType,userName});
      });
    }
    else{
         res.send("No Seat Available");

    }
  }
})
});


router.post('/ConfirmNonStopTicket',(req,res)=>{
  
  console.log(req.body);
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
     console.log("Ticket Booked ");  
    res.json({status:true});
    }
  });

});


// router.post('/PrintTicketsWithStopsDetails', (req, res) => {
//   console.log(req.body);
//   const userName = ""; // Assuming this variable will be used later in the code
//   let inputClassType = "";
//   const selectedClass = req.body[req.body.length - 1].selectedClass;

//   let TicketInfo = [];

//   req.body.pop();

//   if (selectedClass === "Economy") {
//     inputClassType = "E";
//   } else if (selectedClass === "Business") {
//     inputClassType = "B";
//   } else if (selectedClass === "First Class") {
//     inputClassType = "F";
//   }

//   const promises = req.body.map(i => {
//     const InputTrackId = i.TrackID;

//     const request = new sql.Request(pool);
//     request.input('TrainId', sql.NVarChar(30), i.TrainID);
//     request.input('TrackId', sql.NVarChar(30), i.TrackID);
//     request.input('Class', sql.NVarChar(30), inputClassType);

//     return new Promise((resolve, reject) => {
//       request.execute('BookTicket', (err, result) => {
//         if (err) {
//           console.log(err);
//           reject(err);
//         } else {
//           let TicketAvailInfo =[];
//            TicketAvailInfo=result.recordset[0];
//           console.log(result);
//           //if(result == undefined) res.send("No Ticket Found");
//           if (TicketAvailInfo != undefined) {
//             const TicketInfoReq = new sql.Request(pool);
//             TicketInfoReq.input('FoundCarriage', sql.NVarChar(30), TicketAvailInfo.CarriageId);
//             TicketInfoReq.input('TrainId', sql.NVarChar(30), i.TrainID);
//             TicketInfoReq.input('FoundSeat', sql.Int, TicketAvailInfo.SeatNo);
//             TicketInfoReq.input('TrackId', sql.NVarChar(30), InputTrackId);
//             console.log(InputTrackId);

//             TicketInfoReq.execute('GetTicketInfo', (err, result2) => {
//               if (err) {
//                 console.error(err);
//                 reject(err);
//               } else {
//                 console.log("seat details are: ");
//                 console.log(result2);

//                 TicketInfo.push(result2.recordset);
//                 resolve();
//               }
//             });
//           } else {
//             resolve();
//           }
//         }
//       });
//     });
//   });

//   Promise.all(promises)
//     .then(() => {
//       console.log(TicketInfo);
//       //res.render('Ticket.ejs', { TicketInfo, inputClassType, userName });
//       res.json(TicketInfo);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     });
// });
  return router;
};