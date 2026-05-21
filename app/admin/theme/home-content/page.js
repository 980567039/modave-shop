"use client";

import MediaLibrary from "@/app/components/mediaLibrary";
import { AdminContext } from "@/app/contexts/adminContexts";
import useSubmitThemeForm from "@/app/hooks/useSubmitThemeForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, LoaderCircle, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const sections = [
  {
    key: "marketingBanners",
    title: "营销 Banner",
    description: "用于首页大促、活动横幅、图文广告等内容。",
    fields: ["title", "subtitle", "description", "image", "link", "buttonText", "alt"],
  },
  {
    key: "testimonials",
    title: "客户评价",
    description: "用于首页评价轮播，可兼容不同模板的 author/name、review/text、stars/rating 字段。",
    fields: ["title", "author", "review", "image", "productName", "price", "rating"],
  },
  {
    key: "brands",
    title: "品牌 Logo",
    description: "用于首页品牌墙、合作品牌等内容。",
    fields: ["title", "image", "link", "alt"],
  },
  {
    key: "blogPosts",
    title: "博客内容",
    description: "用于首页文章、资讯和内容营销区块。",
    fields: ["title", "subtitle", "description", "image", "link", "buttonText", "alt"],
  },
  {
    key: "decorativeMedia",
    title: "装饰媒体",
    description: "用于 lookbook、装饰图、辅助素材等非商品内容。",
    fields: ["title", "subtitle", "description", "image", "link", "buttonText", "alt"],
  },
];

const emptyItem = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  link: "",
  buttonText: "",
  alt: "",
};

const fieldLabels = {
  title: "标题",
  subtitle: "副标题",
  description: "描述",
  image: "图片",
  link: "链接",
  buttonText: "按钮文字",
  alt: "图片 Alt",
  author: "作者",
  review: "评价内容",
  productName: "关联产品名",
  price: "价格",
  rating: "评分",
};

function normalizeHomeContent(homeContent = {}) {
  return sections.reduce((result, section) => {
    result[section.key] = Array.isArray(homeContent?.[section.key]) ? homeContent[section.key] : [];
    return result;
  }, {});
}

export default function ThemeHomeContentPage() {
  const { store, setStore } = useContext(AdminContext);
  const { isLoading, handleSubmitForm } = useSubmitThemeForm();
  const [homeContent, setHomeContent] = useState(() => normalizeHomeContent());
  const [mediaPicker, setMediaPicker] = useState(null);

  useEffect(() => {
    if (store?.theme) {
      setHomeContent(normalizeHomeContent(store.theme.homeContent));
    }
  }, [store?.theme]);

  const updateItem = (sectionKey, itemIndex, field, value) => {
    setHomeContent((currentContent) => ({
      ...currentContent,
      [sectionKey]: currentContent[sectionKey].map((item, index) => (
        index === itemIndex ? { ...item, [field]: value } : item
      )),
    }));
  };

  const addItem = (sectionKey) => {
    setHomeContent((currentContent) => ({
      ...currentContent,
      [sectionKey]: [...currentContent[sectionKey], { ...emptyItem }],
    }));
  };

  const removeItem = (sectionKey, itemIndex) => {
    setHomeContent((currentContent) => ({
      ...currentContent,
      [sectionKey]: currentContent[sectionKey].filter((_, index) => index !== itemIndex),
    }));
  };

  const handleSelectMedia = (media) => {
    if (!mediaPicker) {
      return;
    }

    updateItem(mediaPicker.sectionKey, mediaPicker.itemIndex, "image", media?.url || "");
    setMediaPicker(null);
  };

  const handleSubmit = () => {
    handleSubmitForm(
      "admin/store/theme",
      "POST",
      {
        homeContent,
        storeId: store?._id,
      },
      (data) => {
        setStore((currentStore) => ({
          ...currentStore,
          theme: data,
        }));
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl">首页内容区块</h2>
        <p className="text-muted-foreground text-sm">
          配置首页变体可复用的营销 Banner、评价、品牌、博客和装饰媒体；前台无配置时会继续使用模板静态 fallback。
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.key} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(section.key)}>
              <Plus className="mr-1 h-4 w-4" />
              添加
            </Button>
          </div>

          {homeContent[section.key].length === 0 ? (
            <div className="rounded-md bg-muted/40 p-4 text-sm text-muted-foreground">
              暂无内容，前台会使用模板静态 fallback。
            </div>
          ) : (
            <div className="space-y-4">
              {homeContent[section.key].map((item, itemIndex) => (
                <div key={`${section.key}-${itemIndex}`} className="rounded-md border bg-background p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{section.title} #{itemIndex + 1}</div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(section.key, itemIndex)}>
                      <Trash2 className="mr-1 h-4 w-4" />
                      删除
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {section.fields.map((field) => (
                      field === "description" || field === "review" ? (
                        <div key={field} className="space-y-2 md:col-span-2">
                          <Label>{fieldLabels[field]}</Label>
                          <Textarea
                            value={item[field] || ""}
                            onChange={(event) => updateItem(section.key, itemIndex, field, event.target.value)}
                            placeholder={fieldLabels[field]}
                          />
                        </div>
                      ) : field === "image" ? (
                        <div key={field} className="space-y-2 md:col-span-2">
                          <Label>{fieldLabels[field]}</Label>
                          <div className="flex gap-3">
                            <Input
                              value={item.image || item.imageSrc || item.imgSrc || ""}
                              onChange={(event) => updateItem(section.key, itemIndex, "image", event.target.value)}
                              placeholder="/images/banner.jpg 或媒体库 URL"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setMediaPicker({ sectionKey: section.key, itemIndex })}
                            >
                              <ImagePlus className="mr-1 h-4 w-4" />
                              选择
                            </Button>
                          </div>
                          {(item.image || item.imageSrc || item.imgSrc) && (
                            <Image
                              src={item.image || item.imageSrc || item.imgSrc}
                              alt={item.alt || section.title}
                              width={176}
                              height={112}
                              unoptimized
                              className="h-28 w-44 rounded-md border object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div key={field} className="space-y-2">
                          <Label>{fieldLabels[field]}</Label>
                          <Input
                            value={item[field] || ""}
                            onChange={(event) => updateItem(section.key, itemIndex, field, event.target.value)}
                            placeholder={fieldLabels[field]}
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="mr-1 h-5 w-5 animate-spin" />
              Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <Dialog open={!!mediaPicker} onOpenChange={() => setMediaPicker(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>选择图片</DialogTitle>
          </DialogHeader>
          <MediaLibrary selectedMedia={handleSelectMedia} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
