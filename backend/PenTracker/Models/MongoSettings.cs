using System;

namespace PenTracker.Models
{
    public class MongoSettings
    {
        private string _connectionString;
        private string _database;

        private static bool _csIinitialized;
        private static bool _dbIinitialized;

        public string ConnectionString
        {
            get => _connectionString;
            set
            {
                if (_csIinitialized)
                    throw new ApplicationException($"{nameof(MongoSettings)}.{nameof(ConnectionString)} already initialized");

                _connectionString = value;
                _csIinitialized = true;
            }
        }

        public string Database
        {
            get => _database;
            set
            {
                if (_dbIinitialized)
                    throw new ApplicationException($"{nameof(MongoSettings)}.{nameof(Database)} already initialized");

                _database = value;
                _dbIinitialized = true;
            }
        }
    }
}