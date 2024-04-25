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
