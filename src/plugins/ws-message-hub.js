import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

const hubConnection = new HubConnectionBuilder()
  .withUrl(`${process.env.VUE_APP_IM_API_URL}sync-hub`)
  .configureLogging(LogLevel.Information)
  .build();

function invokeHubMessage(messageName, messageData) {
  return hubConnection.invoke(messageName, messageData);
}

export { hubConnection, invokeHubMessage };
