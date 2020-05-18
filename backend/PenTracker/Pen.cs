using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace PenTracker
{
    public class Pen
    {
        public string Id { get; set; }
    }
    class PenJson
    {
        public string Penld { get; set; }
    }
}
