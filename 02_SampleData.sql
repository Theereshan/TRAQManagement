-- =============================================
-- 01_CreateTables.sql
-- Creates database + tables + constraints
-- =============================================

IF DB_ID('TRAQManagement') IS NULL
BEGIN
    CREATE DATABASE TRAQManagement;
END
GO

USE TRAQManagement;
GO

-- =========================
-- TABLE: Persons
-- =========================
IF OBJECT_ID('dbo.Persons', 'U') IS NOT NULL DROP TABLE dbo.Persons;
GO

CREATE TABLE dbo.Persons (
    PersonId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    IDNumber NVARCHAR(20) NOT NULL UNIQUE
);
GO

-- =========================
-- TABLE: Status
-- =========================
IF OBJECT_ID('dbo.Status', 'U') IS NOT NULL DROP TABLE dbo.Status;
GO

CREATE TABLE dbo.Status (
    StatusId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- =========================
-- TABLE: Accounts
-- =========================
IF OBJECT_ID('dbo.Accounts', 'U') IS NOT NULL DROP TABLE dbo.Accounts;
GO

CREATE TABLE dbo.Accounts (
    AccountId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AccountNumber NVARCHAR(50) NOT NULL UNIQUE,
    PersonId INT NOT NULL,
    StatusId INT NOT NULL,
    Balance DECIMAL(18,2) NOT NULL DEFAULT(0.00),

    CONSTRAINT FK_Accounts_Persons FOREIGN KEY (PersonId)
        REFERENCES dbo.Persons(PersonId),

    CONSTRAINT FK_Accounts_Status FOREIGN KEY (StatusId)
        REFERENCES dbo.Status(StatusId)
);
GO

-- =========================
-- TABLE: Transactions
-- =========================
IF OBJECT_ID('dbo.Transactions', 'U') IS NOT NULL DROP TABLE dbo.Transactions;
GO

CREATE TABLE dbo.Transactions (
    TransactionId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AccountId INT NOT NULL,
    TransactionDate DATE NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,

    CONSTRAINT FK_Transactions_Accounts FOREIGN KEY (AccountId)
        REFERENCES dbo.Accounts(AccountId)
);
GO

-- =========================
-- TABLE: Users
-- =========================
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
);
GO
