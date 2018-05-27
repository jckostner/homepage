var cbRequest = new Request('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&' + 
    'tsyms=USD');
fetch(cbRequest).then(response => {
    if (response != undefined) {
        response.json().then(json => {
            document.getElementById("price").innerHTML = `$${json.RAW.ETH.USD.PRICE}`;
            document.getElementById("priceHigh").innerHTML = `$${json.RAW.ETH.USD.HIGH24HOUR}`;
            document.getElementById("priceLow").innerHTML = `$${json.RAW.ETH.USD.LOW24HOUR}`;
        });
    } else {
        throw new Error('Unable to contact Coinbase API');
    }
});
