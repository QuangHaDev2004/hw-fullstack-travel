const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");

const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
  try {
    // Danh sách thành phố
    const cityList = await City.find({}).sort({ name: "asc" });

    const find = {
      deleted: false,
      status: "active",
    };

    // Điểm đi
    if (req.query.locationFrom) {
      find.locations = req.query.locationFrom;
    }

    // Điểm đến
    if (req.query.locationTo) {
      const locationTo = slugify(req.query.locationTo);
      const locationToRegex = new RegExp(locationTo, "i");
      find.slug = locationToRegex;
    }

    // Ngày khởi hành
    if (req.query.departureDate) {
      const departureDate = new Date(req.query.departureDate);
      find.departureDate = departureDate;
    }

    // Số lượng
    if (req.query.stockAdult) {
      find.stockAdult = {
        $gte: parseInt(req.query.stockAdult), //giá trị trong CSDL >= giá trị gửi lên
      };
    }
    if (req.query.stockChildren) {
      find.stockChildren = {
        $gte: parseInt(req.query.stockChildren),
      };
    }
    if (req.query.stockBaby) {
      find.stockBaby = {
        $gte: parseInt(req.query.stockBaby),
      };
    }

    // Khoảng giá
    if (req.query.price) {
      const [priceMin, priceMax] = req.query.price
        .split("-")
        .map((item) => parseInt(item));
      find.priceNewAdult = {
        $gte: priceMin,
        $lte: priceMax,
      };
    }

    const tourList = await Tour.find(find).sort({
      position: "desc",
    });

    for (const item of tourList) {
      item.discount = Math.floor(
        ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
      );
      if (item.departureDate) {
        item.departureDateFormat = moment(item.departureDate).format(
          "DD/MM/YYYY"
        );
      }
    }

    res.render("client/pages/search", {
      pageTitle: "Kết quả tìm kiếm",
      cityList: cityList,
      tourList: tourList,
    });
  } catch (error) {
    res.redirect("/");
  }
};
