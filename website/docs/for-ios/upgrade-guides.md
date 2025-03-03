---
title: Upgrade Guides
sidebar_label: Upgrade Guides
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## IonicPortals iOS 0.7.x -> 0.8.0

IonicPortals iOS version 0.8.0 is compatible with '@ionic/portals' version 0.8.x.

This release requires Xcode 14.1 or higher in accordance with [Apple's requirements](https://developer.apple.com/news/upcoming-requirements/?id=04252023a).

:::caution
IonicPortals 0.8.0 is a notable update that requires Capacitor 5.
Care should be taken to update dependencies across your web content and native apps to ensure compatibility.
:::

### Breaking Changes

#### Pub/Sub

PortalsPubSub is now a class with a `shared` singleton available instead of an enum with static functions.
This change allows for providing a custom instance of PortalsPubSub to PortalsPlugin to limit visibility of events that are published to a given portal.
PortalsPlugin will default to using `PortalsPubSub.shared`.

`PortalsPubSub.subscribe` no longer has an overload that returns an `Int` and `PortalsPubSub.unsubscribe` has been removed entirely.
Unsubscribing will occur via an `AnyCancellable` returned by the `subscribe` methods whenever it's cancel method is called or on deinit.

#### Plugin Registration

There is no longer a `PluginRegistrationStrategy` on `Portal`.
All plugins must be explicitly registered on the Portal.
In certain cases, automatic registration can cause unexpected crashes in applications.

## @ionic/portals 0.6.x -> 0.7.0

IonicPortals iOS version 0.7.0 is compatible with '@ionic/portals' version 0.7.x

:::caution
Ionic Portals 0.7.0 is a notable update that upgrades the Capacitor dependency to version 4. Care should be taken to update dependencies across your web content and native apps to ensure compatibility.
:::

First review the [Capacitor 4 Update Guide](https://capacitorjs.com/docs/updating/4-0) for an overview of necessary changes. Some will not be relevant for Portals apps, but this will be a useful reference in case you encounter issues with your upgrade.

### Updating Web Content

Update the Portals Plugin in your web content to `0.7.0`. Then, follow the [Capacitor 4 Update Guide](https://capacitorjs.com/docs/updating/4-0#using-the-cli-to-migrate) CLI migration steps to update your web content that uses Capacitor.

### Update Native Projects

#### Dependency Version Alignment

The only necessary steps to use Portals version 0.7.0 should be to update dependencies. IonicPortals for iOS version 0.7.0 is compatible with Live Updates 0.2.2 and Official Capacitor Plugins over version 4.0.

### InitialContext Update

A default InitialContext is now always passed to the web content running in a Portal context such that the Portal name will always be accessible.

Before:

```typescript
export interface InitialContext<T> {
  name: string;
  value: T;
}
```

After:

```typescript
export interface InitialContext<T> {
  name: string;
  value: T | undefined;
}
```

## @ionic/portals 0.0.x -> 0.6.0

### `Portals.publish()`

The method signature of `Portals.publish()` now allows generic typing over `PortalMessage` instead of restricting generic typing to the `data` parameter of `PortalMessage`. The `message` parameter must be of type `string` but can be predefined to prevent typos, invalid topic names, etc.

Before:

```typescript
Portals.publish<string>({ topic: "foo", data: "bar" });
```

After:

```typescript
type ValidMessage = { topic: "foo"; data: string };

// TypeScript will reject the following statement:
Portals.publish<ValidMessage>({ topic: "food", data: 1 });
```

### `Portals.getInitialContext()`

`Portals.getInitialContext()` is no longer asynchronous and has been moved out of the `Portals` class.

Before:

```typescript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Portals from "@ionic/portals";
import { Capacitor } from "@capacitor/core";

if (!Capacitor.isNativePlatform()) {
  // do something
  (window as any).portalInitialContext = {
    value: { startingRoute: "/" },
  };
}

Portals.getInitialContext<{ startingRoute: string }>().then((context) => {
  ReactDOM.render(
    <React.StrictMode>
      <App context={context.value} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
```

After:

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Portals, { getInitialContext } from '@ionic/portals';
import { Capacitor } from '@capacitor/core';

const initialContext = getInitialContext<{ startingRoute: string }>;
const startingRoute = initialContext?.value ?? { startingRoute: '/' };

ReactDOM.render(
  <React.StrictMode>
    <App context={startingRoute} />
  </React.StrictMode>,
  document.getElementById('root'),
);
```

## IonicPortals iOS 0.6.0 -> 0.6.1

IonicPortals iOS version 0.6.1 is compatible with '@ionic/portals' version 0.5.x

### Swift Package Manager Support

Add https://github.com/ionic-team/ionic-portals-ios in the Xcode "Swift Package Dependencies" tab in the project configuration. The suggested version range
is "Up to Next Minor Version" to prevent auto-updating to a breaking version before Ionic Portals iOS reaches version 1.0

### iOS 13.0 Support

The 0.5.x versions of Ionic Portals iOS required iOS 14.0. In this release we have included support for iOS 13.0 and up. To support iOS 13.0 in your app,
you should update your target to support the OS.

## IonicPortals iOS 0.5.x -> 0.6.0

IonicPortals iOS version 0.6.0 is compatible with '@ionic/portals' version 0.5.x

### PortalManager & PortalBuilder Removal

#### PortalManager -> PortalsRegistrationManager

`PortalManager` has been removed. It's registration functionality has been replaced with [`PortalsRegistrationManager`](https://ionic-portals-ios.vercel.app/documentation/ionicportals/portalsregistrationmanager).

<Tabs
defaultValue="swift"
values={[
{ label: 'Swift', value: 'swift' },
{ label: 'Objective-C', value: 'objc' }
]}>
<TabItem value="swift">

**Before**

```swift
PortalManager.register("YOUR_KEY")
```

**After**

```swift
PortalsRegistrationManager.shared.register(key: "YOUR_KEY")
```

</TabItem>

<TabItem value="objc">

**Before**

```objectivec
[PortalManager register:@"YOUR_KEY"];
```

**After**

```objectivec
[[IONPortalsRegistrationManager shared] registerWithKey:@"YOUR_KEY"];

```

</TabItem>

</Tabs>

#### Creating and Managing Portals

There is no need to add or register Portals with `PortalManager`. Just create an instance of `Portal` directly:

<Tabs
defaultValue="swift"
values={[
{ label: 'Swift', value: 'swift' },
{ label: 'Objective-C', value: 'objc' }
]}>
<TabItem value="swift">

**Before**

```swift
PortalManager.newPortal("name")
    .setStartDir("startDir")
    .create()

// elsewhere in your application

let portal = try! PortalManager.getPortal("name")
```

**After**

```swift
let portal = Portal(
    name: "appname",
    startDir: "startDir",
    initialContext: ["someKey": "someValue"]
)

let portalView = PortalUIView(portal: portal)
```

</TabItem>

<TabItem value="objc">

**Before**

```objectivec
[PortalManager register:@"YOUR_PORTAL_KEY_HERE"];
PortalBuilder *builder = [[PortalBuilder alloc] init:@"name"];
[builder setStartDir:@"startDir"];
Portal *portal = [builder create];
[PortalManager addPortal:portal];

// elsewhere in your application
Portal *portal = [PortalManager getPortal:@"name"];
```

**After**

```objectivec
IONPortal *portal = [[IONPortal alloc] initWithName:@"name" startDir:@"startDir" initialContext:nil];

IONPortalUIView *portalView = [[IONPortalUIView alloc] initWithPortal:portal];
```

</TabItem>

</Tabs>

The primary benefit of this approach is getting rid of a throwing API that is not necessary and eliminating a _required_ and _inflexible_ way of managing Portals. The `Portal` struct is simply configuration data for the view to determine what web assets to render and what data to provide it. If you find that you need to use the Portals in multiple places in your application, the preferred approach is extending `Portal` with static properties or methods:

```swift
extension Portal {
    static let checkout = Portal(
        name: "checkout",
        startDir: "portals/checkout",
        initialContext: ["someKey": "someValue"]
    )

    static func help(initialRoute: String) -> Portal {
        Portal(
          name: "help",
          startDir: "portals/help",
          initialContext: ["initialRoute": initialRoute]
        )
    }
}

// Where you use the Portal
PortalUIView(portal: .checkout)
PortalUIView(portal: .help(initialRoute: "/faq"))
```

Your situation may require something different, but version 0.6.0 gives you the flexibility to take any approach you prefer.

#### `Portal` interface changes

**initialContext**

The `initialContext` property on [`Portal`](https://ionic-portals-ios.vercel.app/documentation/ionicportals/portal) has changed from `[String: Any]` -> `JSObject`. `JSObject` is a typealias from `Capacitor` for `[String: JSValue]`. `JSValue` is a protocol defined in `Capacitor` that the following types conform to:

- `String`
- `Bool`
- `Int`
- `Float`
- `Double`
- `NSNumber`
- `NSNull`
- `Data`
- `Array` where `Element: JSValue`
- `Dictionary` where `Key == String && Value == JSValue`

This change is breaking only in that this was an undocumented requirement when sending data to a `Portal` as data would be coerced to those types. However, any data that did not conform to those types would be lost. This change makes that requirement explicit.

**ExpressibleByStringLiteral**

Portal now has conformance for `ExpressibleByStringLiteral` for simple use-cases where the Portal name and start directory are the same.

```swift
// This creates a `Portal` with name and startDir as "checkout"
// with no intialContext or liveUpdateConfig set.
let portalView = PortalUIView(portal: "checkout")
```

### PortalWebView -> PortalUIView & PortalUIWebView -> PortalView

The PortalWebView (the UIKit class) name has been changed to `PortalUIView`. `PortalUIWebView` (the SwiftUI struct) name as been changed to `PortalView`. All other functionality remains the same.

### PortalsPlugin and Native PubSub separated

In an effort to make the `PortalsPlugin` more focused on simply exposing native behavior to the Web, a new enum `PortalsPubSub` has taken the role of brokering the actual messages, with `PortalsPlugin` providing a small plugin interface wrapping calls to `PortalsPubSub` for Capacitor. `PortalsPlugin` is no longer publicly accessible, but is exposed to the Objective-C runtime for Capacitor to load.

**Before**

```swift
let subscriptionRef = PortalsPlugin.subscribe("topic") { result in
    // do something with result
}

PortalsPlugin.publish("topic", "data")
PortalsPlugin.unsubscribe("topic", subscriptionRef)
```

**After**

```swift
let subscriptionRef = PortalsPubSub.subscribe("topic") { result in
    // do something with result
}

PortalsPubSub.publish("data", to: "topic")
PortalsPubSub.unsubscribe(from: "topic", subscriptionRef: subscriptionRef)
```

### Improvements and API Changes to PubSub Interface

#### A `subscribe(to:)` Method that returns an `AnyCancellable`

Having to manually manage unsubscribing from a `PortalsPubSub` subscription can be error prone and must occur to prevent a closure from being retained indefinitely, which could lead to memory issues. An `AnyCancellable` will run it's `cancel` method on deinit or when explicitly called. IonicPortals provides the AnyCancellable with the unsubscribe logic so you don't have to juggle managing a subscription counter that has no semantic value for your application.

```swift
import UIKit
import Combine // Needed for AnyCancellable visibility
import IonicPortals

class ViewController: UIViewController {
    var cancellable: AnyCancellable?

    override func viewDidLoad() {
        cancellable = PortalsPubSub.subscribe(to: "topic") { result in
            // Do something with result
        }

        super.viewDidLoad()
    }
}
```

#### Combine Support

IonicPortals has support for emitting `SubscriptionResult` through a Combine Publisher:

```swift
import Combine
import IonicPortals

// Emits `SubscriptionResult` downstream
let publisher = PortalsPubSub.publisher(for: "topic")

// Extracts the `data` value from SubscriptionResult
let dataPublisher = PortalsPubSub.publisher(for: "topic")
    .data()

// Attempts to cast the `data` value from SubscriptionResult,
// returning nil on failure
let dataAsPublisher = PortalsPubSub.publisher(for: "topic")
    .data(as: String.self)

// Attempts to cast the `data` value from SubscriptionResult,
// returning an error on failure.
let tryDataAsPublisher = PortalsPubSub.publisher(for: "topic")
    .tryData(as: String.self)

// Attempts to decode the `JSObject` to any type conforming
// to `Decodable`
let decodeDataPublisher = PortalsPubSub.publisher(for: "topic")
    .decodeData(MyDecodableType.self, decoder: JSONDecoder())
```

#### Swift Concurrency Support

_only available for Swift 5.6 +_

Added a `subscribe(to:)` method that returns an `AsyncStream<SubscriptionResult>`:

```swift
import IonicPortals

let task = Task {
    for await result in PortalsPubSub.subscribe(to: "topic") {
        // do something with result
    }
}
```
