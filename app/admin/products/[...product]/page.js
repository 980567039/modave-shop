"use client"
import React, { useContext, useEffect, useState } from 'react'
import AdminHeader from '@/app/components/adminHeader'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Activity, AlertCircle, DollarSign, ExternalLink, ImageUp, LoaderCircle, ShoppingBasket, SquareStack, TextQuote } from 'lucide-react'
import ProductDetails from '@/app/components/admin/products/productDetails'
import ProductGallery from '@/app/components/admin/products/productGallery'
import SelectProductAttributes from '@/app/components/admin/attributes/selectProductAttributes';
import ProductInventory from '@/app/components/admin/inventory/productInventory';
import ProductSEO from '@/app/components/admin/productSeo/productSEO';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { apiReq, transformS3UrlsInObject } from '@/lib/common'
import { AdminContext } from '@/app/contexts/adminContexts'
import { AdminProductContext, AdminProductProvider } from '@/app/contexts/adminProductProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage'


const productFormSchema = z.object({
  title: z.string().min(2, {
    message: "产品名称必须至少包含2个字符。",
  }),
  titleSlug: z.string().min(2, {
    message: "别名必须至少包含2个字符。",
  }),
  description: z.string().optional(),
  modelInfo: z.string().optional(),
  price: z.number().min(2, {
    message: "产品价格必须至少包含2个字符。",
  }),
  stock: z.number().optional(),
  salePrice: z.any().optional(),
  actualPrice: z.any().optional(),
  category: z.any().optional(),
  material: z.string().optional(),
  materialComposition: z.string().optional(),
  defaultImage: z.any().optional(),
  imageGallery: z.any().optional(),
  attributes: z.any().optional(),
  sku: z.string().min(2, {
    message: "产品SKU必须至少包含2个字符。",
  }),
  mappedSku: z.string().min(2, {
    message: "绑定产品SKU必须至少包含2个字符。",
  }),
  sizeChart: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().max(300, {
    message: "谷歌建议元描述最多包含300个字符，以确保在搜索结果中最佳显示。",
  }).optional(),
  seoKeywords: z.string().max(160, {
    message: "谷歌建议元关键词最多包含155-160个字符，以确保在搜索结果中最佳显示。",
  }).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().max(300, {
    message: "谷歌建议元描述最多包含300个字符，以确保在搜索结果中最佳显示。",
  }).optional(),
  ogImage: z.string().optional(),
  visibility: z.boolean().default(true).optional(),
  isGiftCard: z.boolean().default(false).optional(),
  showInShopPage: z.boolean().default(true).optional(),
})

