CREATE TABLE [User] (
  [CNIC] nvarchar(255) PRIMARY KEY,
  [UserName] nvarchar(255),
  [Password] nvarchar(255),
  [PhoneNo] nvarchar(255)
)
GO

CREATE TABLE [Ticket] (
  [TicketId] nvarchar(255) PRIMARY KEY,
  [CNIC] nvarchar(255),
  [SeatNo] int,
  [TrainId] NVARCHAR(255),
  [CarriageId] NVARCHAR(255),
  [trackId] NVARCHAR(255)
)
GO


CREATE TABLE [Carriage] (
  [CarriageId] nvarchar(255) PRIMARY KEY,
  [TrainId] nvarchar(255),
  [Type] char
)
GO


CREATE TABLE [Seat] (
  [CarriageID] nvarchar(255),
  [TrainID] nvarchar(255),
  [SeatNo] int,
  [BookingStatus] char,
  PRIMARY KEY ([CarriageID], [TrainID], [SeatNo])
)
GO

CREATE TABLE [Tracks] (
  [TrackId] nvarchar(255) PRIMARY KEY,
  [Station1Id] nvarchar(255),
  [Station2Id] nvarchar(255)
)
GO

CREATE TABLE [Station] (
  [StationId] nvarchar(255) PRIMARY KEY,
  [StationName] nvarchar(255),
  [Address] nvarchar(255)
)
GO



CREATE TABLE [Train] (
  [TrainId] nvarchar(255) PRIMARY KEY,
  [UpDownStatus] char,
  [DeptStation] nvarchar(255),
  [ArrivalStation] nvarchar(255)
)
GO

CREATE TABLE [Payment] (
  [TicketId] nvarchar(255),
  [CNIC] nvarchar(255),
  [TotalPrice] nvarchar(255),
  [RefundStatus] char,
  PRIMARY KEY ([TicketId])
)
GO

CREATE TABLE [Fare] (
  [TrackId] nvarchar(255),
  [Economy] float,
  [BusinessClass] float,
  [FirstClass] float
)
GO

CREATE TABLE [Crew] (
  [CrewId] nvarchar(255) PRIMARY KEY,
  [CrewName] nvarchar(255),
  [Address] nvarchar(255),
  [DateOfBirth] Date
)
GO


CREATE TABLE [Pilot] (
  [CrewId] nvarchar(255),
  [TrainId] nvarchar(255),

)
GO

CREATE TABLE [Security] (
  [CrewId] nvarchar(255),
  [StationId] nvarchar(255),

)
GO

CREATE TABLE [Route] (
  [TrainId] nvarchar(255),
  [TrackId] nvarchar(255),
  [DeptTime] time,
  [ArrivalTime] time,
  PRIMARY KEY ([TrainId], [TrackId])
)
GO

ALTER TABLE [Pilot] ADD FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId])
GO

ALTER TABLE [Security] ADD CONSTRAINT FK_CREW_ID FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId])
GO

ALTER TABLE [Security] ADD FOREIGN KEY ([StationId]) REFERENCES [Station] ([StationId])
GO

ALTER TABLE [Tracks] ADD CONSTRAINT[Update2] FOREIGN KEY ([Station1Id]) REFERENCES [Station] ([StationId]) on delete cascade
GO

ALTER TABLE [Tracks] ADD constraint FK_TRACKS_STATION2 FOREIGN KEY ([Station2Id]) REFERENCES [Station] ([StationId]) on delete cascade on update cascade
GO

ALTER TABLE [Route] ADD FOREIGN KEY ([TrackId]) REFERENCES [Tracks] ([TrackId])
GO

ALTER TABLE [Route] ADD FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId])
GO

ALTER TABLE [Ticket] ADD FOREIGN KEY ([SeatNo]) REFERENCES [Seat] ([SeatNo])
GO

ALTER TABLE [Carriage] ADD FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId]) ON UPDATE CASCADE
GO

ALTER TABLE [Seat] ADD FOREIGN KEY ([CarriageID]) REFERENCES [Carriage] ([CarriageId]) ON UPDATE CASCADE
GO

ALTER TABLE [Seat] ADD FOREIGN KEY ([TrainID]) REFERENCES [Train] ([TrainId]) ON UPDATE CASCADE
GO

ALTER TABLE [Fare] ADD FOREIGN KEY ([TrackId]) REFERENCES [Tracks] ([TrackId])
GO

ALTER TABLE [Payment] ADD FOREIGN KEY ([TicketId]) REFERENCES [Ticket] ([TicketId])
GO

ALTER TABLE [Ticket] ADD FOREIGN KEY ([CNIC]) REFERENCES [User] ([CNIC])
GO

ALTER TABLE [Ticket]
ADD CONSTRAINT FK_Ticket_Seat
FOREIGN KEY ([CarriageId], [TrainId], [SeatNo])
REFERENCES [Seat] ([CarriageID], [TrainID], [SeatNo]);

