// 轻量版 Vercel Serverless Function 请求/响应类型
// 项目未引入 @vercel/node 依赖，这里只声明本文件实际用到的最小字段，
// 与 Vercel Node.js Runtime 实际传入的对象结构兼容。
export interface ApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}

export interface ApiResponse {
  status(code: number): ApiResponse
  json(data: unknown): void
  setHeader(name: string, value: string): void
}
