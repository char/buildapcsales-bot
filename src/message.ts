import { RichEmbed } from "discord.js";
import { Submission } from "snoowrap";
import { findTypeFromSubmission } from "./channels";

const regexes = [
    /\$((?:\d|\,)*\.?\d+)/m,
    /\s\$(\d+\.\d{2}?)\s/m,
    /\s(\d+\.\d{2}?)\s/m,
    /[\s=]\$(\d+[\.\d{2}]?)\s/m,
    /\s\$(\d+[\.\d{2}]?)\s?/m
];

const defaultAvatar = "https://styles.redditmedia.com/t5_2s3dh/styles/communityIcon_bf4ya2rtdaz01.png";

export async function createEmbeddedMessage(submission: Submission, subReddit: string): Promise<RichEmbed> {
    let avatar = await submission.author.icon_img;

    return new RichEmbed()
        .setTitle(submission.title)
        .setColor("#FF4444")
        .setURL("https://reddit.com" + submission.permalink)
        .setAuthor(`u/${ submission.author.name } posted`, avatar, "https://reddit.com" + submission.permalink)
        .setDescription(`A new post has appeared on [r/${subReddit}](https://www.reddit.com/r/${subReddit}/new/).`)
        .addField("Category", findTypeFromSubmission(submission), true)
        .addField("Price", findPrice(submission.title), true)
        .setTimestamp()
        .setFooter(`r/${subReddit}`, defaultAvatar);
}

export function findPrice(title: string): string {
    for (let regex of regexes) {
        let matches = regex.exec(title);

        if (matches !== null) {
            return "$" + matches[1];
        }
    }
    
    return "Unable to parse price";
}