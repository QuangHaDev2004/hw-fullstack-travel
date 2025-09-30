const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");

const moment = require("moment");

module.exports.cart = (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Giỏ hàng",
  });
};

module.exports.detail = async (req, res) => {
  try {
    const cart = req.body;
    let cartDetail = [];

    for (const item of cart) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false,
      });

      console.log(item);

      console.log(tourInfo);

      if (tourInfo) {
        const cityInfo = await City.findOne({
          _id: item.locationFrom,
        });

        cartDetail.push({
          tourId: item.tourId,
          locationFrom: item.locationFrom,
          quantityAdult: item.quantityAdult,
          quantityChildren: item.quantityChildren,
          quantityBaby: item.quantityBaby,
          checked: item.checked,
          avatar: tourInfo.avatar,
          name: tourInfo.name,
          departureDate: moment(tourInfo.departureDate).format("DD/MM/YYYY"),
          cityName: cityInfo.name,
          stockAdult: tourInfo.stockAdult,
          stockChildren: tourInfo.stockChildren,
          stockBaby: tourInfo.stockBaby,
          priceNewAdult: tourInfo.priceNewAdult,
          priceNewChildren: tourInfo.priceNewChildren,
          priceNewBaby: tourInfo.priceNewBaby,
          slug: tourInfo.slug,
        });
      }
    }

    res.json({
      code: "success",
      message: "Thành công!",
      cart: cartDetail,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};
