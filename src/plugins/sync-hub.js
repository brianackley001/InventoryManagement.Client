import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

export default {
  install(Vue) {
    // use a new Vue instance as the interface for Vue components to receive/send SignalR events
    // this way every component can listen to events or send new events using this.$questionHub
    const syncHub = new Vue();
    Vue.prototype.$syncHub = syncHub;

    // Provide methods to connect/disconnect from the SignalR hub
    let connection = null;
    let startedPromise = null;
    let manuallyClosed = false;

    Vue.prototype.startSignalR = () => {
      connection = new HubConnectionBuilder()
        .withUrl(`${process.env.VUE_APP_IM_API_URL}/sync-hub`)
        .configureLogging(LogLevel.Information)
        .build();

      // Forward hub events through the event, so we can listen for them in the Vue components
      connection.on("SyncShoppingListCheckout", (shoppingListId) => {
        syncHub.$emit("SyncShoppingListCheckout", shoppingListId);
      });
      // connection.on("QuestionScoreChange", (questionId, score) => {
      //   syncHub.$emit("score-changed", { questionId, score });
      // });
      // connection.on("AnswerCountChange", (questionId, answerCount) => {
      //   syncHub.$emit("answer-count-changed", { questionId, answerCount });
      // });
      // connection.on("AnswerAdded", (answer) => {
      //   syncHub.$emit("answer-added", answer);
      // });
      // connection.on("LiveChatMessageReceived", (username, text) => {
      //   syncHub.$emit("chat-message-received", { username, text });
      // });

      // You need to call connection.start() to establish the connection but the client wont handle reconnecting for you!
      // Docs recommend listening onclose and handling it there.
      // This is the simplest of the strategies
      function start() {
        startedPromise = connection.start().catch((err) => {
          console.error("Failed to connect with hub", err);
          return new Promise((resolve, reject) =>
            setTimeout(() => start().then(resolve).catch(reject), 5000)
          );
        });
        return startedPromise;
      }
      connection.onclose(() => {
        if (!manuallyClosed) start();
      });

      // Start everything
      manuallyClosed = false;
      start();
    };
    Vue.prototype.stopSignalR = () => {
      if (!startedPromise) return;

      manuallyClosed = true;
      return startedPromise
        .then(() => connection.stop())
        .then(() => {
          startedPromise = null;
        });
    };
  },
};
