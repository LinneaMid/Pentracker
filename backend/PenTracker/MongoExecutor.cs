using System;
using MongoDB.Driver;
using PenTracker.Models;

namespace PenTracker
{
    public class MongoExecutor
    {
        private readonly MongoSettings _settings;
        private readonly Lazy<MongoClient> _clientLazy;

        public MongoExecutor(MongoSettings settings)
        {
            _settings = settings;
            _clientLazy = new Lazy<MongoClient>(GetClient);
        }

        public T Execute<T>(Func<IMongoDatabase, T> mongoAction)
        {
            var client = _clientLazy.Value;
            var db = client.GetDatabase(_settings.Database);
            return mongoAction(db);
        }

        public void Execute(Action<IMongoDatabase> mongoAction)
        {
            Execute<object>(db =>
            {
                mongoAction(db);
                return null;
            });
        }

        private MongoClient GetClient()
        {
            return new MongoClient(_settings.ConnectionString);
        }
    }
}