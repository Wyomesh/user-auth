class ApiResponse {
  constructor(statuscode, data, message) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message || "success";
    this.success = statuscode < 400;
  }
}

export { ApiResponse };
