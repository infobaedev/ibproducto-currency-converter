export const HOST = process.env.REACT_APP_HOST;

export function loadCurrencys() {
    return fetch(HOST + "/api/divisas/cotizaciones").then(res => res.json());
}
