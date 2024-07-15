
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
	INSERT INTO [User] ([UserName], [Password],[CNIC],[PhoneNo])
	VALUES(@UserName, @Password, @CNIC, @PhoneNo);

END


ALTER PROCEDURE ResetUserPassword
	@UserName nvarchar(255),
	@CNIC nvarchar(255),
    @PhoneNo nvarchar(255),
	@Password nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

    IF(@CNIC!='3520297089087')
    BEGIN
	-- Check if the user already exists
	IF EXISTS (SELECT 1 FROM [User] WHERE CNIC=@CNIC AND UserName=@UserName AND PhoneNo=@PhoneNo)
	BEGIN
		UPDATE [User]
        set password=@password
        where CNIC=@CNIC AND UserName=@UserName AND PhoneNo=@PhoneNo
	END
    ELSE
    BEGIN
		-- User already exists, return an error message
		RAISERROR ('Provided credentials are not valid for any User, Try again!', 16, 1);
		RETURN -1;
	END
    END
    ELSE
    BEGIN
		RAISERROR ('Password of Default User cannot be reset!', 16, 1);
		RETURN -1;
    END

END




create PROCEDURE CreateAdmin
	@AdminName nvarchar(255),
	@CNIC nvarchar(255),
	@PIN nvarchar(255),
	@PhoneNo nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the user already exists
	IF EXISTS (SELECT 1 FROM [Admin] WHERE CNIC=@CNIC)
	BEGIN
		-- Admin already exists, return an error message
		RAISERROR ('Admin already exists!', 16, 1);
		RETURN -1;
	END

	-- Insert the new admin into the admin table
	INSERT INTO [Admin] ([AdminName], [Pin],[CNIC],[PhoneNo])
	VALUES(@AdminName, @PIN, @CNIC, @PhoneNo);

END



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
		 SELECT UserName FROM [User] WHERE CNIC = @CNIC;
	END
	ELSE
	BEGIN
		-- Return error message
		RAISERROR ('User account not found!', 16, 1);
		RETURN -1;
	END

END

--------------------------------------------------------------------------------------------------------


CREATE PROCEDURE AuthenticateAdmin 
    @CNIC nvarchar(255),
	@PIN nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the CNIC and password combination exists
	IF EXISTS (SELECT 1 FROM [Admin] WHERE  CNIC = @CNIC AND  Pin = @PIN)
	BEGIN
		-- User account found, return a success message
		 SELECT AdminName FROM [Admin] WHERE CNIC = @CNIC;
	END
	ELSE
	BEGIN
		-- Return error message
		RAISERROR ('Admin account not found!', 16, 1);
		RETURN -1;
	END

END
--------------------------------------------------------------------------------------------------------




CREATE PROCEDURE GetUserCredentials
	@CNIC nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	 SELECT * FROM [User] WHERE CNIC = @CNIC;
END


--------PROCEDURE FOR UPDATE PROFILE FUNCTIONALITY-------
ALTER PROCEDURE UpdateProfile 
	@CNIC nvarchar(255),
	@UserName nvarchar(255),
	@PhoneNo nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

 IF(@CNIC!='3520297089087')
    BEGIN
		 UPDATE [User]
		 SET UserName=@UserName,PhoneNo=@PhoneNo
		 WHERE CNIC=@CNIC
    END
    ELSE
    BEGIN
		RAISERROR ('profile of default user cannot be updated!', 16, 1);
		RETURN -1;
    END
END

ALTER PROCEDURE ChangePassword 
	@CNIC nvarchar(255),
	@newPassword nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

    IF(@CNIC!='3520297089087')
    BEGIN
		 UPDATE [User]
		 SET Password=@newPassword
		 WHERE CNIC=@CNIC
    END
    ELSE
    BEGIN
		RAISERROR ('password for default user cannot be changed!', 16, 1);
		RETURN -1;
    END
END


alter PROCEDURE ShowBookedTickets
	@CNIC nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM [Ticket] WHERE  CNIC = @CNIC)
	BEGIN
		SELECT * FROM [Ticket] as T JOIN [Payment] as P on P.TicketId = T.TicketId 
        JOIN [route] R on R.TrainId=T.TrainId AND R.TrackId=T.trackId where T.CNIC=@CNIC;
    END
	ELSE
	BEGIN
		-- Return error message if no ticket of user found
		RAISERROR ('no ticket of user found!', 16, 1);
		RETURN -1;
	END
