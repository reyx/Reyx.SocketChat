using System.Diagnostics;
using System.Web;
using XSockets.Core.Common.Socket;

// [assembly: PreApplicationStartMethod(typeof(Reyx.SocketChat.Website.App_Start.XSocketsWebBootstrapper), "Start")]

namespace Reyx.SocketChat.Website.App_Start
{
    public static class XSocketsWebBootstrapper
    {
        private static IXSocketServerContainer wss;
        public static void Start()
        {
            wss = XSockets.Plugin.Framework.Composable.GetExport<IXSocketServerContainer>();
            wss.StartServers();

            foreach (var server in wss.Servers)
            {
                Debug.WriteLine("Started Server: {0}:{1}", server.ConfigurationSetting.Location, server.ConfigurationSetting.Port);
                Debug.WriteLine("Scheme: {0}", server.ConfigurationSetting.Scheme);
                Debug.WriteLine("SSL/TLS: {0}", server.ConfigurationSetting.IsSecure);
                Debug.WriteLine("Allowed Connections (0 = infinite): {0}", server.ConfigurationSetting.NumberOfAllowedConections);
                Debug.WriteLine("------------------------------------------------------");
            }
        }
    }
}
