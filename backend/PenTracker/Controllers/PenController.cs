using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Nest;
using Ninject.Activation.Caching;
using org.joda.time;
using SendGrid.Helpers.Mail;

namespace PenTracker.Controllers
{

    public class PenInput
    {
        public decimal? LocationLAT { get; set; }
        public decimal? LocationLONG { get; set; }
        public string Date { get; set; }
        public string Name { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class Pen
    {
        [BsonId]
        //public ObjectId Id { get; set; }
        public string _id { get; set; }
        public List<PenInput> Inputs { get; set; }


    }

 /*   [AttributeUsage(AttributeTargets.Method)]
      public class RequestRateLimitAttribute : ActionFilterAttribute
    {
        public string Name { get; set; }

        public int Seconds { get; set; }

        private static MemoryCache Cache { get; } = new MemoryCache(new MemoryCacheOptions());
    }

    [Route("api")]
    public class ApiController : Controller
    {
        [HttpPost]
        [RequestRateLimit(Name = "Limit Request number", Seconds = 5)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Get([FromBody]GetRequest getRequest)
        {
            return Ok();
        }
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var ipAddress = context.HttpContext.Request.HttpContext.Connection.RemoteIpAddress;
        var memoryCacheKey = $"{Name}--{ipAddress}";
        if (!Cache.TryGetValue(memoryCacheKey, out bool entry))
        {
            var cacheEntryOptions = new MemoryCacheOptions()
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(Seconds));
            Cache.Set(memoryCacheKey, true, cacheEntryOptions);
        }
        else
        {
            context.Result = ContentResult; {
                Content = $"Requests are limited to 1, every {Seconds} seconds";
            };
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
        }
    }*/

    [Route("api/[controller]")]
    [ApiController]
    public class PenController : ControllerBase
    {
        private readonly IMongoClient mongoClient;

        public PenController(IMongoClient mongoClient)
        {
            this.mongoClient = mongoClient;
        }
        
        // GET: api/Pen
        [HttpGet]
        public ActionResult Get()
        {
            var db = mongoClient.GetDatabase("PenTracker");
            var collection = db.GetCollection<Pen>("Pen");

            var all = collection.Find(x => true).ToList();
            all.ForEach(x => {
                if (x.Inputs != null)
                {
                    var test = x.Inputs.LastOrDefault();
                    x.Inputs.Clear();
                    x.Inputs.Add(test);
                }
            });
            //db.foo.find().sort({ x: 1}).limit(1);
            return Ok(all);
        }
        

        // GET: api/Pen/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult Get(string id)
        {
            var db = mongoClient.GetDatabase("PenTracker");
            var collection = db.GetCollection<Pen>("Pen");
            var firstPen = collection.Find(pen => pen._id == id).FirstOrDefault();

            if (firstPen == null)
            {
                return NotFound("Penna finns ej");
                //return "Penna finns ej";
            }
            //else if (firstPen.Text == null)
            //{

            //    //return "Penna finns utan logg";
            //}
            else
            {                
                return Ok(firstPen);
            //return firstPen.Text;

            }
            
            
        }

        private static readonly HttpClient client = new HttpClient();
        // POST: api/Pen
        [HttpPost("{id}", Name = "Post")]
        public ActionResult Post(string id, [FromBody] PenInput value)
        {
            var db = mongoClient.GetDatabase("PenTracker");
            var pen = db.GetCollection<Pen>("Pen").Find(x => x._id == id).FirstOrDefault();

            if (pen == null)
            {
                return NotFound();
            }

            if (pen.Inputs == null)
            {
                pen.Inputs = new List<PenInput>();
            }

            if (value.LocationLAT==null && value.LocationLONG==null)
            {
                var ipAdress = HttpContext.Connection.RemoteIpAddress.ToString();
                var location = Location(ipAdress);
            } 
            value.Date = System.DateTime.UtcNow.ToString("O");
            //value.Location = ;
            //value.Location =HttpContext.Connection.RemoteIpAddress.ToString();
            pen.Inputs.Add(value);


            var updateDefinition = Builders<Pen>.Update.Set(x => x.Inputs, pen.Inputs);
            db.GetCollection<Pen>("Pen").FindOneAndUpdate(x => x._id == id, updateDefinition);

            return Ok();
        }

        public async Task<String> Location(string ipAdress)
        {
            if (ipAdress == "::1") return null;
            var response = await client.GetAsync("http://ip-api.com/json/" + ipAdress);
            var content = await response.Content.ReadAsStringAsync();
            return "";
        }

        //// PUT: api/Pen/5
        //[HttpPut("{id}")]
        //public ActionResult Put(string id, [FromBody] UpdatePen value)
        //{
        //    var db = mongoClient.GetDatabase("PenTracker");
        //    var pen = db.GetCollection<Pen>("Pen").Find(x => x.Penld == id).FirstOrDefault();

        //    if (pen == null)
        //    {
        //        return NotFound();
        //    }                

        //    if (pen.Name != value.Name)
        //    {
        //        // Update name here
        //        var updateDefinition = Builders<Pen>.Update.Set(x => x.Name, value.Name);
        //        db.GetCollection<Pen>("Pen").FindOneAndUpdate(x => x.Penld == id, updateDefinition);
        //    }

        //    return Ok();
        //}

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)  
        {
        }
    }

    public class UpdatePen
    {
        public string Name { get; set; }
    }
}
