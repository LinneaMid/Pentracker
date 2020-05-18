using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace PenTracker
{
    public class Startup
    {
        private const string DevelopmentCorsPolicy = "Development";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public async void ConfigureServices(IServiceCollection services)
        {
            var c = Configuration.GetValue<string>("ConnectionString");

            services.AddCors(c => c.AddPolicy(DevelopmentCorsPolicy, ConfigureCors));
            services.AddControllers();
            services.AddSingleton<IMongoClient>(x => new MongoClient(c));

            // var result = connection.db.collection(Pen').count()
            /*var client = new MongoClient(c);
            var database = client.GetDatabase("PenTracker");
            var result = client.GetDatabase("PenTracker").GetCollection<Pen>("Pen").CountDocuments(x => true);

            if (result != 100)
            {
                string text = System.IO.File.ReadAllText(@"numbers.JSON");
                var json_data = text;
                //JsonReader jsonReader = new JsonReader(json_data);
                //using JsonReader jsonreader = jsonReader;

                using (var jsonReader = new JsonReader(json_data))
                {
                    var serializer = new BsonArraySerializer();
                    var bsonArray = serializer.Deserialize(BsonDeserializationContext.CreateRoot(jsonReader));
                }
                BsonDocument document = BsonDocument.Parse(JsonReader.ToString());

                var collection = database.GetCollection<BsonDocument>("Pen");
                await collection.InsertOneAsync(document);


            }
            else
            {
               //Do nothing
            }*/
            // Setup communication with DB
            var client = new MongoClient(c);
            var database = client.GetDatabase("PenTracker");
            var collection = database.GetCollection<Pen>("Pen");
            // Count number of pens in the database
            var penCount = collection.CountDocuments(x => true);
            if (penCount != 100) // No pens
            {
                // Read json from file into string
                var json = File.ReadAllText(@"numbers.JSON");
                // Deserialize json string into "PenJson" array
                var penIds = JsonSerializer.Deserialize<PenJson[]>(json);
                // Loop penId from json file and insert into the database
                foreach (var penId in penIds)
                {
                    var dbPen = new Pen { Id = penId.Penld };
                    collection.InsertOne(dbPen);
                }
            }
            else
            {
                //Do nothing and chill
            }
            services.AddMvc(c => c.EnableEndpointRouting = false)
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.IgnoreNullValues = true;

                });

            services.AddControllers();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddOptions();
            services.AddMemoryCache();
            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
            services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
            services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
            services.AddHttpContextAccessor();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.

        private void ConfigureCors(CorsPolicyBuilder builder)
        {
            builder.AllowAnyMethod();
            builder.AllowAnyOrigin();
            builder.AllowAnyHeader();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(DevelopmentCorsPolicy);
            }
            app.UseIpRateLimiting();
            app.UseMvcWithDefaultRoute();

            app.UseHttpsRedirection();
            app.UseMiddleware<CorsMiddleware>();
            app.UseCors(b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().Build());

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc(r =>
            {
                //r.MapRoute("default", "{controller=Home}/{action=Index}");
                r.MapSpaFallbackRoute("spa", new { controller = "Home", action = "Index" });
            });

        }
    }

    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
            httpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            httpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            httpContext.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name");
            httpContext.Response.Headers.Add("Access-Control-Allow-Methods", "POST,GET,PUT,PATCH,DELETE,OPTIONS");
            return _next(httpContext);
        }
    }
}
