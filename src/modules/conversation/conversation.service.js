import {
  BadException,
  conflictException,
  forbiddenException,
  notFoundException,
} from "../../common/exceptions/error.exceptions.js";
import {
  createOne,
  findById,
  findOne,
} from "../../common/repository/db.repo.js";
import { messageModel } from "../../DB/Model/messageModel.js";
import { IdentityRequest } from "../../DB/Model/identityRequest.model.js";
import { StatusEnum } from "../../common/enum/status.enum.js";
import { Conversation } from "../../DB/Model/Conversation.model.js";

export const createConversation = async (identityRequestId) => {
  const request = await findOne({
    model: IdentityRequest,
    filter: { _id: identityRequestId, status: StatusEnum.ACCEPTED },
  });
  if (!request) {
    throw notFoundException(" request not found");
  }
  const message = await findById({
    model: messageModel,
    id: request.messageId,
  });
  if (!message) {
    throw notFoundException("Message not found");
  }

  const requesterId = request.requesterId;
  const recieverId = message.senderId;

  if (!requesterId || !recieverId || !message.recieverId) {
    throw BadException("Message participants are incomplete");
  }
  if (requesterId.toString() != message.recieverId.toString()) {
    throw forbiddenException("Invalid conversation participants");
  }
  const existConversation = await findOne({
    model: Conversation,
    filter: { identityRequestId },
  });
  if (existConversation) {
    throw conflictException("Conversation already exists");
  }

  const conversation = await createOne({
    model: Conversation,
    data: { participants: [requesterId, recieverId], identityRequestId },
  });
  return conversation;
};
