const { Telegraf } = require("telegraf")
require("dotenv").config()
const { generateChatResponse } = require("../../openai/main")
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    console.log("Received /start command")
    try {
        return ctx.reply("Hi, this OpenAI_Bot_BD, ready to chat with you.")
    } catch (e) {
        console.error("error in start action:", e)
        return ctx.reply("Error occured")
    }
})

bot.on("message", async (ctx) => {
    if (ctx.message.via_bot) {
        return ctx.reply("Sorry! I don't reply bots.");
    }
    try {
        if (ctx.message?.chat?.id.toString() !== process.env.GROUP_ID.toString()) {
            return ctx.reply("Please message in the group");
        };
        const response = await generateChatResponse(ctx.message.text, ctx.message?.from?.id?.toString());
        return ctx.reply(response);
    } catch (error) {
        return ctx.reply("Error occured");
    }
})

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
    try {
        await bot.handleUpdate(JSON.parse(event.body))
        return { statusCode: 200, body: "" }
    } catch (e) {
        console.error("error in handler:", e)
        return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
    }
}