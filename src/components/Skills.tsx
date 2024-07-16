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
            <div className="flex flex-wrap justify-center bg-black text-white gap-3">
                {skills.map((skill: skill) => {
                    return (
                        <Panel skill={skill} key={skill.name}>
                            <div
                                key={skill.name}
                                className="border mx-1 my-4 overflow-hidden p-4 flex flex-col gap-2 max-w-64 justify-center items-center hover:shadow-xl transition-all duration-1000 dark:shadow-white rounded-lg"
                            >
                                <div className="aspect-square overflow-hidden rounded-lg flex justify-center items-center">
                                    <img
                                        className="w-full h-full object-contain  rounded-md"
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
                                    <div>{skill.description}</div>
                                </div>
                            </div>
                        </Panel>
                    );
                })}
            </div>
        </>
    );
};
