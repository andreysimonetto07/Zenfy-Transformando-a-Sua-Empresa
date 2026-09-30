self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const target = event.notification.data && event.notification.data.link ? event.notification.data.link : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
