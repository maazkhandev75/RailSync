const express = require('express');
const router=express.Router();
var sql=require('mssql');

module.exports = function(pool) {
    router.post('/',(req,res)=>{
    console.log(req);
    var TrainID=req.body.searchTerm;
    
    const request= new sql.Request(pool);
    request.input('ID',sql.NVarChar,TrainID);

    request.execute('SearchForCarriage',(err,result)=>{
      if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
      }
      else{
        var Carriage=result.recordset;
        console.log(Carriage);
        res.render("admin2", { Carriage});
      }
    })
  });
  return router;
};
