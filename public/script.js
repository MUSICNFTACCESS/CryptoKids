async function fetchPrices() {
  const ids = "bitcoin,ethereum,solana";
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const res = await fetch(url);
  const data = await res.json();
  document.getElementById("prices").innerText = 
    `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum.usd} | SOL: $${data.solana.usd}`;
}
fetchPrices();
setInterval(fetchPrices, 60000);
