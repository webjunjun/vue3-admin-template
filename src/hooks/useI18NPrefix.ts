import { useI18n } from 'vue-i18n'

/**
 * i18n方法设置前缀 避免重复输入
 * @author: 刘军
 * @param  {string} prefix 翻译的前缀
 * @return {Function} cachedTranslateFn
 * @time 2023-07-12 16:17:40
 */
function useI18NPrefix(prefix?: string): Function {
  const { t } = useI18n()

  /**
   * 对t方法的重新封装
   * @author: 刘军
   * @param  {string} key 翻译的关键字
   * @return {string}
   * @time 2023-07-12 16:15:48
   */
  const cachedTranslateFn = (key: string): string => {
    let translationKey = key
    if (prefix) {
      translationKey = `${prefix}.${translationKey}`
    }

    return t(translationKey)
  }

  return cachedTranslateFn
}

export default useI18NPrefix
