import mongoose from "mongoose";

const trim = (value) => (typeof value === "string" ? value.trim() : "");
const hasText = (value) => trim(value).length > 0;
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const isFilled = (value) => value !== false && value !== null && value !== undefined && trim(value).length > 0;

function addRequired(errors, path, value, message) {
  if (!hasText(value)) {
    errors.push({ path, message });
  }
}

function validateOptionalUrl(errors, path, value) {
  const text = trim(value);
  if (!text || text.startsWith("/") || text.startsWith("#")) {
    return;
  }

  try {
    new URL(text);
  } catch {
    errors.push({ path, message: "请输入有效链接，或使用以 / 开头的站内路径" });
  }
}

function validateMediaRows(errors, path, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    errors.push({ path, message: "至少需要添加一项内容" });
    return;
  }

  rows.forEach((row, index) => {
    if (!isObject(row)) {
      errors.push({ path: `${path}.${index}`, message: "内容格式不正确" });
      return;
    }

    const mediaType = row.mediaType || "image";
    const hasDesktopMedia = mediaType === "video"
      ? isFilled(row.video || row.videoSrc)
      : isFilled(row.image || row.imageSrc || row.imgSrc);
    const hasMobileMedia = mediaType === "video" ? isFilled(row.mobileVideo) : isFilled(row.mobileImage);

    if (!hasDesktopMedia && !hasMobileMedia) {
      errors.push({ path: `${path}.${index}`, message: "请至少选择桌面端或移动端媒体" });
    }

    const link = row.link || row.url || row.href;
    if (link) {
      validateOptionalUrl(errors, `${path}.${index}.link`, link);
    }
  });
}

function validateContentRows(errors, path, rows) {
  if (!Array.isArray(rows)) {
    errors.push({ path, message: "内容区块格式不正确" });
    return;
  }

  rows.forEach((row, index) => {
    if (!isObject(row)) {
      errors.push({ path: `${path}.${index}`, message: "内容项格式不正确" });
      return;
    }

    const link = row.link || row.url || row.href;
    if (link) {
      validateOptionalUrl(errors, `${path}.${index}.link`, link);
    }
  });
}

function validateHomeContent(errors, homeContent) {
  if (!isObject(homeContent)) {
    errors.push({ path: "homeContent", message: "首页内容配置格式不正确" });
    return;
  }

  ["marketingBanners", "testimonials", "brands", "blogPosts", "decorativeMedia"].forEach((field) => {
    if (Object.hasOwn(homeContent, field)) {
      validateContentRows(errors, `homeContent.${field}`, homeContent[field]);
    }
  });
}

function validateProductSection(errors, path, section) {
  if (!isObject(section)) {
    errors.push({ path, message: "商品区块格式不正确" });
    return;
  }

  addRequired(errors, `${path}.sectionTitle`, section.sectionTitle, "请输入区块标题");
  validateOptionalUrl(errors, `${path}.viewMoreUrl`, section.viewMoreUrl);

  if (section.isAutoFetch === false) {
    const selectedProducts = Array.isArray(section.selectedProducts) ? section.selectedProducts : [];
    if (selectedProducts.length === 0) {
      errors.push({ path: `${path}.selectedProducts`, message: "手动选择模式下至少需要选择一个商品" });
    }
  }
}

function validateCategoryRows(errors, path, rows) {
  if (!Array.isArray(rows)) {
    return;
  }

  rows.forEach((row, index) => {
    if (!isObject(row)) {
      errors.push({ path: `${path}.${index}`, message: "分类项格式不正确" });
      return;
    }

    const hasAnyValue = Object.values(row).some(isFilled);
    if (!hasAnyValue) {
      return;
    }

    addRequired(errors, `${path}.${index}.mainTitle`, row.mainTitle || row.title || row.label, "请输入分类标题");
    validateOptionalUrl(errors, `${path}.${index}.link`, row.link || row.url || row.href);
  });
}

function validateCategorySection(errors, path, section) {
  if (!isObject(section)) {
    errors.push({ path, message: "分类区块格式不正确" });
    return;
  }

  addRequired(errors, `${path}.sectionTitle`, section.sectionTitle, "请输入区块标题");
  validateCategoryRows(errors, `${path}.items`, section.items || section.categories || section.selectedCategories);
}

