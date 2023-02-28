import { UploadAjaxError } from "$/ajax";
import { EditorError } from '$'

export interface UploadProgressEvent extends ProgressEvent {
  percent: number
}

export interface UploadRequestOptions {
  action: string
  method: string
  data?: Record<string, string | Blob | [string | Blob, string]>
  filename?: string
  file: File
  headers?: Headers | Record<string, string | number | null | undefined>
  onError?: (evt: UploadAjaxError) => void
  onProgress?: (evt: UploadProgressEvent) => void
  onSuccess?: (response: any) => void
  withCredentials?: boolean
}

export type UploadRequestHandler = (
  options: UploadRequestOptions
) => XMLHttpRequest | Promise<unknown>