insert [Ticket] values ('3512389230239',5,'101','202','122121')
INSERT INTO Ticket (CNIC, SeatNo,TrainId,CarriageId,TicketId) values ('3512389230239',5,'101','202','122121')
SET IDENTITY_INSERT Ticket OFF;
ALTER TABLE [Payment] ADD FOREIGN KEY ([CNIC]) REFERENCES [User] ([CNIC])
GO

ALTER TABLE [Pilot] ADD FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId])
GO

ALTER TABLE [Ticket] ADD FOREIGN KEY ([StartingStation]) REFERENCES [Station] ([StationId])
GO

ALTER TABLE [Ticket] ADD FOREIGN KEY ([EndingStation]) REFERENCES [Station] ([StationId])
GO

ALTER TABLE [Train] ADD FOREIGN KEY ([DeptStation]) REFERENCES [Station] ([StationId])
GO

ALTER TABLE [Train] ADD FOREIGN KEY ([ArrivalStation]) REFERENCES [Station] ([StationId])
GO

ALTER TABLE [Ticket] ADD FOREIGN KEY ([TrackId]) REFERENCES [Tracks] ([TrackId]) ON DELETE SET NULL
GO

--------------- UPDATES -------------------------------



ALTER TABLE [Tracks]
DROP CONSTRAINT FK_TRACKS_STATION1;

ALTER TABLE [User]
DROP CONSTRAINT PK__User__3214EC072F032F7B;

ALTER TABLE [Payment] 
DROP FK__Payment__CNIC__5D95E53A

ALTER TABLE [Ticket]
DROP CONSTRAINT FK__Ticket__user_CNIC;

ALTER TABLE [User]
ADD CONSTRAINT PK_User PRIMARY KEY ([CNIC]);

ALTER TABLE [User]
ALTER COLUMN [CNIC] nvarchar(255) NOT NULL;

SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Seat' AND CONSTRAINT_TYPE = 'PRIMARY KEY';

SELECT
    name
FROM
    sys.foreign_keys
WHERE
    parent_object_id = OBJECT_ID('Tracks');

ALTER TABLE Seat
DROP CONSTRAINT FK__Seat__CarriageID__151B244E;

EXEC sp_rename 'Ticket.carriageId', 'CarriageId', 'COLUMN';

ALTER TABLE [Seat]
ADD CONSTRAINT UQ_Seat
UNIQUE ([CarriageID], [TrainID], [SeatNo]);

SELECT name
FROM sys.objects
WHERE type_desc = 'FOREIGN_KEY_CONSTRAINT'
AND parent_object_id = OBJECT_ID('Security');

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
    fk.name = 'FK__Security__Statio__220B0B18'

ALTER TABLE [Security]
DROP CONSTRAINT FK__Security__CrewId__2116E6DF;



delete from [user]
where userName='Muhammad Hassan Javed'

insert into [User]
values('1234567890123','Muhammad Hassan Javed','jackpot123','03200202469')
go

alter table [user] drop column id


insert into [ticket]
values('122148','1234567890123',1,'202','202-1','2')
go


insert into [ticket]
values('122149','1234567890123',2,'202','202-8','2')
go



CREATE TABLE [Ticket] (
  [CNIC] nvarchar(255),
  [SeatNo] int,
  [TrainId] NVARCHAR(255),
  [CarriageId] NVARCHAR(255),
  [trackId] NVARCHAR(255),
  [TicketId] nvarchar(255) PRIMARY KEY
)

insert into Ticket
values('3520297089087',1,'KhiExpress','KhiExpressCarriage','1')
go

sp_help ticket



select * from [User]
select * from [Ticket]
select * from [Crew]
select * from [Pilot]
select * from [Train]
select * from [Carriage]
select * from [Fare]
select * from [Payment]
select * from [Station]
select * from [Security]
select * from [Tracks]
select * from [Seat]
select * from [Route]

DELETE FROM Tracks WHERE TrackId = '6';

SELECT name
FROM sys.objects
WHERE type_desc = 'FOREIGN_KEY_CONSTRAINT'
    AND parent_object_id = OBJECT_ID('Ticket');
 
insert [Tracks] values ('6','QUET','LHR')
insert [Station] values ('QUET','Quetta','Quetta Pakistan')
insert [Train] values ('206','1','LHR','QUET')
alter Proc insertTicket 
@CNIC nvarchar(255),
@Seat int,
@CarriageId nvarchar(255),
@TrackId nvarchar(255),
@TrainId nvarchar(255)
as 
insert into Ticket(CNIC,SeatNo,TrainId,CarriageId,trackId)
values(@CNIC,@Seat,@TrainId,@CarriageId,@TrackId)

insertTicket  '3512389230239',22,'202','5','101'

SELECT COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Ticket'

SELECT
  COLUMN_NAME,
  DATA_TYPE,
  CHARACTER_MAXIMUM_LENGTH AS MaxLength,
  ISNULL(NUMERIC_PRECISION, 0) AS NumericPrecision,
  ISNULL(NUMERIC_SCALE, 0) AS NumericScale
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Ticket'

DELETE FROM "Ticket";

update Tracks set Station1Id='ISB', Station2Id='LHR'
where TrackId='3'

SELECT * FROM Route as R join Tracks as T on R.TrackId=T.TrackId