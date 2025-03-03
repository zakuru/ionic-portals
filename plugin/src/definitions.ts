/**
 * A type definining the `PortalsPlugin` API.
 */
import type { PluginListenerHandle } from '@capacitor/core';

export interface PortalsPlugin {
  publishNative<TMessage extends PortalMessage>(
    message: TMessage,
  ): Promise<void>;
  addListener<T = unknown>(
    eventName: string,
    listenerFunc: SubscriptionCallback<T>,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}

/**
 * A type definining the `InitialContext` from the native application that you can pass into your web application.
 */
export interface InitialContext<T = unknown> {
  name: string;
  value?: T;
  assets?: {
    [key: string]: string;
  };
}

/**
 * A message that you can publish to a topic using Portals.publish()
 */
export interface PortalMessage<TData = any> {
  topic: string;
  data?: TData;
}

/**
 * The type definition from the callback running Portals.subscribe()
 */
export type SubscriptionCallback<T = unknown> = (result: {
  topic: string;
  data: T;
}) => void;
