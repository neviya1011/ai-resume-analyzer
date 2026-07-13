import React from "react";
import Score from "./Score";
import {Eraser} from "lucide-react";


const Cards = (props) => {
    return (
        <div
        onClick={props.onClick}
        className="w-full max-w-[350px] h-auto bg-white rounded-2xl cursor-pointer"
        >
        <div className="p-3">
            <div className="flex justify-between">
            <div className="mt-2 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                    <h1 className="font-bold text-lg sm:text-xl md:text-2xl mb-2 truncate">{props.company}</h1>
                    <button
                        type="button"
                        className=" text-gray-500 shrink-0 "
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onDelete?.();
                        }}
                        >
                        <Eraser size={12} />
                    </button>
                </div>
                
                <h2 className="text-xs text-[rgb(170,170,170)] truncate">{props.role}</h2>

                
            </div>

            <Score score={props.score} />
            </div>

            <img
            src={props.img}
            alt={props.company}
            className="w-full h-[180px] sm:h-[210px] md:h-[250px] rounded-2xl mt-4 object-cover object-top"
            />
        </div>
        </div>
    );
};

export default Cards;