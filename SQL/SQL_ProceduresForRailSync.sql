SELECT * FROM [User]
GO

--------PROCEDURE FOR SIGNUP FUNCTIONALITY-------
CREATE PROCEDURE createUser 
	@UserName nvarchar(255),
	@Password nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the username already exists
	IF EXISTS (SELECT 1 FROM [User] WHERE UserName=@UserName)
	BEGIN
		-- Username already exists, return an error message
		RAISERROR ('UserName already exists.', 16, 1);
		RETURN -1;
	END

	-- Insert the new user into the User table
	INSERT INTO [User] ([Id], [UserName], [Password])
	VALUES(NEWID(), @UserName, @Password);

	-- Return success message
	SELECT 'User created successfully!' AS message;

END

--------PROCEDURE FOR LOGIN FUNCTIONALITY-------
CREATE PROCEDURE authenticateUser 
	@UserName nvarchar(255),
	@Password nvarchar(255)
AS 
BEGIN	
	SET NOCOUNT ON;

	-- Check if the username and password combination exists
	IF EXISTS (SELECT 1 FROM [User] WHERE  UserName = @UserName AND  Password = @Password)
	BEGIN
		-- User account found, return a success message
		SELECT 'User account found!' AS message;
	END
	ELSE
	BEGIN
		-- Return error message
		RAISERROR ('User account not found!', 16, 1);
		RETURN -1;
	END

END

