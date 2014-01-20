using Reyx.SocketChat.Website.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;


namespace Reyx.SocketChat.Website.Controllers
{
    public class Chat : XSocketController
    {
        /// ivory belongs to elephants...Just saying.
     
        private static readonly List<ChatRoom> chats;
        private static readonly List<ChatUser> users;

        //public Chat()
        //{
        //    this.OnClose += Chat_OnClose;
        //}

        //void Chat_OnClose(object sender, XSockets.Core.Common.Socket.Event.Arguments.OnClientDisconnectArgs e)
        //{
        //    this.SendToAll(this.StorageGuid, "removeUser");
        //}

        static Chat()
        {
            chats = new List<ChatRoom>();
            users = new List<ChatUser>();
        }

        /// <summary>
        /// Just a simple XSockets controller that illustrates a "backend" 
        /// </summary>
        public void GetUsers()
        {
            this.Send(users.Where(t => t.Id != this.StorageGuid), "getUsers"); // Pass back the list of users
        }

        /// <summary>
        /// Action that adds an "User" to our static list of users. When added everyone is notified )
        /// </summary>
        /// <param name="user"></param>
        public void Login(ChatUser user)
        {
            user.Id = this.StorageGuid;

            if (!users.Any(t => t.Id == this.StorageGuid))
                users.Add(user);

            this.Send(user, "login");
            this.SendToOthers(user, "addUser");
        }

        /// <summary>
        /// Action that adds an "User" to our static list of users. When added everyone is notified )
        /// </summary>
        /// <param name="user"></param>
        public void InitChat(string from, string to)
        {
            var chat = chats.FirstOrDefault(t => 
                t.FromUser.Slug == from && t.ToUser.Slug == to || 
                t.FromUser.Slug == to && t.ToUser.Slug == from);

            if (chat == null)
            {
                chat = new ChatRoom()
                {
                    FromUser = users.FirstOrDefault(t => t.Slug.Equals(from)),
                    ToUser = users.FirstOrDefault(t => t.Slug.Equals(to))
                };
                chats.Add(chat);
            }
            else
            {
                chat.Messages = chat.Messages.OrderByDescending(t => t.Date).Take(20).ToList();
            }

            this.Send(chat, "initChat");
        }

        /// <summary>
        /// Action that adds an "User" to our static list of users. When added everyone is notified )
        /// </summary>
        /// <param name="user"></param>
        public void SendMessage(string from, string to, string message)
        {
             var chat = chats.FirstOrDefault(t =>
                t.FromUser.Slug == from && t.ToUser.Slug == to || 
                t.FromUser.Slug == to && t.ToUser.Slug == from);

            if (chat == null)
            {
                this.Send(null, "messageSent");
                this.SendTo(p => p.StorageGuid == chat.ToUser.Id, null, "messageReceived");
            }

            var msg = new ChatMessage()
            {
                Date = DateTime.Now,
                Message = message,
                FromUser = users.FirstOrDefault(t => t.Slug.Equals(from)),
                ToUser = users.FirstOrDefault(t => t.Slug.Equals(to))
            };

            chat.Messages = chat.Messages.OrderByDescending(t => t.Date).Take(19).ToList();

            chat.Messages.Insert(0, msg);

            this.Send(msg, "messageSent");
            this.SendTo(p => p.StorageGuid == msg.ToUser.Id, chat, "messageReceived");
        }

        /// <summary>
        /// Remove an user fro the list of Users using it's Id ( Guid )
        /// </summary>
        /// <param name="id"></param>
        public void RemoveUser(string slug)
        {
            var removedUser = users.Find(a => a.Slug.Equals(slug));
            users.Remove(removedUser);
            this.SendToAll(removedUser, "removeUser"); // Notify all that an user is removed...
        }
    }
}