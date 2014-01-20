using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Reyx.SocketChat.Website.Models
{
    public class ChatRoom
    {
        public ChatRoom()
        {
            this.Messages = new List<ChatMessage>();
        }


        public List<ChatMessage> Messages { get; set; }
        public ChatUser FromUser { get; set; }
        public ChatUser ToUser { get; set; }
    }
}