export default function EditProduct(context) {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const route = useRouter();

  const { selectedCategories, setSelectedCategories } = useContext(AdminProductContext);

  const [pageType, setPageType] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editData, setEditData] = useState({});

  const { store } = useContext(AdminContext);



  const { control: productController, handleSubmit: productSubmit, setValue, setError, reset, clearErrors, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      titleSlug: "",
      description: "",
      modelInfo: "",
      price: "",
      salePrice: 0,
      actualPrice: 0,
      category: [],
      material: "",
      materialComposition: "",
      defaultImage: {},
      imageGallery: [],
      attributes: [],
      sku: "",
      mappedSku: "",
      stock: 10,
      sizeChart: '',

      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      visibility: true,
      isGiftCard: false,
      showInShopPage: true,
    }
  });

  const onError = (errors) => {
    setFormErrors(errors);
    console.log("errors", errors);
  };

  const onSubmitForm = async (values) => {

    const payload = {
      ...values,
      ...(values.category && { category: selectedCategories }),
      imageGallery: values?.imageGallery?.map((img) => img._id) || [],
      defaultImage: values?.defaultImage?._id || '',
      inStock: Number(values.stock) !== 0
    }

    try {
      setIsLoading(true);

      if (editData && editData?.titleSlug !== payload?.titleSlug) {

        const checkTitleResponse = await apiReq(`admin/product/check-slug?slug=${payload?.titleSlug}`, 'GET');

        const isExits = await checkTitleResponse.json();

        if (isExits.exists) {
          toast.error('此别名已存在', {
            description: '请使用另一个别名'
          });
          setIsLoading(false);

          return false;
        }
      }


      let res;

      if (isEdit && editData && editData?._id) {
        const addId = {
          ...payload,
          id: editData._id
        };
        res = await apiReq('admin/product', 'PUT', addId);
      } else {
        res = await apiReq('admin/product', 'POST', payload);
      }

      const { data } = await res.json();

      if (res && res.status === 200) {

        toast.success("成功", {
          description: `成功${isEdit ? "更新" : "创建"} "${payload.title}"`,
        });

        clearInputs();

      }

      setIsLoading(false);


    } catch (error) {
      console.log(error);
      toast.error("出错了！", {
        description: "请稍后再试",
      })
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

    route.push("/admin/products");
  }

  const clearInputs = () => {
    reset();
    setValue('titleSlug', '');
    setSelectedCategories([]);
  };

  const errorKeyMapping = (key) => {
    switch (key) {
      case "title":
        return "标题";
      case "titleSlug":
        return "标题别名";
      case "description":
        return "描述";
      case "price":
        return "价格";
      case "salePrice":
        return "促销价";
      case "category":
        return "分类";
      case "material":
        return "材料";
      case "materialComposition":
        return "材料成分";
      case "defaultImage":
        return "默认图片";
      case "imageGallery":
        return "图片库";
      case "seoTitle":
        return "SEO标题";
      case "seoDescription":
        return "SEO描述";
      case "seoKeywords":
        return "SEO关键词";
      case "ogTitle":
        return "Open Graph标题";
      case "ogDescription":
        return "Open Graph描述";
      case "ogImage":
        return "Open Graph图片";
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }

  const getProduct = async (id) => {
    try {
      setIsFetching(true);
      const res = await apiReq(`admin/product?delete=false&id=${id}`, 'GET');
      if (res && res.status === 200) {
        setIsEdit(true);
        const { data } = await res.json();



        const responseData = transformS3UrlsInObject(data[0]);

        setSelectedCategories(responseData?.category || []);
        setEditData(responseData || {})

        setValue("title", responseData?.title || "")
        setValue("titleSlug", responseData?.titleSlug || "")
        setValue("description", responseData?.description || "")
        setValue("price", responseData?.price || "")
        setValue("salePrice", responseData?.salePrice || 0)
        setValue("actualPrice", responseData?.actualPrice || 0)
        setValue("modelInfo", responseData?.modelInfo || '')
        setValue("stock", Number(responseData?.stock) || 0)
        setValue("category", responseData?.category || [])
        setValue("material", responseData?.material || "")
        setValue("materialComposition", responseData?.materialComposition || "")
        setValue("defaultImage", responseData?.defaultImage || {})
        setValue("imageGallery", responseData?.imageGallery || [])
        setValue("attributes", responseData?.attributes || [])
        setValue("sku", responseData?.sku || "")
        setValue("mappedSku", responseData?.mappedSku || "")
        setValue("sizeChart", responseData?.sizeChart || '')

        setValue("seoTitle", responseData?.seoTitle || "")
        setValue("seoDescription", responseData?.seoDescription || "")
        setValue("seoKeywords", responseData?.seoKeywords || "")
        setValue("ogTitle", responseData?.ogTitle || "")
        setValue("ogDescription", responseData?.ogDescription || "")
        setValue("ogImage", responseData?.ogImage || "")
        setValue("visibility", responseData?.visibility)
        setValue("isGiftCard", responseData?.isGiftCard);
        setValue("showInShopPage", responseData?.showInShopPage);
      }

      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  }


  useEffect(() => {
    if (params && params.product) {
      setPageType(params.product[0]);
      if (params.product[0] === 'edit' && productId) {
        getProduct(productId);
      } else {
        // route.push('/admin/products/add');
        // setSelectedCategories([]);
      }
    }
  }, [params, productId, route]);


  if (!store?.loginUserData?.capabilities?.includes('products')) {
    return <RestrictPage />;
  } else {
    return (

      <div className='flex gap-5 flex-col'>
        {isFetching ? <div className='text-center flex items-center justify-center'>
          <LoaderCircle className='w-5 h-5 animate-spin mr-1' />加载中...
        </div> :
          <>

            <AdminHeader title={isEdit ? `更新 - ${getValues("title")}` : `添加新产品`}>

            </AdminHeader>

            <div className='flex gap-2 items-center w-full'>
              <Link
                href={`/product/${getValues('titleSlug')}`}
                target='_blank'
                className='flex items-center justify-center gap-2 text-sm py-2 px-3 border-[1px] rounded-md hover:bg-slate-50'>
                <ExternalLink className='w-4 h-4' strokeWidth={0.9} />查看产品
              </Link>
            </div>

            {errors && Object.keys(errors).length !== 0 && <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-xs">以下输入有错误</AlertTitle>
              <AlertDescription className="text-xs">
                <ul>
                  {Object.keys(errors).map((key, index) => (
                    <li key={index}>- <b>{errorKeyMapping(key)}</b> - {errors[key].message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>}


            <Form {...productController}>
              <div className='flex gap-5'>

                <div className='basis-3/4'>
                  <div className=''>
                    {selectedTab === "basic" && <ProductDetails
                      controller={productController}
                      setValue={setValue}
                      clearErrors={clearErrors}
                      getValues={getValues}
                      setError={setError}
                      editData={editData}
                    />}
                    {selectedTab === "gallery" && <ProductGallery controller={productController} setValue={setValue} getValues={getValues} />}
                    {selectedTab === "variants" && <SelectProductAttributes controller={productController} setValue={setValue} getValues={getValues} />}
                    {selectedTab === "inventory" && <ProductInventory controller={productController} setValue={setValue} />}
                    {selectedTab === "seo" && <ProductSEO controller={productController} setValue={setValue} getValues={getValues} />}
                  </div>
                </div>
                <div className='basis-1/4 sticky top-0 space-y-5'>
                  <div className='border-[1px] flex flex-col rounded-[30px] p-2 gap-2 '>
                    <div className={`flex gap-2 items-center  rounded-full p-1 cursor-pointer hover:bg-white hover:shadow-sm transition-all ease-in-out duration-75 ${selectedTab === "basic" ? 'bg-white shadow-sm border-[1px]' : ''}`} onClick={() => setSelectedTab('basic')}>
                      <div className='w-[35px] h-[35px] border-[1px] rounded-full flex items-center justify-center'>
                        <ShoppingBasket className='w-5 h-5 text-muted-foreground' />
                      </div>
                      <div>
                        <h5 className='font-semibold text-sm '>基本产品详情</h5>
                        <p className='text-xs text-muted-foreground'>添加产品名称和详情</p>
                      </div>
                    </div>
                    <div className={`flex gap-2 items-center  rounded-full p-1 cursor-pointer hover:bg-white hover:shadow-sm transition-all ease-in-out duration-75 ${selectedTab === "gallery" ? 'bg-white shadow-sm border-[1px]' : ''}`} onClick={() => setSelectedTab('gallery')}>
                      <div className='w-[35px] h-[35px] border-[1px] rounded-full flex items-center justify-center'>
                        <ImageUp className='w-5 h-5 text-muted-foreground' />
                      </div>
                      <div>
                        <h5 className='font-semibold text-sm'>产品图库</h5>
                        <p className='text-xs text-muted-foreground'>缩略图和添加产品图库</p>
                      </div>
                    </div>
                    <div className={`flex gap-2 items-center  rounded-full p-1 cursor-pointer hover:bg-white hover:shadow-sm transition-all ease-in-out duration-75 ${selectedTab === "variants" ? 'bg-white shadow-sm border-[1px]' : ''}`} onClick={() => setSelectedTab('variants')}>
                      <div className='w-[35px] h-[35px] border-[1px] rounded-full flex items-center justify-center'>
                        <SquareStack className='w-5 h-5 text-muted-foreground' />
                      </div>
                      <div>
                        <h5 className='font-semibold text-sm '>产品变体</h5>
                        <p className='text-xs text-muted-foreground'>添加产品变体、颜色、尺寸等...</p>
                      </div>
                    </div>
                    {/* <div className={`flex gap-2 items-center  rounded-full p-1 cursor-pointer hover:bg-white hover:shadow-sm transition-all ease-in-out duration-75 ${selectedTab === "inventory" ? 'bg-white shadow-sm' : ''}`} onClick={() => setSelectedTab('inventory')}>
                  <div className='w-[35px] h-[35px] border-[1px] rounded-full flex items-center justify-center'>
                    <TextQuote className='w-5 h-5 text-muted-foreground' />
                  </div>
                  <div>
                    <h5 className='font-semibold text-sm '>库存</h5>
                    <p className='text-xs text-muted-foreground'>添加产品库存详情</p>
                  </div>
                </div> */}
                    <div className={`flex gap-2 items-center  rounded-full p-1 cursor-pointer hover:bg-white hover:shadow-sm transition-all ease-in-out duration-75 ${selectedTab === "seo" ? 'bg-white shadow-sm border-[1px]' : ''}`} onClick={() => setSelectedTab('seo')}>
                      <div className='w-[35px] h-[35px] border-[1px] rounded-full flex items-center justify-center'>
                        <Activity className='w-5 h-5 text-muted-foreground' />
                      </div>
                      <div>
                        <h5 className='font-semibold text-sm '>SEO / OG 数据</h5>
                        <p className='text-xs text-muted-foreground'>添加与此产品相关的SEO和OG数据</p>
                      </div>
                    </div>
                  </div>


                  <FormField
                    control={productController}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2 justify-between">
                            <Label htmlFor="visibility">产品可见性</Label>
                            <Switch
                              id="visibility"
                              checked={field.value}
                              onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productController}
                    name="isGiftCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2 justify-between">
                            <Label htmlFor="isGiftCard">是否为礼品卡</Label>
                            <Switch
                              id="isGiftCard"
                              checked={field.value}
                              onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productController}
                    name="showInShopPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2 justify-between">
                            <Label htmlFor="showInShopPage">在商店页面显示</Label>
                            <Switch
                              id="showInShopPage"
                              checked={field.value}
                              onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button type="button" onClick={productSubmit(onSubmitForm, onError)} disabled={isLoading}>
                    {isLoading ? <>
                      <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                      {isEdit ? "更新中" : '创建中'}
                    </> : <>
                      {isEdit ? "更新产品" : '创建产品'}
                    </>}
                  </Button>
                </div>
              </div>
            </Form>
          </>
        }
      </div>
    )
  }



}
