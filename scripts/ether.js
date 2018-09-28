var url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD';
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.response);
        document.getElementById("price").innerHTML = `$${json.RAW.ETH.USD.PRICE}`;
        document.getElementById("priceHigh").innerHTML = `$${json.RAW.ETH.USD.HIGH24HOUR}`;
        document.getElementById("priceLow").innerHTML = `$${json.RAW.ETH.USD.LOW24HOUR}`;
    }
}

xhttp.open("POST", url, true);
xhttp.send();
