export default function Header(){
    return(
        <div className="flex flex-col items-start justify-center w-full h-1/2 font-light text-gray-500 sm:text-lg dark:text-gray-400 px-[max(15%,12px)]">
            <h2 className="mb-4 text-2xl md:text-4xl tracking-tight font-extrabold text-white">
                Let's Check The Data
            </h2>
            <p className="mb-4 text-justify text-sm md:text-base">
                Based on the Berkeley Earth Surface Temperature (BEST) dataset
                spanning from 1900 to 2013, a clear warming trend in global
                surface temperatures is evident. This trend underscores the
                reality of climate change, with temperatures steadily increasing
                over the past century.
            </p>
        </div>
    );
}