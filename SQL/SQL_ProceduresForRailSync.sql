
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