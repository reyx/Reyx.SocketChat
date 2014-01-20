using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using Reyx.SocketChat.Website;
using XSockets.Core.Common.Socket;
using Reyx.SocketChat.Website.App_Start;

namespace Reyx.SocketChat.Website
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            XSocketsWebBootstrapper.Start();
        }

        void Application_End(object sender, EventArgs e)
        {
        }

        void Application_Error(object sender, EventArgs e)
        {
        }
    }
}
