import { apiReq } from '@/lib/common';
import { useState } from 'react';
import { toast } from 'sonner';

const useSubmitThemeForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitForm = async (url, method, payload, onSuccess) => {
        try {
            setIsLoading(true);

            const res = await apiReq(url, method, payload);

            if (!res.ok) {
                toast.error("Something went wrong!", {
                    description: "Please try again later"
                });
                return;
            }

            const { data } = await res.json();

            if (data) {
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(data);
                }

                toast.success("Operation Successful!", {
                    description: "Your changes have been successfully saved!"
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!", {
                description: "Please try again later"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleSubmitForm };
};

export default useSubmitThemeForm;
