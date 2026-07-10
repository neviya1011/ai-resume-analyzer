<<<<<<< Updated upstream
import React from 'react'
import Score from '../ScoreCircle/Score'
=======
import React from "react";
import Score from "./Score";
import {Eraser} from "lucide-react";
>>>>>>> Stashed changes

const Cards = (props) => {
    return (
        <div
        onClick={props.onClick}
        className="w-[350px] h-[400px] bg-white rounded-2xl cursor-pointer"
        >
        <div className="p-3">
            <div className="flex justify-between">
            <div className="mt-2">
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-2xl mb-2">{props.company}</h1>
                    <button
                        type="button"
                        className=" text-gray-500 "
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onDelete?.();
                        }}
                        >
                        <Eraser size={12} />
                    </button>
                </div>
                
                <h2 className="text-xs text-[rgb(170,170,170)]">{props.role}</h2>

                
            </div>

            <Score score={props.score} />
            </div>

            <img
            src={props.img}
            alt={props.company}
            className="w-full h-[250px] rounded-2xl mt-4 object-cover object-top"
            />
        </div>
        </div>
    );
};

export default Cards;