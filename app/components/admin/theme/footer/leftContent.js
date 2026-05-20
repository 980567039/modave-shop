import React, { useEffect, useState, useCallback } from 'react';
import MediaLibrary from '@/app/components/mediaLibrary';
import TrashButton from '@/app/components/trashButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { IconFacebook, IconTikTok, IconWhatsapp } from '@/app/components/svgIcons';

const FooterLeftContent = ({ data, onChange }) => {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [localData, setLocalData] = useState({});

    useEffect(() => {
        if (data?.leftContent) {
            setLocalData(data.leftContent);
        }
    }, [data]);

    const onChangeHandler = useCallback((value, field) => {
        setLocalData(prev => {
            const updatedData = { ...prev, [field]: value };
            onChange({ leftContent: updatedData });
            return updatedData;
        });
    }, [onChange]);

    const handleImageSelect = useCallback((imageUrl) => {
        onChangeHandler(imageUrl, 'footerLogo');
        setOpenImageModal(false);
    }, [onChangeHandler]);

    return (
        <div className='space-y-3'>
            {/* <div className='space-y-3'>
                {localData.footerLogo && (
                    <div className='relative w-4/12'>
                        <div className='overflow-hidden rounded-lg relative h-[150px]'>
                            <img src={localData.footerLogo} alt="页脚标志" layout="fill" objectFit="cover" />
                        </div>
                        <div className='absolute top-0 right-0 p-2'>
                            <TrashButton
                                title="您确定吗？"
                                content="您确定要删除这张图片吗？"
                                onContinue={() => onChangeHandler('', 'footerLogo')}
                            />
                        </div>
                    </div>
                )}

                {!localData.footerLogo && (
                    <div onClick={() => setOpenImageModal(true)} className="p-2 h-[150px] group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75">
                        <ImagePlus className='text-muted-foreground w-8 h-8' strokeWidth={0.8} />
                        <span className="text-sm text-muted-foreground">选择页脚标志</span>
                    </div>
                )}

                <div className="text-xs flex flex-col gap-1 text-muted-foreground">
                    <span>- 推荐图片大小：小于2MB</span>
                    <span>- 推荐图片宽高：200x80像素</span>
                </div>
            </div> */}

            <div className='space-y-3'>
                <p className='text-sm'>网站描述</p>
                <Textarea
                    placeholder="描述"
                    value={localData.descriptions || ''}
                    onChange={(e) => onChangeHandler(e.target.value, 'descriptions')}
                />

                <div className='flex items-start gap-3'>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 w-max-content p-2'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'><Phone className='w-4 h-4' />电话</div>
                        <div>
                            <Input
                                value={localData.phone || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'phone')}
                                type="text"
                                placeholder="0711336540"
                            />
                        </div>
                    </div>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 w-max-content p-2'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'><Mail className='w-4 h-4' />邮箱</div>
                        <div>
                            <Input
                                type="email"
                                value={localData.email || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'email')}
                                placeholder="sample@email.com"
                            />
                        </div>
                    </div>
                </div>

                
                <p className='text-sm'>社交媒体</p>

                <div className='flex flex-col items-start gap-3 w-full'>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 p-2 w-full'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'>
                            <IconFacebook fill={"#000"} style={{
                                width: 15,
                                height: 15
                            }} />Facebook
                        </div>
                        <div className='flex-1'>
                            <Input
                                value={localData.facebook || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'facebook')}
                                type="url"
                                placeholder="https://fb.com/profile_name"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 p-2 w-full'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'><Instagram className='w-4 h-4' />Instagram</div>
                        <div className='flex-1'>
                            <Input
                                type="url"
                                value={localData.instagram || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'instagram')}
                                placeholder="https://instagram.com/profile_name"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 p-2 w-full'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'><IconWhatsapp style={{ width: 15, height: 15}} />Whatsapp</div>
                        <div className='flex-1'>
                            <Input
                                type="url"
                                value={localData.whatsapp || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'whatsapp')}
                                placeholder="+94712345678"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='flex items-center rounded-lg overflow-hidden bg-slate-50 p-2 w-full'>
                        <div className='text-sm px-2 py-2 flex items-center gap-2'><IconTikTok style={{ width: 15, height: 15}} />Tiktok</div>
                        <div className='flex-1'>
                            <Input
                                type="url"
                                value={localData.tiktok || ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'tiktok')}
                                placeholder="http://tiktok.com/@profile"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择页脚标志</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片，或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={(d) => handleImageSelect(d?.url)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default React.memo(FooterLeftContent);