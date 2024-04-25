select* FROM Carriage where TrainId='101';

insert into Carriage
values('203','101','F');

CREATE PROCEDURE SearchForCarriage
    @ID nvarchar(255)
AS
BEGIN
    SELECT * FROM Carriage WHERE TrainId = @ID;
END;


EXEC SearchForCarriage @ID='101';

CREATE PROCEDURE SearchForSeats
    @CARRIAGEID nvarchar(255)
AS
BEGIN
    Select * from [Seat] where CarriageID=@CARRIAGEID
END;

EXEC SearchForSeats @CARRIAGEID='202'
