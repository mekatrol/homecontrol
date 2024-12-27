/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum BlockSide {
  Left = 'Left',
  Right = 'Right',
  Top = 'Top',
  Bottom = 'Bottom'
}

export interface Flow {
  /** @format uuid */
  id: string;
  key: string;
  enabled: boolean;
  label: string;
  description: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
  blocks: FlowBlock[];
  connections: FlowConnection[];
}

export interface FlowBlock {
  /** @format uuid */
  id: string;
  label?: string | null;
  functionType: string;
  io: InputOutput[];
  offset: Offset;
  size: Size;
  /** @format int32 */
  zOrder: number;
  /** @format int32 */
  zBoost: number;
  /** @format int32 */
  z: number;
  selected: boolean;
  draggingAsNew?: boolean | null;
  dragLocationInvalid?: boolean | null;
  dragLocationHasBeenValid?: boolean | null;
}

export interface FlowConnection {
  /** @format uuid */
  id: string;
  /** @format uuid */
  startBlockId: string;
  /** @format int32 */
  startPin: number;
  /** @format uuid */
  endBlockId: string;
  /** @format int32 */
  endPin: number;
  selected: boolean;
}

export interface InputOutput {
  /** @format int32 */
  pin: number;
  label?: string | null;
  description?: string | null;
  type: InputOutputSignalType;
  direction: InputOutputDirection;
  offset: Offset;
  size: Size;
  side: BlockSide;
}

export enum InputOutputDirection {
  Input = 'Input',
  Output = 'Output'
}

export enum InputOutputSignalType {
  Analogue = 'Analogue',
  Digital = 'Digital',
  PWM = 'PWM'
}

export interface Offset {
  /** @format double */
  x: number;
  /** @format double */
  y: number;
}

export interface PingModel {
  homeAssistantOnline?: boolean | null;
  databaseOnline: boolean;
}

export interface Point {
  /** @format uuid */
  id: string;
  key: string;
  enabled: boolean;
  label: string;
  description: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
}

export interface Size {
  /** @format double */
  width: number;
  /** @format double */
  height: number;
}

import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) && this.securityWorker && (await this.securityWorker(this.securityData))) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { 'Content-Type': type } : {})
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path
      })
      .then((response) => response.data);
  };
}

/**
 * @title Mekatrol.Automatum.NodeServer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  flow = {
    /**
     * No description
     *
     * @tags Flow
     * @name List
     * @request GET:/flow
     */
    list: (params: RequestParams = {}) =>
      this.request<Flow[], any>({
        path: `/flow`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Flow
     * @name Post
     * @request POST:/flow
     */
    post: (data: Flow, params: RequestParams = {}) =>
      this.request<Flow, any>({
        path: `/flow`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Flow
     * @name Put
     * @request PUT:/flow
     */
    put: (data: Flow, params: RequestParams = {}) =>
      this.request<Flow, any>({
        path: `/flow`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Flow
     * @name Get
     * @request GET:/flow/{id}
     */
    get: (id: string, params: RequestParams = {}) =>
      this.request<Flow, any>({
        path: `/flow/${id}`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Flow
     * @name Delete
     * @request DELETE:/flow/{id}
     */
    delete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/flow/${id}`,
        method: 'DELETE',
        ...params
      })
  };
  ping = {
    /**
     * No description
     *
     * @tags Ping
     * @name Ping
     * @request GET:/Ping
     */
    ping: (params: RequestParams = {}) =>
      this.request<PingModel, any>({
        path: `/Ping`,
        method: 'GET',
        format: 'json',
        ...params
      })
  };
  point = {
    /**
     * No description
     *
     * @tags Point
     * @name List
     * @request GET:/point
     */
    list: (params: RequestParams = {}) =>
      this.request<Point[], any>({
        path: `/point`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Point
     * @name Post
     * @request POST:/point
     */
    post: (data: Point, params: RequestParams = {}) =>
      this.request<Point, any>({
        path: `/point`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Point
     * @name Put
     * @request PUT:/point
     */
    put: (data: Point, params: RequestParams = {}) =>
      this.request<Point, any>({
        path: `/point`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Point
     * @name Get
     * @request GET:/point/{id}
     */
    get: (id: string, params: RequestParams = {}) =>
      this.request<Point, any>({
        path: `/point/${id}`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Point
     * @name Delete
     * @request DELETE:/point/{id}
     */
    delete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/point/${id}`,
        method: 'DELETE',
        ...params
      })
  };
}
