import skills from "../data/skills.json";
import { Panel } from "./Panel";

type skill = {
    name: string;
    description: string;
    image: string;
    links: {
        website: string;
        wikipedia: string;
        resources: string[];
    };
    interestingFact: string;
    skillLevel: string;
    usefulness: string;
    other: string;
};

export const Skills = () => {
    return (
        <>
            <div className="flex flex-wrap justify-center bg-slate-950 h-full text-white gap-0 gap-y-6 pt-20">
                {skills.map((skill: skill) => {
                    return (
                        <Panel skill={skill} key={skill.name}>
                            <div
                                key={skill.name}
                                className="border-none border-blue-900 mx-0 my-0 overflow-hidden p-4 flex flex-col gap-6 max-w-64 justify-between items-center hover:shadow-xl transition-all duration-1000 dark:shadow-white bg-gradient-to-tr to-gray-900 from-slate-950 text-bl rounded-none"
                            >
                                <div className="aspect-square rounded-lg flex justify-center items-center">
                                    <img
                                        className="w-full h-full object-contain"
                                        src={skill.image}
                                        alt={skill.name + " logo"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between flex-wrap gap-2">
                                        <div className="rounded-full border-2 border-gray-400 w-min h-min p-1 px-4 whitespace-nowrap">
                                            {skill.name}
                                        </div>
                                        <div className="rounded-full border-2 border-red-400 w-min h-min p-1 px-4 ">
                                            {skill.skillLevel}
                                        </div>
                                    </div>
                                    <div className="text-left text-gray-300">{skill.description}</div>
                                </div>
                            </div>
                        </Panel>
                    );
                })}
            </div>
        </>
    );
};
