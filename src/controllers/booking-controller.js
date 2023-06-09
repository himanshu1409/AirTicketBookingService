const { StatusCodes } = require("http-status-codes");

const { BookingService } = require("../services/index");

const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {
  // constructor(channel) {
  //   this.channel = channel;
  // }

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const data = { message: "Susccess" };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res
      .status(200)
      .json({ message: "Successfully published the message" });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      console.log(response);
      return res.status(StatusCodes.OK).json({
        message: "Successfully completed booking",
        success: true,
        err: {},
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
        success: false,
        err: error.explaination,
        data: {},
      });
    }
  }
}

module.exports = BookingController;
