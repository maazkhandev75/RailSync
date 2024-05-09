SELECT name
FROM sys.objects
WHERE type_desc = 'FOREIGN_KEY_CONSTRAINT'
AND parent_object_id = OBJECT_ID('Pilot');

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
    fk.name = 'FK_CREWID_PILOT'

ALTER TABLE [Seat]
DROP CONSTRAINT FK__Seat__CarriageID__0C50D423;

ALTER TABLE [Carriage] ADD CONSTRAINT FK_TRAINID FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId]) ON UPDATE CASCADE on delete CASCADE
ALTER TABLE [Seat] ADD CONSTRAINT FK_CARRIAGEID FOREIGN KEY ([CarriageID]) REFERENCES [Carriage] ([CarriageId]) ON UPDATE CASCADE on delete CASCADE

ALTER TABLE [Security] ADD CONSTRAINT FK_CREW_ID FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId]) on delete CASCADE
ALTER TABLE [Pilot] ADD CONSTRAINT FK_CREWID_PILOT FOREIGN KEY ([CrewId]) REFERENCES [Crew] ([CrewId]) on delete CASCADE
ALTER TABLE [Pilot] ADD CONSTRAINT FK_STATIONID_PILOT FOREIGN KEY ([TrainId]) REFERENCES [Train] ([TrainId]) on delete SET NULL


