import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";

const rootDir = process.cwd();
const prompt = fs.readFileSync(`${rootDir}/scripts/prompt.md`, "utf-8");
/**
 * Chuyển đổi tất cả các giá trị BigInt trong một đối tượng hoặc mảng thành string.
 * @param obj - Đối tượng hoặc mảng cần chuyển đổi.
 * @returns Đối tượng hoặc mảng đã được chuyển đổi.
 */
export function convertBigIntToString(obj: any): any {
    // Nếu obj là BigInt, chuyển đổi thành string
    if (typeof obj === "bigint") {
        return obj.toString();
    }

    // Nếu obj là mảng, xử lý từng phần tử trong mảng
    if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item));
    }

    // Nếu obj là object (và không phải null), xử lý từng thuộc tính
    if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = convertBigIntToString(obj[key]);
            }
        }
        return newObj;
    }

    // Trả về giá trị nguyên thủy (không phải BigInt, không phải object, không phải mảng)
    return obj;
}

export default async function promptGenerate(
    supabase: Awaited<ReturnType<typeof createClient>>,
) {
    const data = await prisma.prompt_inject.findMany({
        select: {
            data: true,
        },
    });
    let resPrompt = prompt;
    const injectTo = "<--dynamic_prompt-->";
    let result = "";

    data.forEach((item) => {
        result += `${item.data}\n`;
    });

    resPrompt = resPrompt.replace(injectTo, result);

    //! Generate team
    const team = await prisma.team.findMany();
    const teamInjectTo = "<--dynamic_team-->";

    let teamResult = "";

    team.forEach((item) => {
        const convertedItem = convertBigIntToString(item); // Chuyển đổi BigInt thành string
        teamResult += `${JSON.stringify(convertedItem)}\n`;
    });

    resPrompt = resPrompt.replace(teamInjectTo, teamResult);

    //! Generate band
    const band = await prisma.bands.findMany();
    const bandInjectTo = "<--dynamic_band-->";

    let bandResult = "";

    band.forEach((item) => {
        const convertedItem = convertBigIntToString(item); // Chuyển đổi BigInt thành string
        bandResult += `${JSON.stringify(convertedItem)}\n`;
    });

    resPrompt = resPrompt.replace(bandInjectTo, bandResult);

    //! Generate project team
    const projectTeam = await prisma.project_teams.findMany();
    const projectTeamInjectTo = "<--dynamic_project_team-->";

    let projectTeamResult = "";

    projectTeam.forEach((item) => {
        const convertedItem = convertBigIntToString(item); // Chuyển đổi BigInt thành string
        projectTeamResult += `${JSON.stringify(convertedItem)}\n`;
    });

    resPrompt = resPrompt.replace(projectTeamInjectTo, projectTeamResult);

    //! Generate positions
    const positions = await prisma.positions.findMany();
    const positionsInjectTo = "<--dynamic_positions-->";
    let positionsResult = "";

    positions.forEach((item) => {
        const convertedItem = convertBigIntToString(item); // Chuyển đổi BigInt thành string
        positionsResult += `${JSON.stringify(convertedItem)}\n`;
    });

    resPrompt = resPrompt.replace(positionsInjectTo, positionsResult);

    return resPrompt;
}
