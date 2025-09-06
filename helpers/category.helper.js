const buildCategoryTree = (categories, parentId = "") => {
  // Tạo mảng lưu danh mục con
  const tree = [];

  categories.forEach((item) => {
    // Nếu parent của danh mục hiện tại khớp với parentId
    if (item.parent === parentId) {
      // Đệ quy để tìm các danh mục con của danh mục hiện tại
      const children = buildCategoryTree(categories, item.id);

      // Thêm danh mục hiện tại vào cây cùng với danh mục con
      tree.push({
        id: item.id,
        name: item.name,
        children: children,
      });
    }
  });

  return tree;
};

module.exports.buildCategoryTree = buildCategoryTree;
