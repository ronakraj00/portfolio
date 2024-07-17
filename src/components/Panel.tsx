import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export const Panel = ({ skill, children }) => {
    return (
        <Drawer>
            <DrawerTrigger className="flex items-stretch">
                {children}
            </DrawerTrigger>
            <DrawerContent className="bg-black bg-gradient-to-br from-gray-950  text-gray-100 flex gap-2 ">
                <DrawerHeader className="flex flex-col gap-4">
                    <DrawerTitle>
                        <a href={skill.links.website} className="flex justify-center items-center gap-1">
                            {skill.name}
                            <img className="h-4 -rotate-45" src="//icons.veryicon.com/png/o/internet--web/flatten-icon/link-33.png" alt="link Icon"/>
                        </a>
                    </DrawerTitle>
                    <DrawerDescription className="flex flex-col gap-1 p-4 text-gray-400">
                        <ul>
                            <li className="list-disc">{skill.description}</li>
                            <li className="list-disc">
                                {skill.interestingFact}
                            </li>
                            <li className="list-disc">{skill.other}</li>
                            {skill.history && (
                                <li className="list-disc">{skill.history}</li>
                            )}
                        </ul>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex flex-wrap gap-5">
                    <div>
                        <div className="">Resources</div>
                        <div>
                            {skill.links.resources.map((resource) => {
                                return (
                                    <li
                                        key={resource}
                                        className="text-blue-600 my-2"
                                    >
                                        <a href={resource}>{resource}</a>
                                    </li>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <div></div>
                        <div className="rounded-full border-2 border-gray-400 w-min h-min p-1 px-4 whitespace-nowrap">
                            {skill.usefulness + " " + "usefulness"}
                        </div>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
