# @flowxo/twa

> Flow XO Telegram Web App Client

## Install

```bash
npm install @flowxo/twa
```

## Usage

```ts
import { FlowXOClient } from '@flowxo/twa';

clinet = new FlowXOClient({webApp: window.Telegram.WebApp});
client.fetchUserProfile().then((profile) => {
    console.log(profile)
})
client.updateUserProfile({attributes:{new:"attribute"}}).then((updated) => {
    console.log(updated)
})
client.event('myEvent', { my:"data"});
```
## Types
```ts
export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  timezone: string;
  country: string;
  locale: string;
  gender: string;
  email: string;
  phone: string;
  company: string;
  firstMessage: string;
  lastMessage: string;
  status: string;
  bot: {
    id: string;
    name: string;
  };
  attributes: Record<string, string>;
  segments: {
    id: string;
    name: string;
  }[];
}

export interface UserProfileUpdate {
  name: string;
  firstName: string;
  lastName: string;
  timezone: string;
  country: string;
  locale: string;
  gender: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  attributes: Record<string, string>;
  segments: {
    add?: string[],
    remove?: string[],
    replace?: string[]
  }[];
}
```
