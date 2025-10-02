const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");

const {
  paymentMethodList,
  paymentStatusList,
  statusList,
} = require("../../config/variable.config");

const moment = require("moment");

module.exports.dashboard = async (req, res) => {
  // Thông số tổng quan
  const overview = {
    totalAdmin: 0,
    totalOrder: 0,
    totalRevenue: 0,
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({
    deleted: false,
  });

  const orderList = await Order.find({
    deleted: false,
  });

  overview.totalOrder = orderList.length;
  overview.totalRevenue = orderList.reduce(
    (total, item) => total + item.total,
    0
  );

  // Đơn hàng mới
  const find = {
    deleted: false,
  };

  const orderNewList = await Order.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(5)

  for (const orderDetail of orderNewList) {
    orderDetail.paymentMethodName = paymentMethodList.find(
      (item) => item.value === orderDetail.paymentMethod
    ).label;

    orderDetail.paymentStatusName = paymentStatusList.find(
      (item) => item.value === orderDetail.paymentStatus
    ).label;

    orderDetail.statusInfo = statusList.find(
      (item) => item.value === orderDetail.status
    );

    orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
    orderDetail.createdAtDate = moment(orderDetail.createdAt).format(
      "DD/MM/YYYY"
    );

    for (const item of orderDetail.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId,
      });
      if (tourInfo) {
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
      }
    }
  }

  res.render("admin/pages/index", {
    pageTitle: "Tổng quan",
    overview: overview,
    orderNewList: orderNewList
  });
};
