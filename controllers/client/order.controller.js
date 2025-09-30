const { generateRandomNumber } = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");

module.exports.createPost = async (req, res) => {
  try {
    // Mã đơn hàng
    req.body.code = "OD" + generateRandomNumber(10);

    // Tạm tính
    req.body.subTotal = 0;

    // Danh sách Tour
    for (const item of req.body.items) {
      const itemInfo = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active",
      });

      if (itemInfo) {
        // Thêm giá
        item.priceNewAdult = itemInfo.priceNewAdult;
        item.priceNewChildren = itemInfo.priceNewChildren;
        item.priceNewBaby = itemInfo.priceNewBaby;

        // Tạm tính
        req.body.subTotal +=
          item.priceNewAdult * item.quantityAdult +
          item.priceNewChildren * item.quantityChildren +
          item.priceNewBaby * item.quantityBaby;

        // Thêm ngày khởi hành
        item.departureDate = itemInfo.departureDate;

        // Cập nhật lại số lượng tour còn lại
        await Tour.updateOne(
          {
            _id: item.tourId,
          },
          {
            stockAdult: itemInfo.stockAdult - item.quantityAdult,
            stockChildren: itemInfo.stockChildren - item.quantityChildren,
            stockBaby: itemInfo.stockBaby - item.quantityBaby,
          }
        );
      }
    }
    // Hết Danh sách Tour

    // Thanh toán
    // Giảm giá
    req.body.discount = 0;

    // Tổng tiền
    req.body.total = req.body.subTotal - req.body.discount;
    // Hết Thanh toán

    // Trạng thái thanh toán
    req.body.paymentStatus = "unpaid";

    // Trạng thái đơn hàng
    req.body.status = "initial";

    const newRecord = new Order(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Chúc mừng bạn đã đặt Tour thành công!",
      orderCode: req.body.code
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi",
    });
  }
};