END


drop proc ShowBookedTickets

CREATE PROCEDURE ShowTickets
AS 
BEGIN	
    SET NOCOUNT ON;

    SELECT * 
    FROM [Ticket] AS T
    JOIN [Payment] AS P ON P.TicketId = T.TicketId 
    JOIN [route] AS R ON R.TrainId = T.TrainId AND R.TrackId = T.trackId;
END



CREATE PROCEDURE [dbo].[CancelTicket]
	@TicketId int,
    @TrainId nvarchar(255),
    @CarriageId NVARCHAR(255),
    @SeatNo int 

AS 
BEGIN	
	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM [Ticket] WHERE  TicketId = @TicketId)
	BEGIN
	
		update [Seat] set BookingStatus=null where SeatNo=@SeatNo and TrainId=@TrainId and CarriageId=@CarriageId;
        update [Payment] set RefundStatus='R' where TicketId=@TicketId   --here only we are updating the refudnStatus to R rest is only frontend level changes not in the backend database
        select 'UNBOOKED SUCCESSFULLY' as ResultMessage
	END
	ELSE
	BEGIN
		-- Return error message if no ticket of user found
		        select 'UNBOOKED UNSUCCESSFULLY' as ResultMessage
	END
END
GO
USE [afaqkhaliq_SampleDB]
GO
/****** Object:  StoredProcedure [dbo].[SearchTrainWithStops]    Script Date: 22-04-2024 05:32:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


USE [afaqkhaliq_SampleDB]
GO
/****** Object:  StoredProcedure [dbo].[SearchTrainWithStops]    Script Date: 25-04-2024 03:01:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




--**********************************************
-- ( THIS IS THE FINAL LOGIC )

-- NOTE THAT BELOW DEF'S OF PROCEDURES ARE VALID AND THEY ARE EXACTLY SAME AS BEFORE HAVING A MINOR TWEAK ONLY THAT INSTEAD OF USING ARRIVAL TIME 
-- WE ARE NOW USING DEPARTURE TIME BECAUSE WE WANT TO SHOW OPTIONS FOR OUR TRIP DATE BUT NOW 
-- INSTEAD OF SAYING NON STOP TRAINS WE WILL SAY SEAMLESS TRAVEL OPTIONS AND FOR TRAINS WITH ONE STOP WE WILL SAY SEGMENTED TRAVEL (so simple :)

-- Basically TrainsWithoutStop and TrainsWithOneStop logic was changed to 
-- SeamlessTravel and SegmentedTravel due to the following problem:
-- The issue with that logic was that it generates of two different tickets having different seat no's of the same train if the user wants to 
-- travel in a trainWithOneStop due to method of generating tickets so i effectively changed the concept to travel options and added example scenarios to show how things are working now 
-- also in previous concept seats are not utilized throughout the journey and now in this approach everything is working as desired..
-- note that the procedures def's remain same only route train relationships I mean practical scenarios have changed the logic :) 
-- also note the segmented travel has only one common mid point implementation and its obvious because it was previously named as trainsWithOneStop


---- IF WE WANT TO IMPLEMENT THE LOGIC WITH SEARCHDATE MEANS THE DATE ON WHICH YOU ARRIVE ON YOUR DESTINATION 
 -- we will apply check of arrivalTime in  (seachTrain's both without stop and with one stop PROCEDURE )  because we have to reach the the destination on that searchDate it doesn't
 -- matter that we leave one or two day before to start our journey thats why we have written arrivaltime instead of departuretime
 -- the system may show you available trains which may start travelling one day before or even on the same day morning depending upon the route distance and time of travel

-----IF WE WANT TO IMPLEMENT THE LOGIC WITH SEARCHDATE MEANS THE DATE ON WHICH YOU ARE SEARCHING TO TRAVEL FROM FROM YOUR DEPARTURE STATION
 -- we will apply check of departureTime in (seachTrain's both without stop and with one stop PROCEDURE) because now we are finding the trains which are going to our destination on the same day of search and in this case the arrival time is
 -- on the same day is also not guaranted 
--  the system will only show you the trains which are starting their journey on that search date from your dept Station to your arrival Station

-- that was the name of the previous procedures:
drop proc SearchTrainWithOneStop
drop proc SearchForTrains

--remember that the following procedure means one common mid point between ( breaking the journey in to two parts ) search
CREATE PROCEDURE [dbo].[SearchTrainsForSegmenetedTravel] 
    @Search_from_Station NVARCHAR(30),
    @Search_to_Station NVARCHAR(30), 
    @SearchDate DATETIME
AS
WITH 
first_cte AS (   -- cte is basically common table expression
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
        Tr.Station1Id = (SELECT StationId FROM Station WHERE Station.StationName = @Search_from_Station)
        AND Tr.Station2Id <> (SELECT StationId FROM Station WHERE Station.StationName = @Search_to_Station)
        AND CONVERT(date, R.DeptTime) = CONVERT(date, @SearchDate) 
        
),
second_cte AS (
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
        first_cte AS PrevRoute ON PrevRoute.toStation = Tr.Station1Id
    WHERE
        Tr.Station2Id = (SELECT StationId FROM Station WHERE Station.StationName = @Search_to_Station)
        AND CONVERT(date, R.DeptTime) = CONVERT(date, @SearchDate) 
),
union_cte AS (
    SELECT * FROM first_cte 
    UNION 
    SELECT * FROM second_cte
),
FinalRoute AS (
    SELECT U1.TrainId, U1.TrackId, U1.fromStation, U1.toStation
    FROM union_cte AS U1, union_cte AS U2
    WHERE U1.toStation = U2.fromStation
    UNION
    SELECT U1.TrainId, U1.TrackId, U1.fromStation, U1.toStation
    FROM union_cte AS U1, union_cte AS U2
    WHERE U1.fromStation = U2.toStation
)
---- This procedure finds trains with a single common point between the given departure and destination stations. 
---- It shows both legs or parts of the jounery, meaning the user will need to book each leg of the journey separately.
---- Each leg has a different trackId, dept and arrival time and we are here showing both tickets 
---- instead of showing a single ticket having depttime from the first leg and arrival time from the second leg.
SELECT 
    T.TrainId,
    T.UpDownStatus AS UPStatus, 
    CTEtable.TrackId AS TrackId,
    (SELECT StationName FROM Station WHERE StationId = fromStation) AS DeptStation,
    (SELECT StationName FROM Station WHERE StationId = toStation) AS ArrivalStation,
    DeptTime,
    ArrivalTime,
    Economy,
    Business,
    FirstClass
FROM 
    FinalRoute AS CTEtable
JOIN 
    [Route] AS R ON R.TrainId = CTEtable.TrainId AND R.TrackId = CTEtable.TrackId
JOIN 
    [Train] AS T ON T.TrainId = R.TrainId 
JOIN 
    Fare AS F ON F.TrackId = R.TrackId
WHERE
    CONVERT(date, R.DeptTime) = CONVERT(date, @SearchDate)





--remember that the following procedure means direct journey search
CREATE PROCEDURE [dbo].[SearchTrainsForSeamlessTravel] @fromStation nvarchar(30), @toStation nvarchar(30), @SearchDate datetime
as
select T.TrainId,Tr.TrackId as TrackId,T.UpDownStatus as UPStatus ,@fromStation as DeptStation,@toStation as ArrivalStation,DeptTime,ArrivalTime,Economy,Business,FirstClass
from [Train] as T
join [Route] as R
on R.TrainId=T.TrainId
join [Tracks] as Tr
on Tr.TrackId=R.TrackId
join Fare as F on F.TrackId=Tr.TrackId
where Tr.Station1Id=(select StationId from Station where StationName=@fromStation )
and Tr.Station2Id=(select StationId from Station where StationName=@toStation )
AND CONVERT(date, R.DeptTime) = CONVERT(date, @SearchDate) 



--***************************************


-------------------Proceduure to getdetails about seats-----------------------------
ALTER Procedure [dbo].[GetTicketInfo] @FoundCarriage nvarchar(30), @FoundSeat  int, @TrainId nvarchar(30), @TrackId nvarchar(30)
as
select @FoundCarriage as CarriageID, @TrackId as TrackId, @FoundSeat as SeatNo,@TrainId as TrainId, t.Station1Id as DeptStaion, t.Station2Id as ArrivalStation, r.ArrivalTime, r.DeptTime,F.Economy,F.Business,F.FirstClass
from Tracks as t
join [Route] as r on r.TrackId=@TrackId and r.TrainId=@TrainId
join Fare as F on F.TrackId=@TrackId
where t.TrackId=@TrackId

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
-----------------------;---------

create trigger [dbo].[Addpayment] on [dbo].[Ticket]
after insert
as
declare @CNIC nvarchar(255)
declare @TicketId nvarchar(255)
declare @TrackId nvarchar(255)
declare @CarriageId nvarchar(255)
declare @price int
declare @type char
select @CNIC=CNIC,@TicketId=TicketId,@CarriageId=CarriageId,@TrackId=TrackId from inserted
select @type=[Type] from Carriage where CarriageId=@CarriageId
if (@type='B')
begin
select @price= Business from Fare where TrackId= @TrackId
end
if (@type='E')
begin
select @price= Economy from Fare where TrackId= @TrackId
end
if (@type='F')
begin
select @price= FirstClass from Fare where TrackId= @TrackId
end
insert into Payment
values(@TicketId,@CNIC,@Price,NULL)

GO
ALTER TABLE [dbo].[Ticket] ENABLE TRIGGER [Addpayment]
GO




--------EditTrain
CREATE PROCEDURE EditTrain
    @TRAINID NVARCHAR(255),
    @DEPARTURESTATION NVARCHAR(255),
    @ARRIVALSTATION NVARCHAR(255),
    @UPDOWNSTATUS CHAR
AS 
BEGIN
    IF EXISTS (SELECT * FROM Train WHERE TrainId = @TRAINID)
    BEGIN
        UPDATE Train 
        SET DeptStation = @DEPARTURESTATION, 
            ArrivalStation = @ARRIVALSTATION, 
            UpDownStatus = @UPDOWNSTATUS 
        WHERE TrainId = @TRAINID;
    END
END

exec EditTrain '206','ISB','QUET','1'

CREATE PROCEDURE AddTrain
    @TRAINID NVARCHAR(255),
    @DEPARTURESTATION NVARCHAR(255),
    @ARRIVALSTATION NVARCHAR(255),
    @UPDOWNSTATUS CHAR
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM Train WHERE TrainId = @TRAINID)
    BEGIN
        INSERT INTO Train (TrainId, StationName, DeptStation, ArrivalStation)
        VALUES (@TRAINID, @UPDOWNSTATUS, @DEPARTURESTATION, @ARRIVALSTATION);
        SELECT 'TRAIN ADDED SUCCESSFULLY' AS ResultMessage; -- Return success message
    END
    ELSE
    BEGIN
        SELECT 'ID ALREADY EXISTS' AS ResultMessage; -- Return message indicating ID already exists
    END
END


CREATE PROCEDURE AddStation
    @STATIONID NVARCHAR(255),
    @STATIONNAME NVARCHAR(255),
    @STATIONADDRESS NVARCHAR(255)
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM Station WHERE StationId = @STATIONID)
    BEGIN
        INSERT INTO Station (StationId, StationName, [Address])
        VALUES (@STATIONID, @STATIONNAME, @STATIONADDRESS);
        SELECT 'STATION ADDED SUCCESSFULLY' AS ResultMessage; -- Return success message
    END
    ELSE
    BEGIN
        SELECT 'ID ALREADY EXISTS' AS ResultMessage; -- Return message indicating ID already exists
    END
END

ALTER Proc [dbo].[insertTicket] 
@CNIC nvarchar(255),
@Seat int,
@CarriageId nvarchar(255),
@TrackId nvarchar(255),
@TrainId nvarchar(255)
as 
insert into Ticket(CNIC,SeatNo,TrainId,CarriageId,trackId)
values(@CNIC,@Seat,@TrainId,@CarriageId,@TrackId)
update Seat
set BookingStatus='B'
where Seat.TrainID=@TrainID and SeatNo=@Seat and Seat.CarriageId=@Carriageid
print 'Seat Booked Succesfully'
GO


alter PROCEDURE InsertTrack
    @Station1Id NVARCHAR(255),
    @Station2Id NVARCHAR(255),
    @Economy FLOAT,
    @Business float,
    @FirstClass FLOAT
AS 
BEGIN
    if(Not exists(select * from [Tracks] where Station1Id=@Station1Id and Station2Id=@Station2Id))
    BEGIN

    DECLARE @COUNT_NVARCHAR NVARCHAR(255);
    SET @COUNT_NVARCHAR = SUBSTRING(CONVERT(NVARCHAR(255), NEWID()), 1, 10);


   INSERT INTO Tracks (TrackId, Station1Id, Station2Id)
    VALUES (@COUNT_NVARCHAR, @Station1Id, @Station2Id);

    INSERT INTO Fare (TrackId,Economy,Business,FirstClass)
    VALUES (@COUNT_NVARCHAR,@Economy,@Business,@FirstClass)

    select 'TRACK ADDED SUCCESSFULLY' as ResultMessage
    
    END
    ELSE
    BEGIN
        SELECT 'TRACK ALREADY EXISTS' AS ResultMessage;
    END
END;

exec InsertTrack 'PESH','ISL',500,1000,2000
select * from [Tracks]


alter PROCEDURE AddSecurity
    @CrewId NVARCHAR(255),
    @CrewName NVARCHAR(255),
    @Address NVARCHAR(255),
    @DateOfBirth DATE,
    @StationId NVARCHAR(255)
   AS 
BEGIN
    if(not exists(select * from [Crew] where CrewId=@CrewId))
    BEGIN
    INSERT INTO Crew (CrewId,CrewName,[Address],DateOfBirth)
    VALUES (@CrewId, @CrewName, @Address,@DateOfBirth);

    Insert into [Security] (CrewId,StationId) values(@CrewId,@StationId);
    SELECT 'GUARD ADDED SUCCESSFULLY' AS ResultMessage;
    end
    else 
    BEGIN
        SELECT 'GUARD NOT ADDED SUCCESSFULLY' AS ResultMessage;
    END
    end;

exec  AddSecurity '31203412311','Daniel','Lahore,Pakistan','2000-01-01','ISB'

alter PROCEDURE AddPilot
    @CrewId NVARCHAR(255),
    @CrewName NVARCHAR(255),
    @Address NVARCHAR(255),
    @DateOfBirth DATE,
    @TrainId NVARCHAR(255)
   AS 
BEGIN
    if(not exists(select * from [Crew] where CrewId=@CrewId))
    BEGIN
    INSERT INTO Crew (CrewId,CrewName,[Address],DateOfBirth)
    VALUES (@CrewId, @CrewName, @Address,@DateOfBirth);

    Insert into [Pilot] (CrewId,TrainId) values(@CrewId,@TrainId);
    SELECT 'PILOT ADDED SUCCESSFULLY' AS ResultMessage;
    end
    else 
    BEGIN
        SELECT 'PILOT NOT ADDED SUCCESSFULLY' AS ResultMessage;
    END
    end;


CREATE PROCEDURE AddRoute
    @TrainId NVARCHAR(255),
    @TrackId NVARCHAR(255),
    @DepartureTime DATETIME,
    @ArrivalTime DATETIME
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM [Route] WHERE TrainId = @TrainId AND TrackId = @TrackId)
    BEGIN
        INSERT INTO [Route] (TrainId, TrackId, [DeptTime], ArrivalTime)
        VALUES (@TrainId, @TrackId, @DepartureTime, @ArrivalTime);

        SELECT 'ROUTE ADDED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'ROUTE ALREADY EXISTS' AS ResultMessage;
    END
END;


ALTER PROCEDURE AddCarriage

    @TrainId NVARCHAR(255),
    @CarriageId NVARCHAR(255),
    @Type CHAR,
    @NoOfSeats INT
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM [Carriage] WHERE CarriageId = @CarriageId )
    BEGIN
        INSERT INTO [Carriage] (TrainId, CarriageId, [Type])
        VALUES (@TrainId, @CarriageId, @Type);
        
        DECLARE @SeatID INT = 1; -- Initialize SeatID

        -- Loop to insert seats
        WHILE @SeatID <= @NoOfSeats
        BEGIN
            INSERT INTO [Seat] (TrainID, CarriageID, SeatNo, BookingStatus)
            VALUES (@TrainId, @CarriageId, @SeatID, NULL);
            SET @SeatID = @SeatID + 1; -- Increment SeatID
        END

        SELECT 'CARRIAGE ADDED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'CARRIAGE ALREADY EXISTS' AS ResultMessage;
    END
END;

select * from [Seat] where CarriageID='222'

CREATE PROCEDURE EditRoute
    @TrainId NVARCHAR(255),
    @TrackId NVARCHAR(255),
    @DepartureTime DATETIME,
    @ArrivalTime DATETIME
AS 
BEGIN
    IF EXISTS (SELECT * FROM [Route] WHERE TrainId = @TrainId AND TrackId = @TrackId)
    BEGIN
        UPDATE [Route]
        SET DeptTime=@DepartureTime, ArrivalTime=@ArrivalTime
        WHERE TrackId = @TrackId and TrainId=@TrainId

        SELECT 'ROUTE UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'ROUTE DOES NOT EXISTS' AS ResultMessage;
    END
END;





ALTER PROCEDURE EditFare
    @TrackId NVARCHAR(255),
    @Economy FLOAT,
    @Business float,
    @FirstClass FLOAT
AS 
BEGIN
    if( exists(select * from [Fare] where TrackId=@TrackId ))
    BEGIN

    update [Fare] set Economy=@Economy,Business=@Business,FirstClass=@FirstClass 
    where TrackId=@TrackId;
    SELECT 'FARE UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'FARE NOT EXISTS' AS ResultMessage;
    END
END;


ALTER PROCEDURE EditStation
    @StationId NVARCHAR(255),
    @StationName NVARCHAR(255),
    @Address NVARCHAR(255)
AS 
BEGIN
    if( exists(select * from [Station] where StationId=@StationId ))
    BEGIN

    update [Station] set StationName=@StationName,Address=@Address 
    where StationId=@StationId;
    SELECT 'STATION UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'STATION NOT EXISTS' AS ResultMessage;
    END
END;


CREATE PROCEDURE EditCarriage
    @orignalCarriageId NVARCHAR(255),
    @newCarriageId NVARCHAR(255),
    @Type CHAR
AS 
BEGIN
    if( exists(select * from [Carriage] where CarriageId=@orignalCarriageId ))
    BEGIN

    update [Carriage] set CarriageId=@newCarriageId,Type=@Type 
    where CarriageId=@orignalCarriageId
    SELECT 'CARRIAGE UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'CARRIAGE NOT EXISTS' AS ResultMessage;
    END
END;


alter PROCEDURE EditSecurity
    @CrewId NVARCHAR(255),
    @CrewName NVARCHAR(255),
    @Address NVARCHAR(255),
    @StationId NVARCHAR(255)
AS 
BEGIN
    if( exists(select * from [Crew] where CrewId=@CrewId ))
    BEGIN

    update [Crew] set CrewName=@CrewName,[Address]=@Address
    where CrewId=@CrewId;
    update [Security] set StationId=@StationId where CrewId=@CrewId;
    SELECT 'CREW UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'CREW NOT EXISTS' AS ResultMessage;
    END
END;


alter PROCEDURE EditPilot
    @CrewId NVARCHAR(255),
    @CrewName NVARCHAR(255),
    @Address NVARCHAR(255),
    @TrainId NVARCHAR(255)
AS 
BEGIN
    if( exists(select * from [Crew] where CrewId=@CrewId ))
    BEGIN

    update [Crew] set CrewName=@CrewName,[Address]=@Address
    where CrewId=@CrewId;
    update [Pilot] set TrainId=@TrainId where CrewId=@CrewId;
    SELECT 'CREW UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE
    BEGIN
        SELECT 'CREW NOT EXISTS' AS ResultMessage;
    END
END;

ALTER PROCEDURE EditUser
    @CNIC NVARCHAR(255),
    @UserName NVARCHAR(255),
    @Password NVARCHAR(255),
    @PhoneNo NVARCHAR(255)
AS 
BEGIN

    IF(@CNIC!='3520297089087')
    BEGIN
    IF(exists(select * from [User] where CNIC=@CNIC ))
    BEGIN
    update [User] set UserName=@UserName, Password=@Password, PhoneNo=@PhoneNo
    where CNIC=@CNIC;
    SELECT 'USER UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE 
    BEGIN
        SELECT 'USER NOT EXISTS' AS ResultMessage;
    END
    END

    ELSE
    BEGIN
       SELECT 'You cannot edit Default User :)' AS ResultMessage;
    END

END


ALTER PROCEDURE EditAdmin
    @CNIC NVARCHAR(255),
    @AdminName NVARCHAR(255),
    @Pin NVARCHAR(255),
    @PhoneNo NVARCHAR(255)
AS 
BEGIN

    IF(@CNIC!='3520297089087')
    BEGIN
    IF(exists(select * from [Admin] where CNIC=@CNIC ))
    BEGIN
    update [Admin] set AdminName=@AdminName,Pin=@Pin,PhoneNo=@PhoneNo
    where CNIC=@CNIC;
    SELECT 'ADMIN UPDATED SUCCESSFULLY' AS ResultMessage;
    END
    ELSE 
    BEGIN
        SELECT 'ADMIN NOT EXISTS' AS ResultMessage;
    END
    END

    ELSE
    BEGIN
       SELECT 'You cannot edit Default Admin :)' AS ResultMessage;
    END

END





CREATE PROCEDURE EditSeat
    @SeatNo INT,
    @CarriageID NVARCHAR(255),
    @TrainID NVARCHAR(255)
AS 
BEGIN
    DECLARE @Status CHAR;

    IF EXISTS(SELECT BookingStatus FROM [Seat] WHERE TrainID = @TrainID AND CarriageID = @CarriageID AND SeatNo = @SeatNo)
    BEGIN
        SELECT @Status = BookingStatus FROM [Seat] WHERE TrainID = @TrainID AND CarriageID = @CarriageID AND SeatNo = @SeatNo;

        IF (@Status IS NULL)
        BEGIN
            UPDATE [Seat] SET BookingStatus = 'B' 
            WHERE TrainID = @TrainID AND CarriageID = @CarriageID AND SeatNo = @SeatNo;
            SET @Status = 'B';
            SELECT @Status AS BookingStatus, 'BOOKED' AS ResultMessage;
        END
        ELSE
        BEGIN
            UPDATE [Seat] SET BookingStatus = NULL
            WHERE TrainID = @TrainID AND CarriageID = @CarriageID AND SeatNo = @SeatNo;
            SET @Status = NULL;
            SELECT @Status AS BookingStatus, 'UNBOOKED' AS ResultMessage;
        END
    END
    ELSE
    BEGIN
        SELECT 'SEAT DOES NOT EXIST' AS ResultMessage;
    END
END;


alter PROCEDURE DeleteStation
    @StationId NVARCHAR(255)
    AS 
    BEGIN
    if(exists(select * from [Station] where StationId=@StationId))
    BEGIN
    delete [Station] where StationId=@StationId
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;

alter TRIGGER DeletingStation
ON [Station]
INSTEAD OF DELETE
AS 
BEGIN
    SET NOCOUNT ON;

    DECLARE @StationId NVARCHAR(255);
    DECLARE @TrackId NVARCHAR(255);

    SELECT @StationId = deleted.StationId FROM deleted;
    Update [Train] set DeptStation=NULL where DeptStation=@StationId
    Update [Train] set ArrivalStation=NULL where ArrivalStation=@StationId

    WHILE EXISTS (SELECT * FROM [Tracks] WHERE Station1Id = @StationId OR Station2Id = @StationId)
    BEGIN
        SELECT TOP 1 @TrackId = TrackId FROM [Tracks] WHERE Station1Id = @StationId OR Station2Id = @StationId;
        
        
        DELETE FROM [Fare] WHERE TrackId=@TrackId;
        DELETE FROM [Tracks] WHERE TrackId = @TrackId;
        
    END

     DELETE FROM Station WHERE StationId = @StationId
END;


alter PROCEDURE DeleteTrack
    @TrackId NVARCHAR(255)
    AS 
    BEGIN
    if(exists(select * from [Tracks] where TrackId=@TrackId))
    BEGIN
    delete [Tracks] where TrackId=@TrackId
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;

create PROCEDURE DeleteRoute
    @TrackId NVARCHAR(255),
    @TrainId NVARCHAR(255)
    AS 
    BEGIN
    if(exists(select * from [Route] where TrackId=@TrackId and @TrainId=TrainId))
    BEGIN
    delete [Route] where TrackId=@TrackId and @TrainId=TrainId;
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;


    alter PROCEDURE DeleteCrew
    @CrewId NVARCHAR(255)

    AS 
    BEGIN
    if(exists(select * from [Crew] where CrewId=@CrewId ))
    BEGIN
    delete from [Crew] where CrewId=@CrewId;
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;


ALTER PROCEDURE DeleteUser
    @CNIC NVARCHAR(255)
    AS 
    BEGIN

    IF(@CNIC!='3520297089087')
    BEGIN
    IF(exists(select * from [User] where CNIC=@CNIC ))
    BEGIN
    DELETE FROM [User] WHERE CNIC=@CNIC;
    SELECT 'Success' AS ResultMessage;
    END
    ELSE 
    BEGIN
        SELECT 'Fail' AS ResultMessage;
    END
    END

    ELSE
    BEGIN
       SELECT 'You cannot delete Default User :)' AS ResultMessage;
    END

    END;

ALTER PROCEDURE DeleteAdmin
    @CNIC NVARCHAR(255)
    AS 
    BEGIN

    IF(@CNIC!='3520297089087')
    BEGIN
    IF(exists(select * from [Admin] where CNIC=@CNIC ))
    BEGIN
    DELETE FROM [Admin] WHERE CNIC=@CNIC;
    SELECT 'Success' AS ResultMessage;
    END
    ELSE 
    BEGIN
        SELECT 'Fail' AS ResultMessage;
    END
    END

    ELSE
    BEGIN
       SELECT 'You cannot delete Default Admin :)' AS ResultMessage;
    END

    END;



    create PROCEDURE DeleteTrain
    @TrainId NVARCHAR(255)

    AS 
    BEGIN
    if(exists(select * from [Train] where TrainId=@TrainId ))
    BEGIN
    delete [Train] where TrainId=@TrainId;
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;

    create PROCEDURE DeleteCarriage
    @CarriageId NVARCHAR(255)
    AS 
    BEGIN
    if(exists(select * from [Carriage] where CarriageId=@CarriageId ))
    BEGIN
    delete [Carriage] where CarriageId=@CarriageId;
    SELECT 'Success' AS ResultMessage;
    END
    else 
    begin
        SELECT 'Fail' AS ResultMessage;
    end
    END;
   
 



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

 




 SELECT name
FROM sys.objects
WHERE type_desc = 'FOREIGN_KEY_CONSTRAINT'
AND parent_object_id = OBJECT_ID('Payment');

SELECT 
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ReferencedColumnName,
    fk.delete_referential_action_desc AS OnDeleteAction,
    fk.update_referential_action_desc AS OnUpdateAction
FROM 
    sys.foreign_keys AS fk
INNER JOIN 
    sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
WHERE 
    fk.name = 'FK__Ticket__CNIC__2B947552'

ALTER TABLE [Ticket]
DROP CONSTRAINT FK_Ticket_Seat;

ALTER TABLE [Carriage] ADD CONSTRAINT FK_TRAINID FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId]) ON UPDATE CASCADE on delete CASCADE
ALTER TABLE [Seat] ADD CONSTRAINT FK_CARRIAGEID FOREIGN KEY ([CarriageID]) REFERENCES [Carriage] ([CarriageId]) ON UPDATE CASCADE on delete CASCADE

ALTER TABLE [Security] ADD CONSTRAINT FK_CREW_ID FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId]) on delete CASCADE
ALTER TABLE [Pilot] ADD CONSTRAINT FK_CREWID_PILOT FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId]) on delete CASCADE
ALTER TABLE [Pilot] ADD CONSTRAINT FK_STATIONID_PILOT FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId]) on delete SET NULL

select * from [Ticket] as T join [Payment] as P on T.TicketId=P.TicketId; 




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

exec ShowUser '3520297089087'

UpdateUser '3520297089087','m maaz khan','mypass123','03204553255'

INSERT INTO [Ticket] ([TicketId],[CNIC],[SeatNo],[StartingStation],[EndingStation],[date])
VALUES(NEWID(),'0CD8799B-6898-4682-8C22-75A6C7224DA0',1,'KHI','LHR','2025-3-13')

SELECT * FROM [Ticket]

ShowBookedTickets '3520297089087'

update  [Ticket]
set date_and_time='2024-2-1 10:13:02'
where TicketId='F8553E69-5A65-4EA3-AFFE-A7C8CEB704AA'

update  [Ticket]
set Date_and_Time='2025-2-1 20:03:12'
where TicketId='8FDD6A4D-938B-4871-88AA-DC1F7B0D8A1D'


alter table [Ticket] drop  column date
alter table [ticket] add  Date_and_Time DATETIME
