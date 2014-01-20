using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Reyx.SocketChat.Website.Models
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public ChatUser FromUser { get; set; }
        public ChatUser ToUser { get; set; }
    }
}