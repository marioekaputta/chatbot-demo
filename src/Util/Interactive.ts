export function GetMenuID(query: string) {
  const arr = query.match('id:(.*);title:.*')
  if (!arr.length) {
    return
  }

  return arr[1]
}