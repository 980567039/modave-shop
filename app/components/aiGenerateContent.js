import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Ripple from '@/components/ui/ripple';
import genAI from '@/lib/gemini';
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { IconAi } from './svgIcons';

export default function AiGenerateContent({
    buttonTitle,
    basedOn,
    customPrompt,
    type,
    limit,
    onApply
}) {
    const [openDialog, setOpenDialog] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const typeBasedPrompt = (t) => {
        switch (t) {
            case "productDescription":
                return `${customPrompt}, generate a product short description for "${basedOn}",and make it human readable and make that under ${limit || 200} characters, response should be text only, no need to add hashtags or emoji give me just a text`

            default:
                return `${customPrompt}, response should be text only, no need to add hashtags / emoji or HTML tags, give me just a text`
        }
    }

    const generateStreamingContent = async () => {
        setIsGenerating(true);
        setStreamingContent('');
      
        try {
          // 优先使用最新版本
          let model;
          try {
            model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          } catch {
            // 如果 SDK 不支持 gemini-2.0-flash，自动回退
            console.warn("⚠️ gemini-2.0-flash 不可用，正在回退到 gemini-1.5-flash...");
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          }
      
          const prompt = typeBasedPrompt(type);
      
          // 尝试使用流式生成
          let result;
          try {
            result = await model.generateContentStream(prompt);
          } catch (err) {
            // 如果模型不支持流式生成，使用非流式模式
            if (err.message?.includes("not supported for generateContent")) {
              console.warn("⚠️ 当前模型不支持流式生成，改用普通生成模式。");
              const res = await model.generateContent(prompt);
              const text = res.response.text();
              setStreamingContent(text);
              setIsGenerating(false);
              return;
            } else {
              throw err;
            }
          }
      
          // 处理流式内容
          let contentGenerated = false;
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText.trim()) {
              contentGenerated = true;
            }
            setStreamingContent(prev => prev + chunkText);
          }
      
          if (!contentGenerated) {
            toast.error("未生成内容");
          }
        } catch (error) {
          console.error('生成内容时出错:', error);
      
          if (error.message === "No content generated") {
            toast.error("未找到可生成的内容，请尝试更换参数后重试。");
          } else if (error.message.includes("RESOURCE_EXHAUSTED")) {
            toast.error("API 配额已用完，请稍后再试。");
          } else if (error.message.includes("API_KEY_INVALID")) {
            toast.error("API Key 无效，请检查环境变量 NEXT_PUBLIC_GEMINI_API_KEY。");
          } else if (error.message.includes("not found")) {
            toast.error("请求的模型不可用，请检查模型名称或 SDK 版本。");
          } else if (error.message.includes("INVALID_ARGUMENT")) {
            toast.error("输入参数无效，请检查后重试。");
          } else {
            toast.error("发生未知错误，请稍后再试。");
          }
        } finally {
          setIsGenerating(false);
        }
      };

    const handlerOpenModal = () => {
        if (!basedOn) {
            toast.error('“Based on” 字段不能为空！')
        } else if (basedOn.length < 10) {
            toast.error('标题太短！')
        } else {
            setOpenDialog(true);
            setTimeout(() => {
                generateStreamingContent()
            }, 1000)
        }
    }

    const handlerOnApply = () => {
        if (streamingContent !== '') {
            onApply(streamingContent);
            setOpenDialog(false);
            setStreamingContent('');
            setIsGenerating(false);
        } else {
            toast.error('未找到生成内容！')
        }
    }

    return (
        <div>
            <RainbowButton className="text-sm p-2 h-auto flex items-center gap-2 rounded-2xl" onClick={handlerOpenModal}><IconAi fill="white" style={{
                width: 25,
                height: 25
            }} /> {buttonTitle || 'Generate'}</RainbowButton>

            <AlertDialog open={openDialog}>
                <AlertDialogContent className="max-w-[800px] p-0">
                    {streamingContent !== '' ? <>
                        <div className='p-5'>
                            <h2 className='text-xl font-semibold mb-2'>生成的内容</h2>

                            <div className='p-3 border-[1px] rounded-2xl mb-3'>
                                <p className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">{streamingContent}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 justify-end pb-3 px-3'>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>关闭</Button>
                            <Button onClick={handlerOnApply}>应用内容</Button>
                        </div>
                    </> : <>
                        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
                            <p className="z-10 whitespace-pre-wrap text-center text-2xl font-medium tracking-tighter">
                                Thinking..
                            </p>
                            <Ripple />
                        </div>
                        <div className='space-y-3 p-3'>
                            <p className='text-center text-xs text-muted-foreground'>内容将基于 &quot;{basedOn}&quot; 生成</p>

                            <div className='flex items-center justify-center gap-1'>
                                <p className='text-xs text-muted-foreground'>由以下提供支持：</p>
                                <Image src={'/images/google_gemini_logo.svg.png'} alt="gemini" width={80} height={50} className='mb-[13px]' />
                            </div>
                                <div className='flex items-center gap-3 justify-end pb-3 px-3'>
                                    <Button variant="outline" onClick={() => setOpenDialog(false)}>关闭</Button>
                                </div>
                        </div>
                    </>}


                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
