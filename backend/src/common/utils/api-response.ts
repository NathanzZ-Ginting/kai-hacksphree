interface apiResponse {
  success: boolean;
  message?: string;
  data?: object;
  errors?: object;
}

export const SuccessRes = (
  message: string,
  data?: object
) => {
    var response: apiResponse = {
        success: true,
        message: message
    }

    if(data) {
        response.data = data
    }

    return response

};

export const ErrorsRes = (
  message: string,
  errors?: object
) => {
    var response: apiResponse = {
      success: false,
      message: message,
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
};
