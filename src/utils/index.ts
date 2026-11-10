import { AxiosResponse } from 'axios'

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**
 * 触发浏览器下载文件
 * 
 * @param  {Blob | MediaSource} blob 文件对象
 * @param  {string} fileName 文件名
 */
export function saveBlob(blob: Blob | MediaSource, fileName: string) {
  const a = document.createElement('a')
  a.style.display = 'none'
  document.body.appendChild(a)
  const fileUrl = window.URL.createObjectURL(blob)
  a.href = fileUrl
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(fileUrl)
  document.body.removeChild(a)
}

/**
 * 将blob流下载为文件
 * 
 * @param  {AxiosResponse} res 请求返回对象
 */
export function downloadBlobToFile(res: AxiosResponse) {
  const contentDisposition = res.headers['content-disposition']
  const filenameMatch = contentDisposition.match(/filename="(.+)"/)
  if (filenameMatch) {
    const filename = decodeURI(filenameMatch[1])
    const fileType = res.headers['content-type']
    const fileData = new Blob([res.data], { type: (typeof fileType === 'string' ? fileType : undefined) })
    saveBlob(fileData, filename)
  }
}
