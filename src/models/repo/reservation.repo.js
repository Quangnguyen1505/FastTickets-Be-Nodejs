const SeatPrice = async ( movie, user_order ) => {
    console.log("user_order", user_order);
    const movie_Price = await movie.price.map(item => item.price_seat);
    return user_order.map( item => {
        return movie_Price.includes(item.price);
    });
}

module.exports = {
    SeatPrice
}