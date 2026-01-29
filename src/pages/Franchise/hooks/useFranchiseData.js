import { useState, useEffect } from "react";
import { franchisePageBgImage, franchisePackages } from "../../../services";

export const useFranchiseData = () => {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [statsSectionData, setStatsSectionData] = useState([]);
    const [statsMainTitle, setStatsMainTitle] = useState("");
    const [statsSubTitle, setStatsSubTitle] = useState("");

    const fetchData = async () => {
        try {
            const [imageResponse, packageResponse] = await Promise.all([
                franchisePageBgImage(),
                franchisePackages()
            ]);
            
            if (imageResponse.status === 200) {
                setBackgroundImage(imageResponse.image_path);
            }
            
            if (packageResponse.status === 200) {
                let section = packageResponse.data[0];
                setStatsMainTitle(section.title);
                setStatsSubTitle(section.subTitle);
                
                if (section.lineentries?.length > 0) {
                    setStatsSectionData(section.lineentries);
                }
            }
        } catch (error) {
            console.error("Error fetching franchise data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        backgroundImage,
        statsSectionData,
        statsMainTitle,
        statsSubTitle
    };
};