function validateLocations(errors, path, locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    errors.push({ path, message: "至少需要添加一个店铺位置" });
    return;
  }

  locations.forEach((location, index) => {
    if (!isObject(location)) {
      errors.push({ path: `${path}.${index}`, message: "店铺位置格式不正确" });
      return;
    }

    addRequired(errors, `${path}.${index}.locationName`, location.locationName, "请输入店铺名称");
    addRequired(errors, `${path}.${index}.address`, location.address, "请输入店铺地址");

    if (location.email && !/^\S+@\S+\.\S+$/.test(location.email)) {
      errors.push({ path: `${path}.${index}.email`, message: "请输入有效邮箱" });
    }
  });
}

function validateFooter(errors, footer) {
  if (!isObject(footer)) {
    errors.push({ path: "footer", message: "页脚配置格式不正确" });
    return;
  }

  const leftContent = footer.leftContent || {};
  if (leftContent.email && !/^\S+@\S+\.\S+$/.test(leftContent.email)) {
    errors.push({ path: "footer.leftContent.email", message: "请输入有效邮箱" });
  }

  ["facebook", "instagram", "tiktok"].forEach((field) => {
    validateOptionalUrl(errors, `footer.leftContent.${field}`, leftContent[field]);
  });

  if (Array.isArray(footer.footerMenus)) {
    footer.footerMenus.forEach((menu, menuIndex) => {
      const menuItems = Array.isArray(menu.menuItems) ? menu.menuItems : [];
      const hasMenuTitle = hasText(menu.mainMenuTitle);
      const hasMenuItems = menuItems.some((item) => hasText(item?.label) || hasText(item?.url));

      if (!hasMenuTitle && hasMenuItems) {
        errors.push({ path: `footer.footerMenus.${menuIndex}.mainMenuTitle`, message: "请输入菜单标题" });
      }

      menuItems.forEach((item, itemIndex) => {
        const hasLabel = hasText(item?.label);
        const hasUrl = hasText(item?.url);
        if (hasLabel || hasUrl) {
          addRequired(errors, `footer.footerMenus.${menuIndex}.menuItems.${itemIndex}.label`, item?.label, "请输入菜单标签");
          addRequired(errors, `footer.footerMenus.${menuIndex}.menuItems.${itemIndex}.url`, item?.url, "请输入菜单链接");
          validateOptionalUrl(errors, `footer.footerMenus.${menuIndex}.menuItems.${itemIndex}.url`, item?.url);
        }
      });
    });
  }
}

export function validateStoreThemePayload(payload) {
  const errors = [];

  if (!isObject(payload)) {
    return [{ path: "body", message: "请求数据格式不正确" }];
  }

  if (!mongoose.Types.ObjectId.isValid(payload.storeId)) {
    errors.push({ path: "storeId", message: "缺少有效店铺 ID" });
  }

  if (Object.hasOwn(payload, "common")) {
    if (!isObject(payload.common)) {
      errors.push({ path: "common", message: "通用配置格式不正确" });
    } else {
      addRequired(errors, "common.mainLogo", payload.common.mainLogo, "请先设置站点 Logo");
    }
  }

  if (Object.hasOwn(payload, "header")) {
    if (!isObject(payload.header)) {
      errors.push({ path: "header", message: "头部配置格式不正确" });
    } else {
      validateMediaRows(errors, "header.slider", payload.header.slider);
      if (payload.header.movingText && !hasText(payload.header.movingText.text)) {
        errors.push({ path: "header.movingText.text", message: "请输入滚动文字" });
      }
    }
  }

  ["latestArrival", "bestSelling", "trending", "hotSelling"].forEach((field) => {
    if (Object.hasOwn(payload, field)) {
      validateProductSection(errors, field, payload[field]);
    }
  });

  ["featuredCollection", "shopByCategories"].forEach((field) => {
    if (Object.hasOwn(payload, field)) {
      validateCategorySection(errors, field, payload[field]);
    }
  });

  if (Object.hasOwn(payload, "storeLocations")) {
    validateLocations(errors, "storeLocations.locations", payload.storeLocations?.locations);
  }

  if (Object.hasOwn(payload, "homeContent")) {
    validateHomeContent(errors, payload.homeContent);
  }

  if (Object.hasOwn(payload, "footer")) {
    validateFooter(errors, payload.footer);
  }

  return errors;
}
