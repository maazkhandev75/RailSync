
--------PROCEDURE FOR SIGNUP FUNCTIONALITY-------
CREATE PROCEDURE CreateUser 
	@UserName nvarchar(255),
	@CNIC nvarchar(255),
	@Password nvarchar(255),
	@PhoneNo nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the user already exists
	IF EXISTS (SELECT 1 FROM [User] WHERE CNIC=@CNIC)
	BEGIN
		-- User already exists, return an error message
		RAISERROR ('User already exists!', 16, 1);
		RETURN -1;
	END

	-- Insert the new user into the User table
	INSERT INTO [User] ([Id], [UserName], [Password],[CNIC],[PhoneNo])
	VALUES(NEWID(), @UserName, @Password,@CNIC,@PhoneNo);

	-- Return success message
	SELECT 'User created successfully!' AS message;
END

--------PROCEDURE FOR LOGIN FUNCTIONALITY-------

CREATE PROCEDURE AuthenticateUser 
	@CNIC nvarchar(255),
	@Password nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the CNIC and password combination exists
	IF EXISTS (SELECT 1 FROM [User] WHERE  CNIC = @CNIC AND  Password = @Password)
	BEGIN
		-- User account found, return a success message
		 SELECT 'User account found!' AS message, ID, UserName FROM [User] WHERE CNIC = @CNIC;
	END
	ELSE
	BEGIN
		-- Return error message
		RAISERROR ('User account not found!', 16, 1);
		RETURN -1;
	END

END




--************************** (TESTING AREA) **************************

CreateUser 'maazkhan75','3520297089087','password1965','03204553255'

drop proc CreateUser

INSERT INTO [User] ([Id], [UserName], [Password],[CNIC],[PhoneNo])
VALUES(NEWID(), awais, awais123,1352049128298,03239292982);

delete from [User]
where UserName='user17'
SELECT * FROM [User]
GO

truncate table [User]  --we have to remove one by one 

drop proc AuthenticateUser


---------------Procedure to Search Train recursively-=----------------
USE [afaqkhaliq_SampleDB]
GO
/****** Object:  StoredProcedure [dbo].[SearchTrainWithStops]    Script Date: 22-04-2024 05:32:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[SearchTrainWithStops] @Search_from_Station nvarchar(30),@Search_to_Station nvarchar(30), @SearchDate datetime

as
WITH  TrainRoute AS (
    -- Base case: 
    SELECT
        T.TrainId,
        Tr.TrackId,
        Tr.Station1Id AS fromStation,
        Tr.Station2Id AS toStation
    FROM
        [Train] AS T
    JOIN
        [Route] AS R ON R.TrainId = T.TrainId
    JOIN
        [Tracks] AS Tr ON Tr.TrackId = R.TrackId
    JOIN
        Fare AS F ON F.TrackId = Tr.TrackId
    WHERE
        Tr.Station1Id = (SELECT StationId FROM Station WHERE StationName = @Search_from_Station)

    UNION ALL

    -- Recursive step: select the next train route
    SELECT
        T.TrainId,
        Tr.TrackId,
        Tr.Station1Id AS fromStation,
        Tr.Station2Id AS toStation
    FROM
        [Train] AS T
    JOIN
        [Route] AS R ON R.TrainId = T.TrainId
    JOIN
        [Tracks] AS Tr ON Tr.TrackId = R.TrackId
    JOIN
        Fare AS F ON F.TrackId = Tr.TrackId
    JOIN
        TrainRoute AS PrevRoute ON PrevRoute.toStation = Tr.Station1Id
    WHERE
        Tr.Station1Id <> (SELECT StationId FROM Station WHERE StationName = @Search_to_Station)
)
-- Select the final train route
select T.TrainId,T.UpDownStatus as UPStatus ,fromStation as DeptStation,toStation as ArrivalStation,DeptTime,ArrivalTime,Economy,BusinessClass,FirstClass
FROM TrainRoute as CTEtable
join [Train] as T on T.TrainId=CTEtable.TrainId
join [Route] as R
on R.TrainId=CTEtable.TrainId
join Fare as F on F.TrackId=CTEtable.TrackId
AND CONVERT(date, R.ArrivalTime) = CONVERT(date, @SearchDate)


---------------------Procedure to Search non Stops----------------------
ALTER PROCEDURE [dbo].[SearchForTrains] @fromStation nvarchar(30), @toStation nvarchar(30), @SearchDate datetime
as
select T.TrainId,Tr.TrackId as TrackId,T.UpDownStatus as UPStatus ,@fromStation as DeptStation,@toStation as ArrivalStation,DeptTime,ArrivalTime,Economy,BusinessClass,FirstClass
from [Train] as T
join [Route] as R
on R.TrainId=T.TrainId
join [Tracks] as Tr
on Tr.TrackId=R.TrackId
join Fare as F on F.TrackId=Tr.TrackId
where Tr.Station1Id=(select StationId from Station where StationName=@fromStation )
and Tr.Station2Id=(select StationId from Station where StationName=@toStation )
AND CONVERT(date, R.ArrivalTime) = CONVERT(date, @SearchDate)
-------------------Proceduure to getdetails about seats-----------------------------
alter Procedure GetTicketInfo @FoundCarriage nvarchar(30), @FoundSeat  int, @TrainId nvarchar(30), @TrackId nvarchar(30) as
select @FoundCarriage as CarriageID,@FoundSeat as SeatNo,@TrainId as TrainId, t.Station1Id as DeptStaion, t.Station2Id as ArrivalStation, r.ArrivalTime, r.DeptTime
from Tracks as t
join [Route] as r on r.TrackId=@TrackId and r.TrainId=@TrainId
where t.TrackId=@TrackId
---------------procdure to search fot available trains----------------------------------
alter PROCEDURE [dbo].[BookTicket] @TrainId nvarchar(30), @TrackId nvarchar(30), @Class nvarchar(30)
as
select top 1 s.SeatNo,c.CarriageId,T.TrainId
from [Train] as T
join [Route] as R
on R.TrainId=T.TrainId
join [Tracks] as Tr
on Tr.TrackId=R.TrackId
join Fare as F on F.TrackId=Tr.TrackId
join Carriage as c on c.TrainId=T.TrainId
join Seat as s on s.TrainID=T.TrainId
where c.Type=@Class and s.BookingStatus is  Null
------------------------Proceudr eot book ticket and update seat and paymen ttabel;---------
if(@FoundSeat is not null)
begin 
update Seat
set BookingStatus='B'
where Seat.TrainID=@TrainID and SeatNo=@FoundSeat and CarriageId=@FoundCarriage
print 'Seat Found'

end
else 
begin

