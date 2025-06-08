type UserEvent = "user";
type CRUDEvent = "upgraded";

type PolkaWebhookEvent = `${UserEvent}.${CRUDEvent}`;

export type PolkaWebhookRequest = {
  event: PolkaWebhookEvent;
  data: {
    userId: string;
  };
};
