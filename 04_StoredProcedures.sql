-- =============================================
-- 03_Indexes.sql
-- Adds indexes for performance
-- =============================================

USE TRAQManagement;
GO

-- Index on Accounts.PersonId
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'IX_Accounts_PersonId'
)
BEGIN
    CREATE INDEX IX_Accounts_PersonId ON dbo.Accounts(PersonId);
END
GO

-- Index on Transactions.AccountId
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'IX_Transactions_AccountId'
)
BEGIN
    CREATE INDEX IX_Transactions_AccountId ON dbo.Transactions(AccountId);
END
GO

-- Index on Persons.LastName (useful for surname search)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'IX_Persons_LastName'
)
BEGIN
    CREATE INDEX IX_Persons_LastName ON dbo.Persons(LastName);
END
GO
