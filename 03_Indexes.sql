-- =============================================
-- 02_SampleData.sql
-- Inserts sample seed data
-- =============================================

USE TRAQManagement;
GO

-- Status values
IF NOT EXISTS (SELECT 1 FROM dbo.Status WHERE StatusName = 'Open')
    INSERT INTO dbo.Status (StatusName) VALUES ('Open');

IF NOT EXISTS (SELECT 1 FROM dbo.Status WHERE StatusName = 'Closed')
    INSERT INTO dbo.Status (StatusName) VALUES ('Closed');

-- Sample Persons
IF NOT EXISTS (SELECT 1 FROM dbo.Persons WHERE IDNumber = '9001015009087')
BEGIN
    INSERT INTO dbo.Persons (FirstName, LastName, IDNumber)
    VALUES ('John', 'Doe', '9001015009087');
END

IF NOT EXISTS (SELECT 1 FROM dbo.Persons WHERE IDNumber = '9501015009087')
BEGIN
    INSERT INTO dbo.Persons (FirstName, LastName, IDNumber)
    VALUES ('Jane', 'Smith', '9501015009087');
END

-- Sample User
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = 'admin')
BEGIN
    INSERT INTO dbo.Users (Username, PasswordHash)
    VALUES ('admin', 'hashed_password_here');
END
GO
