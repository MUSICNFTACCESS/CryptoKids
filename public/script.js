    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await res.json();
    const price = data[symbol]?.usd;
    if (price) document.getElementById(id).textContent = `$${price.toLocaleString()}`;
  } catch (e) {
    document.getElementById(id).textContent = "Error";
  }
}

function refreshPrices() {
  updatePrice("btc-price", "bitcoin");
  updatePrice("eth-price", "ethereum");
  updatePrice("sol-price", "solana");
}

refreshPrices();
setInterval(refreshPrices, 60000); // every 60 seconds

