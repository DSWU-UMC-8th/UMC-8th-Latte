import { useEffect, useState } from "react";
import axios from "axios";

interface APiResopnse<T> {
    data: T | null;
    isPending: boolean;
    isError: boolean;
}

function useCustomFetch<T>(url: string): APiResopnse<T>{
        const [data, setData] = useState<T | null>(null);
        const [isPending, setIsPending] = useState(false); 
        const [isError, setIsError] = useState(false); 

        useEffect(() => {
            const fetchData = async () => {
                setIsPending(true);
    
                try{
                    const { data } = await axios.get<T>( 
                        url,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                            }
                        }
                    );
                    
                    setData(data);
                } catch  {
                    setIsError(true);
                } finally { // 공통으로
                    setIsPending(false); 
                }
            };
    
            fetchData();
        }, [url]);

        return { data, isPending, isError }
}

export default useCustomFetch;