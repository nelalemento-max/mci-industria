const CRIPTO_PULSO_URL = 'https://cripto-pulso.vercel.app'

async function getJson(path, signal) {
  const response = await fetch(`${CRIPTO_PULSO_URL}${path}`, {signal, headers:{Accept:'application/json'}})
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'No se pudo consultar Cripto Pulso.')
  return payload
}

export const getMciServices = (signal) => getJson('/api/mci-services', signal)

export const getFuelSupply = ({department = 1, product = 'gasoline', signal} = {}) =>
  getJson(`/api/fuel-supply?department=${department}&product=${encodeURIComponent(product)}`, signal)

export const CRIPTO_PULSO_PUBLIC_URL = `${CRIPTO_PULSO_URL}/combustibles`
