"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { FileImage, ImageUp, Images, LoaderCircle, Upload, X, Film, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '../contexts/authUserProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { apiReq, transformS3UrlsInObject } from '@/lib/common';

export default function MediaLibrary({ selectedMedia, mediaType = 'image' }) {
    const isVideoMode = mediaType === 'video';
    const fileInputRef = useRef(null);
    const [defaultTab, setDefaultTab] = useState('library');
    const [medias, setMedias] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const auth = useAuthContext();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const ITEMS_PER_PAGE = 16;

    const acceptedFileTypes = isVideoMode 
        ? "video/mp4,video/webm,video/ogg" 
        : "image/*";

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const uploadToLocal = async () => {
        setUploading(true);
        const totalFiles = selectedFiles.length;
        let uploadedFiles = 0;

        for (const file of selectedFiles) {
            try {
                // Create FormData
                const formData = new FormData();
                formData.append('file', file);
                formData.append('userId', auth.user.id);
                formData.append('mediaType', mediaType); // Send media type to backend

                // Upload to your local API endpoint
                const response = await apiReq('media/upload', "POST", formData);

                const { data } = await response.json();

                if (response.ok) {
                    // Update progress
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: 100
                    }));

                    // Add to media library
                    const newMedia = {
                        url: data?.media?.url,
                        id: data?.media?._id,
                        alt: data?.media?.alt,
                        type: data?.media?.type || mediaType
                    };
                    
                    updateLibrary(newMedia);
                    uploadedFiles++;
                } else {
                    toast.error("Upload failed", {
                        description: data.message || `Failed to upload ${file.name}`
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error("Upload failed", {
                    description: "Failed to upload " + file.name
                });
            }
        }

        setUploading(false);
        if (uploadedFiles === totalFiles) {
            toast.success(`Successfully uploaded ${uploadedFiles} ${isVideoMode ? 'video' : 'file'}${uploadedFiles !== 1 ? 's' : ''}`);
        } else {
            toast.warning(`Uploaded ${uploadedFiles} out of ${totalFiles} ${isVideoMode ? 'videos' : 'files'}`);
        }
        setUploadProgress({});
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const updateLibrary = (newMedia) => {
        setMedias(prev => ([newMedia, ...prev]));
        setDefaultTab("library");
    };

    const getLibraryMedia = useCallback(async (pageNum) => {
        try {
            setLoading(true);

            const response = await apiReq(`media?page=${pageNum}&limit=${ITEMS_PER_PAGE}&type=${mediaType}`, "GET");

            const data = await response.json();

            if (response.ok) {
                setLoading(false);

                const mediaReFormat = transformS3UrlsInObject(data.media);

                const getMedias = mediaReFormat.map((md) => ({
                    url: md.url,
                    id: md._id,
                    alt: md.alt,
                    type: md.type || 'image'
                }));
                setMedias(prev => pageNum === 1 ? getMedias : [...prev, ...getMedias]);
                setHasMore(getMedias.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [mediaType]);

    useEffect(() => {
        getLibraryMedia(1);
    }, [getLibraryMedia, mediaType]);

    const lastMediaElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 1) {
            getLibraryMedia(page);
        }
    }, [page, getLibraryMedia]);

    // Preview component for selected files
    const FilePreview = ({ file, index }) => {
        const isVideo = file.type.startsWith('video/');
        
        return (
            <div className="relative">
                <AspectRatio ratio={1 / 1} className="bg-muted overflow-hidden rounded-md">
                    {isVideo ? (
                        <video 
                            src={URL.createObjectURL(file)} 
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${isVideo ? 'video' : 'image'} ${index + 1}`}
                            objectFit="cover"
                            loading='lazy'
                            width={200}
                            height={200}
                        />
                    )}
                </AspectRatio>
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeSelectedFile(index)}
                >
                    <X className="h-4 w-4" />
                </Button>
                {uploading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                        <Progress value={uploadProgress[file.name] || 0} className="h-1" />
                        <span className="text-center block mt-1">{uploadProgress[file.name] || 0}%</span>
                    </div>
                )}
            </div>
        );
    };

    // Media item component for the library
    const MediaItem = ({ media, index }) => {
        const isVideo = media.type === 'video';
        
        return (
            <AspectRatio
                ref={index === medias.length - 1 ? lastMediaElementRef : null}
                onClick={() => selectedMedia(media)}
                key={media.id}
                ratio={1 / 1}
                className="bg-muted overflow-hidden rounded-md relative group border-2 border-transparent hover:border-primary transition-all ease-in-out duration-75 cursor-pointer"
            >
                <div className='absolute z-10 w-full h-full group-hover:bg-black/50 transition-all ease-in-out duration-75' />
                {isVideo ? (
                    <>
                        <video
                            src={media.url}
                            className="rounded-md object-cover absolute left-0 top-0 w-full h-full"
                            width={200}
                            height={200}
                        />
                        <Film className="absolute top-2 right-2 w-6 h-6 text-white z-20" />
                    </>
                ) : (
                    <img
                        src={media.url}
                        alt={media.alt}
                        className="rounded-md object-cover absolute left-0 top-0 w-full h-full"
                        width={200}
                        height={200}
                        loading='lazy'
                    />
                )}
            </AspectRatio>
        );
    };

    return (
        <div>
            <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full" onValueChange={(d) => setDefaultTab(d)}>
                <TabsList className="grid w-full grid-cols-2 rounded-3xl mb-3">
                    <TabsTrigger value="library" className="rounded-2xl">
                        {isVideoMode ? 
                            <Video className='mr-2 w-4 h-4 text-gray-600' /> : 
                            <Images className='mr-2 w-4 h-4 text-gray-600' />
                        }
                        Library
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="rounded-2xl"><Upload className='mr-2 w-4 h-4 text-gray-600' />Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="library">
                    {!loading && medias.length === 0 && (
                        <div className='p-3 flex flex-col gap-2 items-center justify-center'>
                            {isVideoMode ? 
                                <Film className='text-gray-300 w-[60px] h-[60px]' strokeWidth={0.7} /> :
                                <FileImage className='text-gray-300 w-[60px] h-[60px]' strokeWidth={0.7} />
                            }
                            <h4 className='font-bold'>No {isVideoMode ? 'videos' : 'media'} to show</h4>
                            <p className='text-xs text-muted-foreground'>
                                Currently, there are no {isVideoMode ? 'video' : 'media'} files uploaded under your account. 
                                Please go to the upload tab to upload {isVideoMode ? 'a video' : 'an image'}.
                            </p>
                        </div>
                    )}
                    <div className='grid grid-cols-4 grid-flow-row gap-4 overflow-y-auto max-h-[50vh]'>
                        {medias.map((media, index) => (
                            <MediaItem 
                                key={media.id} 
                                media={media} 
                                index={index} 
                            />
                        ))}
                        {loading && [...Array(4)].map((_, index) => (
                            <AspectRatio key={`skeleton-${index}`} ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="upload">
                    <Label htmlFor="media-file" className={`p-10 group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75 ${uploading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                        {uploading ? (
                            <LoaderCircle className='text-muted-foreground w-10 h-10 animate-spin' strokeWidth={0.8} />
                        ) : isVideoMode ? (
                            <Film className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />
                        ) : (
                            <ImageUp className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />
                        )}
                        <span>{uploading ? "Uploading..." : `Select ${isVideoMode ? 'videos' : 'images'}`}</span>
                        <div className='flex flex-col gap-2'>
                            {!uploading && (
                                <p className='text-muted-foreground text-xs font-normal'>
                                    Click here to select {isVideoMode ? 'videos' : 'images'}
                                </p>
                            )}
                            {!uploading && (
                                <p className='text-muted-foreground text-xs font-normal'>
                                    {isVideoMode 
                                        ? 'Recommended formats: MP4, WebM. Max size: 50MB' 
                                        : 'Recommended image size: less than 2MB each'}
                                </p>
                            )}
                        </div>
                    </Label>
                    <Input 
                        id="media-file" 
                        type="file" 
                        onChange={handleFileChange} 
                        accept={acceptedFileTypes} 
                        multiple={!isVideoMode} 
                        ref={fileInputRef} 
                        className="hidden" 
                    />

                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Selected {isVideoMode ? 'Videos' : 'Images'}:
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {selectedFiles.map((file, index) => (
                                    <FilePreview 
                                        key={index} 
                                        file={file} 
                                        index={index} 
                                    />
                                ))}
                            </div>
                            <Button onClick={uploadToLocal} disabled={uploading} className="mt-4">
                                {uploading ? 'Uploading...' : `Upload Selected ${isVideoMode ? 'Videos' : 'Images'}`}
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}