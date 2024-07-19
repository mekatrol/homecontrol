interface HomeAssistantMessage {
  type: string;
}

const AUTH_REQUIRED = 'auth_required';
const AUTH_OK = 'auth_ok';

export class HomeAssistant {
  private _url: string;
  private _accessToken: string;
  private _ws: WebSocket | undefined;
  private _isConnected: boolean = false;
  private _isAuthenticated: boolean = false;

  constructor(url: string, accessToken: string) {
    this._url = url;
    this._accessToken = accessToken;
    this._ws = undefined;
  }

  public connect = async (): Promise<void> => {
    if (this._ws) {
      throw new Error('Already connected, call disconnect first.');
    }

    return this._connect();
  };

  public disconnect = async (): Promise<void> => {
    if (!this._ws) {
      // Already disconnected
      return;
    }

    // Connection action?
    if (this._isConnected) {
      // Send close to home assistant
    }

    // Close socket
    this._ws.close();

    // Release resource
    this._ws = undefined;
  };

  private _closeEvent = (): void => {
    console.log('closed');

    // Release resource
    this._ws = undefined;
  };

  private _errorEvent = (): void => {
    console.log('error');
  };

  private _messageEvent = (messageEvent: MessageEvent<any>): void => {
    const haMessage = JSON.parse(messageEvent.data) as HomeAssistantMessage;

    console.log('message:', haMessage.type, messageEvent.data);

    switch (haMessage.type) {
      case AUTH_REQUIRED:
        this._isConnected = true;
        this._auth();
        break;

      case AUTH_OK:
        this._isAuthenticated = true;
        break;
    }
  };

  private _auth = (): void => {
    this._ws.send(
      JSON.stringify({
        type: 'auth',
        access_token: this._accessToken
      })
    );
  };

  private _connect = async (): Promise<void> => {
    // Allow access to url inside promise closure
    const url = this._url;

    const closeEvent = this._closeEvent;
    const messageEvent = this._messageEvent;
    const errorEvent = this._errorEvent;

    // Open connection, will throw exception if connection fails
    this._ws = await new Promise((resolve, reject) => {
      try {
        // Create the socket for the given URL
        const ws = new WebSocket(url);

        // Set up callbacks

        ws.onopen = (): void => {
          resolve(ws);
        };

        ws.onmessage = messageEvent;
        ws.onclose = closeEvent;
        ws.onerror = errorEvent;
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };
}

// We want a singleton
let homeAssistant: HomeAssistant | undefined;

export const useHomeAssistant = (url: string, accessToken: string): HomeAssistant => {
  // Already created?
  if (homeAssistant) {
    // Return existing instance
    return homeAssistant;
  }

  homeAssistant = new HomeAssistant(url, accessToken);

  return homeAssistant;
};
