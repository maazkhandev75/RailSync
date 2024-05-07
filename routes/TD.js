const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = function(pool) {
    router.post('/searchCarriage', (req, res) => {
        console.log(req);
        var TrainID = req.body.searchTerm;

        const request = new sql.Request(pool);
        request.input('ID', sql.NVarChar, TrainID);

        request.execute('SearchForCarriage', (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                var Carriage = result.recordset;
                res.json({ Carriage: Carriage });
            }
        });
    });

    router.post('/searchSeat', (req, res) => {
      console.log(req);
      var CarriageID = req.body.searchTerm;

      const request = new sql.Request(pool);
      request.input('CARRIAGEID', sql.NVarChar, CarriageID);

      request.execute('SearchForSeats', (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
          } else {
              var Seat = result.recordset;
              res.json({ Seat: Seat });
          }
      });
  });

  router.post('/addStation', (req, res) => {
    const { StationID, StationName, StationAddress } = req.body;

    const request = new sql.Request(pool);
    request.input('STATIONID', sql.NVarChar, StationID);
    request.input('STATIONNAME', sql.NVarChar, StationName);
    request.input('STATIONADDRESS', sql.NVarChar, StationAddress);


    request.execute('AddStation', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});

router.post('/addTrack', (req, res) => {
    const { Station1Id, Station2Id, Economy,BusinessClass,FirstClass } = req.body;

    const request = new sql.Request(pool);
    request.input('Station1Id', sql.NVarChar, Station1Id);
    request.input('Station2Id', sql.NVarChar, Station2Id);
    request.input('Economy', sql.Float, Economy);
    request.input('BusinessClass', sql.Float, BusinessClass);
    request.input('FirstClass', sql.Float, FirstClass);

    request.execute('InsertTrack', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});

router.post('/addSecurity', (req, res) => {
    const { CrewId,CrewName,Address,DateOfBirth,StationId  } = req.body;

    const request = new sql.Request(pool);
    request.input('CrewId', sql.NVarChar, CrewId);
    request.input('CrewName', sql.NVarChar, CrewName);
    request.input('Address', sql.NVarChar, Address);
    request.input('DateOfBirth', sql.Date, DateOfBirth);
    request.input('StationId', sql.NVarChar, StationId);

    request.execute('AddSecurity', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});
router.post('/addPilot', (req, res) => {
    const { CrewId,CrewName,Address,DateOfBirth,TrainId  } = req.body;

    const request = new sql.Request(pool);
    request.input('CrewId', sql.NVarChar, CrewId);
    request.input('CrewName', sql.NVarChar, CrewName);
    request.input('Address', sql.NVarChar, Address);
    request.input('DateOfBirth', sql.Date, DateOfBirth);
    request.input('TrainId', sql.NVarChar, TrainId);

    request.execute('AddPilot', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});


router.post('/addRoute', (req, res) => {
    const { TrainId,TrackId,DepartureTime,ArrivalTime } = req.body;

    const request = new sql.Request(pool);

    request.input('ArrivalTime', sql.DateTime, ArrivalTime);
    request.input('DepartureTime', sql.DateTime, DepartureTime);
    request.input('TrackId', sql.NVarChar, TrackId);
    request.input('TrainId', sql.NVarChar, TrainId);

    request.execute('AddRoute', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});


router.post('/addCarriage', (req, res) => {
    const { TrainId, CarriageId,Type, NoOfSeats} = req.body;

    const request = new sql.Request(pool);

    request.input('NoOfSeats', sql.Int, NoOfSeats);
    request.input('Type', sql.Char, Type);
    request.input('CarriageId', sql.NVarChar, CarriageId);
    request.input('TrainId', sql.NVarChar, TrainId);

    request.execute('AddCarriage', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});


  router.post('/addTrain', (req, res) => {
    const { trainId, departureStation, ArrivalStation, upDownStatus } = req.body;

    const request = new sql.Request(pool);
    request.input('TRAINID', sql.NVarChar, trainId);
    request.input('DEPARTURESTATION', sql.NVarChar, departureStation);
    request.input('ARRIVALSTATION', sql.NVarChar, ArrivalStation);
    request.input('UPDOWNSTATUS', sql.NVarChar, upDownStatus);

    request.execute('AddTrain', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(result.recordset);
            Message=result.recordset;
            res.json({ Message });
            
        }
    });
});



router.post('/editRoute', (req, res) => {
    const { trainId, departureStation, ArrivalStation, upDownStatus } = req.body;

    const request = new sql.Request(pool);
    request.input('TRAINID', sql.NVarChar, trainId);
    request.input('DEPARTURESTATION', sql.NVarChar, departureStation);
    request.input('ARRIVALSTATION', sql.NVarChar, ArrivalStation);
    request.input('UPDOWNSTATUS', sql.NVarChar, upDownStatus);

    request.execute('EditRoute', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ message: 'Track updated successfully' });
            
        }
    });
});


  router.post('/editTrain', (req, res) => {
    const { trainId, departureStation, ArrivalStation, upDownStatus } = req.body;

    const request = new sql.Request(pool);
    request.input('TRAINID', sql.NVarChar, trainId);
    request.input('DEPARTURESTATION', sql.NVarChar, departureStation);
    request.input('ARRIVALSTATION', sql.NVarChar, ArrivalStation);
    request.input('UPDOWNSTATUS', sql.NVarChar, upDownStatus);

    request.execute('EditTrain', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ message: 'Train updated successfully' });
            
        }
    });
});

  router.delete('/deleteSeat', (req, res) => {
    const { carriageID, trainID, seatNo } = req.query;

    // Perform deletion operation in the database using carriageID, trainID, and seatNo
    // Replace this with your database deletion logic

    // Respond with success or failure
    res.sendStatus(200); // Success
    // res.sendStatus(500); // Failure
});
router.delete('/deleteTrain', (req, res) => {
    const TrainID = req.query;

    // Perform deletion operation in the database using carriageID, trainID, and seatNo
    // Replace this with your database deletion logic
    
    // Respond with success or failure
    res.sendStatus(200); // Success
    // res.sendStatus(500); // Failure
});
router.delete('/deleteCarriage', (req, res) => {
    const CarriageID    = req.query;

    // Perform deletion operation in the database using carriageID, trainID, and seatNo
    // Replace this with your database deletion logic
    
    // Respond with success or failure
    res.sendStatus(200); // Success
    // res.sendStatus(500); // Failure
});



    return router;
};
