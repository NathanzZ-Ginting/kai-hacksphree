import midtransClient from "midtrans-client";

const apiClient = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY!,
  clientKey: process.env.CLIENT_KEY!,
});

export const checkStatusService = async (orderId: string) => {
    try{
        
    }catch(error) {

    }
};
