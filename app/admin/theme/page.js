"use client";
import SiteMainLogo from "@/app/components/admin/theme/common/siteMainLogo";
import SiteSizeChart from "@/app/components/admin/theme/common/siteSizeChart";
import MediaLibrary from "@/app/components/mediaLibrary";
import TrashButton from "@/app/components/trashButton";
import { AdminContext } from "@/app/contexts/adminContexts";
import useSubmitThemeForm from "@/app/hooks/useSubmitThemeForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { apiReq } from "@/lib/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const mainLogoSchema = z.object({
    mainLogo: z.string().optional(),
    commonInnerBanner: z.string().optional()
});

export default function ThemePage() {
    const [formErrors, setFormErrors] = useState({});
    const { store, setStore } = useContext(AdminContext);
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();
    const [openImageModal, setOpenImageModal] = useState(false);

    const [sizeCharts, setSizeCharts] = useState([]);

    const { control: mainLogoController, handleSubmit: mainLogoSubmit, setValue, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(mainLogoSchema),
        defaultValues: {
            mainLogo: "",
            commonInnerBanner: ''
        }
    });

    const handlerSelectImage = (image) => {
        setValue("commonInnerBanner", image?.url);
        setOpenImageModal(false);
    }

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };

    const onSubmitForm = async (values) => {

        const payload = {
            common: {
                ...values,
                sizeCharts,
            },
            storeId: store?._id,
        };


        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                

                setStore((prevState) => ({
                    ...prevState,
                    theme: data,
                }));
            }
        );
    }

    useEffect(() => {
        setValue("mainLogo", store?.theme?.common?.mainLogo);
        setValue("commonInnerBanner", store?.theme?.common?.commonInnerBanner);
        setSizeCharts(store?.theme?.common?.sizeCharts);
    }, [store]);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">网站通用主题数据</h2>
                <p className="text-muted-foreground text-sm">所有网站通用和可重用的主题相关自定义将集中在这里。</p>
            </div>

            <div className="space-y-3">
                <Form {...mainLogoController}>
                    <div className="space-y-3">
                        <label className="text-sm font-semibold">网站LOGO配置</label>

                        <SiteMainLogo controller={mainLogoController} setValue={setValue} />

                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-semibold">通用尺码表(注：配置后可在创建商品时选择，客户在产品详情页面查看)</label>
                        <SiteSizeChart data={sizeCharts} onChange={(d) => setSizeCharts(d)} />
                    </div>
                    <FormField
                        control={mainLogoController}
                        name="commonInnerBanner"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold">商店横幅背景图</label>
                                            <>
                                                <div className='grid grid-cols-4 grid-flow-row gap-4'>
                                                    {field?.value && <div className='relative'>
                                                        <div className='overflow-hidden rounded-lg relative h-[150px]'>
                                                            <img src={field?.value} alt={"主标志"} width={100} height={100} className='w-[100%] h-[100%] absolute left-0 top-0 object-cover' />
                                                        </div>
                                                        <div className='absolute top-0 right-0 p-2'>
                                                            <TrashButton
                                                                title="您确定吗？"
                                                                content="您确定要删除这张图片吗？"
                                                                onContinue={() => {
                                                                    field.onChange('');
                                                                }}
                                                            />
                                                        </div>
                                                    </div>}

                                                    {!field?.value && <div onClick={() => {
                                                        setOpenImageModal(true);
                                                    }} className={`p-2 h-[150px] group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                                                        <ImagePlus className='text-muted-foreground w-8 h-8' strokeWidth={0.8} />

                                                        <span>选择图片</span>
                                                    </div>}
                                                </div>
                                            </>
                                        </div>
                                    </>
                                </FormControl>
                                <FormDescription className="text-xs flex flex-col gap-1">
                                    <span>- 推荐图片大小：小于2MB</span>
                                    <span>- 推荐图片宽度和高度：1300x400像素</span>
                                </FormDescription>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />



                    <div className="flex justify-end">
                        <Button type="button" onClick={mainLogoSubmit(onSubmitForm, onError)} disabled={isLoading}>
                            {isLoading ? <>
                                <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                保存中
                            </> : <>
                                保存
                            </>}
                        </Button>
                    </div>
                </Form>
            </div>


            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择默认内页页眉</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>

        </div>
    )
}
