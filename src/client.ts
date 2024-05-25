import { WebApp } from '@twa-dev/types';

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

export type UserProfileUpdate = Partial<
  Omit<UserProfile, 'firstMessage' | 'lastMessage' | 'bot' | 'segments'>
> & {
  segments?: {
    add?: string[];
    remove?: string[];
    replace?: string[];
  };
};

export interface FlowXOClientInitParams {
  webApp?: WebApp;
  window?: Window;
  params?: Record<string, string>;
  baseUrl?: string;
}

export class FlowXOClient {
  readonly params: Record<string, string>;
  readonly baseUrl: string;
  private webApp?: WebApp;
  constructor(options: FlowXOClientInitParams = {}) {
    if (!window) {
      throw new Error(
        'No window could be found in the global context. This library only works in a browser.'
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.webApp = options.webApp ?? (window as any)?.Telegram?.WebApp;
    this.params = options.params ?? {};

    const urlSearchParams = new URLSearchParams(window.location.search);
    this.params = {
      ...this.params,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ...Object.fromEntries(urlSearchParams.entries()),
    };
    this.baseUrl = options.baseUrl ?? 'https://flowxo.com/telegram';
  }

  get telegram(): WebApp {
    if (!this.webApp) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.webApp = (window as any)?.Telegram?.WebApp;
      if (!this.webApp) {
        throw new Error(
          'No Telegram WebApp could be found in the global context. Please make sure you include the Telegram Web App SDK before using this library.'
        );
      }
    }
    return this.webApp;
  }

  async fetchUserProfile(): Promise<UserProfile> {
    const url = this.resourceUrl('telegram/me');
    const headers = this.createHeaders();
    return fetch(url.href, { method: 'GET', headers }).then(res => {
      return res.json() as Promise<UserProfile>;
    });
  }

  async updateUserProfile(update: UserProfileUpdate): Promise<UserProfile> {
    const url = this.resourceUrl('telegram/me');
    const headers = this.createHeaders();
    return fetch(url.href, {
      method: 'POST',
      headers,
      body: JSON.stringify(update),
    }).then(res => {
      return res.json() as Promise<UserProfile>;
    });
  }

  async event(
    eventName: string,
    eventData: Record<string, unknown>
  ): Promise<void> {
    const url = this.resourceUrl(`telegram/events/${eventName}`);
    const headers = this.createHeaders();
    return fetch(url.href, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: eventData }),
    }).then(() => undefined);
  }

  protected createHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.params.token) {
      headers.append('Authorization', `Bearer ${this.params.token}`);
    }
    if (this.telegram.initData) {
      headers.append('x-init-data', this.telegram.initData);
    }
    if (this.params.rp) {
      headers.append('x-response-path', this.params.rp);
    }
    return headers;
  }

  private resourceUrl(resourcePath: string): URL {
    return new URL(resourcePath, this.baseUrl);
  }
}
