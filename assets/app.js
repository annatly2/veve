const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle ('uid9401-40128451-70');

shopstyle.product(359131344). then(function(response) {
   console.log(response.name);
});

