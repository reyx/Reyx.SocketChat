using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Reyx.SocketChat.Website.Core
{
    public class BaseTemplate : System.Web.UI.Page
    {
        public static string Static(string path)
        {
            return System.IO.Path.Combine(String.Concat("//", "static.", ConfigurationManager.AppSettings["domain"] ?? "localhost"), path).Replace("\\", "/");
        }
    }
}