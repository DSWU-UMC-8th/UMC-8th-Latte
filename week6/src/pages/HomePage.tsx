import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
    const [search, setSearch] = useState("타입");
    const {data, isPending, isError } = useGetLpList({
        search,
    });

    if(isPending) {
        return <div className={"mt-20 p-10"}>Loading...</div>
    }

    if(isError) {
        <div className={"mt-20"}>Error</div>
    }

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            {data?.map((lp) => <h1>{lp.title}</h1>)}
        </div>
    )
};

export default HomePage;