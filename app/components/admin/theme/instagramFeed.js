import { useState, useEffect, useContext } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ImagePlus, LoaderCircle, Plus } from 'lucide-react';
import Image from 'next/image';
import TrashButton from '../../trashButton';
import { AdminContext } from '@/app/contexts/adminContexts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MediaLibrary from '../../mediaLibrary';

const InstagramFeed = ({ isError, accessToken, onChange }) => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const { store } = useContext(AdminContext);

    useEffect(() => {
        updateSelectedImagesFromStore();
    }, [store]);

    const updateSelectedImagesFromStore = () => {
        if (store?.theme?.instagramFeed?.images) {
            const instaImages = store.theme.instagramFeed.images;
            setSelectedImages(instaImages);
            onChange(instaImages);
        } else {
            setSelectedImages([]);
            onChange([]);
        }
    };

    const handlerAddImage = (d) => {
        if (selectedImages.length >= 6) {
            alert('最多允许6张图片');
            return;
        }

        const newSelectedImages = [...selectedImages, d];

        
        
        setSelectedImages(newSelectedImages);
        onChange(newSelectedImages);
    };

    const handlerRemoveImage = (id) => {
        const newSelectedImages = selectedImages.filter((inst) => inst._id !== id);
        setSelectedImages(newSelectedImages);
        onChange(newSelectedImages);
    };



    const transformObject = (obj) => {
        const { id, ...rest } = obj;
        return {
            ...rest,
            _id: id
        };
    };

    const handlerSelectImage = (image) => {

        const transformImgId = transformObject(image);
        handlerAddImage(transformImgId)
        setOpenImageModal(false);
    }

    return (
        <div className='space-y-3'>
            {selectedImages.length > 0 && (
                <div className='p-3 bg-slate-50 space-y-3'>
                    <label className="text-sm font-semibold">已选择的图片</label>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                        {selectedImages.map((image) => (
                            <AspectRatio ratio={1 / 1} key={image._id} className="overflow-hidden rounded-md relative">
                                <div className='absolute top-2 right-2 z-10'>
                                    <TrashButton
                                        title="您确定吗？"
                                        content="您确定要从Instagram集合中删除这张图片吗？"
                                        onContinue={() => handlerRemoveImage(image._id)}
                                    />
                                </div>
                                <img src={image.url} alt={image.alt || 'Instagram图片'} fill className='object-cover' />
                            </AspectRatio>
                        ))}
                    </div>
                </div>
            )}


            {selectedImages.length  < 6 && <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                <div onClick={() => setOpenImageModal(true)} className={`p-2 h-[200px] group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                    <ImagePlus className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                    <span>选择图片</span>
                </div>
            </div>}

            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片，或者直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InstagramFeed;