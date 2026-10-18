
import { useEffect, useState } from "react";
import RmLoaderGif from "../assets/rm_meet_greet_loader.gif";

interface RMLoaderProps {
    onComplete?: () => void;
}

export default function RMLoader({
    onComplete,
}: RMLoaderProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            {/* Replace this with your animated RM GIF */}
            <div className="flex h-48 w-64 items-center justify-center">
                <img
                    src={RmLoaderGif}
                    alt="RM greeting animation"
                    className="h-full w-full object-contain"
                />
            </div>

            <h1 className="mt-3 text-2xl font-bold text-slate-800">
                Report Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                Preparing your workspace...
            </p>

            <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-blue-600" />
            </div>

            <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
}
