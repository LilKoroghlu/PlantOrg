using Microsoft.AspNetCore.SignalR;
using MS_PlantOrg.Models;

namespace MS_PlantOrg.Hubs
{
    public class ChatHub : Hub
    {
        private readonly PlantOrgContext _sql;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ChatHub(PlantOrgContext sql, IWebHostEnvironment hostingEnvironment)
        {
            _sql = sql;
            _hostingEnvironment = hostingEnvironment;
            _hostingEnvironment = hostingEnvironment;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("UserConnected");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.Caller.SendAsync("UserDisconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public Task GetOldMessages(string operatorId)
        {
            var messages = _sql.Messages.Where(m => m.OperatorId == Convert.ToInt32(operatorId)).OrderBy(m => m.Id).ToList();
            return Clients.Caller.SendAsync("SetOldMessages", messages);
        }

		public Task GetOldMessagesUser(string userId)
		{
			var messages = _sql.Messages.Where(m => m.UserId == Convert.ToInt32(userId)).OrderBy(m => m.Id).ToList();
			return Clients.Caller.SendAsync("SetOldMessagesUser", messages);
		}

		public Task SendMessageToOperators(string message, string username, string plantType, string userId, bool isSendPhoto, bool isSendVideo)
        {


            return Clients.All.SendAsync("ReceiveMessageOperators", message, username, plantType, Context.ConnectionId, userId, isSendPhoto, isSendVideo);
        }

        public Task SetOperatorId(string operatorName, string userName, string operatorId, string userId)
        {

            double ratingValue = 0;
            double avgValue = 0;
            var Values = _sql.Ratings.Where(x => x.RatingOperatorId == Convert.ToInt32(operatorId)).ToList();
            bool displayRate = false;
            int rateCount = Values.Count;
            if(rateCount >= 10)
            {
                displayRate = true;
            }

            foreach (var value in Values)
            {
                ratingValue += value.RatingValue.GetValueOrDefault();
            }
            avgValue = Math.Round((double)ratingValue / Values.Count(), 1);

            return Clients.All.SendAsync("ReceiveOperatorId", operatorName, userName, Context.ConnectionId, operatorId, userId, Convert.ToString(avgValue), displayRate);
        }

        public Task SendMessageToOperator(string connectionId, string message, string userName, string userId, string operatorId, string username, string operatorname)
        {
            _sql.Messages.Add(new Message
            {
                UserId = Convert.ToInt32(userId),
                OperatorId = Convert.ToInt32(operatorId),
                Message1 = message,
                SendDate = DateTime.Now,
                SendByUser = true,
                UserName = username,
                Type = "message",
                OperatorName = operatorname
            });
            _sql.SaveChanges();
            return Clients.Client(connectionId).SendAsync("ReceiveMessageOperator", message, userName, userId, operatorId);
        }

        public Task SendMessageToUser(string connectionId, string message, string operatorName, string operatorId, string userId, string username, string operatorname)
        {
            _sql.Messages.Add(new Message
            {
                UserId = Convert.ToInt32(userId),
                OperatorId = Convert.ToInt32(operatorId),
                Message1 = message,
                SendDate = DateTime.Now,
                SendByUser = false,
                UserName = username,
                Type = "message",
                OperatorName = operatorname
            });
            _sql.SaveChanges();
            return Clients.Client(connectionId).SendAsync("receiveMessageUser", message, operatorName, operatorId, userId);
        }

        public Task EndConnectionOperator(string userId, string operatorId, string operatorPlantName, string connectionId)
        {
            _sql.Appeals.Add(new Appeal
            {
                AppealClientId = Convert.ToInt32(userId),
                AppealOperatorId = Convert.ToInt32(operatorId),
                AppealDate = DateTime.Now,
                AppealPlantId = _sql.Plants.FirstOrDefault(p => p.PlantName == operatorPlantName).PlantId
            });
            _sql.SaveChanges();
            return Clients.Client(connectionId).SendAsync("EndConversationUser", operatorId, Context.ConnectionId);
        }

        public Task SendImageToUser(string operatorDbId, string connectionId)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveImageForUser", operatorDbId, Context.ConnectionId);
        }
        public Task SendVideoToUser(string operatorDbId, string connectionId)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveVideoForUser", operatorDbId, Context.ConnectionId);
        }

        public Task SendAudioToUser(string operatorDbId, string connectionId)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveAudioForUser", operatorDbId, Context.ConnectionId);
        }

        public Task EndConnectionUser(string connectionId)
        {
            return Clients.Client(connectionId).SendAsync("EndConversationOperator");
        }

    }
}
