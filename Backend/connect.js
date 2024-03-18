const sql = require('mssql');

const sqlConfig = {
    user:'afaqkhaliq_SampleDB',
    password:'afaq123',
    database:'afaqkhaliq_SampleDB',
    server: 'sql.bsite.net\\MSSQL2016',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    } , options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
      }
  }
  
 
  var executeQuery = function(req, res){             
    sql.connect(sqlConfig, function (err) {
       if (err) {   
           console.log("Error while connecting database :- " + err);
           
       }
       else {
           console.log('Database Connected');
         // create Request object
         var request = new sql.Request();
         // query to the database
         request.query(req, function (err, response) {
           if (err) {
             console.log("Error while querying database :- " + err);
             
             }
             else {
               console.log(response);
               
             }
         });
       }
   });           
}
executeQuery('select * from [User]');