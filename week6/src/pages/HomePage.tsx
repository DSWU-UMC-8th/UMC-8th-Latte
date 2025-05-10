import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {

    const {data, isPending, isError } = useGetLpList({});

    if(isPending) {
        return <div className={"mt-20 p-10"}>Loading...</div>
    }

    if(isError) {
        <div className={"mt-20"}>Error</div>
    }

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            {data?.map((lp) => <h1>{lp.title}</h1>)}
        </div>
    )
};

export default HomePage;