export const extractProductIdFromUrl = () => {
  const currentUrl = window.location.href
  const regex = /\/product\/(\d+)/
  const match = currentUrl.match(regex)
  return match ? Number(match[1]) : null
}
