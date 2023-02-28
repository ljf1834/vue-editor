import { isNil } from 'lodash-unified'
import { throwError } from '$'
import type {
  UploadProgressEvent,
  UploadRequestHandler,
  UploadRequestOptions,
} from '@/types'

const SCOPE = 'EditorUpload'

export class UploadAjaxError extends Error {
  name = 'UploadAjaxError'
  status: number
  method: string
  url: string

  constructor(message: string, status: number, method: string, url: string) {
    super(message)
    this.status = status
    this.method = method
    this.url = url
  }
}

function getError(
  action: string,
  option: UploadRequestOptions,
  xhr: XMLHttpRequest
) {
  let msg: string
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`
  }

  return new UploadAjaxError(msg, xhr.status, option.method, action)
}

function getBody(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const ajaxUpload: UploadRequestHandler = (option) => {
  if (typeof XMLHttpRequest === 'undefined')
    throwError(SCOPE, 'XMLHttpRequest is undefined')

  const xhr = new XMLHttpRequest()
  const action = option.action
  option.method = option.method || 'post'
  option.filename = option.filename || 'file'

  if (xhr.upload) {
    xhr.upload.addEventListener('progress', (evt) => {
      const progressEvt = evt as UploadProgressEvent
      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
      option.onProgress ? option.onProgress(progressEvt) : false
    })
  }

  const formData = new FormData()
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (Array.isArray(value)) formData.append(key, ...value)
      else formData.append(key, value)
    }
  }
  formData.append(option.filename, option.file, option.file.name)

  xhr.addEventListener('error', () => {
    option.onError ? option.onError(getError(action, option, xhr)) : false
  })

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError ? option.onError(getError(action, option, xhr)) : false
    }
    option.onSuccess ? option.onSuccess(getBody(xhr)) : false
  })

  xhr.open(option.method, action, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value))
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNil(value)) continue
      xhr.setRequestHeader(key, String(value))
    }
  }

  xhr.send(formData)
  return xhr
}
export default ajaxUpload
