import { notFoundException } from "../../common/exceptions/error.exceptions.js";
import { createOne, findOne, paginate, updateOne } from "../../common/repository/db.repo.js";
import { Conversation } from "../../DB/Model/Conversation.model.js";
import { ConversationMessage } from "../../DB/Model/ConversationMessage.model.js";


export const sendConversationMessage = async ( { conversationId, content } = {},files = [], user) => {
    const conversation = await findOne({model: Conversation,filter: { _id: conversationId, participants: user._id }});

if (!conversation) {
    throw notFoundException("Conversation not found");
}

    const message = await createOne({ model: ConversationMessage,
        data: {
            conversationId,
            senderId: user._id,
            content,
            attachment: files.map(file => file.path)
        }
    });
    await updateOne({model: Conversation,filter: { _id: conversationId },
        update: {
            lastMessage: content || "Attachment",
            lastMessageAt: message.createdAt
        }
    });
    return message;
};


export const getConversationMessages = async ({ conversationId} = {},user) => {
    const conversation = await findOne({ model: Conversation, filter: {_id: conversationId, participants: user._id } });
    if (!conversation) {
        throw notFoundException("Conversation not found or you are not a participant");
    }
    const messages = await paginate({model: ConversationMessage,filter: { conversationId },
        options: {
            sort: { createdAt: -1 },
        }});
    return messages;
};

export const getAllConversations = async ({ page, limit } = {}, user) => {
    const conversations = await paginate({model: Conversation,filter: {participants: user._id},
        page,
        limit,
        options: {
            sort: {
                lastMessageAt: -1,
                createdAt: -1
            }
        }
    });
    if(!conversations){
        throw notFoundException("no conversations found")
    }
    return conversations;
};