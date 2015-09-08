﻿using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Linq;
using Backend.Database;
using Backend.Models;
using System.Data.Entity;

namespace Backend.Infrastructure
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var roles = Roles; // Allowed roles from the attribute
            var users = Users; // Allowed users from the attribute

            try
            {
                const string tokenName = "api-token";

                // Check if api token is set in the header
                if(actionContext.Request.Headers.Contains(tokenName))
                {
                    var tokenString = actionContext.Request.Headers.GetValues(tokenName).First();
                    Token token = Token.Decrypt(tokenString);

                    User user;

                    using (var db = new DatabaseContext())
                    {
                        user = db.Users.SingleOrDefault(u => u.Username == token.Username);
                    }

                    if(user != null)
                    {
                    }
                }
                
                actionContext.Response = actionContext.Request.CreateErrorResponse(
                    HttpStatusCode.InternalServerError,
                    "Internal Server Errror: Something went wrong during the authorization!");
                return;
            }
            catch
            {
                actionContext.Response = actionContext.Request
                    .CreateErrorResponse(
                    HttpStatusCode.InternalServerError,
                    "Internal Server Errror: Something went wrong during the authorization!");
                return;
            }
            //try
            //{
            //    AuthenticationHeaderValue authValue = actionContext.Request.Headers.Authorization;

            //    if (authValue != null && !String.IsNullOrWhiteSpace(authValue.Parameter))
            //    {
            //        Credentials parsedCredentials = ParseAuthorizationHeader(authValue.Parameter);

            //        if (parsedCredentials != null)
            //        {
            //            var user = Context.Users.Where(u => u.Username == parsedCredentials.Username && u.Password == parsedCredentials.Password).FirstOrDefault();
            //            if (user != null)
            //            {
            //                var roles = user.Roles.Select(m => m.RoleName).ToArray();

            //                CurrentUser = new CustomPrincipal(parsedCredentials.Username, roles);

            //                if (!String.IsNullOrEmpty(Roles))
            //                {
            //                    if (!CurrentUser.IsInRole(Roles))
            //                    {
            //                        actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            //                        return;
            //                    }
            //                }

            //                if (!String.IsNullOrEmpty(Users))
            //                {
            //                    if (!Users.Contains(CurrentUser.UserId.ToString()))
            //                    {
            //                        actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            //                        return;
            //                    }
            //                }

            //            }
            //        }
            //    }
            //}
            //catch (Exception)
            //{
            //    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            //    actionContext.Response.Headers.Add(BasicAuthResponseHeader, BasicAuthResponseHeaderValue);
            //    return;

            //}
        }
    }
}